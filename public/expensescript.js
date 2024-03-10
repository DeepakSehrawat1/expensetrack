var form = document.getElementById("form_group");
const pagination = document.getElementById("pagination");

form.addEventListener("submit", addelement);

function showele(obj) {
  var items = document.getElementById("items");

  //creating li
  var newitem = document.createElement("li");

  //attaching to li
  newitem.appendChild(document.createTextNode(`${obj.amount}`));
  newitem.appendChild(document.createTextNode(`${obj.type}`));
  newitem.appendChild(document.createTextNode(`${obj.category}`));

  //creating del btn
  var delbtn = document.createElement("button");
  delbtn.id = "delete";
  delbtn.appendChild(document.createTextNode("delete"));
  newitem.appendChild(delbtn);

  items.appendChild(newitem);

  delbtn.addEventListener("click", function (e) {
    e.preventDefault();
    const token = localStorage.getItem("token");
    axios
      .delete(`/delet-element/${obj.id}`, { headers: { Authorization: token } })
      .then((res) => {
        var li = e.target.parentElement;
        items.removeChild(li);
      })
      .catch((err) => console.log(err));
  });
}

function addelement(e) {
  e.preventDefault();
  var item1 = document.getElementById("amount").value;
  var item2 = document.getElementById("job").value;
  var item3 = document.getElementById("category").value;
  let id = Math.floor(Math.random() * 1000);
  let itemN = parseInt(item1);
  let myobj = {
    id: id,
    amount: itemN,
    type: item2,
    category: item3,
  };
  const token = localStorage.getItem("token");
  axios
    .post("/add-element", myobj, { headers: { Authorization: token } })
    .then((res) => showele(myobj))
    .catch((err) => console.log(err));

  document.getElementById("form_group").reset();
}

window.addEventListener("DOMContentLoaded", function () {
  getElement(1);
});

document.getElementById("premium").onclick = async function (e) {
  const token = localStorage.getItem("token");
  const response = await axios.get("/premiumes", {
    headers: { Authorization: token },
  });
  console.log(response.data);

  var options = {
    key: response.data.key_id,
    order_id: response.data.order.id,
    handler: async function (response) {
      await axios.post(
        "/updatetranscationstatus",
        {
          order_id: options.order_id,
          payment_id: response.razorpay_payment_id,
        },
        { headers: { Authorization: token } }
      );
      document.getElementById("premium").style.visibility = "hidden";
      document.getElementById("showpremiumity").style.display = "block";
      document.getElementById("savexpense").style.display = "block";
      showleaderboard();
      alert("you are premium user now");
    },
  };

  const rzp1 = new Razorpay(options);
  rzp1.open();
  e.preventDefault();

  rzp1.on("payment.failed", function (response) {
    console.log(response);
    alert("something went wrong");
  });
};
function buypremiumvisible() {
  const token = localStorage.getItem("token");
  axios
    .get("/check_boolean", { headers: { Authorization: token } })
    .then((response) => {
      // Check the boolean value retrieved from the server
      const data = response.data;
      if (data.message == "true") {
        document.getElementById("premium").style.visibility = "hidden";
        document.getElementById("showpremiumity").style.display = "block";
        document.getElementById("savexpense").style.display = "block";
        showleaderboard();
      } else {
        document.getElementById("premium").style.display = "block";
      }
    })
    .catch((error) => {
      console.error("There was a problem with the Axios request:", error);
    });
}

buypremiumvisible();

function showleaderboard() {
  const inputElement = document.createElement("input");
  inputElement.type = "button";
  inputElement.value = "show leaderboard";
  console.log("ooo");

  inputElement.onclick = async function (e) {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const userboardleader = await axios.get("/premium/leaderboard", {
        headers: { Authorization: token },
      });

      console.log(userboardleader);

      var leaderboardEle = document.getElementById("leaderboard");
      leaderboardEle.innerHTML = `<h1> Leader Board </h1>`;

      userboardleader.data.forEach((userDetail) => {
        leaderboardEle.innerHTML += `<li>   ${userDetail.Name}  total expense ${
          userDetail.TotalExpense || 0
        }`;
      });
    } catch (err) {
      console.log(err);
    }
  };

  document.getElementById("message").appendChild(inputElement);
}
function download() {
  document.getElementById("savexpense").onclick = async function (e) {
    e.preventDefault();
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get("expense/download", {
        headers: { Authorization: token },
      });

      if (response.status === 200) {
        // The backend is essentially sending a download link
        // which, if we open in the browser, the file would download
        const a = document.createElement("a");
        a.href = response.data.fileURL;
        a.download = "myexpense.csv";
        a.click();
      } else {
        throw new Error(response.data.message);
      }
    } catch (err) {
      console.log(err);
    }
  };
}

function showPages({
  currentPage,
  hasNext,
  nextPge,
  hasPrev,
  previousPage,
  lastPage,
}) {
  pagination.innerHTML = "";
  if (hasPrev) {
    const btnp = document.createElement("button");
    btnp.innerHTML = previousPage;
    btnp.addEventListener("click", () => getElement(previousPage));
    pagination.appendChild(btnp);
  }

  const btnc = document.createElement("button");
  btnc.innerHTML = `<h3>${currentPage}</h3>`;
  btnc.addEventListener("click", () => getElement(currentPage));
  pagination.appendChild(btnc);

  if (hasNext) {
    const btnn = document.createElement("button");
    btnn.innerHTML = `<h3>${nextPge}</h3>`;
    btnn.addEventListener("click", () => getElement(nextPge));
    pagination.appendChild(btnn);
  }
}

function getElement(page) {
  document.getElementById("items").innerHTML = "";
  const token = this.localStorage.getItem("token");
  axios
    .get(`/get-element/?page=${page}`, { headers: { Authorization: token } })
    .then((res) => {
      console.log(res.data);
      for (var i = 0; i < res.data.results.length; i++) {
        console.log(typeof res.data.results[i]);
        showele(res.data.results[i]);
      }
      showPages(res.data);
    })
    .catch((ele) => console.log("error"));
}
