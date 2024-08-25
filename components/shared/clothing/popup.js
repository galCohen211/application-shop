// Generally about this file: This will make the popup appear once every session.

// This function shows the popup on screen
function showPopup() {
    // Check if the popup should be shown this session (I want the popup to be displayed only once per session)
    const popup = document.getElementById('popup');
    const isPopupShown = sessionStorage.getItem('popupShown');
    
    if (!isPopupShown) {
        popup.style.display = 'flex'; // Show the popup
        console.log("Popup is displayed");

        // Set session storage to indicate the popup has been shown this session
        sessionStorage.setItem('popupShown', 'true');
    } else {
        console.log("Popup has already been shown this session");
    }
}

// Function to close the popup when the close button is clicked
function closePopup() {
    const popup = document.getElementById('popup');
    popup.style.display = 'none';
}

// Show the popup as soon as the page finishes loading
window.onload = function() {
    showPopup();
}

// Close the popup when the close button is clicked
document.addEventListener('DOMContentLoaded', function() {
    const closeButton = document.querySelector('.close');
    closeButton.addEventListener('click', closePopup);
});

// Set the target date and time
const targetDate = new Date("December 01, 2024 23:59:59").getTime();

// Countdown timer function
function updateCountdown() {
    const now = new Date().getTime();
    const timeLeft = targetDate - now;

    // Calculate days, hours, minutes, and seconds left
    const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

    // Display the result in the countdown element
    document.getElementById("countdown").innerHTML = 
        days + "d " + hours + "h " + minutes + "m " + seconds + "s ";

    // If the countdown is over, display a message
    if (timeLeft < 0) {
        clearInterval(timerInterval);
        document.getElementById("countdown").innerHTML = "Offer expired";
    }
}
// Update the countdown every second
const timerInterval = setInterval(updateCountdown, 1000);
