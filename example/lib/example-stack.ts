import * as cdk from '@aws-cdk/core';
import * as golang from "golanglambda";

export class ExampleStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here
    const myLambda = new golang.GolangLambda(this, 'my-lambda');
  }
}
