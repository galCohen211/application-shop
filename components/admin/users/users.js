// Table view and pagination
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

// // Fill popup with user details
// function fillPopup(user) {
//     $('#id')[0].value = user._id;
//     $('#fistName')[0].value = user.firstName;
//     $('#lastName')[0].value = user.lastName;
//     $('#email')[0].value = user.email;
//     $('#city')[0].value = user.city;
//     $('#street')[0].value = user.street;
//     $('#gender')[0].value = user.gender;
//     $('#birthDate')[0].value = user.birthDate;
// }
// TODO: to remove search function from users.js
// Get all usersW
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
                    date = new Date(user.birthDate);
                    const userRow = `
                        <tr>
                            <td data-id="${user._id}">${user.firstName}</td>
                            <td>${user.lastName}</td>
                            <td>${user.email}</td>
                            <td>${user.city}</td>
                            <td>${user.street}</td>
                            <td>${user.gender}</td>
                            <td>${date.toISOString().slice(0, 10)}</td>
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

// // Open the popup when the plus button is clicked
// const plusButton = document.getElementById('plusButton');
// const closePopupBtn = document.getElementById('closePopup');

// plusButton.addEventListener('click', function () {
//     popupForm.style.display = 'flex'; // Use flexbox to center the popup
//     $('#popup-header').text("Add New user");
//     $('#userForm')[0].reset(); // Reset all form fields
// });


// // Close the popup when the close button (X) is clicked
// closePopupBtn.addEventListener('click', function () {
//     popupForm.style.display = 'none';
// });

// // Close the popup when clicking outside the popup content
// window.addEventListener('click', function (event) {
//     if (event.target === popupForm) {
//         popupForm.style.display = 'none';
//     }
// });

function refreshTable() {
    // Fetch all users and reinitialize table view and pagination
    getAllUserTable().then(() => {
        tableView();
    });
}

// // Add or update a user
// function addOrUpdateuser(accessToken) {
//     $('#userForm').on('submit', function (event) {
//         event.preventDefault(); // Prevent default form submission

//         // Create FormData object and append form fields
//         const formData = new FormData();
//         formData.append('firstName', $('#firstName').val());
//         formData.append('lastName', $('#lastName').val());
//         formData.append('email', $('#email').val());
//         formData.append('city', $('#brand').val());
//         formData.append('street', $('#street').val());
//         formData.append('gender', $('#gender').val());
//         formData.append('birthDate', $('#birthDate').val());
//         const accessToken = localStorage.getItem('accessToken');
//         const headerText = $('#popup-header').text();
//         if (headerText.includes("Update")) {
//             const userId = $('#id').val();
//             $.ajax({
//                 url: `http://localhost:4000/users/${userId}`,
//                 type: 'PUT',
//                 contentType: false,
//                 processData: false,
//                 headers: {
//                     'Authorization': `Bearer ${accessToken}`
//                 },
//                 data: formData,
//                 success: function () {
//                     $('#userForm')[0].reset();
//                     $('#popupForm').hide();
//                     refreshTable();
//                 },
//                 error: function (error) {
//                     console.error('Error updating user:', error);
//                     alert('An error occurred while updating the user.');
//                 }
//             });
//         } else {
//             $.ajax({
//                 url: 'http://localhost:4000/users',
//                 type: 'POST',
//                 contentType: false,
//                 processData: false,
//                 headers: {
//                     'Authorization': `Bearer ${accessToken}`
//                 },
//                 data: formData,
//                 success: function (result) {
//                     const tableBody = $('#main-table tbody');
//                     const newRow = `
//                         <tr>
//                             <td>${result.user.firstName}</td>
//                             <td>${result.user.lastName}</td>
//                             <td>$${result.user.email}</td>
//                             <td>${result.user.city}</td>
//                             <td>${result.user.street}</td>
//                             <td>${result.user.gender}</td>
//                             <td>${result.user.birthDate}</td>
//                         </tr>
//                     `;
//                     tableBody.append(newRow);
//                     $('#userForm')[0].reset();
//                     $('#popupForm').hide();
//                 },
//                 error: function (error) {
//                     console.error('Error adding user:', error);
//                     alert('An error occurred while adding the user.');
//                 }
//             });
//         }
//     });
// }

// // Delete a user
// function deleteuser(accessToken) {
//     $('#main-table').on('click', '.delete-btn', function () {
//         const row = $(this).closest('tr');
//         const userId = row.find('td:first').data('id');

//         if (confirm("Are you sure you want to delete this user?")) {
//             $.ajax({
//                 url: `http://localhost:4000/users/${userId}`,
//                 type: 'DELETE',
//                 headers: {
//                     'Authorization': `Bearer ${accessToken}`
//                 },
//                 success: function () {
//                     row.remove(); // Remove the row from the table
//                     alert('user deleted successfully.');
//                 },
//                 error: function (error) {
//                     console.error('Error deleting user:', error);
//                     alert('An error occurred while deleting the user.');
//                 }
//             });
//         }
//     });
// }

// // Edit a user
// function edituser(accessToken) {
//     $('#main-table').on('click', '.edit-btn', function () {
//         const row = $(this).closest('tr');
//         const userId = row.find('td:first').data('id');

//         $.ajax({
//             url: `http://localhost:4000/users/${userId}`,
//             type: 'GET',
//             headers: {
//                 'Authorization': `Bearer ${accessToken}`
//             },
//             success: function (result) {
//                 popupForm.style.display = 'flex';
//                 $('#popup-header').text("Update user");
//                 fillPopup(result.user);
//             },
//             error: function (error) {
//                 console.error('Error fetching user details:', error);
//                 alert('An error occurred while fetching user details.');
//             }
//         });
//     });
// }

// Search users
async function searchusers(accessToken) {
    const searchQuery = $('.search-box').val().trim();

    // If search box is cleared, fetch all users again
    if (searchQuery === '') {
        await getAllUserTable();
        tableView();
        return;
    }

    const result = await $.ajax({
        url: `http://localhost:4000/users/search?name=${encodeURIComponent(searchQuery)}`,
        type: 'GET',
        headers: {
            'Authorization': `Bearer ${accessToken}`
        },
        success: function (response) {
            const tableBody = $("#main-table tbody");
            tableBody.empty(); // Clear previous rows

            if (response.length > 0) {
                birth = new Date(user.birthDate.toISOString().slice(0, 10));
                response.forEach(user => {
                    const userRow = `
                        <tr>
                            <td data-id="${user._id}">${user.firstName}</td>
                            <td>${user.lastName}</td>
                            <td>$${user.email}</td>
                            <td>${user.city}</td>
                            <td>${user.street}</td>
                            <td>${user.gender}</td>
                            <td>${birth}</td>
                            <td>
                                <button class="btn edit-btn"><i class="bi bi-pencil"></i></button>
                                <button class="btn delete-btn"><i class="bi bi-trash"></i></button>
                            </td>
                        </tr>
                    `;
                    tableBody.append(userRow);
                });
            } else {
                // Show empty table
                tableBody.append('<tr><td colspan="10">No users found</td></tr>');
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
    await getAllUserTable();
    tableView();

    // Event listeners
    //addOrUpdateuser(accessToken);
    //deleteuser(accessToken);
    //edituser(accessToken);
});
