
import { TodoAccess } from '../dao/todoAccess'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
import { TodoItem } from '../models/TodoItem'
import * as uuid from 'uuid'

const todoAccess = new TodoAccess()

export async function getTodosForUser(userId: string): Promise<TodoItem[]>{
    return await todoAccess.getTodosForUser(userId);
}

export async function createTodo(
    createTodoRequest: CreateTodoRequest,
    userId: string): Promise<TodoItem> {

    const todoId = uuid.v4()
    const createdAt = new Date().toISOString()

    return await todoAccess.createTodo({
        userId: userId,
        todoId: todoId,
        createdAt: createdAt,
        name: createTodoRequest.name,
        dueDate: createTodoRequest.dueDate,
        done: false,
        attachmentUrl: createTodoRequest.attachmentUrl
    })
}

export async function updateTodo(
    todoId: string,
    userId: string,
    updateTodoRequest: UpdateTodoRequest)
    {
  
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


export async function deleteTodo(userId:string,todoId:string){
    await todoAccess.deleteTodo(userId,todoId)
}
