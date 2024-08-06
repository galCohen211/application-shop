function closeFooter() {
    const footer = document.querySelector('.black-bar');
    footer.style.display = 'none';
  }

  setTimeout(() => {
    const closeBtn = document.querySelector('.close-btn');
    closeBtn.style.display = 'block';
    }, 3000);
