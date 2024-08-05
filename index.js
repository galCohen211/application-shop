document.querySelectorAll('.women-link').forEach(function(link) {
    link.addEventListener('click', function(event) {
        event.preventDefault();
        window.location.href = 'women.html';
    });
});

document.querySelectorAll('.men-link').forEach(function(link) {
    link.addEventListener('click', function(event) {
        event.preventDefault();
        window.location.href = 'men.html';
    });
});

//Changing images every 3 seconds
document.addEventListener("DOMContentLoaded", function(){
    const image = document.getElementById("background-image");
    const images = [
        "images/general/homepage_background.png",
        "images/general/homepage_background1.png",
        "images/general/homepage_background2.png",
        "images/general/homepage_background3.png"
    ];
    let currentImage = 0;
    setInterval(()=>{
        currentImage = (currentImage +1) % images.length;
        image.src = images[currentImage];
    }, 3000);
})