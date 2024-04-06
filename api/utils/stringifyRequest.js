function stringifyRequest(req) {
  const { method, url, headers, params, query, body } = req;

  const requestDetails = {
    method,
    url,
    headers,
    params,
    query,
    body,
  };

  return JSON.stringify(requestDetails, null, 2);
}

module.exports = { stringifyRequest };
