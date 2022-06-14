fName = $("#first-name");
lName = $("#last-name");
mail = $("#email");
mo= $("#mobile");
dob = $("#dateOfBirth");
gen = $(".gender");
reli = $("#religion");
pass = $("#password");
img = $("#profilePic");
$(document).ready( () => {
    display();
})

var currentRecord;
function retrieveFromStorage() {
    var contactsJSON = localStorage.getItem('contacts');
    return contactsJSON ? JSON.parse(contactsJSON) : [];
}

display = function () {

    currentRecord = {
        key: null,
        contact: {}
    };
    displayCurrentRecord();
    var results = retrieveFromStorage();
    setToTable(results);
};


 setToTable = (results) =>{
    var html = '';
    for (var i = 0; i < results.length; i++) {
        var contact = results[i];
        html += (`<tr><td>${contact.FirstName} ${contact.LastName}</td>
                      <td> ${contact.Email}</td>
                      <td><img src=${contact.Image} id="profilePic" /></td>
                      <td><a class="details" href="javascript:void(0)" data-key="${i}">Details</a></td>
                      <td><a class="edit" href="javascript:void(0)" data-key="${i}">Edit</a></td>
                      <td><a class="delete" href="javascript:void(0)" data-key="${i}">Delete</a></td>
                 </tr>`);

    }

    $('#contacts tbody').html(html);
    $('.details').on('click', showDetails);
    $('.edit').on('click', readData);
    $('#contacts a.delete').on('click', deleteDate);
}

showDetails = (e) => {
    $("#detailsTable").empty();
    var key = e.target.attributes[2].nodeValue;
    var results = retrieveFromStorage();

    currentRecord = {
        key : key,
        contact: results[key]
    }
    var contact = currentRecord.contact;
    var markUp = $(`<tr>
        <th>Name</th>
        <td>${contact.FirstName} ${contact.LastName}</td>
    </tr>
    <tr>
        <th>Email</th>
        <td>${contact.Email}</td>
    </tr>
    <tr>
        <th>Mobile</th>
        <td>${contact.Mobile}</td>
    </tr>
    <tr>
        <th>Date of Birth</th>
        <td>${contact.DateOfBirth}</td>
    </tr>
    <tr>
        <th>Gender</th>
        <td>${contact.Gender}</td>
    </tr>
    <tr>
        <th>Religion</th>
        <td>${contact.Religion}</td>
    </tr>
    <tr>
        <th>Password</th>
        <td>${contact.Password}</td>
    </tr>
    <tr>
        <th>Image</th>
        <td><img src="${contact.Image}" width="80" height="80" id="detailsImage" /></td>
    </tr>`).appendTo($("#detailsTable"));
};


readData = (e) => {
    var key = e.target.attributes[2].nodeValue;
    var results = retrieveFromStorage();

    currentRecord = {
        key : key,
        contact: results[key]
    }
    displayCurrentRecord();
}

deleteDate = (e) => {
    var key = e.target.attributes[2].nodeValue;
    var results = retrieveFromStorage();

    if (key) {
        results.splice(key, 1);
    }
    localStorage.setItem('contacts', JSON.stringify(results));
    window.location.reload();
}


displayCurrentRecord = () => {
    var contact = currentRecord.contact;
    fName.val(contact.FirstName); 
    lName.val(contact.LastName);
    mail.val(contact.Email) ;
    mo.val(contact.Mobile);
    dob.val(contact.DateOfBirth);
    gen.val(contact.Gender) ;
    reli.val(contact.Religion); 
    pass.val(contact.Password); 
}

submit = () => {
    
    var contact = currentRecord.contact;
    contact.FirstName = fName.val().toUpperCase(),
    contact.LastName = lName.val().toUpperCase(),
    contact.Email = mail.val(),
    contact.Mobile = mo.val(),
    contact.DateOfBirth = dob.val(),
    contact.Gender = $("input:radio:checked").val(),
    contact.Religion = reli.val(),
    contact.Password = pass.val();
    contact.Image = img64;

    var results = retrieveFromStorage();

    if (currentRecord.key != null) {
        results[currentRecord.key] = contact;
    }
    else {
        results.push(contact);
    }

    localStorage.setItem('contacts', JSON.stringify(results));
    display();
    
};

var img64;
document.querySelector('#profilePic').addEventListener('change', function () {

    const reader = new FileReader();
    reader.addEventListener("load", function ()  {
    img64 = reader.result;
});
reader.readAsDataURL(this.files[0]);

});

// $document.querySelector("#dropZone").addEventListener('dragover', (e) => {
//     console.log(e);
//     e.preventDefault();
//     e.dataTransfer.dropEffect = "copy";
//     console.log("Hello");
// });
// $document.querySelector("#dropZone").addEventListener('drop', (e) => {
//     e.preventDefault();
//     fileList = e.dataTransfer.files;
//     document.querySelector("#fileName").textContent = fileList[0];
// })