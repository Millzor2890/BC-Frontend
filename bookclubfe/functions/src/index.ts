import * as functions from 'firebase-functions';

import {firebase_config} from '../../src/configs/firebase.config';

import * as crypto from 'crypto';
import * as tsscmp from 'tsscmp';

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
export const helloWorld = functions.https.onRequest((request, response) => {
 response.send("Hello from Firebase!");
});


export const resetSurvey = functions.https.onRequest((request, response) => {
    response.send("Hello from Firebase! " + legitSlackRequest(request));

   });




   
function legitSlackRequest(req) {
    // Your signing secret
    const slackSigningSecret = firebase_config.firebase.apiKey;

    // Grab the signature and timestamp from the headers
    const requestSignature = req.headers['x-slack-signature'] as string;
    const requestTimestamp = req.headers['x-slack-request-timestamp'];

    // Create the HMAC
    const hmac = crypto.createHmac('sha256', slackSigningSecret);

    // Update it with the Slack Request
    const [version, hash] = requestSignature.split('=');
    const base = `${version}:${requestTimestamp}:${JSON.stringify(req.body)}`;
    hmac.update(base);

    // Returns true if it matches
    return tsscmp(hash, hmac.digest('hex'));
}