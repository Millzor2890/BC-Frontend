# Getting an API Key for local development: 

1.  I have setup non-prod credentials: in src/configs/firebase.config.nonprod.ts

2.  Prod credentials are stored in a private repo, message me if you need access to them.

3.  Rename firebase.config.nonprod.ts to firebase.config.ts

4. I generally just use the latest version of node, right now I am using v10.13.0  but I think the version of angular I'm using will need v8 or later

5.  npm install, and npm start should get the app to run locally.

## Api Usage Limits

1.  Google Books Api allows for 100 requests in a minute, I dont think I've ever hit that limit

2.  The other limit is 1000 requests a day, and I have definitely hit that before.

3.  Its not clear if those APi limits are shared across all API keys, if it becomes a problem I can fix it then,

4.  But please try no to go crazy with local development, I really dont want to put a credit card into billing for the Google API. :P

5.  Prod requests are all cached as a part of the PWA stuff, but locally im not running https, so they wont be cached, I dont really want to cache locally anyway so I can tell whats working.  This does however dirve up API requests like crazy.  Every book on the survey and the bookshelf makes 1 request, so it can add up quickly.

## Branching and Merge requests

1.  Please branch and send me a merge request to look over before merging to master.

2.  I might still merge to master, which is very wrong of me, but I still expect to be the sole contributer.


## Thanks for Contributing!




