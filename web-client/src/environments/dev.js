// const API_URL = 'https://7wjn89p2z4.execute-api.us-east-1.amazonaws.com/dev/v1'; //for testing with dev on aws
const API_URL = 'http://localhost:3000/v1'; //for testing with npm run start:local in api - need to be logged into aws

/**
 * Context for the dev environment
 */
const dev = {
  getBaseUrl: () => {
    return API_URL;
  },
};

export default dev;
