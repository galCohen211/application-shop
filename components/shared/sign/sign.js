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
  var msg = document.getElementById("password-hint-message");
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

function validateEmail(email) {
  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailPattern.test(email);
}

function showValidationMessage({
  firstName,
  lastName,
  email,
  password,
  city,
  street,
  gender,
  birthDate,
}) {
  let isValid = true;

  const firstNameMessage = document.getElementById("firstname-error-message");
  if (!firstName) {
    firstNameMessage.style.display = "block";
    isValid = false;
  } else {
    firstNameMessage.style.display = "none";
  }

  const lastNameMessage = document.getElementById("lastname-error-message");
  if (!lastName) {
    lastNameMessage.style.display = "block";
    isValid = false;
  } else {
    lastNameMessage.style.display = "none";
  }

  const emailErrorMessage = document.getElementById("email-error-message");
  if (!validateEmail(email)) {
    emailErrorMessage.style.display = "block";
    isValid = false;
  } else {
    emailErrorMessage.style.display = "none";
  }

  const passwordErrorMessage = document.getElementById("password-hint-message");
  const passwordErrorMessageStrenght = document.getElementById("strenght");
  if (!password) {
    passwordErrorMessage.style.display = "block";
    passwordErrorMessageStrenght.innerHTML = "required";
    isValid = false;
  } else {
    passwordErrorMessage.style.display = "none";
  }

  const cityErrorMessage = document.getElementById("city-error-message");
  if (!city) {
    cityErrorMessage.style.display = "block";
    isValid = false;
  } else {
    cityErrorMessage.style.display = "none";
  }

  const streetErrorMessage = document.getElementById("street-error-message");
  if (!street) {
    streetErrorMessage.style.display = "block";
    isValid = false;
  } else {
    streetErrorMessage.style.display = "none";
  }

  const genderErrorMessage = document.getElementById("gender-error-message");
  if (!gender) {
    genderErrorMessage.style.display = "block";
    isValid = false;
  } else {
    genderErrorMessage.style.display = "none";
  }

  const birthDateErrorMessage = document.getElementById(
    "birthdate-error-message"
  );
  if (!birthDate) {
    birthDateErrorMessage.style.display = "block";
    isValid = false;
  } else {
    birthDateErrorMessage.style.display = "none";
  }

  return isValid;
}

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
      )?.value;
      const birthDate = document.getElementById("birthdate").value;

      const isFormValid = showValidationMessage({
        firstName,
        lastName,
        email,
        password,
        city,
        street,
        gender,
        birthDate,
      });

      if (!isFormValid) {
        return;
      }

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

      console.log(response);
      console.log(responseText);

      if (response.ok) {
        window.location.assign("../../shared/home/index.html");
      } else {
        try {
          const errorMsg = JSON.parse(responseText)[0];
          if (errorMsg.email === "unavailable") {
            document.getElementById("form-submit-error-message").innerText =
              "User already exists";
          }
        } catch (error) {
          document.getElementById("form-submit-error-message").innerText =
            "An error occurred. Please try again.";
        } finally {
          document.getElementById(
            "form-submit-error-message-container"
          ).style.display = "block";
        }
        console.log("Register failed");
        console.error(error);
      }
    });
});

  // Toggle the eye icon
  document.addEventListener("DOMContentLoaded", function () {
  const eye = document.getElementById('toggle-password');
  const passwordField = document.getElementById('password-sign-in');
  
  eye.addEventListener('click', function () {
    let type;
    if (passwordField.type === 'password') {
        type = 'text';
    } else {
        type = 'password';
    }
    passwordField.type = type;
    
    eye.classList.toggle('fa-eye');
    eye.classList.toggle('fa-eye-slash');
  });
});


document.addEventListener("DOMContentLoaded", setMaxDate);
document.addEventListener("DOMContentLoaded", passwordValidation);
