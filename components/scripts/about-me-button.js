  document.querySelector('.btn-about').addEventListener('click', () => {
    // Animate here...
    setTimeout(() => {
      window.location.href = './components/animations/loading/index.html?redirect=about-me';
    }, 1200); // after 1.2 second
  });