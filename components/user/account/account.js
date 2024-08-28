$(document).ready(function () {
    const accessToken = localStorage.getItem('accessToken');

    const payload = JSON.parse(atob(accessToken.split('.')[1]));
    const userId = payload.userId;

    $.ajax({
        url: `http://localhost:4000/users/${userId}`,
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${accessToken}`
        },
        success: function (data) {
            $('#email').val(data.user.email);
            $('#city').val(data.user.city);
            $('#street').val(data.user.street);
        },
        error: function () {
            $('#responseMessage').html('<div class="alert alert-danger">Failed to load user details.</div>');
        }
    });

    $('#updateUserForm').on('submit', function (e) {
        e.preventDefault();

        if (this.checkValidity() === false) {
            e.stopPropagation();
            this.classList.add('was-validated');
            return;
        }

        const formData = {
            email: $('#email').val(),
            city: $('#city').val(),
            street: $('#street').val()
        };

        $.ajax({
            url: `http://localhost:4000/users/${userId}`,
            method: 'PUT',
            contentType: 'application/json',
            headers: {
                'Authorization': `Bearer ${accessToken}`
            },
            data: JSON.stringify(formData),
            success: function (data) {
                $('#responseMessage').html('<div class="alert alert-success">Update went successfully!</div>');
            },
            error: function (xhr) {
                let errorMessage = 'Unknown error occurred.';
                
                if (xhr.responseJSON) {
                    if (xhr.responseJSON.errors) {
                        const emailError = xhr.responseJSON.errors.find(error => error.path === 'email');
                        if (emailError) {
                            errorMessage = 'The email provided is invalid. Please enter a valid email address.';
                        }
                    } else if (xhr.responseJSON.message) {
                        if (xhr.responseJSON.message === "Invalid email. Did not update") {
                            errorMessage = 'The email is already taken. Please choose a different one.';
                        } else {
                            errorMessage = xhr.responseJSON.message;
                        }
                    }
                }

                $('#responseMessage').html(`<div class="alert alert-danger">${errorMessage}</div>`);
            }
        });
    });
});
