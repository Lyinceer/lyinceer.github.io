document.querySelector('.btn-game').addEventListener('click', () => {
  // Animate here...
  setTimeout(() => {
    window.location.href = './components/animations/loading/index.html?redirect=game';
  }, 1200); // after 1.2 second
});