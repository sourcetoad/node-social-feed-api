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

### Setup

Instagram and Google both require user-specific access tokens, thus requiring special setup. See full example below for more specific examples.

##### Instagram

** Before you begin, make sure you have an endpoint set up for your redirect uri. See full example section below. **
1. In a web browser, navigate to https://www.instagram.com/oauth/authorize/?client_id=YOUR_CLIENT_ID&redirect_uri=YOUR_REDIRECT_URI&response_type=code. It will prompt you to login with an instagram account. This is to generate an access token.
2. Once logged in, click the green authorize button.
3. In your console, you should see an object output. One of the fields is called access_token. If you see that, you have successfully generated your access token!
4. Take that access token and place it in your applications env file or equivalent so you do not have to continually generate a new access token (Instagrams access tokens do not expire as of today).
```javascript
social.initializeInstagram('YOUR_CODE_FROM_CALLBACK_URI')
.then(response => {
  console.log(response);
  instaAccessToken = response.access_token;
  res.status(201).json({ message: 'Access token generated successfully!' });
}, () => {
  res.status(400).json({ message: 'Error occurred generating Instagram access token.' });
});
```

##### Google
** Before you begin, make sure you have an endpoint set up for your redirect uri. See full example section below. **

1. In a web browser, navigate to https://accounts.google.com/o/oauth2/v2/auth?redirect_uri=YOUR_REDIRECT_URI&response_type=code&client_id=YOUR_CLIENT_IDscope=https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fplus.login&access_type=offline
2. Click "Allow"
3. In your console, you should now see an object with a field "refresh_token."
4. Copy that value and place it in your env file or equivalent.
5. Now we will need to get the user id of the profile you want to get the feed for. In a web browser, navigate to https://www.googleapis.com/plus/v1/people/me?access_token=YOUR_ACCESS_TOKEN. You will see a field called "id." That is your google user id. Place that in your env or equivalent.
```javascript
social.initializeGoogle(req.query.code)
.then(response => {
  console.log(response);
  gAccessToken = response.access_token;
  res.status(201).json({ message: 'Access token generated successfully!' });
}, () => {
  res.status(400).json({ message: 'Error occurred generating google access token.' });
});
```
##### Full
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
  google: {
    clientId: googleClientId,
    clientSecret: googleClientSecret,
    userId: googleUserId,
    redirectURI: googleRedirectURI,
    refreshToken: googleRefreshToken,
  },
});
```

### Full Example (with Express)

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
  googleClientId,
  googleClientSecret,
  googleRedirectURI,
  googleUserId,
  googleRefreshToken,
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
  google: {
    clientId: googleClientId,
    clientSecret: googleClientSecret,
    userId: googleUserId,
    redirectURI: googleRedirectURI,
    refreshToken: googleRefreshToken,
  },
});

let instaAccessToken = instagramAccessToken || '';

// TODO: add error logging
app.get('/v1/socialFeed', (req, res) => {
  const accessTokens = {
    instagram: instaAccessToken,
    google: gAccessToken,
  };
  social.getFeeds(accessTokens)
  .then(response => {
    res.status(200).json({ response });
  }, () => {
    res.status(400).json({ error: 'There was an error fetching feeds' });
  });
});

app.get('/v1/instaRedirect', (req, res) => {
  if (instaAccessToken) res.status(400).json({ message: 'Access token already generated' });
  if (req.query.code) {
    if (!instaAccessToken) {
      social.initializeInstagram(req.query.code)
      .then(response => {
        console.log(response);
        instaAccessToken = response.access_token;
        res.status(201).json({ message: 'Access token generated successfully!' });
      }, () => {
        res.status(400).json({ message: 'Error occurred generating instagram access token.' });
      });
    }
  } else {
    res.status(400).json({ error: 'An error occurred' });
  }
});

app.get('/v1/googleRedirect', (req, res) => {
  if (googleRefreshToken) res.status(400).json({ message: 'Refresh token already generated' });
  if (req.query.code) {
    if (!googleRefreshToken) {
      social.initializeGoogle(req.query.code)
      .then(response => {
        console.log(response);
        googleRefreshToken = response.refresh_token;
        res.status(201).json({ message: 'Google tokens generated successfully!' });
      }, () => {
        res.status(400).json({ message: 'Error occurred generating google tokens.' });
      });
    }
  } else {
    res.status(400).json({ error: 'An error occurred' });
  }
});

console.log('STARTING SERVER');
```
