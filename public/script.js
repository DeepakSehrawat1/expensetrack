const signup = document.getElementById("signup");
signup.addEventListener("submit", (e) => {
  e.preventDefault();
  const username = document.getElementById("name").value;
  const password = document.getElementById("password").value;
  const email = document.getElementById("email").value;

  const usernameWarning = document.getElementById("usernameWarning");
  if (!username) {
    usernameWarning.textContent = "Please enter your username";
  } else {
    usernameWarning.textContent = "";
  }

  const emailWarning = document.getElementById("emailWarning");
  if (!email) {
    emailWarning.textContent = "Please enter your email";
  } else {
    emailWarning.textContent = "";
  }

  // Validate password field
  const passwordWarning = document.getElementById("passwordWarning");
  if (!password) {
    passwordWarning.textContent = "Please enter your password";
  } else {
    passwordWarning.textContent = "";
  }

  if (!username || !password || !email) {
    return;
  }

  let user = {
    username: username,
    email: email,
    password: password,
  };

  axios
    .post("/user", user)
    .then((response) => {
      document.getElementById("signup").reset();
      document.getElementById("error").innerHTML = "";
      console.log(response);
    })
    .catch((err) => {
      document.getElementById("error").innerHTML = err;
    });
});
