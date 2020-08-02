$('#navbar').load('navbar.html');
$('#footer').load("footer.html");

 
const devices = JSON.parse(localStorage.getItem('devices')) || [];
const users = JSON.parse(localStorage.getItem('users')) || [];

/* 2.2 
const API_URL = 'http://localhost:5000/api';
*/

//use this for 1.4 then delete//


/*  2.1 onwards// 
const response = $.get(`${API_URL}/devices`);
console.log(response);




/* 2.1 onwards//
 $.get(`${API_URL}/devices`)
    .then(response => {
        response.forEach(device => {
            $('#devices tbody').append(`
 <tr>
 <td>${device.user}</td>
 <td>${device.name}</td>
 </tr>`
            );
        });
    })
    .catch(error => {
        console.error(`Error: ${error}`);
    });
    


  2.1 onwards//
 $('#add-device').on('click', () => {
    const name = $('#name').val();
    const user = $('#user').val();
    const sensorData = [];
    const body = {
        name,
        user,
        sensorData
    };
    $.post(`${API_URL}/devices`, body)
        .then(response => {
            location.href = '/';
        })
        .catch(error => {
            console.error(`Error: ${error}`);
        });
});
*/



//use this for 1.4 then delete// 
devices.forEach(function (device) {
 $('#devices tbody').append(`
 <tr>
 <td>${device.user}</td>
<td>${device.name}</td>
 </tr>`
);
}); 


//use this for 1.4 then delete// 
$('#add-device').on('click', function () {
    const user = $('#user').val();
    const name = $('#name').val();
    devices.push({ user: user, name: name });
    localStorage.setItem('devices', JSON.stringify(devices));
    location.href = '/';
}); 



$('#send-command').on('click', function () {
    const command = $('#command').val();
    console.log(`command is: ${command}`);
});


$('#register').on('click', function() {
    const username = $('#user').val();
    const password = $('#password').val();
    const confirmpasswrd = $('#confirmpassword').val();
    const exists = users.find((user) => {console.log(user.username); return user.username === username});
    if (exists == undefined)
    {
      if(password == confirmpasswrd)
      {
        users.push({ username, password, confirmpasswrd });
        localStorage.setItem('users', JSON.stringify(users));
        location.href = '/login';
      }
      else
      {
        $("#message-warning").text("Passwords do not match! Please Try again");
        $("#message").fadeIn();
      }
    }
    else
    {
      $("#message-warning").text("User Exists!");
      $("#message").fadeIn();
    }


$('#login').on('click', function() {
    const username = $('#user').val();
    const password = $('#password').val();
    const exists = users.find((user) => {console.log(user.username); return user.username === username});
    const confirmpassword = users.find((user) => {console.log(user.passwrd); return user.password === passwrd});
    if (exists == undefined)
    {
      $("#message-warning").text("User doesn't Exists!");
      $("#message").fadeIn();
    }
    else
    {
      if (confirmpassword == undefined)
      {
        $("#message-warning").text("Password does not match.. Try Again!");
        $("#message").fadeIn();
      }
      else
      {
        localStorage.setItem('isAuthenticated', JSON.stringify(true));
        location.href = '/';
      }
    }
  });

const logout = () => {
    localStorage.removeItem('isAuthenticated');
    location.href = '/login';
}

})