function withTimeout(promise, ms = 15000) {
  return Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error('SerpApi request timed out')), ms)
    )
  ]);
}

module.exports = { withTimeout };