// Table view and pagination
function tableView() {
    const rowsPerPage = 3;
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



// Fill popup with user details
function fillPopup(user) {
    
    $('#user_id')[0].value = user._id;
    document.querySelector('[for="firstName"]').hidden = true;
    $('#firstName')[0].hidden = true;
    document.querySelector('[for="lastName"]').hidden = true;
    $('#lastName')[0].hidden = true;
    $('#firstName')[0].value = user.firstName;
    $('#lastName')[0].value = user.lastName;
    $('#email')[0].value = user.email;
    $('#city')[0].value = user.city;
    $('#street')[0].value = user.street;
    document.querySelector('[for="gender"]').hidden = true;
    $('#gender')[0].hidden = true;
    date = new Date(user.birthDate);
    document.querySelector('[for="birthDate"]').hidden = true;
    $('#birthDate')[0].hidden = true;
    $('#birthDate')[0].value = date.toISOString().split('T')[0];
    document.querySelector('[for="password"]').hidden = true;
    $("#password")[0].hidden = true;
    $("#password")[0].value = user.password;

}
// Get all users
async function getAllUserTable() {
    const accessToken = localStorage.getItem('accessToken');
    const result = await $.ajax({
        url: 'http://localhost:4000/users',
        type: 'GET',
        headers: {
            'Authorization': `Bearer ${accessToken}`
        },
        dataType: 'json',
        success: function (response) {
            function addUsersToTable(users) {
                const tableBody = $("#main-table tbody");
                tableBody.empty(); // Clear any existing rows

                users.forEach(function (user) {
                    date = new Date(user.birthDate).toLocaleDateString('en-GB');
                    const userRow = `
                        <tr>
                            <td data-id="${user._id}">${user.firstName}</td>
                            <td>${user.lastName}</td>
                            <td>${user.email}</td>
                            <td>${user.city}</td>
                            <td>${user.street}</td>
                            <td>${user.gender}</td>
                            <td>${date}</td>
                            <td>
                                <button class="btn edit-btn"><i class="bi bi-pencil"></i></button>
                                <button class="btn delete-btn"><i class="bi bi-trash"></i></button>
                            </td>
                        </tr>
                    `;

                    tableBody.append(userRow); // Add the new row to the table
                });
            }
            addUsersToTable(response);
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
    $('#popup-header').text("Add New user");
    $('#userForm')[0].reset(); // Reset all form fields
    document.querySelector('[for="password"]').hidden = false;
    $("#password")[0].hidden = false;
    document.querySelector('[for="firstName"]').hidden = false;
    $('#firstName')[0].hidden = false;
    document.querySelector('[for="lastName"]').hidden = false;
    $('#lastName')[0].hidden = false;
    document.querySelector('[for="gender"]').hidden = false;
    $('#gender')[0].hidden = false;
    document.querySelector('[for="birthDate"]').hidden = false;
    $('#birthDate')[0].hidden = false;
    document.querySelector('[for="password"]').hidden =false;
    $("#password")[0].hidden = false;
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
    // Fetch all users and reinitialize table view and pagination
    getAllUserTable().then(() => {
        tableView();
    });
}

// // Add or update a user
function addOrUpdateUser(accessToken) {
    $('#userForm').on('submit', async function (event) {
        event.preventDefault(); // Prevent default form submission

        // Create FormData object and append form fields
        firstName = $('#firstName').val();
        lastName = $('#lastName').val();
        email = $('#email').val();
        city = $('#city').val();
        password = $('#password').val();
        street = $('#street').val();
        gender = $('#gender').val();
        birthDate = $('#birthDate').val();

        const userData = {
            firstName,
            lastName,
            email,
            password,
            city,
            street,
            gender,
            birthDate,
        };
    
        const accessToken = localStorage.getItem('accessToken');
        const headerText = $('#popup-header').text();
        if (headerText.includes("Update")) {
            const userId = $('#user_id').val();
            const response = await fetch(`http://localhost:4000/users/${userId}`, {
                method: "PUT",
                headers: {
                  "Content-Type": "application/json",
                  'Authorization': `Bearer ${accessToken}`
                },
                body: JSON.stringify(userData),
              });
              const responseText = await response.text();
        
              if (response.ok) {
                $('#userForm')[0].reset();
                $('#popupForm').hide();
                refreshTable();
              } else {
                    console.error('Error updating user');
                    alert('An error occurred while updating the user.');
                }
        } else {
            
              const response = await fetch("http://localhost:4000/users/signup", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(userData),
              });
              const responseText = await response.text();
        
              if (response.ok) {
                $('#userForm')[0].reset();
                $('#popupForm').hide();
                refreshTable();
              } else {
           
                const errorMsg = JSON.parse(responseText)[0];
                if (errorMsg.email === "unavailable") {
                document.getElementById("form-submit-error-message").innerText =
                    "User already exists";
                }
            
                console.log("Register failed");
                console.error(error);
              }
            }
        });
    }

// Delete a user
function deleteuser(accessToken) {
    $('#main-table').on('click', '.delete-btn', function () {
        const row = $(this).closest('tr');
        const userId = row.find('td:first').data('id');

        if (confirm("Are you sure you want to delete this user?")) {
            $.ajax({
                url: `http://localhost:4000/users/${userId}`,
                type: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                },
                success: function () {
                    row.remove(); // Remove the row from the table
                    alert('user deleted successfully.');
                    refreshTable();
                },
                error: function (error) {
                    console.error('Error deleting user:', error);
                    alert('An error occurred while deleting the user.');
                }
            });
        }
    });
}

// Edit a user
function editUser(accessToken) {
    $('#main-table').on('click', '.edit-btn', function () {
        const row = $(this).closest('tr');
        const userId = row.find('td:first').data('id');

        $.ajax({
            url: `http://localhost:4000/users/${userId}`,
            type: 'GET',
            headers: {
                'Authorization': `Bearer ${accessToken}`
            },
            success: function (result) {
                popupForm.style.display = 'flex';
                $('#popup-header').text("Update user");
                fillPopup(result.user);
            },
            error: function (error) {
                console.error('Error fetching user details:', error);
                alert('An error occurred while fetching user details.');
            }
        });
    });
}

$(document).ready(async function () {
    const accessToken = localStorage.getItem('accessToken');
    await getAllUserTable();
    tableView();

    // Event listeners
    addOrUpdateUser(accessToken);
    deleteuser(accessToken);
    editUser(accessToken);
});
