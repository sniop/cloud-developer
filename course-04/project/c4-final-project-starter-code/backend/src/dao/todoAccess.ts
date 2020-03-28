import * as AWS  from 'aws-sdk'
//import * as AWSXRay from 'aws-xray-sdk'
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
    private readonly todosTable = process.env.TODOS_TABLE,
    private readonly userIdIndex = process.env.USER_ID_INDEX
    
    ) {
  }

  async getTodosForUser(userId: string): Promise<TodoItem[]>{
    
    const todosData = await this.docClient.query({
      TableName: this.todosTable,
      IndexName: this.userIdIndex,
      KeyConditionExpression:'userId = :userId',
      ExpressionAttributeValues: {
        ':userId': userId
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
    await this.docClient.update({
      TableName: this.todosTable,
      Key:{
        'userId': userId,
        'todoId': todoId
      },
      UpdateExpression: 'set name= :name, dueDate= :dueDate, done= :done',
      ExpressionAttributeValues:{
        ':name': todoUpdateItem.name,
        ':dueDate': todoUpdateItem.dueDate,
        ':done': todoUpdateItem.done
      }
    },
    function(err,data){
      if(err){
        logger.error("failed to update todo",{'err':err});
      }else{
        logger.error("update successful",{'data':data});
      }
    }).promise()
  }

  async deleteTodo(todoId: string){
    await this.docClient.delete({
      TableName: this.todosTable,
      Key: {
        'todoId':todoId
      }
    })
  }
}

function createDynamoDBClient() {
  return new XAWS.DynamoDB.DocumentClient()
}
