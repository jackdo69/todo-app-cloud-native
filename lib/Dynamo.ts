import { AttributeType, Table } from "aws-cdk-lib/aws-dynamodb";
import { Construct } from "constructs";

export class Dynamo extends Table {
  constructor(scope: Construct) {
    super(scope, "DynamoDB", {
      tableName: "to-do_db",
      partitionKey: { name: "type", type: AttributeType.STRING },
      sortKey: { name: "id", type: AttributeType.STRING }
    });
  }
}
