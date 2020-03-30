import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'

import { createLogger } from '../../utils/logger'
import { getUserId,corsHeadersAllowOrigin } from '../utils'
import { getTodosForUser } from '../../service/todoService'

const logger = createLogger('getTodos')


export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  // DONE: Get all TODO items for a current user
  const userId = getUserId(event)
  
  logger.info("fetch TODO details",{'userId':userId})

  const items = await getTodosForUser(userId)

  return {
    statusCode: 200,
    headers: corsHeadersAllowOrigin(),
    body:JSON.stringify({
      items
    })
  }

}
