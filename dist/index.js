'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Facebook = require('./classes/Facebook');

var _Facebook2 = _interopRequireDefault(_Facebook);

var _Twitter = require('./classes/Twitter');

var _Twitter2 = _interopRequireDefault(_Twitter);

var _Instagram = require('./classes/Instagram');

var _Instagram2 = _interopRequireDefault(_Instagram);

var _Google = require('./classes/Google');

var _Google2 = _interopRequireDefault(_Google);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var SocialFeedAPI = function () {
  /**
   * @param {object} config
   */
  function SocialFeedAPI(config) {
    _classCallCheck(this, SocialFeedAPI);

    if (config.facebook) {
      this.facebook = new _Facebook2.default(config.facebook.appId, config.facebook.appSecret, config.facebook.pageId, config.facebook.image);
    }
    if (config.twitter) {
      this.twitter = new _Twitter2.default(config.twitter.consumerKey, config.twitter.consumerSecret, config.twitter.accessTokenKey, config.twitter.accessTokenSecret, config.twitter.screenName, config.twitter.options);
    }
    if (config.instagram) {
      this.instagram = new _Instagram2.default(config.instagram.clientId, config.instagram.clientSecret, config.instagram.userId, config.instagram.redirectURI, config.instagram.accessToken);
    }
    if (config.google) {
      this.google = new _Google2.default(config.google.clientId, config.google.clientSecret, config.google.userId, config.google.redirectURI, config.google.refreshToken);
    }
  }

  /**
   * Generates an access token from instagram which is required
   *
   * @return {Promise}
   */


  _createClass(SocialFeedAPI, [{
    key: 'initializeInstagram',
    value: function initializeInstagram(code) {
      var _this = this;

      return new Promise(function (fulfill, reject) {
        _this.instagram.initialize(code).then(function (res) {
          console.log(res);
          fulfill(res);
        }, function (err) {
          console.log(err);
          reject(err);
        });
      });
    }

    /**
     * Generates an access token from Google which is required
     *
     * @return {Promise}
     */

  }, {
    key: 'initializeGoogle',
    value: function initializeGoogle(code) {
      var _this2 = this;

      return new Promise(function (fulfill, reject) {
        _this2.google.initialize(code).then(function (res) {
          fulfill(res);
        }, function (err) {
          reject(err);
        });
      });
    }

    /**
     * Aggregates all social media feeds
     *
     * @param {object} accessTokens DEPRECATED: object of accessTokens
     * @return {Promise}
     */

  }, {
    key: 'getFeeds',
    value: function getFeeds(accessTokens) {
      var _this3 = this;

      if (accessTokens) console.warn('NOTE: passing access tokens to getFeeds is now deprecated. Pass access token in constructor. See readme.md');
      var instagram = null;
      if (this.instagram) {
        instagram = accessTokens ? this.instagram.fetch(accessTokens.instagram) : this.instagram.fetch();
      }
      return new Promise(function (fulfill, reject) {
        Promise.all([_this3.facebook ? _this3.facebook.fetch() : Promise.resolve(null), _this3.twitter ? _this3.twitter.fetch() : Promise.resolve(null), _this3.instagram ? instagram : Promise.resolve(null), _this3.google ? _this3.google.fetch() : Promise.resolve(null)]).then(function (res) {
          fulfill({
            facebook: res[0] || {},
            twitter: res[1] || {},
            instagram: res[2] || {},
            google: res[3] || {}
          });
        }, function (err) {
          reject(err);
        });
      });
    }
  }]);

  return SocialFeedAPI;
}();

exports.default = SocialFeedAPI;