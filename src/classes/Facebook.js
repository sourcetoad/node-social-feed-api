import request from 'request';

export default class Facebook {
  /**
   * @param {string} appId
   * @param {string} appSecret
   * @param {string} pageId
   */
  constructor(appId, appSecret, pageId) {
    this.accessToken = null;
    this.data = {
      appId: appId || null,
      appSecret: appSecret || null,
      pageId: pageId || null,
    };
  }

  /**
   * Generates an access token from facebook
   *
   * @return {Promise}
   */
  getAccessToken() {
    return new Promise((fulfill, reject) => {
      request(`https://graph.facebook.com/oauth/access_token?grant_type=client_credentials&client_id=${this.data.appId}&client_secret=${this.data.appSecret}`,
        (error, response, body) => {
          if (error) reject(error);
          if (response.statusCode === 200) {
            this.accessToken = JSON.parse(body).access_token;
            fulfill();
          }
        },
      );
    });
  }

  /**
   * Fetches feed from facebook
   *
   * @return Promise
   */
  getFeed() {
    return new Promise((fulfill, reject) => {
      request(`https://graph.facebook.com/${this.data.pageId}/feed?access_token=${this.accessToken}`, (error, response, body) => {
        if (error) reject(error);
        if (response.statusCode === 200) fulfill(body);
      });
    });
  }

  /**
   * Method called from server
   *
   * @return Promise
   */
  fetch() {
    return new Promise(fulfill => {
      // If no access token yet, get one
      if (this.accessToken === null) {
        this.getAccessToken()
        .then(() => {
          return this.getFeed();
        }, err => {
          throw new Error(err);
        })
        .then(res => {
          fulfill(res);
        }, err => {
          throw new Error(err);
        });
      } else {
        this.getFeed()
        .then(res => {
          fulfill(res);
        }, err => {
          throw new Error(err);
        });
      }
    });
  }
}
