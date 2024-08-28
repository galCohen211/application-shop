$(document).ready(function () {
    const accessToken = localStorage.getItem('accessToken');

    const payload = JSON.parse(atob(accessToken.split('.')[1]));
    const userId = payload.userId;

    $.ajax({
        url: `http://localhost:4000/orders/${userId}`,
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${accessToken}`
        },
        success: function (data) {
            console.log(data.data[0].cart);
            $('#totalPrice').val(data.data[0].totalPrice);
            $('#cart').val(data.data[0].cart);
        },
        error: function () {
            $('#responseMessage').html('<div class="alert alert-danger">Failed to load orders details.</div>');
        }
    });

    $('#updateUserOrders').on('submit', function (e) {
        e.preventDefault();

        if (this.checkValidity() === false) {
            e.stopPropagation();
            this.classList.add('was-validated');
            return;
        }

        const formData = {
            totalPrice: $('#totalPrice').val(),
            cart: $('#cart').val()
        };

        $.ajax({
            url: `http://localhost:4000/orders/${userId}`,
            method: 'GET',
            contentType: 'application/json',
            headers: {
                'Authorization': `Bearer ${accessToken}`
            },
            data: JSON.stringify(formData),
            success: function (data) {
                $('#responseMessage').html('<div class="alert alert-success">Update went successfully!</div>');
                console.log("Orders are loaded")
            },
            error: function (xhr) {
                let errorMessage = 'Unknown error occurred.';
                $('#responseMessage').html(`<div class="alert alert-danger">${errorMessage}</div>`);
            }
        });
    });
});
