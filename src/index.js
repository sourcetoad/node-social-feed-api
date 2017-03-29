import Facebook from './classes/Facebook';
import Twitter from './classes/Twitter';
import Instagram from './classes/Instagram';
import Google from './classes/Google'

export default class SocialFeedAPI {
  /**
   * @param {object} config
   */
  constructor(config) {
    this.facebook = new Facebook(
      config.facebook.appId,
      config.facebook.appSecret,
      config.facebook.pageId,
    );
    this.twitter = new Twitter(
      config.twitter.consumerKey,
      config.twitter.consumerSecret,
      config.twitter.accessTokenKey,
      config.twitter.accessTokenSecret,
      config.twitter.screenName,
    );
    this.instagram = new Instagram(
      config.instagram.clientId,
      config.instagram.clientSecret,
      config.instagram.redirectURI,
    );
    this.google = new Google(
      config.google.clientId,
      config.google.clientSecret,
      config.google.userId,
      config.google.redirectURI,
    );
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
        fulfill(res);
      }, err => {
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
   * @return {Promise}
   */
  getFeeds(accessTokens) {
    return new Promise((fulfill, reject) => {
      const output = {
        facebook: {},
        twitter: {},
        instagram: {},
        google: {},
      };

      Promise.all([
        this.facebook.fetch(),
        this.twitter.fetch(),
        this.instagram.fetch(accessTokens.instagram),
        this.google.fetch(accessTokens.google),
      ])
      .then(res => {
        output.facebook = res[0];
        output.twitter = res[1];
        output.instagram = res[2];
        output.google = res[3];
        fulfill(output);
      }, err => {
        reject(err);
      });
    });
  }
}
