'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Facebook = require('./classes/Facebook');

var _Facebook2 = _interopRequireDefault(_Facebook);

var _Twitter = require('./classes/Twitter');

var _Twitter2 = _interopRequireDefault(_Twitter);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var SocialFeedAPI = function () {
  /**
   * @param {object} fb
   * @param {object} twitter
   */
  function SocialFeedAPI(config) {
    _classCallCheck(this, SocialFeedAPI);

    this.facebook = new _Facebook2.default(config.facebook.appId, config.facebook.appSecret, config.facebook.pageId);
    this.twitter = new _Twitter2.default(config.twitter.consumerKey, config.twitter.consumerSecret, config.twitter.accessTokenKey, config.twitter.accessTokenSecret, config.twitter.screenName);
  }

  /**
   * @return {Promise}
   */


  _createClass(SocialFeedAPI, [{
    key: 'getFeeds',
    value: function getFeeds() {
      var _this = this;

      return new Promise(function (fulfill) {
        var output = {
          facebook: {},
          twitter: {},
          instagram: {},
          google: {}
        };

        Promise.all([_this.facebook.fetch(), _this.twitter.fetch()]).then(function (res) {
          output.facebook = res[0];
          output.twitter = res[1];
          fulfill(output);
        }, function (err) {
          throw new Error(err);
        });
      });
    }
  }]);

  return SocialFeedAPI;
}();

exports.default = SocialFeedAPI;