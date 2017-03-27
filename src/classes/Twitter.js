import TwitterAPI from 'twitter';

export default class Twitter {
  /**
   * @param {string} consumerKey
   * @param {string} consumerSecret
   * @param {string} accessTokenKey
   * @param {string} accessTokenSecret
   * @param {string} screenName
   */
  constructor(consumerKey, consumerSecret, accessTokenKey, accessTokenSecret, screenName) {
    this.screenName = screenName;
    this.client = new TwitterAPI({
      consumer_key: consumerKey,
      consumer_secret: consumerSecret,
      access_token_key: accessTokenKey,
      access_token_secret: accessTokenSecret,
    });
  }

  /**
   * Calls twitters API and gets tweets
   *
   * @return {Promise}
   */
  fetch() {
    return new Promise((fulfill, reject) => {
      this.client.get('statuses/user_timeline', { screen_name: this.screenName }, (err, tweets, res) => {
        if (err) reject(err);
        if (res.statusCode === 200) fulfill(tweets);
      });
    });
  }
}
