$('#navbar').load('navbar.html');
$('#footer').load("footer.html");


//const devices = JSON.parse(localStorage.getItem('devices')) || [];
//const users = JSON.parse(localStorage.getItem('users')) || [];

const API_URL = 'http://localhost:5000/api'; //'https://api-puce-two.vercel.app/api';
const MQTT_URL = "http://localhost:5001";

//fetch devices only for the logged in user 
//adds a data device-id attribute to track which row is being clicked. 
const currentUser = localStorage.getItem('user');

if (currentUser) {
    $.get(`${API_URL}/users/${currentUser}/devices`)
        .then(response => {
            response.forEach((device) => {
                $('#devices tbody').append(`
                 <tr data-device-id=${device._id}>
                     <td>${device.user}</td>
                     <td>${device.name}</td>
                     </tr>`
                );
            });
            $('#devices tbody tr').on('click', (e) => {
                const deviceId = e.currentTarget.getAttribute('data-device-id');
                $.get(`${API_URL}/devices/${deviceId}/device-history`)
                    .then(response => {
                        response.map(sensorData => {
                            $('#historyContent').append(`
                <tr>
                <td>${sensorData.ts}</td>
                <td>${sensorData.temp}</td>
                <td>${sensorData.loc.lat}</td>
                <td>${sensorData.loc.lon}</td>
                </tr>
                `);
                        });
                        $('#historyModal').modal('show');
                    });
            });
        })
        .catch(error => {
            console.error(`Error: ${error}`);
        });
}
else {
    const path = window.location.pathname;
    if (path !== '/login' && path !== '/registration') {
        location.href = '/login';
    }
}


const response = $.get(`${API_URL}/devices`);
console.log(response);

// comment out after 2.3
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


$('#register').on('click', () => {
    const user = $('#user').val();
    const password = $('#password').val();
    const confirm = $('#confirm').val();
    if (password !== confirm) {
        $("#message-warning").text('Passwords do not match');
        $("#message").fadeIn();
    } else {
        $.post(`${API_URL}/registration`, { user, password })
            .then((response) => {
                if (response.success) {
                    location.href = '/login';
                } else {
                    $("#message-warning").text(`User already exists`);
                    $("#message").fadeIn();
                }

            });
    }
});



$('#login').on('click', () => {
    const user = $('#user').val();
    const password = $('#password').val();
    $.post(`${API_URL}/authenticate`, { user , password })
        .then((response) => {
            if (response.success) {
                localStorage.setItem('user', user);
                localStorage.setItem('isAdmin', response.isAdmin);
                localStorage.setItem('isAuthenticated', true);
                location.href = '/';
            } else {
                $("#message-warning").text("User doesn't Exist!");
                $("#message").fadeIn();
            }
        });
});




$('#send-command').on("click", function () {
    const command = $('#command').val();
    const deviceId = $('#deviceid').val();
    $.post(`${MQTT_URL}/send-command`, { deviceId, command })
        .then(response => {
            console.log(response);
        })
    console.log(`command is ${command}`);
});


const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('isAuthenticated');
    location.href = '/login';

}