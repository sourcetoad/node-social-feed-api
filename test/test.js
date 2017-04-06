const env = process.env.NODE_ENV === 'testing' ? process.env : require('./env.js');
const chai = require('chai');
const chaiHttp = require('chai-http');
const assert = chai.assert;
const expect = chai.expect;
const SocialFeed = require('../dist/').default;

chai.use(chaiHttp);
const social = new SocialFeed({
  facebook: {
    appId: env.fbAppId,
    appSecret: env.fbAppSecret,
    pageId: env.fbPageId,
    image: {
      height: 100,
      width: 100,
    },
  },
  twitter: {
    consumerKey: env.twitterConsumerKey,
    consumerSecret: env.twitterConsumerSecret,
    accessTokenKey: env.twitterAccessTokenKey,
    accessTokenSecret: env.twitterAccessTokenSecret,
    screenName: env.twitterScreenName,
  },
  instagram: {
    clientId: env.instagramClientId,
    clientSecret: env.instagramClientSecret,
    redirectURI: env.instagramRedirectURI,
    userId: env.instagramUserId,
    accessToken: env.instagramAccessToken,
  },
  google: {
    clientId: env.googleClientId,
    clientSecret: env.googleClientSecret,
    userId: env.googleUserId,
    redirectURI: env.googleRedirectURI,
    refreshToken: env.googleRefreshToken,
  },
});

/**
 * Loops through feeds and tests each property
 * @param  {array} feeds Networks to tests
 * @param  {object} res Data returned from method
 */
function socialMediaParser(feeds, res) {
  for (let i = 0; i < feeds.length; i++) {
    assert.property(res, feeds[i], `${feeds[i]} property exists`);
    assert.property(res[feeds[i]], 'account', `${feeds[i]} account property exists`);
    assert.property(res[feeds[i]].account, 'name', `${feeds[i]} name property exists`);
    assert.property(res[feeds[i]].account, 'profileImage', `${feeds[i]} profileImage property exists`);
    assert.property(res[feeds[i]], 'items', `${feeds[i]} items property exists`);
    assert.property(res[feeds[i]], '_meta', `${feeds[i]} _meta property exists`);
    assert.isAbove(res[feeds[i]].items.length, 0, `Items returned from ${feeds[i]}`);
    if (feeds.indexOf('facebook') === -1) assert.notDeepProperty(res, 'facebook.items', 'facebook property should not exist');
    if (feeds.indexOf('twitter') === -1) assert.notDeepProperty(res, 'twitter.items', 'twitter property should not exist');
    if (feeds.indexOf('google') === -1) assert.notDeepProperty(res, 'google.items', 'google property should not exist');
    if (feeds.indexOf('instagram') === -1) assert.notDeepProperty(res, 'instagram.items', 'instagram property should not exist');
  }
}

describe('Test getFeeds() with all social networks', () => {
  it('should return successful with all sources', () => {
    return social.getFeeds()
      .then(res => {
        socialMediaParser(['facebook', 'twitter', 'instagram', 'google'], res);
      }, err => {
        console.error(`Error while fetching ${err.source}`, err);
      });
  });
});

describe('Test getFeeds() with just facebook', () => {
  const network = new SocialFeed({
    facebook: {
      appId: env.fbAppId,
      appSecret: env.fbAppSecret,
      pageId: env.fbPageId,
      image: {
        height: 100,
        width: 100,
      },
    },
  });
  it('should return with just facebook', () => {
    return network.getFeeds()
      .then(res => {
        socialMediaParser(['facebook'], res);
      });
  });
});

describe('Test getFeeds() with just twitter', () => {
  const network = new SocialFeed({
    twitter: {
      consumerKey: env.twitterConsumerKey,
      consumerSecret: env.twitterConsumerSecret,
      accessTokenKey: env.twitterAccessTokenKey,
      accessTokenSecret: env.twitterAccessTokenSecret,
      screenName: env.twitterScreenName,
      options: { excludeReplies: true }
    },
  });
  it('should return with just twitter', () => {
    return network.getFeeds()
      .then(res => {
        socialMediaParser(['twitter'], res);
      });
  });
});

describe('Test getFeeds() with just instagram', () => {
  const network = new SocialFeed({
    instagram: {
      clientId: env.instagramClientId,
      clientSecret: env.instagramClientSecret,
      redirectURI: env.instagramRedirectURI,
      userId: env.instagramUserId,
      accessToken: env.instagramAccessToken,
    },
  });
  it('should return with just instagram', () => {
    return network.getFeeds()
      .then(res => {
        socialMediaParser(['instagram'], res);
      });
  });

  it('should return ok with deprecated instagram method', () => {
    const instaDeprecated = new SocialFeed({
      instagram: {
        clientId: env.instagramClientId,
        clientSecret: env.instagramClientSecret,
        redirectURI: env.instagramRedirectURI,
        userId: env.instagramUserId,
      },
    });
    return instaDeprecated.getFeeds({ instagram: env.instagramAccessToken })
      .then(res => {
        socialMediaParser(['instagram'], res);
      });
  });
});

describe('Test getFeeds() with just google', () => {
  const network = new SocialFeed({
    google: {
      clientId: env.googleClientId,
      clientSecret: env.googleClientSecret,
      userId: env.googleUserId,
      redirectURI: env.googleRedirectURI,
      refreshToken: env.googleRefreshToken,
    },
  });
  it('should return with just google', () => {
    return network.getFeeds()
      .then(res => {
        socialMediaParser(['google'], res);
      });
  });
});
