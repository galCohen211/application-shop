// Apply header.html file into the pages

const role = localStorage.getItem("role");

if (role === null) {
fetch('../../shared/headers/guest.html')
    .then(response => response.text())
    .then(data => {
        document.getElementById('header').innerHTML = data;
    })
    .catch(error => console.error('Error fetching header:', error));
}

else if (role === 'user') {
    fetch('../../shared/headers/user.html')
    .then(response => response.text())
    .then(data => {
        document.getElementById('header').innerHTML = data;
    })
    .catch(error => console.error('Error fetching header:', error));
}

else if (role === 'admin') {
    fetch('../../shared/headers/admin.html')
    .then(response => response.text())
    .then(data => {
        document.getElementById('header').innerHTML = data;
    })
    .catch(error => console.error('Error fetching header:', error));
}

else {
    console.log("role is not valid")
}

