import * as lambda from "@aws-cdk/aws-lambda";
import * as path from "path";
import { Construct } from "constructs";

export interface GolangLambdaProps extends lambda.FunctionOptions {
  /// The path in which this function's source can be found.
  /// This must be the path that leads to package main, i.e., your main.go file.
  /// Defaults to project_root/cmd/${id} which is determined relative to the golanglambda package location.
  readonly sourcePath?: string;

  /// Bash commands to be run prior to `go test` & `go build`
  readonly bundlingCommands?: string[];

  /// Whether or not `go test` should be ran prior to `go build`
  /// Note that `go test` is ran after any provided bundlingOptions.
  /// Defaults to true.
  readonly testingEnabled?: boolean;
}

export class GolangLambda extends lambda.Function {
  constructor(scope: Construct, id: string, props?: GolangLambdaProps) {
    const source = props?.sourcePath || path.join(__dirname, "../../../cmd/");
    const bundlingCommands = props?.bundlingCommands || [];

    if (props?.testingEnabled !== false) {
      bundlingCommands.push("go test -v");
    }

    super(scope, id, {
      ...props,
      runtime: lambda.Runtime.GO_1_X,
      handler: id,
      code: lambda.Code.fromAsset(source, {
        bundling: {
          image: lambda.Runtime.GO_1_X.bundlingDockerImage,
          workingDirectory: "/asset-input/" + id,
          command: [
            "bash",
            "-c",
            [
              ...bundlingCommands,
              "GOOS=linux go build -o /asset-output/" + id,
            ].join(" && "),
          ],
        },
      }),
    });
  }
}
