function tableView() {
    const rowsPerPage = 4; // Number of rows per page
    const rows = $('#main-table tbody tr');
    const rowsCount = rows.length;
    const totalPages = Math.ceil(rowsCount / rowsPerPage); // How many divisions of pages do we need
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

//Popup
const plusButton = document.getElementById('plusButton');
const closePopupBtn = document.getElementById('closePopup');

// Open popup when the plus button is clicked
plusButton.addEventListener('click', function () {
    popupForm.style.display = 'flex'; // Use flexbox to center the popup
});

// Close popup when the close button (X) is clicked
closePopupBtn.addEventListener('click', function () {
    popupForm.style.display = 'none';
});

// Close popup when clicking outside of the popup content
window.addEventListener('click', function (event) {
    if (event.target === popupForm) {
        popupForm.style.display = 'none';
    }
});

//Add Product
function addProduct(accessToken) {
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

        $.ajax({
            url: `http://localhost:4000/products`,
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
                tableBody.append(newRow); // Add the new row to the table

                // Clear form fields
                $('#productForm')[0].reset();

                // Close the popup
                $('#popupForm').hide();
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.error('Error submitting form:', errorThrown);
                alert('An error occurred while creating the product.');
            }
        });
    });
}

function deleteProduct(accessToken) {
    $('#main-table').on('click', '.delete-btn', function () {
        const row = $(this).closest('tr'); // Get the row containing the clicked button
        const productId = row.find('td:first').data('id'); // Assuming the product ID is stored in a data attribute

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
                error: function (jqXHR, textStatus, errorThrown) {
                    console.error('Error deleting product:', errorThrown);
                    alert('An error occurred while deleting the product.');
                }
            });
        }
    });
}

$(document).ready(async function () {
    const accessToken = localStorage.getItem('accessToken');
    const payload = JSON.parse(atob(accessToken.split('.')[1]));
    const userId = payload.userId;
    await getAllProductTable();
    tableView();
    addProduct(accessToken);
    deleteProduct(accessToken);
});
