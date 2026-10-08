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

function getShoppingResults(query){
  return new Promise((resolve, reject) => {
    getJson({
      engine: "google_shopping",
      q: query,
      gl: "in",
      hl: "en",
      api_key: process.env.SERPAPI_KEY
    }, (json) => {
      if (json.error) {
        reject(new Error(json.error));
      } else {
        resolve(json.shopping_results);
      }
    })
  })
}

function getForumResults(query){
  return new Promise((resolve, reject) => {
    getJson({
      engine: "google_forums",
      q: query,
      api_key: process.env.SERPAPI_KEY
    }, (json) => {
      if (json.error) {
        reject(new Error(json.error));
      } else {
        resolve(json.forum_results);
      }
    })
  })
}

function getNewsResults(query){
  return new Promise((resolve, reject) => {
    getJson({
      engine: "google_news",
      q: query,
      gl: "in",
      hl: "en",
      api_key: process.env.SERPAPI_KEY
    }, (json) => {
      if (json.error) {
        reject(new Error(json.error));
      } else {
        resolve(json.news_results);
      }
    })
  })
}

function searchMapsPlace(query){
  return new Promise((resolve, reject) => {
    getJson({
      engine: "google_maps",
      q: query,
      api_key: process.env.SERPAPI_KEY
    }, (json) => {
      if (json.error) {
        reject(new Error(json.error));
      } else {
        resolve(json.local_results);
      }
    })
  })
}

function getMapsReviews(dataId){
  return new Promise((resolve, reject) => {
    getJson({
      engine: "google_maps_reviews",
      data_id: dataId,
      api_key: process.env.SERPAPI_KEY
    }, (json) => {
      if (json.error) {
        reject(new Error(json.error));
      } else {
        resolve(json.reviews);
      }
    })
  })
}

module.exports = { getInstagramProfile , getLensMatches , getShoppingResults , getForumResults , getNewsResults, searchMapsPlace, getMapsReviews };