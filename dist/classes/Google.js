'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _request = require('request');

var _request2 = _interopRequireDefault(_request);

var _API = require('./API');

var _API2 = _interopRequireDefault(_API);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Google = function () {
  /**
   * @param {string} clientId
   * @param {string} clientSecret
   * @param {string} userId
   * @param {string} redirectURI
   */
  function Google(clientId, clientSecret, userId, redirectURI, refreshToken) {
    _classCallCheck(this, Google);

    this.data = {
      clientId: clientId,
      clientSecret: clientSecret,
      userId: userId,
      redirectURI: redirectURI,
      refreshToken: refreshToken
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


  _createClass(Google, [{
    key: 'initialize',
    value: function initialize(code) {
      var _this = this;

      // If someway, somehow this is already set (which it shouldn't be at this point)
      if (this.data.accessToken !== null) return Promise.resolve(this.data.accessToken);
      return new Promise(function (fulfill) {
        _request2.default.post('https://www.googleapis.com/oauth2/v4/token', {
          form: {
            client_id: _this.data.clientId,
            client_secret: _this.data.clientSecret,
            grant_type: 'authorization_code',
            redirect_uri: _this.data.redirectURI,
            code: code
          }
        }, function (error, response, body) {
          if (error || response.statusCode >= 400) {
            fulfill({ error: error });
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

  }, {
    key: 'refreshAccessToken',
    value: function refreshAccessToken() {
      var _this2 = this;

      return new Promise(function (fulfill, reject) {
        _request2.default.post('https://www.googleapis.com/oauth2/v4/token', {
          form: {
            refresh_token: _this2.data.refreshToken,
            client_id: _this2.data.clientId,
            client_secret: _this2.data.clientSecret,
            grant_type: 'refresh_token'
          }
        }, function (err, response, body) {
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

  }, {
    key: 'fetch',
    value: function fetch() {
      var _this3 = this;

      return new Promise(function (fulfill, reject) {
        _this3.refreshAccessToken().then(function (res) {
          var token = JSON.parse(res).access_token;
          _request2.default.get('https://www.googleapis.com/plus/v1/people/' + _this3.data.userId + '/activities/public?access_token=' + token, function (err, response, body) {
            if (err || response.statusCode >= 400) {
              reject({
                source: 'google',
                error: err || body
              });
            } else {
              var output = JSON.parse(body).items;
              output.unshift({
                id: output[0].actor.id,
                name: output[0].actor.displayName,
                profileImage: output[0].actor.image.url
              });
              fulfill(_API2.default.normalize('google', output));
            }
          });
        });
      });
    }
  }]);

  return Google;
}();

exports.default = Google;