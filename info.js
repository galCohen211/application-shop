function closeFooter() {
    const footer = document.querySelector('.black-bar');
    footer.style.display = 'none';
  }

  setTimeout(() => {
    const closeBtn = document.querySelector('.close-btn');
    closeBtn.style.display = 'block';
    }, 3000);

//Function to show the popup
function showPopup() {
    const popup = document.getElementById('popup');
    popup.style.display = 'flex'; // Show the popup
}

// Function to close the popup when the close button is clicked
function closePopup() {
    const popup = document.getElementById('popup');
    popup.style.display = 'none'; // Hide the popup
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
