import { CustomAuthorizerEvent, CustomAuthorizerResult } from 'aws-lambda'
import 'source-map-support/register'

import { verify } from 'jsonwebtoken'
import { createLogger } from '../../utils/logger'
import { JwtPayload } from '../../auth/JwtPayload'

const axios = require('axios').default;
const logger = createLogger('auth')

// DONE: Provide a URL that can be used to download a certificate that can be used
// to verify JWT token signature.
// To get this URL you need to go to an Auth0 page -> Show Advanced Settings -> Endpoints -> JSON Web Key Set
const jwksUrl = 'https://dev-x8u69k6f.eu.auth0.com/.well-known/jwks.json'

export const handler = async (event: CustomAuthorizerEvent
): Promise<CustomAuthorizerResult> => {
  logger.info('Authorizing a user')
  try {
    const jwtToken = await verifyToken(event.authorizationToken)
    logger.info('User was authorized')

    return createAuthorizationResult(jwtToken.sub, 'Allow')

  } catch (e) {
    logger.error('User not authorized', { error: e.message })

    return createAuthorizationResult('user', 'Deny')
  }
}

async function verifyToken(authHeader: string): Promise<JwtPayload> {

  const publicKey = await getPublicKeyFromJwksService();
  const token = getToken(authHeader)
  // const jwt: Jwt = decode(token, { complete: true }) as Jwt

  // DONE: Implement token verification
  // You should implement it similarly to how it was implemented for the exercise for the lesson 5
  // You can read more about how to do this here: https://auth0.com/blog/navigating-rs256-and-jwks/
  return verify(token, publicKey, { algorithms: ['RS256'] }) as JwtPayload
}

async function getPublicKeyFromJwksService(): Promise<string>{
  try{
    const jwksResponse = await axios.get(jwksUrl)
    const x5cCert = jwksResponse.data.keys[0].x5c[0]
    logger.info("x5c extracted from jwks",{'x5c':x5cCert})
    return base64ToPem(x5cCert)
  }catch(error){
    logger.error('failed to fetch cert from AUTH0-JWKS service', { error: error })
  }
}

function base64ToPem(base64EncodedCert:string): string{
  const prefix=`-----BEGIN CERTIFICATE-----\n`
  const suffix=`\n-----END CERTIFICATE-----`
  const pemCert = prefix+base64EncodedCert+suffix
  logger.info("converting to pem",{'pemCert':pemCert})
  return pemCert
}

function getToken(authHeader: string): string {
  if (!authHeader) throw new Error('No authentication header')

  if (!authHeader.toLowerCase().startsWith('bearer '))
    throw new Error('Invalid authentication header')

  const split = authHeader.split(' ')
  const token = split[1]

  return token
}

async function createAuthorizationResult(principalId: string, effect: string): Promise<CustomAuthorizerResult> {
  return {
    principalId: principalId,
    policyDocument: {
      Version: '2012-10-17',
      Statement: [
        {
          Action: 'execute-api:Invoke',
          Effect: effect,
          Resource: '*'
        }
      ]
    }
  }
}
