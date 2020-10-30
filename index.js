//HTTP
const cors = require('cors');
//Express
const express = require('express');
//Boby parser
const bodyParser = require('body-parser');
//Watson assistant
const AssistantV2 = require('ibm-watson/assistant/v2');
const { IamAuthenticator } = require('ibm-watson/auth');
//Express
const app = express();
app.listen(8080);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors({
    origin: '*'
}));
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
})

//Consts
const assistantId = 'seuAssistantId';
const apiKey = 'suaApiKey';
const url = 'suaURL'
const version = '2020-10-10';

app.post('/createSession', async (request, resToS) => {
    const assistant = new AssistantV2({
        version: version,
        authenticator: new IamAuthenticator({
            apikey: apiKey,
        }),
        serviceUrl: url,
        disableSslVerification: true,
    });

    assistant.createSession({
        assistantId: assistantId
    })
        .then(res => {
            let sessionID = res.result.session_id;
            resToS.send({session: sessionID})
        })
        .catch(err => {
            console.log(err);
        });
})

app.post('/newMessage', async (request, resToS) => {
    let body = request.body;
    let sessionId = body.session;
    let text = body.text;
    const assistant = new AssistantV2({
        version: version,
        authenticator: new IamAuthenticator({
            apikey: apiKey,
        }),
        serviceUrl: url,
        disableSslVerification: true,
    });

    assistant.message({
        assistantId: assistantId,
        sessionId: sessionId,
        input: {
            'message_type': 'text',
            'text': text
        }
    })
        .then(res => {
            let response = res.result.output.generic[0].text;
            resToS.send({response: response})
        })
        .catch(err => {
            console.log(err);
        });
})