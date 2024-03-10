const login = document.getElementById("login");
login.addEventListener("submit", (e) => {
  e.preventDefault();

  const password = document.getElementById("password").value;
  const email = document.getElementById("email").value;

  if (!password || !email) {
    return;
  }

  let detail = {
    email: email,
    password: password,
  };

  axios
    .post("/checklogin", detail)
    .then((response) => {
      document.getElementById("login").reset();
      if (response.status === 200) {
        alert("login successful");
        localStorage.setItem("token", response.data.token);
        axios
          .get("/expense")
          .then((res) => {
            document.open();
            document.write(res.data);
            document.close();

            window.history.pushState({}, "", "/expense");
          })
          .catch((err) => {
            console.log(err);
          });
      }
      console.log(response);
    })
    .catch((err) => {
      document.getElementById("error").innerHTML = err;
      console.log(err);
    });
});

function forgotpassword() {
  document.getElementById("forgotpass").onclick = (e) => {
    e.preventDefault();
    console.log("hello");
    document.getElementById("forgopass").style.display = "block";
  };

  document.getElementById("forgopass").addEventListener("submit", async (e) => {
    e.preventDefault();
    try {
      let obj = {
        email: document.getElementById("inpumail").value,
      };

      await axios.post("/password/forgotpassword", obj);
    } catch (err) {
      console.log(err);
    }
  });
}
forgotpassword();
