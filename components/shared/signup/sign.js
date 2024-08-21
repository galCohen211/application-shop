const container = document.getElementById("container");
const registerBtn = document.getElementById("register");
const loginBtn = document.getElementById("login");

registerBtn.addEventListener("click", () => {
  container.classList.add("active");
});

loginBtn.addEventListener("click", () => {
  container.classList.remove("active");
});

//Date Validation
function setMaxDate() {
  const today = new Date().toISOString().split("T")[0];
  const birthdateInput = document.getElementById("birthdate");

  if (birthdateInput) {
    birthdateInput.setAttribute("max", today);
  }
}

//Password Validation
function passwordValidation() {
  var pass = document.getElementById("password");
  var msg = document.getElementById("message");
  var str = document.getElementById("strenght");

  pass.addEventListener("input", () => {
    if (pass.value.length > 0) {
      msg.style.display = "block";
    } else {
      msg.style.display = "none";
    }
    if (pass.value.length < 5) {
      str.innerHTML = "weak";
      pass.style.borderBlockColor = "#ff5925";
      msg.style.color = "#ff5925";
    } else if (pass.value.length >= 5 && pass.value.length < 8) {
      str.innerHTML = "medium";
      pass.style.borderBlockColor = "#FFD700 ";
      msg.style.color = "#FFD700 ";
    } else if (pass.value.length > 8) {
      str.innerHTML = "strong";
      pass.style.borderBlockColor = "#26d730";
      msg.style.color = "#26d730";
    }
  });
}

document.addEventListener("DOMContentLoaded", setMaxDate);
document.addEventListener("DOMContentLoaded", passwordValidation);
