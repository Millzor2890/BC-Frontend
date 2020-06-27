import * as functions from 'firebase-functions';

import {firebase_config} from '../../src/configs/firebase.config';

import * as crypto from 'crypto';

var qs = require('qs');



const https = require('https');

const yourWebHookURL = firebase_config.firebase.slackWebhookURL; 
//states
const MS_FR = "WaitForFriendlyReminder";
const MS_AM = "WaitForActualMeeting";
const MS_WI = "WaitIndefinitely";
const VS_WI = "WaitIndefinitely";
const VS_MS = "WaitForMinimumSubmission";
const VS_FS = "WaitForFinalSubmissions";
const VS_MV = "WaitForMinimumVotes";
const VS_FV = "WaitForFinalVotes";


const admin = require('firebase-admin');
admin.initializeApp();
var db = admin.firestore();

export const setNextMeetingTime = functions.https.onRequest(setNextMeetingTimeRequest);

export  const pet = functions.https.onRequest(meow);

export const resetSurveySlackTest = functions.https.onRequest((request, response) => {
    var isLegit = legitSlackRequest(request);
    if(isLegit){
        response.send("Ok. Ill get right on that! ");

        db.collection("Surveys").get()
        .then(function(querySnapshot){
            var data = querySnapshot.docs[0].data();

            var newSurveyBookShelf = new Array;
            var newMemberInfo = new Array;
        
            for(var i =0; i < data.memberInfo.length; i++){
                var newMember = data.memberInfo[i];
                newMember.hasVoted = false;
                newMemberInfo.push(newMember);
            }
            var data4db = {
                memberInfo: newMemberInfo,
                books: newSurveyBookShelf,
                members: data.members
            }
            querySnapshot.docs[0].ref.set(data4db);
        });
        db.collection("Larry-Tracker").get()
        .then(function(querySnapshot){
            var currentTime = Date.now();
            var newNextSubmissionCheck = new Date(currentTime);
            newNextSubmissionCheck.setDate(newNextSubmissionCheck.getDate()+2);
            var data = querySnapshot.docs[0].data();
            var data4db = {
                NextBookClubMeeting: data.NextBookClubMeeting,
                meetingStatus : data.meetingStatus,
                votingStatus : VS_MS,
                nextSubmissionCheck : newNextSubmissionCheck.getTime(),
                nextVoteCheck: data.nextVoteCheck
            }
            querySnapshot.docs[0].ref.set(data4db);
        });
    }
    else{
        response.send("This request is not legit, nothing happened.  Hello from Firebase!!!v11 " + isLegit);
    }
});

export const scheduledFunctionPlainEnglish =
    functions.pubsub.schedule('every 60 minutes').onRun(HourlyCron);

async function setNextMeetingTimeRequest(request, response){
    var isLegit = legitSlackRequest(request);
    if(isLegit){

        var newDate = new Date(request.body.text);
        response.send("Gotcha ill set the next book club meeting for: " + newDate.toLocaleDateString());
        var timestamp = newDate.getTime();

        await db.collection("Larry-Tracker").get()
        .then(function(querySnapshot){
            var newMeetingTime = timestamp;
            var data = querySnapshot.docs[0].data();

            var data4db = {
                NextBookClubMeeting: newMeetingTime,
                meetingStatus : MS_FR,
                votingStatus : data.votingStatus,
                nextSubmissionCheck : data.nextSubmissionCheck,
                nextVoteCheck:  data.nextVoteCheck
            }
            querySnapshot.docs[0].ref.set(data4db);
        });
        var slackString = 'The next book club meeting is set for:  ' + new Date(timestamp).toLocaleDateString() + 
        ' ' + formatAMPM(new Date(timestamp)) + ' CST'

        sendSlackMessage(yourWebHookURL,{
            'text': slackString, // text
          } )
    }
    else{
        response.send("This request is not valid")
    }
}

async function meow(request, response){
    var isLegit = legitSlackRequest(request);
    if(isLegit){
        response.send("Pet recieved");
        var second_Meow = Math.round(Math.random() * 10);
        var third_Meow = Math.round(Math.random() * 100)


        var meowstring = 'Meow. ';
        if(second_Meow == 9)
        {
            meowstring += "Meow. "
        }
        if(third_Meow == 99)
        {
            meowstring += "Meow. "
        }

        sendSlackMessage(yourWebHookURL,{
             'text': meowstring, // text
           } )
    }
    else{
        response.send("This request is not valid")
    }
}


