import * as functions from 'firebase-functions';

import {firebase_config} from '../../src/configs/firebase.config';

import * as crypto from 'crypto';

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
export const helloWorld = functions.https.onRequest((request, response) => {
 response.send("Hello from Firebase");
});


export const resetSurveySlackTest = functions.https.onRequest((request, response) => {
    var isLegit = legitSlackRequest(request)
    response.send("Hello from Firebase!!! " + isLegit);

   });




   
function legitSlackRequest(req: any) {
    // Your signing secret
    const slackSigningSecret = firebase_config.firebase.slackSecret;

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
    return timeSafeCompare(hash, hmac.digest('hex'));
}


function timeSafeCompare(a: any, b: any) {
    var sa = String(a);
    var sb = String(b);
    var key = crypto.pseudoRandomBytes(32);
    var ah = crypto.createHmac('sha256', key).update(sa).digest();
    var bh = crypto.createHmac('sha256', key).update(sb).digest();
  
    return bufferEqual(ah, bh) && a === b;
  }

  function bufferEqual(a: any, b: any) {
    if (a.length !== b.length) {
      return false;
    }
    // `crypto.timingSafeEqual` was introduced in Node v6.6.0
    // <https://github.com/jshttp/basic-auth/issues/39>
    if (crypto.timingSafeEqual) {
      return crypto.timingSafeEqual(a, b);
    }
    for (var i = 0; i < a.length; i++) {
      if (a[i] !== b[i]) {
        return false;
      }
    }
    return true;
  }