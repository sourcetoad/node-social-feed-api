import Facebook from './classes/Facebook';
import Twitter from './classes/Twitter';

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
  }

  /**
   * @return {Promise}
   */
  getFeeds() {
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
      ])
      .then(res => {
        output.facebook = res[0];
        output.twitter = res[1];
        fulfill(output);
      }, err => {
        throw new Error(err);
      });
    });
  }
}
