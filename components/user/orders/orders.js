$(document).ready(function () {
    const accessToken = localStorage.getItem('accessToken');
    const payload = JSON.parse(atob(accessToken.split('.')[1]));
    const userId = payload.userId;

    let currentPage = 1;
    const ordersPerPage = 5;

    function renderOrders(orders, page) {
        const start = (page - 1) * ordersPerPage;
        const end = start + ordersPerPage;
        const paginatedOrders = orders.slice(start, end);

        const ordersList = $('#ordersList');
        ordersList.empty();

        paginatedOrders.forEach((order, index) => {
            const orderNumber = start + index + 1;
            const orderItem = `
                <li class="list-group-item d-flex justify-content-between align-items-center">
                    Order #${orderNumber}: Total of ${order.totalPrice}$
                    <button class="btn btn-primary view-details-btn" data-order='${JSON.stringify(order)}' data-bs-toggle="modal" data-bs-target="#orderDetailsModal">View Details</button>
                </li>
            `;
            ordersList.append(orderItem);
        });

        $('.view-details-btn').on('click', function () {
            const order = $(this).data('order');
            $('#modalTotalOrderPrice').text(order.totalPrice + '$');

            const parsedDate = parseDate(order.dateOrdered);
            const formattedDate = formatDate(parsedDate);
            $('#modalDateOrdered').text(formattedDate);

            const itemsList = $('#itemsList');
            itemsList.empty();

            order.cartItems.forEach(item => {
                const itemData = `
                    <li class="list-group-item d-flex align-items-center">
                        <div class="text-content">
                            <p><strong>Product Name:</strong> ${item.product.name}</p>
                            <p><strong>Item Amount:</strong> ${item.amount}</p>
                            <p><strong>Total Item Price:</strong> ${item.price + '$'}</p>
                        </div>
                        <img src="${item.product.imagePath}" alt="Product Image" class="img-fluid productImage" />
                    </li>
                `;
                itemsList.append(itemData);
            });
        });

        renderPagination(orders, page);
    }

    function renderPagination(orders, page) {
        const totalPages = Math.ceil(orders.length / ordersPerPage);
        const pagination = $('#pagination');
        pagination.empty();

        for (let i = 1; i <= totalPages; i++) {
            const isActive = i === page ? 'active' : '';
            const pageButton = `<li class="page-item ${isActive}"><button class="page-link" data-page="${i}">${i}</button></li>`;
            pagination.append(pageButton);
        }

        $('.page-link').on('click', function () {
            const selectedPage = parseInt($(this).data('page'));
            currentPage = selectedPage;
            renderOrders(orders, currentPage);
        });
    }

    $.ajax({
        url: `http://localhost:4000/orders/${userId}`,
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${accessToken}`
        },
        beforeSend: function () {
            $('#loadingSpinner').show();
        },
        success: function (data) {
            $('#loadingSpinner').hide();
            renderOrders(data.data, currentPage);
        },
        error: function () {
            $('#loadingSpinner').hide();
            $('#responseMessage').html('<div class="alert alert-danger">Failed to load orders details.</div>');
        }
    });
});
