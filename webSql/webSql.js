$( document ).ready(function() {
    readDataAll();
});
   

var itemNo;       // for display item on input
    userList = [1];

    fName = $("#first-name");
    lName = $("#last-name");
    mail = $("#email");
    mo= $("#mobile");
    dob = $("#dateOfBirth");
    gen = $(".gender");
    reli = $("#religion");
    pass = $("#password");
    img = $("#profilePic");
    
    // function makeCounter() {
    //     var count = 0;
    //     return function() {
    //         count++;
    //         return count;
    //     };
    // };

    // This variable contains a counter instance
    // The counter is shared among all calls regardless of the caller
    //  counter = makeCounter();

    // Submit Data to webSql
submit = (e) => {

    userId = userList.slice(-1)[0];
    firstName = fName.val(),
    lastName = lName.val(),
    email = mail.val(),
    mobile = mo.val(),
    dateOfBirth = dob.val(),
    gender = $("input:radio:checked").val(),
    religion = reli.val(),
    password = pass.val();
   var image = img64;
    submitting(userId, firstName, lastName, email, mobile, dateOfBirth, gender, religion, password, image);
    alert("ID : " + userId + " inserted");

}

// Image processing for 64base
    var img64;
    document.querySelector('#profilePic').addEventListener('change', function () {

        const reader = new FileReader();
        reader.addEventListener("load", function ()  {
        img64 = reader.result;
    });
    reader.readAsDataURL(this.files[0]);

    });

    //////////////////////////////////////////////
    var db = openDatabase('userDB', "1.0", "userInformation", 20 * 1024 * 1024);
    db.transaction((tx) => {
        tx.executeSql("SELECT * FROM user", [], (transaction, results) => {
            lastNo = results.rows.length;
            userList.push(lastNo + 1);
        });
    });


submitting = (userId, firstName, lastName, email, mobile, dateOfBirth, gender, religion, password, image) => {
    var db = openDatabase('userDB', "1.0", "userInformation", 20 * 1024 * 1024);

    db.transaction((tx) => {
        tx.executeSql('CREATE TABLE IF NOT EXISTS user(Id unique, FirstName, LastName, Email, Mobile, DateOfBirth, Gender, Religion, Password, Image)');
        tx.executeSql('INSERT INTO user (Id, FirstName, LastName, Email, Mobile, DateOfBirth, Gender, Religion, Password, Image) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [userId, firstName, lastName, email, mobile, dateOfBirth, gender, religion, password, image]);
        tx.executeSql("SELECT * FROM user", [], (transaction, results) => {
            lastNo = results.rows.length;
            readData();
            clearAllForm();
        });
    });
};

// Read Data from webSql
readData = () => {

    function displayResults(transaction, results) {
        $("#contactList").empty();
        for (var i = 0; i < results.rows.length; i++) {
            var item = results.rows.item(i);
            
                $('#contactList').append(`<tr>
                <td>${item.Id}</td>  
                <td>${item.FirstName}</td>  
                <td>${item.LastName}</td>  
                <td>${item.Email}</td>  
                <td>${item.Mobile}</td>  
                <td>${item.DateOfBirth}</td>  
                <td>${item.Gender}</td>  
                <td>${item.Religion}</td>  
                <td><img src="${item.Image}" id="profilePic" /></td>  
                </tr>`);
        }
    }
    var db = openDatabase('userDB', "1.0", "userInformation", 20 * 1024 * 1024);
    db.transaction(function (t) {
        t.executeSql("SELECT * FROM user", [], displayResults);
    });
};

// Update Data user info
updateItem = () => {
console.log("Hello");
    firstName = fName.val(),
    lastName = lName.val(),
    email = mail.val(),
    mobile = mo.val(),
    dateOfBirth = dob.val(),
    gender = $("input:radio:checked").val(),
    religion = reli.val(),
    password = pass.val();
   var image = img64;
    var db = openDatabase('userDB', "1.0", "userInformation", 20 * 1024 * 1024);
    db.transaction(function (tx) {
        tx.executeSql("UPDATE user SET (FirstName, LastName, Email, Mobile, DateOfBirth, Gender, Religion, Password, Image) = (?, ?, ?, ?, ?, ?, ?, ?, ?) WHERE id = ?", [firstName, lastName, email, mobile, dateOfBirth, gender, religion, password, image, itemNo]);
        readDataAll();
        clearAllForm();
    });
}

// Delete Data
deleteItem = () => {
    var db = openDatabase('userDB', "1.0", "userInformation", 20 * 1024 * 1024);
    db.transaction(function (t) {
        t.executeSql("DELETE FROM user WHERE Id = ?", [itemNo]);
        alert(itemNo + ' no item deleted');
        readDataAll();
    });
}

// Delete All Data of table
deleteAll = () => {
    var db = openDatabase('userDB', "1.0", "userInformation", 20 * 1024 * 1024);
    db.transaction(function (t) {
        t.executeSql("DELETE FROM user");
    });
}

// Show data for Updating
showId = () => {
    itemNo = Number.parseInt($("#showId").val());

    function displayResults(transaction, results) {
        var item = results.rows.item(itemNo - 1);
        fName.val(item.FirstName); 
        lName.val(item.LastName);
        mail.val(item.Email) ;
        mo.val(item.Mobile);
        dob.val(item.DateOfBirth);
        gen.val(item.Gender) ;
        reli.val(item.Religion); 
        pass.val(item.Password);
    }
    var db = openDatabase('userDB', "1.0", "userInformation", 20 * 1024 * 1024);
    db.transaction(function (tx) {
        tx.executeSql("SELECT * FROM user", [], displayResults);
    });
}

// Read All Data from webSql
readDataAll = () => {

    function displayResults(transaction, results) {
        $("#contactList").empty();
        for (var i = 0; i < results.rows.length; i++) {
            var item = results.rows.item(i);
            
                $('#contactList').append(`<tr>
                <td>${item.Id}</td>  
                <td>${item.FirstName}</td>  
                <td>${item.LastName}</td>  
                <td>${item.Email}</td>  
                <td>${item.Mobile}</td>  
                <td>${item.DateOfBirth}</td>  
                <td>${item.Gender}</td>  
                <td>${item.Religion}</td>  
                <td><img src="${item.Image}" id="profilePic" /></td>  
                </tr>`);
        }
    }
    var db = openDatabase('userDB', "1.0", "userInformation", 20 * 1024 * 1024);
    db.transaction(function (t) {
        t.executeSql("SELECT * FROM user", [], displayResults);
    });
};


function clearAllForm() {
    fName.val(""); 
    lName.val("");
    mail.val("") ;
    mo.val("");
    dob.val("");
    gen.val("") ;
    reli.val(""); 
    pass.val("");
}

