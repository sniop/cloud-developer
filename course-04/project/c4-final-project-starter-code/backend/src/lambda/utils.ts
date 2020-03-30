import { APIGatewayProxyEvent } from "aws-lambda";
import { parseUserId } from "../auth/utils";
import { createLogger } from '../utils/logger'

const logger = createLogger('utils')
/**
 * Get a user id from an API Gateway event
 * @param event an event from API Gateway
 *
 * @returns a user id from a JWT token
 */
export function getUserId(event: APIGatewayProxyEvent): string {
  const authorization = event.headers.Authorization
  logger.debug("auth header received ",{"authorization":authorization})
  const split = authorization.split(' ')
  const jwtToken = split[1]

  return parseUserId(jwtToken)
}

export function corsHeadersAllowOriginAndCredential() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Credentials': true
  }
}

export function corsHeadersAllowOrigin() {
  return { 'Access-Control-Allow-Origin': '*' }
}