var form = document.getElementById("form_group");

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

  //creating edit btn
  /* var editbtn = document.createElement("button");
  editbtn.id = "edit";
  editbtn.appendChild(document.createTextNode("edit"));
  newitem.appendChild(editbtn);*/

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

  /*editbtn.addEventListener("click", function (e) {
    e.preventDefault();
    axios
      .delete(
        "https://crudcrud.com/api/59675cf01959452299e9ef3b0620e3ee/appointment/" +
          obj._id
      )
      .then((res) => {
        var li = e.target.parentElement.childNodes;
        console.log(li[0].data);

        document.getElementById("amount").value = li[0].data;
        document.getElementById("job").value = li[1].data;
        document.getElementById("category").value = li[2].data;

        var le = e.target.parentElement;
        items.removeChild(le);
      })
      .catch((err) => console.log(err));
  });*/
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

/*function removebtn(e) {
  e.preventDefault();
  if (e.target.id === "delete") {
    var li = e.target.parentElement;

    console.log(li._id);
    /* axios
      .delete(
        "https://crudcrud.com/api/e5344f4ad3f2408abcb0532b71d233a9/appointment" +
          li
      )
      .then((res) => console.log(res))
      .catch((err) => console.log(err));
  } else if (e.target.id === "edit") {
    var li = e.target.parentElement.childNodes;
    console.log(li[0].data);

    document.getElementById("amount").value = li[0].data;
    document.getElementById("job").value = li[1].data;
    document.getElementById("category").value = li[2].data;

    var le = e.target.parentElement;
    itemlist.removeChild(le);
  }
}*/

window.addEventListener("DOMContentLoaded", function () {
  const token = this.localStorage.getItem("token");
  axios
    .get("/get-element", { headers: { Authorization: token } })
    .then((res) => {
      console.log(res.data);
      for (var i = 0; i < res.data.length; i++) {
        console.log(typeof res.data[i]);
        showele(res.data[i]);
      }
    })
    .catch((ele) => console.log("error"));
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
