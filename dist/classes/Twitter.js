'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _twitter = require('twitter');

var _twitter2 = _interopRequireDefault(_twitter);

var _API = require('./API');

var _API2 = _interopRequireDefault(_API);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Twitter = function () {
  /**
   * @param {string} consumerKey
   * @param {string} consumerSecret
   * @param {string} accessTokenKey
   * @param {string} accessTokenSecret
   * @param {string} screenName
   * @param {string} excludeReplies
   */
  function Twitter(consumerKey, consumerSecret, accessTokenKey, accessTokenSecret, screenName) {
    var options = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : { excludeReplies: false };

    _classCallCheck(this, Twitter);

    this.screenName = screenName;
    this.options = options;
    this.client = new _twitter2.default({
      consumer_key: consumerKey,
      consumer_secret: consumerSecret,
      access_token_key: accessTokenKey,
      access_token_secret: accessTokenSecret
    });
  }

  /**
   * Calls twitters API and gets tweets
   *
   * @return {Promise}
   */


  _createClass(Twitter, [{
    key: 'fetch',
    value: function fetch() {
      var _this = this;

      return new Promise(function (fulfill) {
        _this.client.get('statuses/user_timeline', {
          screen_name: _this.screenName,
          exclude_replies: Object.keys(_this.options).indexOf('excludeReplies') > -1 ? _this.options.excludeReplies : false,
          count: _this.options.count || 20,
          include_rts: Object.keys(_this.options).indexOf('includeRts') > -1 ? _this.options.includeRts : true
        }, function (error, body, response) {
          if (error || response.statusCode >= 400) {
            fulfill({ error: error });
          } else {
            body.unshift({
              id: body[0].user.id_str,
              name: body[0].user.name,
              handle: body[0].user.screen_name,
              profileImage: body[0].user.profile_image_url_https
            });
            fulfill(_API2.default.normalize('twitter', body));
          }
        });
      });
    }
  }]);

  return Twitter;
}();

exports.default = Twitter;