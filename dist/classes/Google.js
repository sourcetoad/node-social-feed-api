'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _request = require('request');

var _request2 = _interopRequireDefault(_request);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Google = function () {
  /**
   * @param {string} clientId
   * @param {string} clientSecret
   * @param {string} userId
   * @param {string} redirectURI
   */
  function Google(clientId, clientSecret, userId, redirectURI) {
    _classCallCheck(this, Google);

    this.data = {
      clientId: clientId,
      clientSecret: clientSecret,
      userId: userId,
      redirectURI: redirectURI,
      accessToken: null
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
      return new Promise(function (fulfill, reject) {
        _request2.default.post('https://www.googleapis.com/oauth2/v4/token', {
          form: {
            client_id: _this.data.clientId,
            client_secret: _this.data.clientSecret,
            grant_type: 'authorization_code',
            redirect_uri: _this.data.redirectURI,
            code: code
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
     *
     * @param {string} accessToken
     */

  }, {
    key: 'fetch',
    value: function fetch(accessToken) {
      var _this2 = this;

      return new Promise(function (fulfill, reject) {
        _request2.default.get('https://www.googleapis.com/plus/v1/people/' + _this2.data.userId + '/activities/public?access_token=' + accessToken, function (err, response, body) {
          // console.log(response);
          if (err || response.statusCode >= 400) {
            reject(err || body);
          } else {
            fulfill(JSON.parse(body).items);
          }
        });
      });
    }
  }]);

  return Google;
}();

exports.default = Google;