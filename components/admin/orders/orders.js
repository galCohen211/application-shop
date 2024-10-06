async function getUserName(id) {
    try {
        const result = await $.ajax({
            url: `http://localhost:4000/users/${id}`,
            type: 'GET',
            dataType: 'json'
        });
        return result;
    } catch (error) {
        console.error("Error fetching data:", error);
        throw error;
    }
}

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

    // Show the table now that pagination is set up
    $('#main-table').show();
}

// Get all orders
async function getAllOrders(accessToken) {
    try {
        $('#loadingSpinner').show();

        $('#main-table').hide();
        $('#totalOrders').hide();
        $('#salesByCityChart').hide();

        const result = await $.ajax({
            url: 'http://localhost:4000/orders',
            type: 'GET',
            headers: {
                'Authorization': `Bearer ${accessToken}`
            },
            dataType: 'json'
        });

        const tableBody = $("#main-table tbody");
        tableBody.empty(); // Clear any existing rows

        $('#totalOrders').text(`Total orders: ${result.amount}`);

        const addOrdersToTable = async (orders) => {
            for (const order of orders.data) {
                try {
                    const userData = await getUserName(order.user);
                    const firstName = userData.user.firstName;
                    const lastName = userData.user.lastName;
                    const orderRow = `
                        <tr>
                            <td data-id="${order._id}">${order._id}</td>
                            <td>${firstName}</td>
                            <td>${lastName}</td>
                            <td>${order.dateOrdered}</td>
                            <td>$${order.totalPrice}</td>
                            <td>${order.city}</td>
                            <td>${order.street}</td>
                        </tr>
                    `;
                    tableBody.append(orderRow); // Add the new row to the table
                } catch (error) {
                    console.error("Error fetching user data:", error);
                }
            }
            tableView(); // Initialize pagination after adding rows
        };

        await addOrdersToTable(result);

    } catch (error) {
        console.error("Error fetching orders:", error);
    } finally {
        $('#loadingSpinner').hide();

        $('#main-table').show();
        $('#totalOrders').show();
        $('#salesByCityChart').show();
    }
}

async function getSalesByCity(accessToken) {
    try {
        const result = await $.ajax({
            url: 'http://localhost:4000/orders/groupByCity',
            type: 'GET',
            dataType: 'json',
            headers: {
                'Authorization': `Bearer ${accessToken}`
            },
        });

        const data = result.groupedOrders;
        createBarChart(data); // Pass the grouped order data to the chart creation function
    } catch (error) {
        console.error('Error fetching sales by city:', error);
    }
}

function createBarChart(data) {
    const svg = d3.select('#barChart');
    const margin = { top: 20, right: 30, bottom: 50, left: 60 };
    const width = 800 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    // Clear any previous elements inside the svg
    svg.selectAll("*").remove();

    const g = svg
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);

    // X scale for city names
    const x = d3.scaleBand()
        .domain(data.map(d => d._id))
        .range([0, width])
        .padding(0.1);

    // Y scale for total sales
    const y = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.totalSales)])
        .range([height, 0]);

    // Append the bars
    g.selectAll('.bar')
        .data(data)
        .enter().append('rect')
        .attr('class', 'bar')
        .attr('x', d => x(d._id))
        .attr('y', d => y(d.totalSales))
        .attr('width', x.bandwidth())
        .attr('height', d => height - y(d.totalSales));

    // X-axis
    g.append('g')
        .attr('transform', `translate(0,${height})`)
        .call(d3.axisBottom(x))
        .selectAll('text');

    // Y-axis
    g.append('g')
        .call(d3.axisLeft(y));

    // X-axis label (City)
    svg.append('text')
        .attr('x', width / 2 + margin.left)
        .attr('y', height + margin.top + margin.bottom - 10)
        .attr('text-anchor', 'middle')
        .attr('class', 'axis-label')
        .text('City');

    // Y-axis label (Total Sales)
    svg.append('text')
        .attr('transform', 'rotate(-90)')
        .attr('x', -(height / 2) - margin.top)
        .attr('y', margin.left / 2 - 10)
        .attr('text-anchor', 'middle')
        .attr('class', 'axis-label')
        .text('Total Sales ($)');
}


$(document).ready(async function () {
    const accessToken = localStorage.getItem('accessToken');
    await getAllOrders(accessToken);
    await getSalesByCity(accessToken);
});
