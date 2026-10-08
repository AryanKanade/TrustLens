const { getJson } = require("serpapi");

function getInstagramProfile(handle) {
  return new Promise((resolve, reject) => {
    getJson({
      engine: "instagram_profile",
      profile_id: handle,
      api_key: process.env.SERPAPI_KEY
    }, (json) => {
      if (json.error) {
        reject(new Error(json.error));
      } else {
        resolve(json.profile_results);
      }
    });
  });
}

function getLensMatches(imageUrl){
  return new Promise((resolve, reject) => {
    getJson({
      engine: "google_lens",
      url: imageUrl,
      api_key: process.env.SERPAPI_KEY
    }, (json) => {
      if (json.error) {
        reject(new Error(json.error));
      } else {
        resolve(json.visual_matches);
      }
    });
  });
}

module.exports = { getInstagramProfile , getLensMatches };