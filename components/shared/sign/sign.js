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

//Fetch to the login
document
  .getElementById("sign-in-btn")
  .addEventListener("click", async function (event) {
    event.preventDefault();
    const email = document.getElementById("email-sign-in").value;
    const password = document.getElementById("password-sign-in").value;

    const loginData = {
      email: email,
      password: password,
    };

    try {
      const response = await fetch("http://localhost:4000/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginData),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Login successful:", data);
        localStorage.setItem("role", data.role);
        localStorage.setItem("accessToken", data.accessToken);
        console.log("role:", data.role);
        window.location.href = "../../shared/home/index.html";
      } else {
        const errorMessage = document.getElementById("error-message");
        errorMessage.style.display = "block";
        errorMessage.textContent = "Invalid email or password.";
        console.log("Login failed");
      }
    } catch (error) {
      console.error("An error occurred:", error);
      const errorMessage = document.getElementById("error-message");
      errorMessage.style.display = "block";
      errorMessage.textContent = "An error occurred. Please try again.";
    }
  });

//Fetch to the register
document.addEventListener("DOMContentLoaded", function () {
  document
    .getElementById("sign-up-btn")
    .addEventListener("click", async function (event) {
      event.preventDefault();

      const firstName = document.getElementById("firstName").value;
      const lastName = document.getElementById("lastName").value;
      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;
      const city = document.getElementById("city").value;
      const street = document.getElementById("street").value;
      const gender = document.querySelector(
        'input[name="gender"]:checked'
      ).value;
      const birthDate = document.getElementById("birthdate").value;

      const registerData = {
        firstName,
        lastName,
        email,
        password,
        city,
        street,
        gender,
        birthDate,
      };

      const response = await fetch("http://localhost:4000/users/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(registerData),
      });
      const responseText = await response.text();
      console.log("Response text:", responseText);

      if (response.ok) {
        const data = await response.json();
        console.log("Register successful:", data);
        window.location.assign("../../shared/home/index.html");
      } else {
        console.log("Register failed");
      }

    });
});

document.addEventListener("DOMContentLoaded", setMaxDate);
document.addEventListener("DOMContentLoaded", passwordValidation);
