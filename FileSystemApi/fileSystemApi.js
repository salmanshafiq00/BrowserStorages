var myObject, objString;
window.requestFileSystem = window.requestFileSystem ||
    window.webkitRequestFileSystem;

var img64;
document.querySelector('#profilePic').addEventListener('change', function () {

    const reader = new FileReader();
    reader.addEventListener("load", function ()  {
    img64 = reader.result;
});
reader.readAsDataURL(this.files[0]);

});
// Submit to fileSystem Api........................................................
$("#btnSubmit").on('click', () => {
    var id = $("#id").val();
    var userName = $("#userName").val();
    var dob = $("#dob").val();
    var gender = $("input:radio:checked").val();

    var myObject = {
        ID: id,
        UserName: userName,
        DateOfBirth: dob,
        Gender: gender,
        Image: img64
    }
    var objString = JSON.stringify(myObject);


    window.requestFileSystem(TEMPORARY, 5 * 1024 * 1024, getFile, handleError);

    function getFile(fileSystem) {
        fileSystem.root.getFile("user.txt", {
            create: true
        }, fileOpened, handleError);
    }

    function fileOpened(fileEntry) {
        fileEntry.createWriter(writeToFile, handleError);
    }

    function writeToFile(fileWriter) {
        fileWriter.onwriteend = function () {
            alert('Success');
        };
        fileWriter.onerror = function () {
            alert('Failed');
        };
        fileWriter.seek(fileWriter.length);
        fileWriter.write(new Blob([`${objString}`], {
            type: 'text/plain'
        }));
    }

    function handleError(error) {
        alert(error.code);
    }
});

// function for read file from fileSystem api.....................................
$("#btnRead").on('click', () => {
    window.requestFileSystem(TEMPORARY, 5 * 1024 * 1024, getFile, handleError);

    function getFile(fileSystem) {
        fileSystem.root.getFile("user.txt", {
            create: true
        }, fileOpened, handleError);
    }

    function fileOpened(fileEntry) {
        fileEntry.file(readFile, handleError);
    }
    var txtFile;
    var objArray = [];
    function readFile(file) {
        var fileReader = new FileReader();
        fileReader.onloadend = function () {
            txtFile = this.result;
            // var objArray = [];
            objArray = txtFile.split(/(?<=\})/);
            $("#resultTable").empty();
            for (let i = 0; i < objArray.length; i++) {
                var objs = JSON.parse(objArray[i]);
                var markUp = $(`<tr>
                <td>${objs.ID}</td>
                <td>${objs.UserName}</td>
                <td>${objs.DateOfBirth}</td>
                <td>${objs.Gender}</td>
                <td><img src="${objs.Image}" width="50px" height="50px"/></td>
                <td><a class="dlt" href="javascript:void(0)" data-key="${i}"/>Delete</td>
                <td><a class="edit" href="javascript:void(0)" data-key="${i}"/>Edit</td>
            </tr>`).appendTo($("#resultTable"));
            }
            $("#resultTable a.dlt").on("click", dltFunc);
            $("#resultTable a.edit").on("click", btnEdit);
        };
        fileReader.onerror = function () {
            alert('Failed');
        };
        fileReader.readAsText(file);
    }

    function handleError(error) {
        alert(error.code);
    }

});

// Delete
$("#btnDelte").on('click', () => {
    window.requestFileSystem(TEMPORARY, 5 * 1024 * 1024, getFile, handleError);

    function getFile(fileSystem) {
        fileSystem.root.getFile("user.txt", {
            create: true
        }, fileOpened, handleError);
    }

    function fileOpened(fileEntry) {
        fileEntry.remove(fileRemoved, handleError);
    }

    function fileRemoved() {
        alert('Success');
    }

    function handleError(error) {
        alert(error.code);
    }
});
//********************************************************* */
var dltFunc = (e) => {
    console.log("Hello");
    console.log(e.target.attributes[2].nodeValue);
    var dltKey = e.target.attributes[2].nodeValue;
    window.requestFileSystem(TEMPORARY, 5 * 1024 * 1024, getFile, handleError);

    function getFile(fileSystem) {
        fileSystem.root.getFile("user.txt", {
            create: true
        }, fileOpened, handleError);
    }

    function fileOpened(fileEntry) {
        // fileEntry.remove(fileRemoved, handleError);
    }

    function fileRemoved() {
        alert('Success');
    }

    function handleError(error) {
        alert(error.code);
    }
}
// A function for edit..............................................................
var btnEdit = (e) => {
    var editKey = e.target.attributes[2].nodeValue;
        window.requestFileSystem(TEMPORARY, 5 * 1024 * 1024, getFile, handleError);
    
        function getFile(fileSystem) {
            fileSystem.root.getFile("user.txt", {
                create: true
            }, fileOpened, handleError);
        }
    
        function fileOpened(fileEntry) {
            fileEntry.file(readFile, handleError);
        }
        var txtFile;
        var objArray = [];
        function readFile(file) {
            var fileReader = new FileReader();
            fileReader.onloadend = function () {
                txtFile = this.result;
                objArray = txtFile.split(/(?<=\})/);
                for (let i = 0; i < objArray.length; i++) {
                    if (editKey == i) {
                        console.log(i);
                        var objs = JSON.parse(objArray[i]);
                        console.log(objs);
                        $("#id").val(`${objs.ID}`);
                        $("#userName").val(`${objs.UserName}`);
                        $("#dob").val(`${objs.DateOfBirth}`);
                        $("input:radio:checked").val();
                    }
                }
            };
            fileReader.onerror = function () {
                alert('Failed');
            };
            fileReader.readAsText(file);
        }
    
        function handleError(error) {
            alert(error.code);
        }
}