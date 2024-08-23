// Switch between images and videos every 5 seconds
document.addEventListener("DOMContentLoaded", function(){
    const image = document.getElementById("background-image");
    const video = document.getElementById("background-video");
    const images = [
        "../../../assets/images/general/homepage_background.png",
        "../../../assets/images/general/homepage_background1.png",
        "../../../assets/images/general/homepage_background2.png",
        "../../../assets/images/general/homepage_background3.png"
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
