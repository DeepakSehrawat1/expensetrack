var form = document.getElementById("form_group");

form.addEventListener("submit", addelement);

function showele(obj) {
  var items = document.getElementById("items");

  //creating li
  var newitem = document.createElement("li");

  //attaching to li
  newitem.appendChild(document.createTextNode(`${obj.amount}`));
  newitem.appendChild(document.createTextNode(`${obj.job}`));
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
    axios
      .delete(`/delet-element/${obj.id}`)
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
  let id = Math.random();
  let myobj = {
    id: id,
    expense: item1,
    type: item2,
    category: item3,
  };

  axios
    .post("/add-element", myobj)
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
  axios
    .get("/get-element")
    .then((res) => {
      console.log(res.data);
      for (var i = 0; i < res.data.length; i++) {
        console.log(typeof res.data[i]);
        showele(res.data[i]);
      }
    })
    .catch((ele) => console.log("error"));
});
