import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import * as AWS  from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import { createLogger } from '../../utils/logger'
const logger = createLogger('createTodos')

const XAWS = AWSXRay.captureAWS(AWS)
const s3 = new XAWS.S3({
  signatureVersion: 'v4'
})

const bucketName = process.env.TODOS_S3_BUCKET
const urlExpirationInSeconds = process.env.SIGNED_URL_EXPIRATION_IN_SECONDS

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  // DONE: Return a presigned URL to upload a file for a TODO item with the provided id
  logger.debug("event processed",event)
  const todoId = event.pathParameters.todoId

  return {
    statusCode: 200,
    body: JSON.stringify({
      uploadUrl: createPreSignedUrlForUpload(todoId)
    })
  }
}

function createPreSignedUrlForUpload(todoId: string) {
  return s3.getSignedUrl('putObject', {
    Bucket: bucketName,
    Key: todoId,
    Expires: urlExpirationInSeconds
  })
}
