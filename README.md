# Group Song Generator with Messages and Voice API

<img src="https://developer.nexmo.com/assets/images/Vonage_Nexmo.svg" height="48px" alt="Nexmo is now known as Vonage" />

This is a JavaScript project that uses [Express](expressjs.com) to create a HTTP server for the [Vonage Messages API](https://developer.nexmo.com/messages/overview). Incoming messages are stored, when finished all the numbers that contributed messages will get a callback with the [Vonage Voice API](https://developer.nexmo.com/messages/overview) which will read back the messages.

## Welcome to Vonage

If you're new to Vonage, you can [sign up for a Vonage API account](https://dashboard.nexmo.com/sign-up?utm_source=DEV_REL&utm_medium=github) and get some free credit to get you started.

## Prerequisites

+ A Vonage API account.

+ Node

## Running the project

After cloning the project to your machine change into the project directory. Create a new app with this command, where `SUBDOMAIN` is a unique string that you will add to your `.env` later:

```
nexmo app:create "My Messages App" --capabilities=messages,voice --messages-inbound-url=https://SUBDOMAIN.loca.lt/webhooks/inbound-message/ --messages-status-url=https://SUBDOMAIN.loca.lt/webhooks/message-status/ --voice-answer-url=https://SUBDOMAIN.loca.lt/voice/ --voice-event-url=https://SUBDOMAIN.loca.lt/voice/ --keyfile=private.key
```

Install the dependencies with `npm install`

Make a copy of the `.env.example` file using `.env.example .env` then populate the .env file:

```
PORT=8080
SUBDOMAIN=
VONAGE_API_KEY=
VONAGE_API_SECRET=
VONAGE_NUMBER=
VONAGE_APPLICATION_ID=
VONAGE_APPLICATION_PRIVATE_KEY=./private.key
```

Visit [the Message API Sandbox](https://dashboard.nexmo.com/messages/sandbox) and enable a sandbox for one or more of the channels. Then enter the message webhooks again.

Run the project with `node index.js`.

## Getting Help

We love to hear from you so if you have questions, comments or find a bug in the project, let us know! You can either:

* Open an issue on this repository
* Tweet at us! We're [@VonageDev on Twitter](https://twitter.com/VonageDev)
* Or [join the Vonage Developer Community Slack](https://developer.nexmo.com/community/slack)

## Further Reading

* Check out the Developer Documentation at <https://developer.nexmo.com>

