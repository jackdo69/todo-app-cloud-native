import "reflect-metadata";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { Container } from "inversify";
import { ITodoController, TodoController } from "../controllers/todo.controller";
import { ITodoRepository, TodoRepository } from "../repositories/todo.repository";
import { ILoggerService, LoggerService } from "../services/logger.service";
import { ITodoService, TodoService } from "../services/todo.service";
import { ContainerKeys } from "./keys";

const container = new Container();

try {
  const dynamoClient = new DynamoDBClient({ region: "ap-southeast-2" });
  container.bind(DynamoDBClient).toConstantValue(dynamoClient);
  container.bind<ILoggerService>(ContainerKeys.ILoggerService).to(LoggerService);
  container.bind<ITodoRepository>(ContainerKeys.ITodoRepository).to(TodoRepository);
  container.bind<ITodoService>(ContainerKeys.ITodoService).to(TodoService);
  container.bind<ITodoController>(ContainerKeys.ITodoController).to(TodoController);
} catch (err) {
  console.log("Error during initialization", err);
}

export { container };
