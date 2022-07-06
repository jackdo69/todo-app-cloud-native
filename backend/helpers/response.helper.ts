import { APIGatewayProxyResult } from "aws-lambda";

export const processResponse = (status: number, body: Record<string, any>): APIGatewayProxyResult => {
  return {
    body: JSON.stringify(body),
    statusCode: status,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Content-control": "no-store",
      Pragma: "no-cache",
      "Strict-Transport-Security": "max-age=31536000; includeSubDomains",
      "Access-Control-Allow-Credentials": true
    }
  };
};
