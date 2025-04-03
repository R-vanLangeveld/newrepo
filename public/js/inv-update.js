const form = document.querySelector('form');
form.addEventListener('change', () => {
  const updateBtn = document.querySelector('#submit');
  updateBtn.removeAttribute('disabled');
});
