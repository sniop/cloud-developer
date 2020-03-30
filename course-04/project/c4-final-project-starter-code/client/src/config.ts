// TODO: Once your application is deployed, copy an API id here so that the frontend could interact with it
const apiId = '...'
export const apiEndpoint = `https://rrevnxey3k.execute-api.us-east-2.amazonaws.com/dev`
// export const apiEndpoint = `http://localhost:3003`

export const authConfig = {
  // DONE: Create an Auth0 application and copy values from it into this map
  domain: 'dev-x8u69k6f.eu.auth0.com',            // Auth0 domain
  clientId: 'oxvNP0eh7Oy207W90a1nIaDdy6t2Gm37',          // Auth0 client id
  callbackUrl: 'http://localhost:3000/callback'
}
