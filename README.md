# node-social-feed-api

##### **CURRENTLY IN DEVELOPMENT**

Simple module to fetch all social feeds and output in one simple API call.

### Install

##### NOTE: not published yet
`npm install --save social-feed-api`

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
  }
});
```

### Example (with Express)

```javascript
import express from 'express';
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
  port,
} from './env';

const app = express();
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
});

app.get('/v1/socialFeed', (req, res) => {
  social.getFeeds()
  .then(response => {
    res.status(200).json({ response });
  }, err => {
    console.log(err);
    res.status(400).json({ error: 'There was an error fetching feeds' });
  })
});

console.log('STARTING SERVER');
```
