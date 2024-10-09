// Table view and pagination
function tableView() {
    const rowsPerPage = 4;
    const rows = $('#main-table tbody tr');
    const rowsCount = rows.length;
    const totalPages = Math.ceil(rowsCount / rowsPerPage);

    $('#pagination').empty(); // Clear previous pagination

    const pagination = $('<ul class="pagination"></ul>'); // Create the pagination element

    // Display rows for the current page number
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
        const pageNumber = $(this).text();
        displayRows(pageNumber); // Display the appropriate rows
        pagination.find('li').removeClass('active');
        $(this).parent().addClass('active');
    });

    // Initialize the first page
    displayRows(1);
    pagination.find('li:first').addClass('active'); // Mark the first page as active
}

// Fill popup with product details
function fillPopup(product) {
    $('#id')[0].value = product._id;
    $('#name')[0].value = product.name;
    $('#category')[0].value = product.category;
    $('#price')[0].value = product.price;
    $('#brand')[0].value = product.brand;
    $('#quantity')[0].value = product.quantity;
    $('#gender')[0].value = product.gender;
    $('#color')[0].value = product.color;
    $('#size')[0].value = product.size;
}

// Get all products
async function getAllProductTable() {
    const result = await $.ajax({
        url: 'http://localhost:4000/products',
        type: 'GET',
        dataType: 'json',
        success: function (response) {
            function addProductsToTable(products) {
                const tableBody = $("#main-table tbody");
                tableBody.empty(); // Clear any existing rows

                products.forEach(function (product) {
                    const productRow = `
                        <tr>
                            <td data-id="${product._id}">${product.name}</td>
                            <td>${product.category}</td>
                            <td>$${product.price}</td>
                            <td>${product.brand}</td>
                            <td>${product.size}</td>
                            <td>${product.color}</td>
                            <td>${product.quantity}</td>
                            <td>${product.gender}</td>
                            <td><img src="${product.imagePath}" alt="${product.name}" width="50" /></td> 
                            <td>
                                <button class="btn edit-btn"><i class="bi bi-pencil"></i></button>
                                <button class="btn delete-btn"><i class="bi bi-trash"></i></button>
                            </td>
                        </tr>
                    `;

                    tableBody.append(productRow); // Add the new row to the table
                });
            }
            addProductsToTable(response);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.error("Error fetching data:", textStatus, errorThrown);
        }
    });
    return result;
}

// Open the popup when the plus button is clicked
const plusButton = document.getElementById('plusButton');
const closePopupBtn = document.getElementById('closePopup');

plusButton.addEventListener('click', function () {
    popupForm.style.display = 'flex'; // Use flexbox to center the popup
    $('#popup-header').text("Add New Product");
    $('#productForm')[0].reset(); // Reset all form fields
});


// Close the popup when the close button (X) is clicked
closePopupBtn.addEventListener('click', function () {
    popupForm.style.display = 'none';
});

// Close the popup when clicking outside the popup content
window.addEventListener('click', function (event) {
    if (event.target === popupForm) {
        popupForm.style.display = 'none';
    }
});

function refreshTable() {
    // Fetch all products and reinitialize table view and pagination
    getAllProductTable().then(() => {
        tableView();
    });
}

// Add or update a product
function addOrUpdateProduct(accessToken) {
    $('#productForm').on('submit', function (event) {
        event.preventDefault(); // Prevent default form submission

        // Create FormData object and append form fields
        const formData = new FormData();
        formData.append('name', $('#name').val());
        formData.append('category', $('#category').val());
        formData.append('price', $('#price').val());
        formData.append('brand', $('#brand').val());
        formData.append('size', $('#size').val());
        formData.append('color', $('#color').val());
        formData.append('quantity', $('#quantity').val());
        formData.append('gender', $('#gender').val());
        formData.append('imagePath', $('#imagePath')[0].files[0]);

        const headerText = $('#popup-header').text();
        if (headerText.includes("Update")) {
            const productId = $('#id').val();
            $.ajax({
                url: `http://localhost:4000/products/${productId}`,
                type: 'PUT',
                contentType: false,
                processData: false,
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                },
                data: formData,
                success: function () {
                    $('#productForm')[0].reset();
                    $('#popupForm').hide();
                    refreshTable();
                },
                error: function (error) {
                    console.error('Error updating product:', error);
                    alert('An error occurred while updating the product.');
                }
            });
        } else {
            $.ajax({
                url: 'http://localhost:4000/products',
                type: 'POST',
                contentType: false,
                processData: false,
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                },
                data: formData,
                success: function (result) {
                    const tableBody = $('#main-table tbody');
                    const newRow = `
                        <tr>
                            <td>${result.product.name}</td>
                            <td>${result.product.category}</td>
                            <td>$${result.product.price}</td>
                            <td>${result.product.brand}</td>
                            <td>${result.product.size}</td>
                            <td>${result.product.color}</td>
                            <td>${result.product.quantity}</td>
                            <td>${result.product.gender}</td>
                            <td><img src="${result.product.imagePath}" alt="${result.product.name}" width="50" /></td>
                        </tr>
                    `;
                    tableBody.append(newRow);
                    $('#productForm')[0].reset();
                    $('#popupForm').hide();
                },
                error: function (error) {
                    console.error('Error adding product:', error);
                    alert('An error occurred while adding the product.');
                }
            });
        }
    });
}

