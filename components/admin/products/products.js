

function headerHtml () {
    $("#placeholder_header").load("../header/header.html", function(response, status, xhr) {
        if (status == "error") {
            console.log("Error loading header: " + xhr.status + " " + xhr.statusText);
        }
    });
}


function tableView(){
    const rowsPerPage = 4; // Number of rows per page
    const rows = $('#main-table tbody tr');
    const rowsCount = rows.length;
    const totalPages = Math.ceil(rowsCount / rowsPerPage);//How many divisions of pages do we need
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

//GetAllProducts
async function getAllProductTable(){
    const result = await $.ajax({
        url: 'http://localhost:4000/products', 
        type: 'GET',                 
        dataType: 'json',           
        success: function(response) {
            function addProductsToTable(products) {
                const tableBody = $("#main-table tbody");
                tableBody.empty();  // Clear any existing rows
        
                products.forEach(function(product) {
                    const productRow = `
                        <tr>
                            <td>${product.name}</td>
                            <td>${product.category}</td>
                            <td>$${product.price}</td>
                            <td>${product.brand}</td>
                            <td>${product.size}</td>
                            <td>${product.color}</td>
                            <td>${product.quantity}</td>
                            <td><img src="${product.imagePath}" alt="${product.name}" width="50" /></td> 
                        </tr>
                    `;
                    
                    tableBody.append(productRow);  // Add the new row to the table
                });
            }
        
            // Call the function to add the products to the table
            addProductsToTable(response);
        
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.error("Error fetching data:", textStatus, errorThrown);
        }
    });
    return result;  
}

//Paging with numbers:
$(document).ready(async function () {
    headerHtml();
    await getAllProductTable();
    tableView();
});