function formatAMPM(date) {
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0'+minutes : minutes;
    var strTime = hours + ':' + minutes + ' ' + ampm;
    return strTime;
  }


async function HourlyCron(context){
    
        //log current time
        var currentTime = Date.now();
        //retrieve meeting status
         var larryInfo = await retrieveLarryInfo();
        var hourString =  formatAMPM(new Date(larryInfo.NextBookClubMeeting));
        console.log("Larry Info: " + JSON.stringify(larryInfo));

        if(larryInfo.meetingStatus == MS_FR){
            var twoDaysAgo = new Date(larryInfo.NextBookClubMeeting)
            twoDaysAgo.setDate(twoDaysAgo.getDate()-2);
            if(twoDaysAgo.getTime() < currentTime){
                //send friendly reminder
                var meetingTimeDateString = new Date(larryInfo.NextBookClubMeeting).toLocaleDateString();
                var meetingTimeStringForSlack = '<!here> Friendly reminder that the next book club is scheduled for ' +
                 meetingTimeDateString + ' ' + hourString + ' CST';

                sendSlackMessage(yourWebHookURL,{
                        'text': meetingTimeStringForSlack, // text
                    } )
                //update status to wait for actual meeting
                db.collection("Larry-Tracker").get()
                .then(function(querySnapshot){
                    var data = querySnapshot.docs[0].data();
                    var data4db = {
                        NextBookClubMeeting: data.NextBookClubMeeting,
                        meetingStatus : MS_AM,
                        votingStatus : data.votingStatus,
                        nextSubmissionCheck : data.nextSubmissionCheck,
                        nextVoteCheck:  data.nextVoteCheck
                    }
                    querySnapshot.docs[0].ref.set(data4db);
                });
            }
        }

        //if meetingStatus is wait for actual meeting
        if(larryInfo.meetingStatus == MS_AM){
            var dayAfter = new Date(larryInfo.NextBookClubMeeting)
            dayAfter.setDate(dayAfter.getDate()+1);
            if(dayAfter.getTime() < currentTime){
                var reminderForNextDateForSlack = '<!here> I\'ve detected that you havent chosen a new date for the next '+
                'book club meeting.  You can let me know what you decide with the slash command: '+
                ' /setnextbookclubmeeting YYYY-MM-DDTHH:MM:SS thanks!';

                sendSlackMessage(yourWebHookURL,{
                    'text': reminderForNextDateForSlack, // text
                    } )
                //update status to wait for actual meeting
                db.collection("Larry-Tracker").get()
                .then(function(querySnapshot){
                    var data = querySnapshot.docs[0].data();
                    var data4db = {
                        NextBookClubMeeting: data.NextBookClubMeeting,
                        meetingStatus : MS_WI,
                        votingStatus : data.votingStatus,
                        nextSubmissionCheck : data.nextSubmissionCheck,
                        nextVoteCheck:  data.nextVoteCheck
                    }
                    querySnapshot.docs[0].ref.set(data4db);
                });
            }
        }
        if(larryInfo.votingStatus == VS_MS){
            var submissions = await howManyPeopleHaveSubmittedBooks();
            if(submissions > 4){
                //update status
                    //update next vote check time
                await db.collection("Larry-Tracker").get()
                    .then(function(querySnapshot){
                        var newNextSubmissionCheck = new Date(currentTime);
                        newNextSubmissionCheck.setDate(newNextSubmissionCheck.getDate()+1);
                        var data = querySnapshot.docs[0].data();
                        var data4db = {
                            NextBookClubMeeting: data.NextBookClubMeeting,
                            meetingStatus : data.meetingStatus,
                            votingStatus : VS_FS,
                            nextSubmissionCheck : newNextSubmissionCheck.getTime(),
                            nextVoteCheck: data.nextVoteCheck
                        }
                        querySnapshot.docs[0].ref.set(data4db);
                    });
                //send slack message
                    //
                var waitADayForMoreSubmissionsForSlack = '<!here> 5 people have submitted books so far! '+
                'I\'ll open up voting in the next 24 hours '+
                'so if you haven\`t submitted books yet please do so in the next 24 hours! Thank you!';

                sendSlackMessage(yourWebHookURL,{
                    'text': waitADayForMoreSubmissionsForSlack, // text
                    } )
            }
            else if(larryInfo.nextSubmissionCheck < currentTime){
                 //update status
                    //update next vote check time
                await db.collection("Larry-Tracker").get()
                    .then(function(querySnapshot){
                        var newNextSubmissionCheck = new Date(currentTime);
                        newNextSubmissionCheck.setDate(newNextSubmissionCheck.getDate()+2);
                        var data = querySnapshot.docs[0].data();
                        var data4db = {
                            NextBookClubMeeting: data.NextBookClubMeeting,
                            meetingStatus : data.meetingStatus,
                            votingStatus : data.votingStatus,
                            nextSubmissionCheck : newNextSubmissionCheck.getTime(),
                            nextVoteCheck: data.nextVoteCheck
                        }
                        querySnapshot.docs[0].ref.set(data4db);
                    });
                //send slack message
                    //
                var waitTwoDaysForMoreSubmissionsForSlack = '<!here> Friendly reminder to submit books for the next '+
                'book club if you havent done so already! ';

                sendSlackMessage(yourWebHookURL,{
                    'text': waitTwoDaysForMoreSubmissionsForSlack, // text
                    } )
            }
        }
        if(larryInfo.votingStatus == VS_FS){
            if(larryInfo.nextSubmissionCheck < currentTime){
                //update status
                await db.collection("Larry-Tracker").get()
                    .then(function(querySnapshot){
                        var newNextVoteCheck = new Date(currentTime);
                        newNextVoteCheck.setDate(newNextVoteCheck.getDate()+2);
                        var data = querySnapshot.docs[0].data();
                        var data4db = {
                            NextBookClubMeeting: data.NextBookClubMeeting,
                            meetingStatus : data.meetingStatus,
                            votingStatus : VS_MV,
                            nextSubmissionCheck : data.nextSubmissionCheck,
                            nextVoteCheck:  newNextVoteCheck.getTime()
                        }
                        querySnapshot.docs[0].ref.set(data4db);
                    });
                //send slack message
                    //
                var openVotingForSlack = '<!here> Voting is now open. Please go vote for our next book when you get a chance! ';

                sendSlackMessage(yourWebHookURL,{
                    'text': openVotingForSlack, // text
                    } )
            }

        }
        if(larryInfo.votingStatus == VS_MV){
            var votes = await howManyPeopleHaveVoted();
            if(votes > 4){
                //update status
                    //update next vote check time
                await db.collection("Larry-Tracker").get()
                    .then(function(querySnapshot){
                        var newNextVoteCheck = new Date(currentTime);
                        newNextVoteCheck.setDate(newNextVoteCheck.getDate()+1);
                        var data = querySnapshot.docs[0].data();
                        var data4db = {
                            NextBookClubMeeting: data.NextBookClubMeeting,
                            meetingStatus : data.meetingStatus,
                            votingStatus : VS_FV,
                            nextSubmissionCheck : data.nextSubmissionCheck,
                            nextVoteCheck:  newNextVoteCheck.getTime()
                        }
                        querySnapshot.docs[0].ref.set(data4db);
                    });
                //send slack message
                    //
                var waitADayForMoreVotesForSlack = '<!here> 5 people have voted so far! '+
                'I\'ll pick the winner in the next 24 hours '+
                'so if you haven\`t voted yet please do so in the next 24 hours! Thank you!';

                sendSlackMessage(yourWebHookURL,{
                    'text': waitADayForMoreVotesForSlack, // text
                    } )
            }
            else if(larryInfo.nextVoteCheck < currentTime){
                 //update status
                    //update next vote check time
                await db.collection("Larry-Tracker").get()
                    .then(function(querySnapshot){
                        var newNextVoteCheck = new Date(currentTime);
                        newNextVoteCheck.setDate(newNextVoteCheck.getDate()+2);
                        var data = querySnapshot.docs[0].data();
                        var data4db = {
                            NextBookClubMeeting: data.NextBookClubMeeting,
                            meetingStatus : data.meetingStatus,
                            votingStatus : data.votingStatus,
                            nextSubmissionCheck : data.nextSubmissionCheck,
                            nextVoteCheck:  newNextVoteCheck.getTime()
                        }
                        querySnapshot.docs[0].ref.set(data4db);
                    });
                //send slack message
                    //
                var waitTwoDaysForMoreVotesForSlack = '<!here> Friendly reminder to vote for books for the next '+
                'book club if you havent done so already! ';

                sendSlackMessage(yourWebHookURL,{
                    'text': waitTwoDaysForMoreVotesForSlack, // text
                    } )
            }
        }
        if(larryInfo.votingStatus == VS_FV){
            if(larryInfo.nextVoteCheck < currentTime){
                //update status
                await db.collection("Larry-Tracker").get()
                    .then(function(querySnapshot){
                        var newNextVoteCheck = new Date(currentTime);
                        newNextVoteCheck.setDate(newNextVoteCheck.getDate()+2);
                        var data = querySnapshot.docs[0].data();
                        var data4db = {
                            NextBookClubMeeting: data.NextBookClubMeeting,
                            meetingStatus : data.meetingStatus,
                            votingStatus : VS_WI,
                            nextSubmissionCheck : data.nextSubmissionCheck,
                            nextVoteCheck:  data.nextVoteCheck
                        }
                        querySnapshot.docs[0].ref.set(data4db);
                    });
                //send slack message
                    //
                var openVotingForSlack = '<!here> Voting is finished. Check out the website to see who the winner is! ';

                sendSlackMessage(yourWebHookURL,{
                    'text': openVotingForSlack, // text
                    } )
            }
        }
    
}

