document.addEventListener('DOMContentLoaded', () => {
  const openBtn = document.getElementById('open-help-modal');
  const modal = document.getElementById('helpModal');
  const closeBtn = document.getElementById('closeHelpModal');

  openBtn.addEventListener('click', () => {
    modal.classList.add('active');
  });

  closeBtn.addEventListener('click', () => {
    modal.classList.remove('active');
  });
});