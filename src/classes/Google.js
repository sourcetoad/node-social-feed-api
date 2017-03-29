import request from 'request';

export default class Google {
  constructor(clientId, clientSecret, userId, redirectURI) {
    this.data = {
      clientId,
      clientSecret,
      userId,
      redirectURI,
      accessToken: null,
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
      request.post('https://www.googleapis.com/oauth2/v4/token', {
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

  fetch(accessToken) {
    return new Promise((fulfill, reject) => {
      request.get(`https://www.googleapis.com/plus/v1/people/${this.data.userId}/activities/public?access_token=${accessToken}`,
        (err, response, body) => {
          // console.log(response);
          if (err || response.statusCode >= 400) {
            reject(err || body);
          } else {
            fulfill(JSON.parse(body).items);
          }
        });
    });
  }
}
