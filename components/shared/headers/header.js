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

function openMenu(event) {
    event.stopPropagation();

    const dropdowns = document.querySelectorAll('.dropdown-menu');
    
    // Close all other dropdowns
    dropdowns.forEach(function(dropdown) {
      if (dropdown !== event.currentTarget.nextElementSibling) {
        dropdown.classList.remove('show');
      }
    });
    
    // Toggle the current dropdown
    const dropdown = event.currentTarget.nextElementSibling;
    dropdown.classList.toggle('show');
}

// When clicking anywhere else, close the dropdown
document.addEventListener('click', function(event) {
    const isDropdownButton = event.target.classList.contains('dropdown-toggle');
    const isDropdown = event.target.closest('.dropdown-menu');

    if (!isDropdownButton && !isDropdown) {
        document.querySelectorAll('.dropdown-menu').forEach(function(dropdown) {
            dropdown.classList.remove('show');
        });
    }
});

function signOut() {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("role");
    window.location.href = "../../shared/home/index.html";
    console.log("User signed out.");
  }
  