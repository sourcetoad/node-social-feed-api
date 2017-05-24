import request from 'request';
import API from './API';

export default class Facebook {
  /**
   * @param {string} appId
   * @param {string} appSecret
   * @param {string} pageId
   */
  constructor(appId, appSecret, pageId, profileImage) {
    this.accessToken = null;
    this.data = {
      appId: appId || null,
      appSecret: appSecret || null,
      pageId: pageId || null,
      profileImage: profileImage || null,
    };
    this.profileImageUrl = null;
  }

  /**
   * Generates an access token from facebook
   *
   * @return {Promise}
   */
  getAccessToken() {
    return new Promise(fulfill => {
      request(`https://graph.facebook.com/oauth/access_token?grant_type=client_credentials&client_id=${this.data.appId}&client_secret=${this.data.appSecret}`,
        (error, response, body) => {
          if (error) fulfill({ error });
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
   * @return {Promise}
   */
  getFeed() {
    return new Promise((fulfill, reject) => {
      // If picture is not set, get that first
      if (!this.profileImageUrl) {
        this.getProfileImage()
        .then(res => {
          this.profileImageUrl = res;
          request(`https://graph.facebook.com/${this.data.pageId}/posts?access_token=${this.accessToken}&fields=attachments,message,created_time,from`, (err, response, body) => {
            if (err || response.statusCode >= 400) {
              reject(err || body);
            } else {
              const output = JSON.parse(body).data;
              output.unshift({
                id: output[0].from.id,
                name: output[0].from.name,
                profileImage: this.profileImageUrl,
              });
              fulfill(output);
            }
          });
        });
      } else {
        request(`https://graph.facebook.com/${this.data.pageId}/posts?access_token=${this.accessToken}&fields=attachments,message,created_time,from`, (err, response, body) => {
          if (err || response.statusCode >= 400) {
            reject(err || body);
          } else {
            const output = JSON.parse(body).data;
            output.unshift({
              name: output[0].from.name,
              profileImage: this.profileImageUrl,
            });
            fulfill(output);
          }
        });
      }
    });
  }

  /**
   * Fetches profile picture
   */
  getProfileImage() {
    return new Promise((fulfill, reject) => {
      request(`https://graph.facebook.com/${this.data.pageId}/picture?access_token=${this.accessToken}&redirect=false&height=${this.data.profileImage.height}&width=${this.data.profileImage.width}`,
        (err, response, body) => {
          if (err || response.statusCode >= 400) {
            reject(err || body);
          } else {
            fulfill(JSON.parse(body).data.url);
          }
        });
    });
  }

  /**
   * Method called from server
   *
   * @return Promise
   */
  fetch() {
    return new Promise((fulfill, reject) => {
      // If no access token yet, get one
      if (this.accessToken === null) {
        this.getAccessToken()
        .then(() => {
          return this.getFeed();
        }, err => {
          throw new Error(err);
        })
        .then(res => {
          fulfill(API.normalize('facebook', res));
        }, err => {
          reject({
            source: 'facebook',
            error: err,
          });
        });
      } else {
        this.getFeed()
        .then(res => {
          fulfill(API.normalize('facebook', res));
        }, err => {
          reject({
            source: 'facebook',
            error: err,
          });
        });
      }
    });
  }
}