// Delete a product
function deleteProduct(accessToken) {
    $('#main-table').on('click', '.delete-btn', function () {
        const row = $(this).closest('tr');
        const productId = row.find('td:first').data('id');

        if (confirm("Are you sure you want to delete this product?")) {
            $.ajax({
                url: `http://localhost:4000/products/${productId}`,
                type: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                },
                success: function () {
                    row.remove(); // Remove the row from the table
                    alert('Product deleted successfully.');
                },
                error: function (error) {
                    console.error('Error deleting product:', error);
                    alert('An error occurred while deleting the product.');
                }
            });
        }
    });
}

// Edit a product
function editProduct(accessToken) {
    $('#main-table').on('click', '.edit-btn', function () {
        const row = $(this).closest('tr');
        const productId = row.find('td:first').data('id');

        $.ajax({
            url: `http://localhost:4000/products/${productId}`,
            type: 'GET',
            headers: {
                'Authorization': `Bearer ${accessToken}`
            },
            success: function (result) {
                popupForm.style.display = 'flex';
                $('#popup-header').text("Update Product");
                fillPopup(result.product);
            },
            error: function (error) {
                console.error('Error fetching product details:', error);
                alert('An error occurred while fetching product details.');
            }
        });
    });
}

// Search Products
async function searchProducts(accessToken) {
    const searchQuery = $('.search-box').val().trim();

    // If search box is cleared, fetch all products again
    if (searchQuery === '') {
        await getAllProductTable();
        tableView();
        return;
    }

    const result = await $.ajax({
        url: `http://localhost:4000/products/search?name=${encodeURIComponent(searchQuery)}`,
        type: 'GET',
        headers: {
            'Authorization': `Bearer ${accessToken}`
        },
        success: function (response) {
            const tableBody = $("#main-table tbody");
            tableBody.empty(); // Clear previous rows

            if (response.length > 0) {
                response.forEach(product => {
                    const productRow = `
                        <tr>
                            <td data-id="${product._id}">${product.name}</td>
                            <td>${product.category}</td>
                            <td>$${product.price}</td>
                            <td>${product.brand}</td>
                            <td>${product.size}</td>
                            <td>${product.color}</td>
                            <td>${product.quantity}</td>
                            <td>${product.gender}</td>
                            <td><img src="${product.imagePath}" alt="${product.name}" width="50" /></td>
                            <td>
                                <button class="btn edit-btn"><i class="bi bi-pencil"></i></button>
                                <button class="btn delete-btn"><i class="bi bi-trash"></i></button>
                            </td>
                        </tr>
                    `;
                    tableBody.append(productRow);
                });
            } else {
                // Show empty table
                tableBody.append('<tr><td colspan="10">No products found</td></tr>');
            }

            // Reinitialize pagination after search results
            tableView();
        },
        error: function (error) {
            console.error('Error fetching search results:', error);
            // No need to throw an error; simply show an empty table with headers
            $("#main-table tbody").empty();
            tableView(); // Clear pagination if no results
        }
    });

    return result;
}

$(document).ready(async function () {
    const accessToken = localStorage.getItem('accessToken');
    await getAllProductTable();
    tableView();

    // Event listeners
    addOrUpdateProduct(accessToken);
    deleteProduct(accessToken);
    editProduct(accessToken);

    // Search functionality
    $('.search-box').on('input', function () {
        searchProducts(accessToken);
    });
});
