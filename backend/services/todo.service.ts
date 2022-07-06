import { inject, injectable } from "inversify";
import { Contracts } from "../contracts/todo.contracts";
import { ContainerKeys } from "../ioc/keys";
import { ITodo, Status } from "../models/todo.model";
import { ITodoRepository } from "../repositories/todo.repository";
import { ILoggerService } from "./logger.service";
import { v4 as uid } from "uuid";

export interface ITodoService {
  createTodo(params: Contracts.CreateTodo): Promise<ITodo>;
  getTodo(): Promise<ITodo[]>;
  updateTodo(params: Contracts.UpdateTodo): Promise<ITodo>;
  deleteTodo(params: Contracts.DeleteTodo): Promise<void>;
}

@injectable()
export class TodoService implements ITodoService {
  constructor(
    @inject(ContainerKeys.ILoggerService) private logger: ILoggerService,
    @inject(ContainerKeys.ITodoRepository) private repo: ITodoRepository
  ) {}

  async createTodo(params: Contracts.CreateTodo): Promise<ITodo> {
    this.logger.log("createTodo() called", { params }, this.constructor.name);

    const { content } = params;
    const createdTodo: ITodo = {
      type: "Todo",
      id: uid(),
      content,
      status: Status.CREATED,
      created: new Date().toISOString(),
      updated: new Date().toISOString()
    };
    const response = await this.repo.createTodo(createdTodo);

    this.logger.log("dynamo response", { response }, this.constructor.name);
    return createdTodo;
  }

  async getTodo(): Promise<ITodo[] | []> {
    this.logger.log("getTodo() called");

    const response = await this.repo.getTodo();
    let result: any = [];
    if (response.Count > 0) {
      result = response.Items.map((item) => this.processDynamoItem(item));
    }

    this.logger.log("dynamo response", { response }, this.constructor.name);

    return result;
  }

  private isStatusValid(status: string): status is Status {
    return Object.values(Status).some((v) => v === status);
  }

  private processDynamoItem(item: any) {
    const output: any = {};
    for (const k in item) {
      output[k] = item[k]["S"];
    }
    return output;
  }

  async updateTodo(params: Contracts.UpdateTodo): Promise<ITodo | null> {
    this.logger.log("updateTodo() called", { params }, this.constructor.name);
    const { status, id } = params;

    if (!this.isStatusValid(status)) throw new Error("Invalid status");

    const response = await this.repo.updateTodo(status, id);
    this.logger.log("dynamo response", { response }, this.constructor.name);
    if (response.$metadata.httpStatusCode == 200) {
      const updatedTodo = await this.repo.getTodoById(id);
      this.logger.log("updatedTodo", updatedTodo);
      return this.processDynamoItem(updatedTodo.Items[0]);
    }
    return null;
  }

  async deleteTodo(params: Contracts.DeleteTodo): Promise<void> {
    this.logger.log("deleteTodo() called", { params }, this.constructor.name);
    const { id } = params;

    const response = await this.repo.deleteTodo(id);
    this.logger.log("dynamo response", { response }, this.constructor.name);
    return;
  }
}
