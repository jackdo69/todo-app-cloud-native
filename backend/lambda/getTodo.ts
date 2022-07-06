import { APIGatewayEvent, APIGatewayProxyResult } from "aws-lambda";
import { ITodoController } from "../controllers/todo.controller";
import { container } from "../ioc/container";
import { ContainerKeys } from "../ioc/keys";

const controller: ITodoController = container.get(ContainerKeys.ITodoController);

export const handler = async (event: APIGatewayEvent): Promise<APIGatewayProxyResult> => {
  return await controller.getTodo();
};
