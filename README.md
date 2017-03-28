# node-social-feed-api

##### **CURRENTLY IN DEVELOPMENT**

Simple module to fetch all social feeds and output in one simple API call.
### Currently supported

1. Facebook
2. Twitter
3. Instagram

### Install

##### NOTE: not published yet
`npm install --save social-feed-api`

### Generate an access token for Instagram

1. Go to https://www.instagram.com/oauth/authorize/?client_id=YOUR_CLIENT_ID&redirect_uri=YOUR_REDIRECT_URI&response_type=code
2. In the example below, the access token will log to the console. It is recommended you store that in an env file or redis so you never have to call initializeInstagram again (see example usage)

### Setup
```javascript
const social = new SocialFeed({
  facebook: {
    appId: 'YOUR_FB_APP_ID',
    appSecret: 'YOUR_FB_APP_SECRET',
    pageId: 'PAGE_ID_YOU_ARE_FETCHING',
  },
  twitter: {
    consumerKey: 'YOUR_TWITTER_CONSUMER_KEY',
    consumerSecret: 'YOUR_TWITTER_CONSUMER_SECRET',
    accessTokenKey: 'YOUR_TWITTER_ACCESS_TOKEN_KEY',
    accessTokenSecret: 'YOUR_TWITTER_ACCESS_TOKEN_SECRET',
    screenName: 'HANDLE_YOU_ARE_FETCHING',
  },
  instagram: {
    clientId: instagramClientId,
    clientSecret: instagramClientSecret,
    redirectURI: instagramRedirectURI,
  },
});
```
##### If you want to pull from instagram you must call initializeInstagram (see full example below)
```javascript
social.initializeInstagram('YOUR_CODE_FROM_CALLBACK_URI')
.then(response => {
  console.log(response);
  instaAccessToken = response.access_token;
  res.status(201).json({ message: 'Access token generated successfully!' });
});
```
### Example (with Express)

```javascript
import express from 'express';
import bodyParser from 'body-parser';
import http from 'http';
import SocialFeed from 'social-feed-api';
import {
  fbAppId,
  fbAppSecret,
  fbPageId,
  twitterConsumerKey,
  twitterConsumerSecret,
  twitterAccessTokenKey,
  twitterAccessTokenSecret,
  twitterScreenName,
  instagramClientId,
  instagramClientSecret,
  instagramRedirectURI,
  instagramAccessToken,
  port,
} from './env';

const app = express();
app.use(bodyParser.json({ type: 'application/*+json' }));
http.createServer(app).listen(port);

const social = new SocialFeed({
  facebook: {
    appId: fbAppId,
    appSecret: fbAppSecret,
    pageId: fbPageId,
  },
  twitter: {
    consumerKey: twitterConsumerKey,
    consumerSecret: twitterConsumerSecret,
    accessTokenKey: twitterAccessTokenKey,
    accessTokenSecret: twitterAccessTokenSecret,
    screenName: twitterScreenName,
  },
  instagram: {
    clientId: instagramClientId,
    clientSecret: instagramClientSecret,
    redirectURI: instagramRedirectURI,
  },
});

let instaAccessToken = instagramAccessToken || '';

app.get('/v1/socialFeed', (req, res) => {
  social.getFeeds()
  .then(response => {
    res.status(200).json({ response });
  }, err => {
    console.log(err);
    res.status(400).json({ error: 'There was an error fetching feeds' });
  })
});

app.get('/v1/instaRedirect', (req, res) => {
  if (req.query.code) {
    if (!instaAccessToken) {
      social.initializeInstagram(req.query.code)
      .then(response => {
        console.log(response);
        instaAccessToken = response.access_token;
        res.status(201).json({ message: 'Access token generated successfully!' });
      });
    }
  } else {
    res.status(400).json({ error: 'An error occurred' });
  }
});

console.log('STARTING SERVER');
```
