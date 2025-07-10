  document.querySelector('.home-button').addEventListener('click', () => {
    // Animate here...
    setTimeout(() => {
      window.location.href = '../components/animations/loading/index.html?redirect=home';
    }, 1200); // after 1.2 second
  });