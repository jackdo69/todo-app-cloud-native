import { APIGatewayEvent, APIGatewayProxyResult } from "aws-lambda";

export const handler = async (event: APIGatewayEvent): Promise<APIGatewayProxyResult> => {
  console.log("get todo lambda executed", event);

  return {
    body: "gettodo called",
    statusCode: 200
  };
};
