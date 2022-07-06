import {
  DeleteItemCommand,
  DeleteItemCommandInput,
  DeleteItemCommandOutput,
  DynamoDBClient,
  PutItemCommand,
  PutItemCommandInput,
  PutItemCommandOutput,
  QueryCommand,
  QueryCommandInput,
  QueryCommandOutput,
  UpdateItemCommand,
  UpdateItemCommandInput,
  UpdateItemCommandOutput
} from "@aws-sdk/client-dynamodb";
import { inject, injectable } from "inversify";
import { ContainerKeys } from "../ioc/keys";
import { Status } from "../models/todo.model";
import { LoggerService } from "../services/logger.service";

export interface ITodoRepository {
  createTodo(params: Record<string, any>): Promise<PutItemCommandOutput>;
  getTodo(): Promise<QueryCommandOutput>;
  getTodoById(id: string): Promise<QueryCommandOutput>;
  updateTodo(status: Status, id: string): Promise<UpdateItemCommandOutput>;
  deleteTodo(id: string): Promise<DeleteItemCommandOutput>;
}

@injectable()
export class TodoRepository implements ITodoRepository {
  private tableName = "to-do_db";
  private partitionKey = "type";
  private sortKey = "id";
  constructor(
    @inject(ContainerKeys.ILoggerService) protected logger: LoggerService,
    @inject(DynamoDBClient) protected client: DynamoDBClient
  ) {}

  async createTodo(params: Record<string, any>): Promise<PutItemCommandOutput> {
    this.logger.log("createTodo() called", params, this.constructor.name);

    const putItem: any = {};
    for (const key in params) {
      putItem[key] = {
        S: params[key]
      };
    }

    const input: PutItemCommandInput = {
      TableName: this.tableName,
      Item: putItem
    };
    const command = new PutItemCommand(input);
    this.logger.log("createTodo() finished");
    return await this.client.send(command);
  }

  async getTodo(): Promise<QueryCommandOutput> {
    this.logger.log("getTodo() called", null, this.constructor.name);

    const input: QueryCommandInput = {
      TableName: this.tableName,
      ExpressionAttributeNames: {
        "#type": "type"
      },
      ExpressionAttributeValues: {
        ":queryType": { S: "Todo" }
      },
      KeyConditionExpression: "#type = :queryType"
    };
    const command = new QueryCommand(input);
    const response = await this.client.send(command);

    this.logger.log("getTodo() called", { response }, this.constructor.name);
    return response;
  }

  async getTodoById(id: string): Promise<QueryCommandOutput> {
    this.logger.log("getTodoById() called", null, this.constructor.name);

    const input: QueryCommandInput = {
      TableName: this.tableName,
      ExpressionAttributeNames: {
        "#type": "type",
        "#id": "id"
      },
      ExpressionAttributeValues: {
        ":queryType": { S: "Todo" },
        ":queryId": { S: id }
      },
      KeyConditionExpression: "#type = :queryType AND #id = :queryId"
    };
    const command = new QueryCommand(input);
    const response = await this.client.send(command);

    this.logger.log("getTodoById() called", { response }, this.constructor.name);
    return response;
  }

  async updateTodo(status: Status, id: string): Promise<UpdateItemCommandOutput> {
    this.logger.log("updateTodo() called", { status, id }, this.constructor.name);

    const input: UpdateItemCommandInput = {
      TableName: this.tableName,
      Key: {
        [this.partitionKey]: { S: "Todo" },
        [this.sortKey]: { S: id }
      },
      UpdateExpression: "SET #status = :updatedStatus",
      ExpressionAttributeNames: {
        "#status": "status"
      },
      ExpressionAttributeValues: {
        ":updatedStatus": { S: status }
      }
    };
    const command = new UpdateItemCommand(input);
    const response = await this.client.send(command);

    this.logger.log("updateTodo() finished", { response }, this.constructor.name);
    return response;
  }

  async deleteTodo(id: string): Promise<DeleteItemCommandOutput> {
    this.logger.log("deleteTodo() called", { id }, this.constructor.name);

    const input: DeleteItemCommandInput = {
      TableName: this.tableName,
      Key: {
        [this.partitionKey]: { S: "Todo" },
        [this.sortKey]: { S: id }
      }
    };
    const command = new DeleteItemCommand(input);
    const response = await this.client.send(command);

    this.logger.log("deleteTodo() finished", { response }, this.constructor.name);
    return response;
  }
}
