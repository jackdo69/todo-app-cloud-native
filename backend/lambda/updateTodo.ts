import { APIGatewayEvent, APIGatewayProxyResult } from "aws-lambda";

export const handler = async (event: APIGatewayEvent): Promise<APIGatewayProxyResult> => {
  console.log("update todo lambda executed", event);

  return {
    body: "updatetodo called",
    statusCode: 200
  };
};
