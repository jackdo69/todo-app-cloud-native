import { Status } from "../models/todo.model";

export namespace Contracts {
  export interface CreateTodo {
    content: string;
  }

  export interface UpdateTodo {
    id: string;
    status: Status;
  }

  export interface DeleteTodo {
    id: string;
  }
}
