
const randomCoordinates = require('random-coordinates');
const rand = require('random-int');
const mqtt = require('mqtt');
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Device = require('./models/device');
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 5001;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});


app.use(express.static('public'));
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-RequestedWith, Content-Type, Accept");
    next();
});

const client = mqtt.connect("mqtt://broker.hivemq.com:1883");
client.on('connect', () => {
    client.subscribe('/sensorData');
    console.log('mqtt connected');
});

//find the device in the collection, 
//add the new sensor data to the array 
//overwrite the existing device.
client.on('message', (topic, message) => {
    if (topic == '/sensorData') {
        const data = JSON.parse(message);

        Device.findOne({ "name": data.deviceId }, (err, device) => {
            if (err) {
                console.log(err)
            }

            const { sensorData } = device;
            const { ts, loc, temp } = data;
            sensorData.push({ ts, loc, temp });
            device.sensorData = sensorData;
            device.save(err => {
                if (err) {
                    console.log(err)
                }
            });
        });
    }
});


app.post('/send-command', (req, res) => {
    const { deviceId, command } = req.body;
    const topic = `/218303945/command/${deviceId}`;
    client.publish(topic, command, () => {
        res.send('published new message');
    });
});


/**
* @mqtt {put} /sensor-data Generate Sensor-Data
* @mqttGroup Device
* @mqttParam {String} deviceId ID/name of device
* @mqttSuccessExample Success-Response:
* published new message
* @apiErrorExample Error-Response:
* N/A
*/
app.put('/sensor-data', (req, res) => {
    const { deviceId } = req.body;
    const [lat, lon] = randomCoordinates().split(", ");
    const ts = new Date().getTime();
    const loc = { lat, lon };
    const temp = rand(20, 50);
    const topic = `/sensorData`;
    const message = JSON.stringify({ deviceId, ts, loc, temp });
    client.publish(topic, message, () => {
        console.log(req)
        res.send('published new message');
    });
});


client.on('connect', () => {
    console.log('connected');
});


app.listen(port, () => {
    console.log(`listening on port ${port}`);
});

/*const topic = '/218303945/test/hello/';
const msg = 'Hello MQTT world!';
client.publish(topic, msg, () => {
    console.log('message sent...');
});
*/

