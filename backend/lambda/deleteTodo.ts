import { APIGatewayEvent, APIGatewayProxyResult } from "aws-lambda";

export const handler = async (event: APIGatewayEvent): Promise<APIGatewayProxyResult> => {
  console.log("delete todo lambda executed", event);

  return {
    body: "deletetodo called",
    statusCode: 200
  };
};
