import { APIGatewayEvent, APIGatewayProxyResult } from "aws-lambda";

export const handler = async (event: APIGatewayEvent): Promise<APIGatewayProxyResult> => {
  console.log("create todo lambda executed", event);

  return {
    body: "createtodo called",
    statusCode: 200
  };
};
