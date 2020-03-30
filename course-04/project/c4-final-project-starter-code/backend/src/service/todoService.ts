
import { TodoAccess } from '../dao/todoAccess'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
import { TodoItem } from '../models/TodoItem'
import * as uuid from 'uuid'
import { createLogger } from '../utils/logger'
import * as AWS  from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'

const logger = createLogger('todoService')

const todoAccess = new TodoAccess()
const bucketName = process.env.TODOS_S3_BUCKET
const urlExpirationInSeconds = parseInt(process.env.SIGNED_URL_EXPIRATION_IN_SECONDS)

const XAWS = AWSXRay.captureAWS(AWS)
const s3 = new XAWS.S3({
    signatureVersion: 'v4'
  })
  
export async function getTodosForUser(userId: string): Promise<TodoItem[]> {
    return await todoAccess.getTodosForUser(userId);
}

export async function createTodo(
    createTodoRequest: CreateTodoRequest,
    userId: string): Promise<TodoItem> {

    const todoId = uuid.v4()
    const createdAt = new Date().toISOString()
    const attachmentUrl = `https://${bucketName}.s3.amazonaws.com/${todoId}`

    return await todoAccess.createTodo({
        userId: userId,
        todoId: todoId,
        createdAt: createdAt,
        name: createTodoRequest.name,
        dueDate: createTodoRequest.dueDate,
        done: false,
        attachmentUrl: attachmentUrl
    })
}

export async function updateTodo(
    todoId: string,
    userId: string,
    updateTodoRequest: UpdateTodoRequest) {

    await todoAccess.updateTodo(
        todoId,
        userId,
        {
            name: updateTodoRequest.name,
            dueDate: updateTodoRequest.dueDate,
            done: updateTodoRequest.done
        }
    )
}


export async function deleteTodo(userId: string, todoId: string) {
    await todoAccess.deleteTodo(userId, todoId)
}

export function createPreSignedUrlForUpload(todoId: string) {
    logger.info("creating presigned URL")
    return s3.getSignedUrl('putObject', {
      Bucket: bucketName,
      Key: todoId,
      Expires: urlExpirationInSeconds
    })
  }
  
