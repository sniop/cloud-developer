import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import { createLogger } from '../../utils/logger'
import { createPreSignedUrlForUpload } from '../../service/todoService'
import { corsHeadersAllowOriginAndCredential } from '../utils'

const logger = createLogger('createTodos')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  // DONE: Return a presigned URL to upload a file for a TODO item with the provided id
  const todoId = event.pathParameters.todoId

  const preSignedUrl = createPreSignedUrlForUpload(todoId);

  logger.info("presigned URL created ",{"preSignedUrl":preSignedUrl})

  return {
    statusCode: 200,
    headers: corsHeadersAllowOriginAndCredential(),
    body: JSON.stringify({
      uploadUrl: preSignedUrl
    })
  }
}
