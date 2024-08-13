src="https://code.jquery.com/jquery-3.3.1.slim.min.js"
integrity="sha384-q8i/X+965DzO0rT7abK41JStQIAqVgRVzpbzo5smXKp4YfRvH+8abtTE1Pi6jizo"
crossorigin="anonymous"

src="https://cdn.jsdelivr.net/npm/popper.js@1.14.7/dist/umd/popper.min.js"
integrity="sha384-UO2eT0CpHqdSJQ6hJty5KVphtPhzWj9WO1clHTMGa3JDZwrnQq4sF86dIHNDz0W1"
crossorigin="anonymous"

src="https://cdn.jsdelivr.net/npm/bootstrap@4.3.1/dist/js/bootstrap.min.js"
integrity="sha384-JjSmVgyd0p3pXB1rRibZUAYoIIy6OrQ6VrjIEaFf/nJGzIxFDsf4x0xIM+B07jRM"
crossorigin="anonymous"

// Close button appears after 3 seconds
setTimeout(() => { 
  const closeBtn = document.getElementById('close-btn');
  closeBtn.style.display = 'block';
}, 3000);

//Close the black bar with sessionStorage 
document.addEventListener('DOMContentLoaded', ()=>{
  const footer = document.getElementById('black-bar');
  const closeBtn = document.getElementById('close-btn');

  if(sessionStorage.getItem('black-bar') !== 'true'){
    footer.classList.remove('hidden');
  } 

  closeBtn.addEventListener('click', () =>{
    footer.classList.add('hidden');
    sessionStorage.setItem('black-bar', 'true');
  })
})

function openMenu(event) {
  event.stopPropagation(); // Prevent the click event from bubbling up to the document
  const dropdowns = document.querySelectorAll('.dropdown-list');

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

document.addEventListener('click', function(event) {
  const dropdownLists = document.querySelectorAll('.dropdown-list');

  // Close all dropdowns if the click is outside any dropdown
  dropdownLists.forEach(function(list) {
    if (!list.parentElement.contains(event.target)) {
      list.classList.remove('show');
    }
  });
});
