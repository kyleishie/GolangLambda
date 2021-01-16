import * as cdk from '@aws-cdk/core';
import { GolangLambda } from "golanglambda";
import {Duration} from "@aws-cdk/core";

export class ExampleStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here
    const myLambda = new GolangLambda(this, 'my-lambda');

  }
}
