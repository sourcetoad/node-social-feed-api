export default class API {
  /**
   * Normalizes data to make it consistent for all social networks
   *
   * @param {string} network Type of social network (facebook|twitter|instagram|google)
   * @param {array} data Data to normalize
   */
  static normalize(network, data) {
    const items = [];
    // TODO: make these fields more customizable
    if (network === 'facebook') {
      for (let i = 0; i < data.length; i++) {
        items.push({
          id: data[i].id,
          text: data[i].message,
          created_at: data[i].created_time
        });
      }
    } else if (network === 'twitter') {
      for (let i = 0; i < data.length; i++) {
        items.push({
          id: data[i].id,
          text: data[i].text,
          created_at: new Date(data[i].created_at).toISOString(),
          media: data[i].entities.media ? {
            images: {
              standard: data[i].entities.media[0].media_url_https,
            },
          } : null,
        });
      }
    } else if (network === 'instagram') {
      for (let i = 0; i < data.length; i++) {
        items.push({
          id: data[i].id,
          text: data[i].caption.text,
          created_at: new Date(parseFloat(data[i].caption.created_time, 10) * 1000).toISOString(),
          media: {
            images: {
              low: data[i].images.low_resolution.url,
              standard: data[i].images.standard_resolution.url,
              thumbnail: data[i].images.thumbnail.url,
            },
            videos: data[i].type === 'video' ? {
              low_bandwidth: data[i].videos.low_bandwidth.url,
              standard: data[i].videos.standard_resolution.url,
              low: data[i].videos.low_resolution.url,
            } : null,
          },
        });
      }
    } else if (network === 'google') {
      for (let i = 0; i < data.length; i++) {
        items.push({
          id: data[i].id,
          text: data[i].object.content,
          created_at: data[i].published,
        });
      }
    }

    return {
      _meta: {
        count: data.length,
      },
      items,
    };
  }
}
