import { Stack, StackProps } from 'aws-cdk-lib';
import { Lambda } from './Lambda';
import { Construct } from 'constructs';
import { ApiGateway } from './ApiGateway';

export class TodoAppStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

  // Api Gateway setup
  const api = new ApiGateway(this);

  //Lambdas setup
  const healthLambda = new Lambda(this, "health");

  api.addIntegration("GET", "/health", healthLambda)

  }
}