//utils
function legitSlackRequest(req: any) {

    // Grab the signature and timestamp from the headers
    const requestSignature = req.headers['x-slack-signature'] as string;
    const requestTimestamp = req.headers['x-slack-request-timestamp'];

    //Make sure request was sent recently
    // convert current time from milliseconds to seconds
    const time = Math.floor(new Date().getTime()/1000);
    if (Math.abs(time - requestTimestamp) > 1000) {
        return false;
    }

    // Get signing secret
    const slackSigningSecret = firebase_config.firebase.slackSecret;

    // Create the HMAC
    const hmac = crypto.createHmac('sha256', slackSigningSecret);

    // Update it with the Slack Request
    const [version, hash] = requestSignature.split('=');
    const base = `${version}:${requestTimestamp}:${qs.stringify(req.body,{ format:'RFC1738' })}`;
    hmac.update(base);
    var digest = hmac.digest('hex');

    // Returns true if it matches
    return timeSafeCompare(hash, digest);
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
    return crypto.timingSafeEqual(a, b);
}

async function howManyPeopleHaveVoted(){
    var totalVoters = 0;

    await db.collection("Surveys").get()
    .then(function(querySnapshot){
        var data = querySnapshot.docs[0].data();
        for(var i =0; i < data.memberInfo.length; i++){
            if(data.memberInfo[i].hasVoted){
                totalVoters++;
            }
        }
        
    });
    return totalVoters;
}

