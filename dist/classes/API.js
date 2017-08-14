'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var API = function () {
  function API() {
    _classCallCheck(this, API);
  }

  _createClass(API, null, [{
    key: 'normalize',

    /**
     * Normalizes data to make it consistent for all social networks
     *
     * @param {string} network Type of social network (facebook|twitter|instagram|google)
     * @param {array} data Data to normalize
     */
    value: function normalize(network, data) {
      var items = [];
      // TODO: make these fields more customizable
      // TODO: loop through all attachments
      if (network === 'facebook') {
        for (var i = 1; i < data.length; i++) {
          items.push({
            id: data[i].id,
            text: data[i].message,
            created_at: data[i].created_time,
            media: data[i].attachments && data[i].attachments.data[0] ? {
              images: data[i].attachments.data[0].type === 'photo' ? {
                standard: data[i].attachments.data[0].url
              } : {},
              videos: data[i].attachments.data[0].type === 'video_inline' ? {
                standard: data[i].attachments.data[0].url
              } : {},
              share: data[i].attachments.data[0].type === 'share' ? {
                standard: data[i].attachments.data[0].url
              } : {}
            } : {}
          });
        }
      } else if (network === 'twitter') {
        for (var _i = 1; _i < data.length; _i++) {
          items.push({
            id: data[_i].id,
            text: data[_i].text,
            created_at: new Date(data[_i].created_at).toISOString(),
            media: data[_i].entities.media ? {
              images: {
                standard: data[_i].entities.media[0].media_url_https
              }
            } : {}
          });
        }
      } else if (network === 'instagram') {
        for (var _i2 = 1; _i2 < data.length; _i2++) {
          items.push({
            id: data[_i2].id,
            text: data[_i2].caption ? data[_i2].caption.text : null,
            created_at: data[_i2].caption ? new Date(parseFloat(data[_i2].caption.created_time, 10) * 1000).toISOString() : null,
            media: {
              images: {
                low: data[_i2].images.low_resolution.url,
                standard: data[_i2].images.standard_resolution.url,
                thumbnail: data[_i2].images.thumbnail.url
              },
              videos: data[_i2].type === 'video' ? {
                low_bandwidth: data[_i2].videos.low_bandwidth.url,
                standard: data[_i2].videos.standard_resolution.url,
                low: data[_i2].videos.low_resolution.url
              } : {}
            }
          });
        }
      } else if (network === 'google') {
        for (var _i3 = 1; _i3 < data.length; _i3++) {
          items.push({
            id: data[_i3].id,
            text: data[_i3].object.content,
            created_at: data[_i3].published,
            media: {
              images: data[_i3].object.attachments[0].objectType === 'photo' ? {
                standard: data[_i3].object.attachments[0].url
              } : {},
              videos: data[_i3].object.attachments[0].objectType === 'video' ? {
                standard: data[_i3].object.attachments[0].url
              } : {}
            }
          });
        }
      }

      return {
        _meta: {
          count: data.length - 1
        },
        account: data[0],
        items: items
      };
    }
  }]);

  return API;
}();

exports.default = API;