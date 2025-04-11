const form = document.querySelector('#updateAccount');
form.addEventListener('change', () => {
  const updateBtn = document.querySelector('#updateAccountBtn');
  updateBtn.removeAttribute('disabled');
});