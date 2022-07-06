import { APIGatewayEvent, APIGatewayProxyResult } from "aws-lambda";
import { ITodoController } from "../controllers/todo.controller";
import { container } from "../ioc/container";
import { ContainerKeys } from "../ioc/keys";
import { ILoggerService } from "../services/logger.service";

const logger: ILoggerService = container.get(ContainerKeys.ILoggerService);
const controller: ITodoController = container.get(ContainerKeys.ITodoController);

export const handler = async (event: APIGatewayEvent): Promise<APIGatewayProxyResult> => {
  logger.log("Lambda hander event", { event });

  return await controller.createTodo(event);
};
