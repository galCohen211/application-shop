// Apply header.html file into the pages
fetch('header.html')
    .then(response => response.text())
    .then(data => {
        document.getElementById('header').innerHTML = data;

        const currentUrl = window.location.pathname;

        // Remove any existing 'active' class from all nav links
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });

        // Add the 'active' class to the correct link based on the current URL
        if (currentUrl.includes('women.html')) {
            document.getElementById('women-link').classList.add('active');
        } else if (currentUrl.includes('men.html')) {
            document.getElementById('men-link').classList.add('active');
        } else if (currentUrl.includes('info.html')) {
            document.getElementById('info-link').classList.add('active');
        }
    })
    .catch(error => console.error('Error fetching header:', error));
