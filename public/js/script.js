if (document.querySelector("h1").textContent === "Login" || document.querySelector("h1").textContent === "Register") {
  const pswdBtn = document.querySelector("#pswdBtn");
  pswdBtn.addEventListener("click", function() {
    const pswdInput = document.getElementById("account_password");
    const type = pswdInput.getAttribute("type");
    if (type == "password") {
      pswdInput.setAttribute("type", "text");
      pswdBtn.innerHTML = "Hide Password";
    } else {
      pswdInput.setAttribute("type", "password");
      pswdBtn.innerHTML = "Show Password";
    }
  });
}

/* **************************************
* Select the previously selected option of the dynamic drop-down list
************************************** */
if (document.querySelector("h1").textContent === "New Vehicle") {
  const form = document.getElementById("addVehicle");
  const desc = document.getElementById("classificationList");
  let id = localStorage.getItem("classification_id");

  form.addEventListener("submit", () => {
    localStorage.setItem("classification_id", desc.value);
  });

  if (id != null) {
    document.getElementById(`'${id}'`).selected = true;
  }
}