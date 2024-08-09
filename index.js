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

document.querySelectorAll('.info-link').forEach(function(link) {
    link.addEventListener('click', function(event) {
        event.preventDefault();
        window.location.href = 'info.html';
    });
});

//Changing images and video every 5 seconds
document.addEventListener("DOMContentLoaded", function(){
    const image = document.getElementById("background-image");
    const video = document.getElementById("background-video");
    const images = [
        "images/general/homepage_background.png",
        "images/general/homepage_background1.png",
        "images/general/homepage_background2.png",
        "images/general/homepage_background3.png"
    ];
    let currentImage = 0;
    setInterval(()=>{
        if(currentImage == images.length){
            image.style.display = "none";
            video.style.display = "block";
            video.play();
        }
        else{
            image.src = images[currentImage];
            currentImage ++;
        }
    }, 5000);
    video.onended = () => {
        video.style.display = "none";
        currentImage = 0;
        image.style.display = "block"
        image.src = images[currentImage];
    };
});


