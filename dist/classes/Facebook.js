'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _request = require('request');

var _request2 = _interopRequireDefault(_request);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Facebook = function () {
  /**
   * @param {string} appId
   * @param {string} appSecret
   * @param {string} pageId
   */
  function Facebook(appId, appSecret, pageId) {
    _classCallCheck(this, Facebook);

    this.accessToken = null;
    this.data = {
      appId: appId || null,
      appSecret: appSecret || null,
      pageId: pageId || null
    };
  }

  /**
   * Generates an access token from facebook
   *
   * @return {Promise}
   */


  _createClass(Facebook, [{
    key: 'getAccessToken',
    value: function getAccessToken() {
      var _this = this;

      return new Promise(function (fulfill, reject) {
        (0, _request2.default)('https://graph.facebook.com/oauth/access_token?grant_type=client_credentials&client_id=' + _this.data.appId + '&client_secret=' + _this.data.appSecret, function (error, response, body) {
          if (error) reject(error);
          if (response.statusCode === 200) {
            _this.accessToken = JSON.parse(body).access_token;
            fulfill();
          }
        });
      });
    }

    /**
     * Fetches feed from facebook
     *
     * @return Promise
     */

  }, {
    key: 'getFeed',
    value: function getFeed() {
      var _this2 = this;

      return new Promise(function (fulfill, reject) {
        (0, _request2.default)('https://graph.facebook.com/' + _this2.data.pageId + '/feed?access_token=' + _this2.accessToken, function (error, response, body) {
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

  }, {
    key: 'fetch',
    value: function fetch() {
      var _this3 = this;

      return new Promise(function (fulfill) {
        // If no access token yet, get one
        if (_this3.accessToken === null) {
          _this3.getAccessToken().then(function () {
            return _this3.getFeed();
          }, function (err) {
            throw new Error(err);
          }).then(function (res) {
            fulfill(res);
          }, function (err) {
            throw new Error(err);
          });
        } else {
          _this3.getFeed().then(function (res) {
            fulfill(res);
          }, function (err) {
            throw new Error(err);
          });
        }
      });
    }
  }]);

  return Facebook;
}();

exports.default = Facebook;