import * as AWS  from 'aws-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { TodoItem } from '../models/TodoItem'
import { TodoUpdate } from '../models/TodoUpdate'
import { createLogger } from '../utils/logger'

const AWSXRay = require('aws-xray-sdk')
const XAWS = AWSXRay.captureAWS(AWS)

const logger = createLogger('todoAccess')

export class TodoAccess {

  constructor(
    private readonly docClient: DocumentClient = createDynamoDBClient(),
    private readonly todosTable = process.env.TODOS_TABLE    
    ) {
  }

  async getTodosForUser(userId: string): Promise<TodoItem[]>{
    logger.info('get TODO',{'userId':userId,'todosTable':this.todosTable});
    const queryParams = {
      TableName: this.todosTable,
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: {
        ':userId': userId
      }
    }
    const todosData = await this.docClient.query(queryParams,
        function(err,data){
          if(err){
            logger.error('failed to query todo',{'err':err});
          }else{
            logger.info('query successful',{'data':data});
          }
        }).promise()

      return todosData.Items as TodoItem[]
  }

  async createTodo(todoItem: TodoItem): Promise<TodoItem> {
    await this.docClient.put({
      TableName: this.todosTable,
      Item: todoItem
    }).promise()

    return todoItem
  }

  async updateTodo(todoId:string, userId:string, todoUpdateItem: TodoUpdate) {
    logger.info('updating TODO',{'todoId':todoId,'userId':userId,'todoUpdateItem':todoUpdateItem});
    await this.docClient.update({
      TableName: this.todosTable,
      Key:{
        'userId': userId,
        'todoId': todoId
      },
      UpdateExpression: 'set #name= :name, dueDate= :dueDate, done= :done',
      ExpressionAttributeNames:{
        '#name':'name'
      },
      ExpressionAttributeValues:{
        ':name': todoUpdateItem.name,
        ':dueDate': todoUpdateItem.dueDate,
        ':done': todoUpdateItem.done
      }
    },
    function(err,data){
      if(err){
        logger.error('failed to update todo',{'err':err});
      }else{
        logger.info('update successful',{'data':data});
      }
    }).promise()
  }

  async deleteTodo(userId:string,todoId: string){
    await this.docClient.delete({
      TableName: this.todosTable,
      Key: {
        'todoId':todoId,
        'userId':userId
      }
    },
    function(err,data){
      if(err){
        logger.error('failed to delete todo',{'err':err});
      }else{
        logger.info('delete successful',{'data':data});
      }
    })
  }
}

function createDynamoDBClient() {
  if (process.env.IS_OFFLINE) {
    console.log('Creating a local DynamoDB instance')
    return new XAWS.DynamoDB.DocumentClient({
      region: 'localhost',
      endpoint: 'http://localhost:8000'
    })
  }
  return new XAWS.DynamoDB.DocumentClient()
}
