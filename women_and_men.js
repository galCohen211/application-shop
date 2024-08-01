function closeFooter() {
    const footer = document.querySelector('.black-bar');
    footer.style.display = 'none';
    localStorage.setItem('footerFlag', 'true');
  }

  setTimeout(() =>{
    const closeBtn = document.querySelector('.close-btn');
    closeBtn.style.display = 'block';
  }, 3000);





  