async function retrieveLarryInfo(){
    var info;

    await db.collection("Larry-Tracker").get()
    .then(function(querySnapshot){
        var data = querySnapshot.docs[0].data();
        info = data
        
    });
    return info;
}

async function howManyPeopleHaveSubmittedBooks(){
    var uniqueSubmitters = 0;
    var uniqueSubmittersemails = new Array();

    await db.collection("Surveys").get()
    .then(function(querySnapshot){
        var data = querySnapshot.docs[0].data();
        for(var i =0; i < data.books.length; i++){
            if(!uniqueSubmittersemails.includes(data.books[i].promotingUser)){
                uniqueSubmittersemails.push(data.books[i].promotingUser)
                uniqueSubmitters++;
            }
        }
        
    });
    return uniqueSubmitters;
}

/**
 * Handles the actual sending request. 
 * We're turning the https.request into a promise here for convenience
 * @param webhookURL
 * @param messageBody
 * @return {Promise}
 */
function sendSlackMessage (webhookURL, messageBody) {
  // make sure the incoming message body can be parsed into valid JSON
  try {
    messageBody = JSON.stringify(messageBody);
  } catch (e) {
    throw new Error('Failed to stringify messageBody');
  }

  // Promisify the https.request
  return new Promise((resolve, reject) => {
    // general request options, we defined that it's a POST request and content is JSON
    const requestOptions = {
      method: 'POST',
      header: {
        'Content-Type': 'application/json'
      }
    };

    // actual request
    const req = https.request(webhookURL, requestOptions, (res) => {
      let response = '';


      res.on('data', (d) => {
        response += d;
      });

      // response finished, resolve the promise with data
      res.on('end', () => {
        resolve(response);
      })
    });

    // there was an error, reject the promise
    req.on('error', (e) => {
      reject(e);
    });

    // send our message body (was parsed to JSON beforehand)
    req.write(messageBody);
    req.end();
  });
}
