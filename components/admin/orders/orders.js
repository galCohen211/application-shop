async function getUserName(id) {
    try {
        const result = await $.ajax({
            url: `http://localhost:4000/users/${id}`,
            type: 'GET',
            dataType: 'json'
        });
        return result; // Return the full response object
    } catch (error) {
        console.error("Error fetching data:", error);
        throw error; // Rethrow the error to handle it outside the function if needed
    }
}

// Table view and pagination
function tableView() {
    const rowsPerPage = 5;
    const rows = $('#main-table tbody tr');
    const rowsCount = rows.length;
    const totalPages = Math.ceil(rowsCount / rowsPerPage); // How many divisions of pages we need

    $('#pagination').empty(); // Clear previous pagination

    const pagination = $('<ul class="pagination"></ul>'); // Create the pagination element

    // Function to display rows for the given page number
    function displayRows(pageNumber) {
        const start = (pageNumber - 1) * rowsPerPage;
        const end = start + rowsPerPage;
        rows.hide();
        rows.slice(start, end).show(); // Show the rows for the current page
    }

    // Generate pagination controls dynamically
    for (let i = 1; i <= totalPages; i++) {
        pagination.append(`<li class="page-item"><a class="page-link" href="#">${i}</a></li>`);
    }

    // Insert the pagination element after the table
    $('#pagination').append(pagination);

    // Handle pagination click
    pagination.on('click', 'a', function (e) {
        e.preventDefault();
        const pageNumber = $(this).text(); // Get the page number from the clicked link
        displayRows(pageNumber); // Display the appropriate rows
        pagination.find('li').removeClass('active'); // Remove 'active' class from all pagination links
        $(this).parent().addClass('active'); // Add 'active' class to the clicked pagination link
    });

    // Initialize the first page
    displayRows(1);
    pagination.find('li:first').addClass('active'); // Mark the first page as active

    // Show the table now that pagination is set up
    $('#main-table').show();
}

// Get all orders
async function getAllOrders(accessToken) {
    try {
        // Show the loading spinner
        $('#loadingSpinner').show();

        // Hide the table while data is loading
        $('#main-table').hide();

        const result = await $.ajax({
            url: 'http://localhost:4000/orders',
            type: 'GET',
            headers: {
                'Authorization': `Bearer ${accessToken}`
            },
            dataType: 'json'
        });

        const tableBody = $("#main-table tbody");
        tableBody.empty(); // Clear any existing rows

        // Function to add orders to the table
        const addOrdersToTable = async (orders) => {
            for (const order of orders.data) {
                try {
                    const userData = await getUserName(order.user);
                    const firstName = userData.user.firstName;
                    const lastName = userData.user.lastName;
                    const orderRow = `
                        <tr>
                            <td data-id="${order._id}">${order._id}</td>
                            <td>${firstName}</td>
                            <td>${lastName}</td>
                            <td>${order.dateOrdered}</td>
                            <td>$${order.totalPrice}</td>
                            <td>${order.city}</td>
                            <td>${order.street}</td>
                        </tr>
                    `;
                    tableBody.append(orderRow); // Add the new row to the table
                } catch (error) {
                    console.error("Error fetching user data:", error);
                }
            }
            tableView(); // Initialize pagination after adding rows
        };

        await addOrdersToTable(result);

    } catch (error) {
        console.error("Error fetching orders:", error);
    } finally {
        // Hide the loading spinner
        $('#loadingSpinner').hide();
        // Show the table
        $('#main-table').show();
    }
}

$(document).ready(async function () {
    const accessToken = localStorage.getItem('accessToken');
    await getAllOrders(accessToken);
});
