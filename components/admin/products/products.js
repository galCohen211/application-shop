//check if role is admin and check access token
//localStorage.getItem("role");
//const role = localStorage.getItem("role");
function headerHtml () {
    $("#placeholder_header").load("../../shared/headers/admin.html", function(response, status, xhr) {
        if (status == "error") {
            console.log("Error loading header: " + xhr.status + " " + xhr.statusText);
        }
    });
}

function tableView () {
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
            addProductsToTable(response);
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.error("Error fetching data:", textStatus, errorThrown);
        }
    });
    return result;  
}

//Popup
const plusButton = document.getElementById('plusButton');
const closePopupBtn = document.getElementById('closePopup');

// Open popup when the plus button is clicked
plusButton.addEventListener('click', function() {
    popupForm.style.display = 'flex';  // Use flexbox to center the popup
});

// Close popup when the close button (X) is clicked
closePopupBtn.addEventListener('click', function() {
    popupForm.style.display = 'none';
});

// Close popup when clicking outside of the popup content
window.addEventListener('click', function(event) {
    if (event.target === popupForm) {
        popupForm.style.display = 'none';
    }
});


// Create and Save product on form submission
document.getElementById('productForm').addEventListener('submit', async function(event) {
    event.preventDefault();  // Prevent form submission

    // Gather form values
    const productData = {
        name: document.getElementById('name').value,
        category: document.getElementById('category').value,
        price: document.getElementById('price').value,
        brand: document.getElementById('brand').value,
        size: document.getElementById('size').value,
        color: document.getElementById('color').value,
        quantity: document.getElementById('quantity').value,
        gender: document.getElementById('gender').value,
        imagePath: document.getElementById('imagePath').value,
    };

    try {
        // Send form data to the server via POST request
        const response = await fetch('http://localhost:4000/products', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(productData),
        });

        const result = await response.json();

        // Check for validation errors
        if (!response.ok) {
            // Show validation errors if any
            const errorMessages = result.errors.map(err => err.msg).join('\n');
            alert('Validation failed:\n' + errorMessages);
        } else {
            // If successful, add the new product to the table
            const tableBody = document.querySelector("#main-table tbody");
            const newRow = `
                <tr>
                    <td>${result.product.name}</td>
                    <td>${result.product.category}</td>
                    <td>$${result.product.price}</td>
                    <td>${result.product.brand}</td>
                    <td>${result.product.size}</td>
                    <td>${result.product.color}</td>
                    <td>${result.product.quantity}</td>
                    <td><img src="${result.product.imagePath}" alt="${result.product.name}" width="50" /></td> 
                </tr>
            `;
            tableBody.insertAdjacentHTML('beforeend', newRow);  // Add new row to the table

            // Clear form fields
            document.getElementById('productForm').reset();

            // Close the popup
            document.getElementById('popupForm').style.display = 'none';
        }
    } catch (error) {
        console.error('Error submitting form:', error);
    }
});



$(document).ready(async function () {
    headerHtml();
    await getAllProductTable();
    tableView();
});
