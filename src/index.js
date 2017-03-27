import Facebook from './classes/Facebook';
import Twitter from './classes/Twitter';

export default class SocialFeedAPI {
  /**
   * @param {object} fb
   * @param {object} twitter
   */
  constructor(fb, twitter) {
    this.facebook = new Facebook(fb.fbAppId, fb.fbAppSecret, fb.fbPageId);
    this.twitter = new Twitter(
      twitter.twitterConsumerKey,
      twitter.twitterConsumerSecret,
      twitter.twitterAccessTokenKey,
      twitter.twitterAccessTokenSecret,
      twitter.twitterScreenName,
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
      });
    });
  }
}
