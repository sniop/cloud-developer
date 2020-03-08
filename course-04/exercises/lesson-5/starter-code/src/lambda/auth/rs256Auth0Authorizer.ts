
import { CustomAuthorizerEvent, CustomAuthorizerResult } from 'aws-lambda'
import 'source-map-support/register'
import { verify } from 'jsonwebtoken'
import { JwtToken } from '../../auth/JwtToken'

export const handler = async (event: CustomAuthorizerEvent): Promise<CustomAuthorizerResult> => {

  const cert = `-----BEGIN CERTIFICATE-----
MIIDDTCCAfWgAwIBAgIJdCWZwowm08UpMA0GCSqGSIb3DQEBCwUAMCQxIjAgBgNV
BAMTGWRldi14OHU2OWs2Zi5ldS5hdXRoMC5jb20wHhcNMjAwMzA0MjIzMzAyWhcN
MzMxMTExMjIzMzAyWjAkMSIwIAYDVQQDExlkZXYteDh1NjlrNmYuZXUuYXV0aDAu
Y29tMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAvzJ6cu8pweY0xSzY
wXwK+oKxtHR4Z6RSlQIhM3+iEiijBUb4yFG3wtDfhoI7zlmK729Gh2TWWpGuleEH
S5CNIDWPIfp5uUuZ3gFG1qqG6qmUhj6ycUWeEqwnQ5PnO6ji32XUKXXw9hDJ+KxC
JHKJGRnPsm/oRBKA1rm+9+SsghBw4DYrpLvim+ryEhTB3+9Ojk/SUgEp0IVrj6TV
dMc9H2u8ScOE0+4rFZXNS2hPczlcdU8aD/7uNbBYh2qtamVZuGADSzRkls1MdD5B
Idyxgi+58NOZ87+miE4IAONg4sm1rqIZfHOemygIgX1Ixpb+RYErMtfRxm2h14ze
+0gKnwIDAQABo0IwQDAPBgNVHRMBAf8EBTADAQH/MB0GA1UdDgQWBBSCJh8zdCYL
Ix69+zUBn5T2zHeCrzAOBgNVHQ8BAf8EBAMCAoQwDQYJKoZIhvcNAQELBQADggEB
ADgK3P4QjxgOBEYWgiu4yzySo+k5+L9DRTR1m4VPqd84t1R/0iD+2p/9rhPPFJnL
yCR6dCUR7Drsf9urR2cBUDtNCU+KEx+rNHiKmVDbC6Bl/puea+fZhhs7lR+ZQ6Fc
H7m4XTS9NbxdKtqwDkN2tUtWZTEm34ZCPmyCL9dZvKotxA5FTuqhDKz3RsFArn38
JrcJ9TU//DPjb2qiNfnbINJRXNkOb0btFH0VJ+flG4C+XKlMrp2LOl6K6XroJxaP
Vgaij7otjAhtCln/G3UAx+MJ8pQfhTpvqufiU54AEmhBMUxrpz+WkopHoGUqH7G5
nKFoTdAqT85z3YROmsGCnqo=
-----END CERTIFICATE-----`
  try {

    const decodedToken = verifyToken(event.authorizationToken, cert)

    console.log('User was authorized', decodedToken)

    return createPolicyDocument(decodedToken.sub, 'Allow')

  } catch (e) {
    console.log('User was not authorized', e.message)

    return createPolicyDocument('unknownUser', 'Deny')
  }
}

function createPolicyDocument(userId: string, effect: string) {
  console.log('Creating Policy Document with effect='+effect)
  return {
    principalId: userId,
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

function verifyToken(authHeader: string, cert: string): JwtToken {
  console.log('verifying auth-header=', authHeader)
  if (!authHeader)
    throw new Error('No authentication header')

  if (!authHeader.toLowerCase().startsWith('bearer '))
    throw new Error('Invalid authentication header')

  const split = authHeader.split(' ')
  const token = split[1]
  console.log('verifying JwtToken=', token)
  console.log('verifying JwtToken with cert=', cert)
  return verify(token, cert, { algorithms: ['RS256'] }) as JwtToken
}
