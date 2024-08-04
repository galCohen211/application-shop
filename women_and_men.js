src="https://code.jquery.com/jquery-3.3.1.slim.min.js"
integrity="sha384-q8i/X+965DzO0rT7abK41JStQIAqVgRVzpbzo5smXKp4YfRvH+8abtTE1Pi6jizo"
crossorigin="anonymous"

src="https://cdn.jsdelivr.net/npm/popper.js@1.14.7/dist/umd/popper.min.js"
integrity="sha384-UO2eT0CpHqdSJQ6hJty5KVphtPhzWj9WO1clHTMGa3JDZwrnQq4sF86dIHNDz0W1"
crossorigin="anonymous"

src="https://cdn.jsdelivr.net/npm/bootstrap@4.3.1/dist/js/bootstrap.min.js"
integrity="sha384-JjSmVgyd0p3pXB1rRibZUAYoIIy6OrQ6VrjIEaFf/nJGzIxFDsf4x0xIM+B07jRM"
crossorigin="anonymous"

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
