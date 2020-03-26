
import { TodoAccess } from '../dao/todoAccess'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
import { TodoItem } from '../models/TodoItem'
import * as uuid from 'uuid'

const todoAccess = new TodoAccess()

export async function getTodosForUser(userId: string): Promise<TodoItem[]>{
    return todoAccess.getTodosForUser(userId);
}

export async function createTodo(
    createTodoRequest: CreateTodoRequest,
    userId: string): Promise<TodoItem> {

    const todoId = uuid.v4()

    return await todoAccess.createTodo({
        userId: userId,
        todoId: todoId,
        createdAt: createTodoRequest.createdAt,
        name: createTodoRequest.name,
        dueDate: createTodoRequest.dueDate,
        done: createTodoRequest.done,
        attachmentUrl: createTodoRequest.attachmentUrl
    })
}

export async function updateTodo(
    todoId: string,
    updateTodoRequest: UpdateTodoRequest,
    userId: string)
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


export async function deleteTodo(todoId:string){
    todoAccess.deleteTodo(todoId)
}
