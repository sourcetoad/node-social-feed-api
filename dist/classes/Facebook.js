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

var Facebook = function () {
  /**
   * @param {string} appId
   * @param {string} appSecret
   * @param {string} pageId
   */
  function Facebook(appId, appSecret, pageId, profileImage) {
    _classCallCheck(this, Facebook);

    this.accessToken = null;
    this.data = {
      appId: appId || null,
      appSecret: appSecret || null,
      pageId: pageId || null,
      profileImage: profileImage || null
    };
    this.profileImageUrl = null;
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

      return new Promise(function (fulfill) {
        (0, _request2.default)('https://graph.facebook.com/oauth/access_token?grant_type=client_credentials&client_id=' + _this.data.appId + '&client_secret=' + _this.data.appSecret, function (error, response, body) {
          if (error) fulfill({ error: error });
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
     * @return {Promise}
     */

  }, {
    key: 'getFeed',
    value: function getFeed() {
      var _this2 = this;

      return new Promise(function (fulfill, reject) {
        // If picture is not set, get that first
        if (!_this2.profileImageUrl) {
          _this2.getProfileImage().then(function (res) {
            _this2.profileImageUrl = res;
            (0, _request2.default)('https://graph.facebook.com/' + _this2.data.pageId + '/posts?access_token=' + _this2.accessToken + '&fields=attachments,message,created_time,from', function (err, response, body) {
              if (err || response.statusCode >= 400) {
                reject(err || body);
              } else {
                var output = JSON.parse(body).data;
                output.unshift({
                  id: output[0].from.id,
                  name: output[0].from.name,
                  profileImage: _this2.profileImageUrl
                });
                fulfill(output);
              }
            });
          });
        } else {
          (0, _request2.default)('https://graph.facebook.com/' + _this2.data.pageId + '/posts?access_token=' + _this2.accessToken + '&fields=attachments,message,created_time,from', function (err, response, body) {
            if (err || response.statusCode >= 400) {
              reject(err || body);
            } else {
              var output = JSON.parse(body).data;
              output.unshift({
                name: output[0].from.name,
                profileImage: _this2.profileImageUrl
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

  }, {
    key: 'getProfileImage',
    value: function getProfileImage() {
      var _this3 = this;

      return new Promise(function (fulfill, reject) {
        (0, _request2.default)('https://graph.facebook.com/' + _this3.data.pageId + '/picture?access_token=' + _this3.accessToken + '&redirect=false&height=' + _this3.data.profileImage.height + '&width=' + _this3.data.profileImage.width, function (err, response, body) {
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

  }, {
    key: 'fetch',
    value: function fetch() {
      var _this4 = this;

      return new Promise(function (fulfill, reject) {
        // If no access token yet, get one
        if (_this4.accessToken === null) {
          _this4.getAccessToken().then(function () {
            return _this4.getFeed();
          }, function (err) {
            throw new Error(err);
          }).then(function (res) {
            fulfill(_API2.default.normalize('facebook', res));
          }, function (err) {
            reject({
              source: 'facebook',
              error: err
            });
          });
        } else {
          _this4.getFeed().then(function (res) {
            fulfill(_API2.default.normalize('facebook', res));
          }, function (err) {
            reject({
              source: 'facebook',
              error: err
            });
          });
        }
      });
    }
  }]);

  return Facebook;
}();

exports.default = Facebook;