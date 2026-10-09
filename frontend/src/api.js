const BASE_URL = 'http://localhost:5000';

/**
 * Fetch a seller's Instagram profile.
 * @param {string} handle — Instagram handle without @
 * @returns {Promise<object>} — { profile: { ... } }
 */
export async function getProfile(handle) {
  const res = await fetch(`${BASE_URL}/api/profile/get-profile`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ handle }),
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || 'Something went wrong — please try again.');
  }

  return res.json();
}

/**
 * Start a trust investigation for a seller + product.
 * @param {object} params
 * @param {string} params.handle
 * @param {string} params.imageUrl — serpapi_display_url of the chosen post
 * @param {number} params.askingPrice
 * @param {string} params.brandName
 * @param {string} [params.addressQuery] — optional claimed address
 * @returns {Promise<object>} — investigation report
 */
export async function startInvestigation({ handle, imageUrl, askingPrice, brandName, addressQuery }) {
  const payload = { handle, imageUrl, askingPrice, brandName };
  if (addressQuery) payload.addressQuery = addressQuery;

  const res = await fetch(`${BASE_URL}/api/investigate/start-investigation`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || 'Investigation failed — please try again.');
  }

  return res.json();
}
