import Facebook from './classes/Facebook';
import Twitter from './classes/Twitter';
import Instagram from './classes/Instagram';

export default class SocialFeedAPI {
  /**
   * @param {object} fb
   * @param {object} twitter
   */
  constructor(config) {
    this.facebook = new Facebook(
      config.facebook.appId,
      config.facebook.appSecret,
      config.facebook.pageId
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
   * @return {Promise}
   */
  getFeeds(instagramAccessToken) {
    return new Promise(fulfill => {
      const output = {
        facebook: {},
        twitter: {},
        instagram: {},
        google: {},
      };

      Promise.all([
        this.facebook.fetch(),
        this.twitter.fetch(),
        this.instagram.fetch(instagramAccessToken),
      ])
      .then(res => {
        output.facebook = res[0];
        output.twitter = res[1];
        output.instagram = res[2];
        fulfill(output);
      }, err => {
        throw new Error(err);
      });
    });
  }
}
