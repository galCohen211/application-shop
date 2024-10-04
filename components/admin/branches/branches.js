function tableView() {
    const rowsPerPage = 4; // Number of rows per page
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

// Get all branches
async function getAllBranchTable() {
    const result = await $.ajax({
        url: 'http://localhost:4000/branches/',
        type: 'GET',
        dataType: 'json',
        success: function (response) {
            function addBranchesToTable(branches) {
                const tableBody = $("#main-table tbody");
                tableBody.empty(); // Clear any existing rows

                branches.forEach(function (branch) {
                    //coordinates = new Coordinate(branch.coordinates);
                    const branchRow = `
                        <tr>
                            <td>${branch.city}</td>
                            <td>${branch.street}</td>
                            <td>${branch.coordinates.lat}</td>
                            <td>${branch.coordinates.lng}</td>
                        </tr>
                    `;
                    tableBody.append(branchRow); // Add the new row to the table
                });
            }
            addBranchesToTable(response);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.error("Error fetching data:", textStatus, errorThrown);
        }
    });
    return result;
}

function refreshTable() {
    // Fetch all branches and reinitialize table view and pagination
    getAllBranchTable().then(() => {
        tableView();
    });
}

$(document).ready(async function () {
    const accessToken = localStorage.getItem('accessToken');
    await getAllBranchTable();
    tableView();
});
