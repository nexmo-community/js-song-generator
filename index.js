'use strict'

require('dotenv').config();
var Datastore = require('nedb'), db = new Datastore();
const Vonage = require('@vonage/server-sdk');
const express = require('express');
const localtunnel = require('localtunnel');

const vonage = new Vonage({
    apiKey: process.env.VONAGE_API_KEY,
    apiSecret: process.env.VONAGE_API_SECRET,
    applicationId: process.env.VONAGE_APPLICATION_ID,
    privateKey: process.env.VONAGE_APPLICATION_PRIVATE_KEY
});

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post('/webhooks/inbound-message', async (req, res) => {
    const number = req.body.from.number;
    const message = req.body.message.content.text;

    // End of song delimiter
    if (message === 'fin.') {
        try {
            const messages = await fetchMessages();
            await makeCall(messages);
            await deleteMessages();
        } catch (error) {
            console.log(error);
        }
    } else {
        try {
            await insertMessage(number, message)
        } catch (error) {
            console.log(error);
        }
    }

    res.sendStatus(200).end();
});

app.post('/webhooks/message-status', (req, res) => {
    console.log(req.body);
    res.sendStatus(200).end();
});

async function insertMessage(number, message) {
    console.log('Inserting message');
    return new Promise((resolve, reject) => {
        db.insert({ 'number': number, 'message': message, 'createdAt': new Date() }, function (error, newMessage) {
            if (error == null) {
                resolve('Message received', newMessage);
            } else {
                reject(error);
            }
        });
    });
}

async function fetchMessages() {
    console.log('Fetching messages');
    return new Promise((resolve, reject) => {
        db.find({}).sort({ createdAt: 1 }).exec(function (error, messages) {
            if (error == null) {
                resolve(messages);
            } else {
                reject(error);
            }
        });
    });
}

async function makeCall(messages) {
    console.log('Making call');
    return new Promise((resolve, reject) => {
        const [numbers, text] = formatMessages(messages);
        const to = numbers.map(numberEntry => {
            return {
                'type': 'phone',
                'number': numberEntry
            };
        });

        vonage.calls.create({
            ncco: [
                {
                    'action': 'talk',
                    'text': 'This song is generated, hope you enjoy it: ' + text + ' goodbye!'
                }
            ],
            to: to,
            from: {
                type: 'phone',
                number: process.env.VONAGE_NUMBER
            }
        }, (error, response) => {
            if (error) reject(error)
            if (response) resolve(response)
        });
    });
}

function formatMessages(messages) {
    console.log('Formatting messages');
    var numbers = new Set();
    var text = [];

    messages.map(message => {
        numbers.add(message.number);
        text.push(message.message);
    });

    return [Array.from(numbers), text.join(' ')];
}

async function deleteMessages() {
    console.log('Deleting messages');
    return new Promise((resolve, reject) => {
        db.remove({}, { multi: true }, function (error, numRemoved) {
            if (error) reject(error)
            if (numRemoved) resolve(numRemoved)
        });
    });
}

app.listen(process.env.PORT);

(async () => {
    const tunnel = await localtunnel({ subdomain: process.env.SUBDOMAIN, port: process.env.PORT });
    console.log(`App available at: ${tunnel.url}`);
})();