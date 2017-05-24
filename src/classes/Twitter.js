import TwitterAPI from 'twitter';
import API from './API';

export default class Twitter {
  /**
   * @param {string} consumerKey
   * @param {string} consumerSecret
   * @param {string} accessTokenKey
   * @param {string} accessTokenSecret
   * @param {string} screenName
   * @param {string} excludeReplies
   */
  constructor(consumerKey, consumerSecret, accessTokenKey, accessTokenSecret, screenName,
    options = { excludeReplies: false },
  ) {
    this.screenName = screenName;
    this.options = options;
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
    return new Promise(fulfill => {
      this.client.get('statuses/user_timeline', {
        screen_name: this.screenName,
        exclude_replies: Object.keys(this.options).indexOf('excludeReplies') > -1 ? this.options.excludeReplies : false,
        count: this.options.count || 20,
        include_rts: Object.keys(this.options).indexOf('includeRts') > -1 ? this.options.includeRts : true,
      },
        (error, body, response) => {
          if (error || response.statusCode >= 400) {
            fulfill({ error });
          } else {
            body.unshift({
              id: body[0].user.id_str,
              name: body[0].user.name,
              handle: body[0].user.screen_name,
              profileImage: body[0].user.profile_image_url_https,
            });
            fulfill(API.normalize('twitter', body));
          }
      });
    });
  }
}
