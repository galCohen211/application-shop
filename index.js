document.querySelectorAll('.women-link').forEach(function(link) {
    link.addEventListener('click', function(event) {
        event.preventDefault();
        window.location.href = 'women.html';
    });
});

// script.js
document.querySelectorAll('.men-link').forEach(function(link) {
    link.addEventListener('click', function(event) {
        event.preventDefault();
        window.location.href = 'men.html';
    });
});
