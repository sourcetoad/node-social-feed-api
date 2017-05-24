import request from 'request';
import API from './API';

export default class Instagram {
  /**
   * @param {string} clientId
   * @param {string} clientSecret
   * @param {string} userId
   * @param {string} redirectURI
   */
  constructor(clientId, clientSecret, userId, redirectURI, accessToken) {
    this.data = {
      clientId,
      clientSecret,
      redirectURI,
      userId,
      accessToken: accessToken || null,
    };
  }

  /**
   * Generates an access token from instagram. Access tokens live forever.
   * BEST PRACTICE: log the access token and then store it in your env file.
   * Then you never have to call this method again.
   *
   * @param {string} code
   * @return {Promise}
   */
  initialize(code) {
    // If someway, somehow this is already set (which it shouldn't be at this point)
    if (this.data.accessToken !== null) return Promise.resolve(this.data.accessToken);
    return new Promise((fulfill, reject) => {
      request.post('https://api.instagram.com/oauth/access_token', {
        form: {
          client_id: this.data.clientId,
          client_secret: this.data.clientSecret,
          grant_type: 'authorization_code',
          redirect_uri: this.data.redirectURI,
          code,
        },
      }, (err, response, body) => {
        if (err || response.statusCode >= 400) {
          reject(err || body);
        } else {
          fulfill(body);
        }
      });
    });
  }

  /**
   * Calls instagram's api and gets user's latest posts
   *
   * @param {string} accessToken
   * @return {Promise}
   */
  fetch(token) {
    // DEPRECATED. Pass to constructor.
    const accessToken = token || this.data.accessToken;
    return new Promise(fulfill => {
      request(`https://api.instagram.com/v1/users/${this.data.userId}/media/recent/?access_token=${accessToken}`, (error, response, body) => {
        if (error || response.statusCode >= 400) {
          fulfill({
            error,
          });
        } else {
          const data = JSON.parse(body).data;
          data.unshift({
            id: data[0].user.id,
            name: data[0].user.full_name,
            handle: data[0].user.username,
            profileImage: data[0].user.profile_picture,
          });
          fulfill(API.normalize('instagram', data));
        }
      });
    });
  }
}
