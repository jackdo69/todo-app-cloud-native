import { APIGatewayProxyResult } from "aws-lambda";

export const handleServiceErrors = (err: Error): APIGatewayProxyResult => {
  console.log("Exception", err);
  let errorMessage = "";
  if (err instanceof Error) {
    errorMessage = err.message;
  } else {
    errorMessage = JSON.stringify(err);
  }
  const result: APIGatewayProxyResult = {
    statusCode: 500,
    body: `Internal server error: ${errorMessage}`
  };

  return result;
};
