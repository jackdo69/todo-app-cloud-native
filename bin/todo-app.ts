import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { TodoAppStack } from '../lib/todo-app-stack';

const app = new cdk.App();
new TodoAppStack(app, 'TodoAppStack', {});