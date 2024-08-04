function closeFooter() {
  const footer = document.querySelector('.black-bar');
  footer.style.display = 'none';
}

setTimeout(() => {
  const closeBtn = document.querySelector('.close-btn');
  closeBtn.style.display = 'block';
  }, 3000);

function openDropDown() {
  var dropdownMenu = document.getElementById("dropdownMenu");
  if (dropdownMenu.style.display === "none" || dropdownMenu.style.display === "") {
    dropdownMenu.style.display = "block";
  } else {
    dropdownMenu.style.display = "none";
  }
}
