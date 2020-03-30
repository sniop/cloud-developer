import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import { deleteTodo } from '../../service/todoService'
import { createLogger } from '../../utils/logger'
import { getUserId } from '../utils'
const logger = createLogger('createTodos')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  // DONE: Remove a TODO item by id

  const userId = getUserId(event)
  const todoId = event.pathParameters.todoId
  logger.info("calling delete todo service",{"userId":userId,"todoId":todoId})
  await deleteTodo(userId,todoId)

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body:''
  }
}
