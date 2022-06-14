$(document).ready(function () {
  readData();
});
fName = $("#first-name");
lName = $("#last-name");
mail = $("#email");
mo = $("#mobile");
dob = $("#dateOfBirth");
gen = $(".gender");
reli = $("#religion");
pass = $("#password");
img = $("#profilePic");

userList = [1];
idNum = $("#showId");
var nameValue, emailValue, passwordValue, trans, user;

// Making cross Browser friendly
window.indexedDB =
  window.indexedDB ||
  window.mozIndexedDB ||
  window.webkitIndexedDB ||
  window.msIndexedDB;
window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction;
window.IDBCursor = window.IDBCursor || window.webkitIDBCursor;
window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange;

var indexedDB = window.indexedDB; // here indexedDB IDBFactory object
var openRequest = indexedDB.open("UserDB", 1); // here openRequest is IDBRequest object and async call

var db;

openRequest.onsuccess = (response) => {
  db = openRequest.result; // if connection open successfully then the database hold in var db
};

openRequest.onerror = (response) => {
  alert(`Error code:  &nbsp ${response.target.errorCode}`);
};

openRequest.onupgradeneeded = (response) => {
  response.currentTarget.result.createObjectStore("user", {
    keypath: "ID",
    autoIncrement: true,
  });
};
var TransUser = () => {
  trans = db.transaction("user", "readwrite");
  user = trans.objectStore("user");
  return trans, user;
};
//Clear data from input
var ClearInputData = () => {
  fName.val("");
  lName.val("");
  mail.val("");
  mo.val("");
  dob.val("");
  gen.val("");
  reli.val("");
  pass.val("");
};

// when submit............................................
submit = () => {
  // userId = userList.slice(-1)[0];
  (firstName = fName.val()),
    (lastName = lName.val()),
    (email = mail.val()),
    (mobile = mo.val()),
    (dateOfBirth = dob.val()),
    (gender = $("input:radio:checked").val()),
    (religion = reli.val()),
    (password = pass.val());
  var image = img64;
  currentUser = {
    FirstName: firstName,
    LastName: lastName,
    Email: email,
    Mobile: mobile,
    DateOfBirth: dateOfBirth,
    Gender: gender,
    Religion: religion,
    Password: password,
    Image: image,
  };

  var trans = db.transaction("user", "readwrite");
  var user = trans.objectStore("user");
  var request = user.add(currentUser);
  request.onsuccess = (response) => {
    console.log(request.result);
  };
  request.onerror = (response) => {
    console.log(request.errorCode);
  };
  alert("Data Submitted");
  readData();
  ClearInputData();
};
var img64;
document.querySelector("#profilePic").addEventListener("change", function () {
  const reader = new FileReader();
  reader.addEventListener("load", function () {
    img64 = reader.result;
  });
  reader.readAsDataURL(this.files[0]);
});
// object Store Length.......................................................
var objectStoreLength = () => {
  var storeLength, a;
  TransUser();
  var countRequest = user.count();

  countRequest.onsuccess = () => {
    storeLength = countRequest.result;
    console.log(storeLength);
    return storeLength;
  };
  console.log(storeLength);
  return Number.parseInt(storeLength);
};
showId = () => {
  var id = Number.parseInt(idNum.val());
  console.log(id);
  TransUser();

  var request = user.get(id);
  request.onsuccess = (response) => {
    var currentUser = response.target.result;

    fName.val(currentUser.FirstName);
    lName.val(currentUser.LastName);
    mail.val(currentUser.Email);
    mo.val(currentUser.Mobile);
    dob.val(currentUser.DateOfBirth);
    gen.val(currentUser.Gender);
    reli.val(currentUser.Religion);
    pass.val(currentUser.Password);
  };
  request.onerror = (response) => {
    console.log(request.errorCode);
  };
};

// delete single record data................................................................
deleteItem = () => {
  var i = Number.parseInt($("#showId").val());
  TransUser();
  var request = user.delete(i);

  request.onsuccess = () => console.log(i + " no record deleted");
  request.onerror = () => console.log(request.errorCode);
  ClearInputData();
  readData();
};

// Delete all data.............................................................................
deleteAll = () => {
  TransUser();
  user.clear();
};

// Update single record........................................................................
updateItem = () => {
  (firstName = fName.val()),
    (lastName = lName.val()),
    (email = mail.val()),
    (mobile = mo.val()),
    (dateOfBirth = dob.val()),
    (gender = $("input:radio:checked").val()),
    (religion = reli.val()),
    (password = pass.val());
    var image = img64;
  
  currentUser = {
    FirstName: firstName,
    LastName: lastName,
    Email: email,
    Mobile: mobile,
    DateOfBirth: dateOfBirth,
    Gender: gender,
    Religion: religion,
    Password: password,
    Image: image,
  };

  var i = Number.parseInt($("#showId").val());
  var trans = db.transaction("user", "readwrite");
  var user = trans.objectStore("user");
  var request = user.put(currentUser);
  request.onsuccess = () => console.log(i + " no record updated");
  request.onerror = () => console.log(request.errorCode);
  ClearInputData();
  readData();
};

// Show All Record to DOM
readData = () => {
  $("tbody").empty();
  TransUser();
  var request = user.openCursor();

  request.onsuccess = (response) => {
    var cursor = response.target.result;
    if (!cursor) {
      console.log("No record found");
      return;
    }
    cuID = cursor.key;
    cuFName = cursor.value.FirstName;
    cuLName = cursor.value.LastName;
    cuEmail = cursor.value.Email;
    cuMobile = cursor.value.Mobile;
    cuDateOfBirth = cursor.value.DateOfBirth;
    cuGender = cursor.value.Gender;
    cuReligion = cursor.value.Religion;
    cuPass = cursor.value.Password;
    cuImage = cursor.value.Image;
    var tbody = $(`<tr>
            <td>${cuID}</td>
            <td> ${cuFName}</td>
            <td> ${cuLName}</td>
            <td>${cuEmail}</td>
            <td>${cuMobile}</td>
            <td>${cuDateOfBirth}</td>
            <td>${cuGender}</td>
            <td>${cuReligion}</td>
            <td>${cuPass}</td>
            <td><img src="${cuImage}" width="50" height="50" /></td>
        </tr>`).appendTo($("#contactList"));
    cursor.continue();
    $("#result").css("visibility", "visible");
  };
};

(firstName = fName.val()),
  (lastName = lName.val()),
  (email = mail.val()),
  (mobile = mo.val()),
  (dateOfBirth = dob.val()),
  (gender = $("input:radio:checked").val()),
  (religion = reli.val()),
  (password = pass.val());
var image = img64;
currentUser = {
  FirstName: firstName,
  LastName: lastName,
  Email: email,
  Mobile: mobile,
  DateOfBirth: dateOfBirth,
  Gender: gender,
  Religion: religion,
  Password: password,
  Image: image,
};

var trans = db.transaction("user", "readwrite");
var user = trans.objectStore("user");
var request = user.add(currentUser);
request.onsuccess = (response) => {
  console.log(request.result);
};
request.onerror = (response) => {
  console.log(request.errorCode);
};
alert("Data Submitted");
ClearInputData();
