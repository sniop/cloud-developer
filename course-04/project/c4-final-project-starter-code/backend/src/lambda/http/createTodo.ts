import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'

import { CreateTodoRequest } from '../../requests/CreateTodoRequest'
import { createTodo } from '../../service/todoService'
import { getUserId,corsHeadersAllowOriginAndCredential } from '../utils'

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  // DONE: Implement creating a new TODO item

  const newTodo: CreateTodoRequest = JSON.parse(event.body)
  const userId = getUserId(event)

  const item = await createTodo(newTodo,userId)

  return {
    statusCode: 201,
    headers: corsHeadersAllowOriginAndCredential(),
    body: JSON.stringify({
      item
    })
  }
}

