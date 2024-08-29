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
            ordersAmount = data.amount; // orders count
            orderData = data.data[0];  // order number
            itemData = orderData.cartItems[0]; // item number
            itemsAmount = itemData.amount; 
            productData = itemData.product;

            totalOrderPrice = orderData.totalPrice;
            itemAmount = itemData.amount;
            totalItemPrice = itemData.price;
            productName = productData.name;
            productImagePath = productData.imagePath;
            
            console.log(productData); // just for debug

            // Update the HTML content
            $('#totalOrderPrice').text(totalOrderPrice);
            $('#itemAmount').text(itemAmount);
            $('#totalItemPrice').text(totalItemPrice);
            $('#productName').text(productName);
            $('#productImagePath').text(productImagePath);

            // Update the image src attribute
            $('#productImage').attr('src', productImagePath);
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
            totalOrderPrice: $('#totalOrderPrice').text(),
            itemAmount: $('#itemAmount').text(),
            totalItemPrice: $('#totalItemPrice').text(),
            productName: $('#productName').text(),
            productImagePath: $('#productImage').attr('src')
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
                console.log("Orders are loaded");
            },
            error: function (xhr) {
                let errorMessage = 'Unknown error occurred.';
                $('#responseMessage').html(`<div class="alert alert-danger">${errorMessage}</div>`);
            }
        });
    });
});
