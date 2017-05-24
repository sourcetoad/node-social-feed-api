import Facebook from './classes/Facebook';
import Twitter from './classes/Twitter';
import Instagram from './classes/Instagram';
import Google from './classes/Google';

export default class SocialFeedAPI {
  /**
   * @param {object} config
   */
  constructor(config) {
    if (config.facebook) {
      this.facebook = new Facebook(
        config.facebook.appId,
        config.facebook.appSecret,
        config.facebook.pageId,
        config.facebook.image,
      );
    }
    if (config.twitter) {
      this.twitter = new Twitter(
        config.twitter.consumerKey,
        config.twitter.consumerSecret,
        config.twitter.accessTokenKey,
        config.twitter.accessTokenSecret,
        config.twitter.screenName,
        config.twitter.options,
      );
    }
    if (config.instagram) {
      this.instagram = new Instagram(
        config.instagram.clientId,
        config.instagram.clientSecret,
        config.instagram.userId,
        config.instagram.redirectURI,
        config.instagram.accessToken,
      );
    }
    if (config.google) {
      this.google = new Google(
        config.google.clientId,
        config.google.clientSecret,
        config.google.userId,
        config.google.redirectURI,
        config.google.refreshToken,
      );
    }
  }

  /**
   * Generates an access token from instagram which is required
   *
   * @return {Promise}
   */
  initializeInstagram(code) {
    return new Promise((fulfill, reject) => {
      this.instagram.initialize(code)
      .then(res => {
        console.log(res);
        fulfill(res);
      }, err => {
        console.log(err);
        reject(err);
      });
    });
  }

  /**
   * Generates an access token from Google which is required
   *
   * @return {Promise}
   */
  initializeGoogle(code) {
    return new Promise((fulfill, reject) => {
      this.google.initialize(code)
      .then(res => {
        fulfill(res);
      }, err => {
        reject(err);
      });
    });
  }

  /**
   * Aggregates all social media feeds
   *
   * @param {object} accessTokens DEPRECATED: object of accessTokens
   * @return {Promise}
   */
  getFeeds(accessTokens) {
    if (accessTokens) console.warn('NOTE: passing access tokens to getFeeds is now deprecated. Pass access token in constructor. See readme.md');
    let instagram = null;
    if (this.instagram) {
      instagram = accessTokens ?
        this.instagram.fetch(accessTokens.instagram) : this.instagram.fetch();
    }
    return new Promise((fulfill, reject) => {
      Promise.all([
        this.facebook ? this.facebook.fetch() : Promise.resolve(null),
        this.twitter ? this.twitter.fetch() : Promise.resolve(null),
        this.instagram ? instagram : Promise.resolve(null),
        this.google ? this.google.fetch() : Promise.resolve(null),
      ])
      .then(res => {
        fulfill({
          facebook: res[0] || {},
          twitter: res[1] || {},
          instagram: res[2] || {},
          google: res[3] || {},
        });
      }, err => {
        reject(err);
      });
    });
  }
}
