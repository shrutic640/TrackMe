
const mongoose = require('mongoose');
mongoose.connect("mongodb+srv://shruti:uknm1234@cluster0.otluc.mongodb.net",
    { useNewUrlParser: true, useUnifiedTopology: true });

// For device model in MONGODB(mongoose)    
const Device = require('./models/device');
// For user model in MONGODB(mongoose)  
const User = require('./models/user');


const express = require('express');
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

const port = process.env.PORT || 5000;


app.use(express.static('public'));
/*remove for 2.3 add after
app.use((req, res, next) => {
 res.header("Access-Control-Allow-Origin", "*");
 res.header("Access-Control-Allow-Headers", "Origin, X-RequestedWith, Content-Type, Accept");
 next();
});
*/

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-RequestedWith, Content-Type, Accept");
    next();
});


app.use(express.static(`${__dirname}/public/generated-docs`));

/**
* @api {get} /api/docs Sending the apidoc document
* @apiGroup Docs
*/
app.get('/docs', (req, res) => {
    res.sendFile(`${__dirname}/public/generated-docs/index.html`);
});


/**
* @api {get} /api/test Test if the API is working
* @apiGroup Test
* @apiSuccessExample Success-Response:
{
     "The API is working!
}
*/
app.get('/api/test', (req, res) => {
    res.send('The API is working!');

});



/**
 * @api {post} /api/devices Request User information
 * @apiGroup Devices
 * @apiParam {String} name         name of the device
 * @apiParam {String} user         names of the user
 * @apiParam {Object}[sensorData]  data from sensor
 * @apiSuccessexample Success-Response:
 * {
 * 'successfully added device and data'
 * }
 */

app.post('/api/devices', (req, res) => {
    const { name, user, sensorData } = req.body;
    const newDevice = new Device({
        name,
        user,
        sensorData
    });
    newDevice.save(err => {
        return err
            ? res.send(err)
            : res.send('successfully added device and data');
    });
});


/**
* @api {get} /api/devices All Devices An array of all devices
* @apiGroup Device
* @apiSuccessExample {json} Success-Response:
* [
* {
* "_id": "dsohsdohsdofhsofhosfhsofh",
* "name": "Mary's iPhone",
* "user": "mary",
* "sensorData": [
* {
* "ts": "1529542230",
* "temp": 12,
* "loc": {
* "lat": -37.84674,
* "lon": 145.115113
* }
* },
* {
* "ts": "1529572230",
* "temp": 17,
* "loc": {
* "lat": -37.850026,
* "lon": 145.117683
* }
* }
* ]
* }
* ]
* @apiErrorExample {json} Error-Response:
* {
* "User does not exist"
* }
*/

app.get('/api/devices', (req, res) => {
    Device.find({}, (err, devices) => {
        if (err == true) {
            return res.send(err);
        } else {
            return res.send(devices);
        }
    });
});



app.post('/api/authenticate', (req, res) => {
    //reads user, password from req.body and saves in varaibles
    const { user, password } = req.body;
    // searchs database for an account
    User.findOne({ name: user }, (err, found) => {
        // handles errors
        if (err) {
            return res.send(err);
        } else if (!found) {
            return res.send('This User does not exsit');
        } else if (found.password !== password) {
            return res.send('Incorrect password');
        }
        //returns a json object 
        else {
            return res.json({
                success: true,
                message: 'Authenticated successfully',
                isAdmin: found.isAdmin
            });
        }
    });
});


app.post('/api/registration', (req, res) => {
    const { user, password, isAdmin } = req.body;
    console.log(req.body);
    User.findOne({name: user}, (err, found) => {
        if (err) {
            return res.send(err);
        } else if (found) {
            return res.send('User already exists');
        } else {
            const newUser = new User({
                name: user,
                password,
                isAdmin
            });
            newUser.save(err => {
                return err
                    ? res.send(err)
                    : res.json({
                        success: true,
                        message: 'Created new user'
                    });
            });
        }
    });
});

app.get('/api/devices/:deviceId/device-history', (req, res) => {
    const { deviceId } = req.params;
    console.log(req.params);
    Device.findOne({ "_id": deviceId }, (err, devices) => {
        const { sensorData } = devices;
        console.log(devices);
        return err
            ? res.send(err)
            : res.send(sensorData);
    });
});

app.get('/api/users/:user/devices', (req, res) => {
    const { user } = req.params;
    Device.find({ "user": user }, (err, devices) => {
        return err
            ? res.send(err)
            : res.send(devices);
    });
});

// use for 2.3 then remove  //
app.post('/api/send-command', (req, res) => {
    console.log(req.body);
});


app.listen(port, () => {
    console.log(`listening on port ${port}`);
});
