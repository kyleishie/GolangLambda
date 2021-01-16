#### GolangLambda
GolangLambda is a npm package for AWS CDK that makes creating
Lambdas with Golang extremely simple. No need to figure out how/when to build your code 
because GolangLambda will build it for you within a Docker container. The best part is that
this means your code builds anywhere that has docker installed, including within a CDK Pipeline. 😎


#### Requirements
- Docker
- NPM
- Experience writing `if err != nil ...`

#### Installation
`npm install golanglambda`

#### How to Use
```
import { GolangLambda } from "golanglambda";

const myLambda = new GolangLambda(this, 'my-lambda');
```

Note the `id` given to the GolangLambda constructor.  This is used for a few things other than the id of the CDK
resource itself. It is used as the lambda.handler and executable name as well as the directory that contains the main.go.
GolangLambda assumes that your Go source code will be located in a "cmd" directory at the root of the project.  This gives
you a nice place to keep all of your Go code but don't worry if you want to change this you can, see below.

#### Testing (go test)
Testing your Go code happens by default automatically when running `cdk synth` or `cdk deploy`.  You can disable this 
step by setting `testingEnabled: false`.

#### Building (go build)
Building your Go code happens automatically when running `cdk synth` or `cdk deploy`.  However, there are a few things to note
about the build process.
1. The entire `sourcePath` directory is copied into the build container.  This is true whether you set `sourcePath` or not.
   The intention here is to allow code sharing between multiple lambdas in the project.
2. `sourcePath` is determined relative to `project_root/node_modules/golanglambda/lib` so if for some reason your `node_modules`
   is located elsewhere you will probably need to set `sourcePath` explicitly.
3. When using CDK Pipelines you must set `privileged: true` in order for the build stage to have access to Docker.

#### Configuration
In typical CDK fashion, GolangLambda exposes configuration via the `GolangLambdaProps` interface.
This interface extends CDK's `FunctionOptions` which means you have access to all the underlying lambda's props as well.

##### Lambda Timeout & Memory
```
import { GolangLambda } from "golanglambda";

const myLambda = new GolangLambda(this, 'my-lambda', {
    timeout: Duration.seconds(30),
    memorySize: 128
});
```

##### Lambda Environment Variables
```
import { GolangLambda } from "golanglambda";

const myLambda = new GolangLambda(this, 'my-lambda', {
    environment : {
        "DYNAMODB_TABLE_NAME" : "my-table"
    }
});
```

##### Lambda VPC Access
```
import { GolangLambda } from "golanglambda";

const vpc = ...
const securityGroup = ...

const myLambda = new GolangLambda(this, 'my-lambda', {
    vpc: vpc,
    vpcSubnets: {
        subnetType: SubnetType.PRIVATE,
    },
    securityGroups: [
        securityGroup
    ]
});
```

##### Build Time Access to private Repo
```
import { GolangLambda } from "golanglambda";

const myLambda = new GolangLambda(this, 'my-lambda', {
    bundlingCommands: [
        'git config --global url."https://oauth2:lolyouthoughtmytokenwashere@gitlab.com".insteadOf  "https://gitlab.com"'
    ],
});
```

#### Issues
Submit an issue.  PRs welcome.

#### License
MIT