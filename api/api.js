
const mongoose = require('mongoose');
mongoose.connect("mongodb+srv://shruti:uknm1234@cluster0.otluc.mongodb.net",
    { useNewUrlParser: true, useUnifiedTopology: true });

const Device = require('./models/device');

const express = require('express');
const app = express();

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

const port = process.env.PORT || 5000;


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

app.listen(port, () => {
    console.log(`listening on port ${port}`);
});

