import { APIGatewayEvent, APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { inject, injectable } from "inversify";
import { handleServiceErrors } from "../helpers/error.helper";
import { processResponse } from "../helpers/response.helper";
import { ContainerKeys } from "../ioc/keys";
import { ITodoService } from "../services/todo.service";

export interface ITodoController {
  createTodo(params: APIGatewayEvent): Promise<APIGatewayProxyResult>;
  getTodo(): Promise<APIGatewayProxyResult>;
  updateTodo(params: APIGatewayEvent): Promise<APIGatewayProxyResult>;
  deleteTodo(params: APIGatewayEvent): Promise<APIGatewayProxyResult>;
}

@injectable()
export class TodoController implements ITodoController {
  constructor(@inject(ContainerKeys.ITodoService) private service: ITodoService) {}

  async createTodo(params: APIGatewayEvent): Promise<APIGatewayProxyResult> {
    try {
      const { body } = params;
      if (body === null) throw new Error("Missing request body");
      const { content } = JSON.parse(body);
      if (!content) throw new Error("Missing content in request body");
      const response = await this.service.createTodo({ content });

      return processResponse(201, response);
    } catch (err: any) {
      return handleServiceErrors(err);
    }
  }

  async getTodo(): Promise<APIGatewayProxyResult> {
    try {
      const response = await this.service.getTodo();
      return processResponse(200, response);
    } catch (err: any) {
      return handleServiceErrors(err);
    }
  }

  async updateTodo(params: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
    try {
      const { body } = params;
      if (body === null) throw new Error("Missing request body");
      const { status } = JSON.parse(body);
      const { id } = params.pathParameters;
      const response = await this.service.updateTodo({ status, id });
      return processResponse(200, response);
    } catch (err: any) {
      return handleServiceErrors(err);
    }
  }

  async deleteTodo(params: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
    try {
      const { id } = params.pathParameters;
      await this.service.deleteTodo({ id });
      return processResponse(202, {});
    } catch (err: any) {
      return handleServiceErrors(err);
    }
  }
}
