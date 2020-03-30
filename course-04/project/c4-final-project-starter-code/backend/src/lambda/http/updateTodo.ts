import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'

import { UpdateTodoRequest } from '../../requests/UpdateTodoRequest'
import { updateTodo } from '../../service/todoService'
import { getUserId,corsHeadersAllowOriginAndCredential } from '../utils'
import { createLogger } from '../../utils/logger'
const logger = createLogger('createTodos')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  // DONE: Update a TODO item with the provided id using values in the "updatedTodo" object
  
  const todoId = event.pathParameters.todoId
  const updatedTodo: UpdateTodoRequest = JSON.parse(event.body)
  logger.info("user data to be updated",
  {
    'todoId':todoId,
    'updatedTodo':updatedTodo
  })
  const userId = getUserId(event)

  logger.info("user id extracted from token",{'userId':userId})

  await updateTodo(todoId, userId,updatedTodo)

  return {
    statusCode: 200,
    headers: corsHeadersAllowOriginAndCredential(),
    body:''
  }
}
