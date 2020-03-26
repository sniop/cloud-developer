import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'

import { createLogger } from '../../utils/logger'
import { getUserId } from '../utils'
import { getTodosForUser } from '../../service/todoService'

const logger = createLogger('getTodos')


export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  // DONE: Get all TODO items for a current user
  logger.debug("event processed",event)

  const userId = getUserId(event)
  

  const items = getTodosForUser(userId)

  return {
    statusCode: 200,
    headers:{
      'Access-Control-Allow-Origin': '*'//TODO-ABS use middy instead
    },
    body:JSON.stringify({
      items
    })
  }

}
