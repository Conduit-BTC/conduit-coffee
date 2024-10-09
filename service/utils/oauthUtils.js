const axios = require('axios');
const qs = require('querystring');

let uspsOauthToken = null;
let uspsOauthTokenExpiry = null;

async function getOauthToken() {
  const token = await getTokenFromUsps();
  // Set the token to expire 5 minutes before the actual expiry
  if (!token) {
    throw new Error('Failed to obtain token from USPS');
  }
  uspsOauthTokenExpiry = Date.now() + token.expires_in * 1000 - 300000;
  uspsOauthToken = token;
  return token;
}

async function getTokenFromUsps() {
  const tokenUrl = 'https://api.usps.com/oauth2/v3/token';
  const clientId = process.env.USPS_CLIENT_ID;
  const clientSecret = process.env.USPS_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error('Missing USPS client ID or client secret');
  }

  const data = qs.stringify({
    grant_type: 'client_credentials',
    client_id: clientId,
    client_secret: clientSecret,
  });

  const config = {
    method: 'post',
    url: tokenUrl,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    data: data,
  };

  try {
    const response = await axios(config);
    return response.data;
  } catch (error) {
    console.error(
      'Error obtaining token from USPS:',
      error.response ? error.response.data : error.message,
    );
    throw error;
  }
}

module.exports = { getOauthToken, uspsOauthToken };
