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
    const rowsPerPage = 5; // Number of rows per page
    const rows = $('#main-table tbody tr');
    const rowsCount = rows.length;
    const totalPages = Math.ceil(rowsCount / rowsPerPage); // How many divisions of pages we need

    $('#pagination').empty(); // Clear previous pagination

    const pagination = $('<ul class="pagination"></ul>'); // Create the pagination element

    // Function to display rows for the given page number
    function displayRows(pageNumber) {
        const start = (pageNumber - 1) * rowsPerPage;
        const end = start + rowsPerPage;
        rows.hide(); // Hide all rows
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
}

// Get all orders
async function getAllOrders(accessToken) {
    const result = await $.ajax({
        url: 'http://localhost:4000/orders',
        type: 'GET',
        headers: {
            'Authorization': `Bearer ${accessToken}`
        },
        dataType: 'json',
        success: async function (response) {
            async function addOrdersToTable(orders) {
                const tableBody = $("#main-table tbody");
                tableBody.empty(); // Clear any existing rows

                console.log(orders.data)
                orders.data.forEach(async function (order) {
                    const userData = await getUserName(order.user);
                    const firstName = userData.user.firstName;
                    const lastName = userData.user.lastName;
                    // firstName = getUserName(order.user)
                    // console.log(firstName)
                    // lastName = getUserName(order.user)
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
                });
            }
            await addOrdersToTable(response);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.error("Error fetching data:", textStatus, errorThrown);
        }
    });
    return result;
}

// function refreshTable() {
//     // Fetch all orders and reinitialize table view and pagination
//     getAllOrders().then(() => {
//         tableView();
//     });
// }

$(document).ready(async function () {
    const accessToken = localStorage.getItem('accessToken');
    await getAllOrders(accessToken);
    tableView();
});
