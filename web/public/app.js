$('#navbar').load('navbar.html');
$('#footer').load("footer.html");

const devices = JSON.parse(localStorage.getItem('devices')) || [];

devices.forEach(function (device) {
    $('#devices tbody').append(`
    <tr>
    <td>${device.user}</td>
    <td>${device.name}</td>
    </tr>`
    );
});


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
    const username = $('#username').val();
    const password = $('#password').val();
    const confirmpassword = $('#confirmpassword').val();
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const userexists = users.find(user => user.name === username);

    if (userexists) {
        $('#message').appendTo('<p class="alert alert-info alert-dismissible fade in">This Username has already been taken</p>');
    }

    else if (password !== confirmpassword) {
        $('#message').append('<p class="alert alert-warning alert-dismissible fade in">The passwords do not match</p>');
    }
    else {
        users.push({ name: username, password });
        localStorage.setItem('users', JSON.stringify(users));
        location.href = '/login';
    }
});


$('#login').on('click', function () {
    const username = $('#username').val();
    const password = $('#password').val();
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const usernameexists = users.find(user => user.name === username);
    const passwordexists = users.find(user => user.password === password);
    if (usernameexists && passwordexists === password) {
        localStorage.setItem('isAuthenticated', true);
        location.href = '/';
    } else {
        $('#message').append('<p class="alert alert-warning alert-dismissible fade in">Wrong username or password</p>');
    }
});

const logout = () => {
    localStorage.removeItem('isAuthenticated');
    location.href = '/login';
}



