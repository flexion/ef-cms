import queryString from 'query-string';

exports.queryStringDecoder = () => {
  const query = queryString.parse(location.search);
  const hash = queryString.parse(location.hash); // cognito uses a # instead of ?
  const code = query.code;
  const token = hash.id_token || query.token;
  const path = query.path || '/';

  return {
    code,
    path,
    token,
  };
};
