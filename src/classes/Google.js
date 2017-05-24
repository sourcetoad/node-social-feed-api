import request from 'request';
import API from './API';

export default class Google {
  /**
   * @param {string} clientId
   * @param {string} clientSecret
   * @param {string} userId
   * @param {string} redirectURI
   */
  constructor(clientId, clientSecret, userId, redirectURI, refreshToken) {
    this.data = {
      clientId,
      clientSecret,
      userId,
      redirectURI,
      refreshToken,
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
    return new Promise(fulfill => {
      request.post('https://www.googleapis.com/oauth2/v4/token', {
        form: {
          client_id: this.data.clientId,
          client_secret: this.data.clientSecret,
          grant_type: 'authorization_code',
          redirect_uri: this.data.redirectURI,
          code,
        },
      }, (error, response, body) => {
        if (error || response.statusCode >= 400) {
          fulfill({ error });
        } else {
          fulfill(body);
        }
      });
    });
  }

  /**
   * Refreshes access token which is required by Google
   *
   * @return {Promise}
   */
  refreshAccessToken() {
    return new Promise((fulfill, reject) => {
      request.post('https://www.googleapis.com/oauth2/v4/token', {
        form: {
          refresh_token: this.data.refreshToken,
          client_id: this.data.clientId,
          client_secret: this.data.clientSecret,
          grant_type: 'refresh_token',
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
   * Calls Google's API and gets posts
   * Access tokens last one hour
   *
   * @param {string} accessToken
   */
  fetch() {
    return new Promise((fulfill, reject) => {
      this.refreshAccessToken()
      .then(res => {
        const token = JSON.parse(res).access_token;
        request.get(`https://www.googleapis.com/plus/v1/people/${this.data.userId}/activities/public?access_token=${token}`,
          (err, response, body) => {
            if (err || response.statusCode >= 400) {
              reject({
                source: 'google',
                error: err || body,
              });
            } else {
              const output = JSON.parse(body).items;
              output.unshift({
                id: output[0].actor.id,
                name: output[0].actor.displayName,
                profileImage: output[0].actor.image.url,
              });
              fulfill(API.normalize('google', output));
            }
        });
      });
    });
  }
}
