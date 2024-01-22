import {Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { Asset } from 'aws-cdk-lib/aws-s3-assets';
import { Fn } from 'aws-cdk-lib';
import { Duration } from 'aws-cdk-lib';

// Service files import
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as iam from 'aws-cdk-lib/aws-iam';

// Stack import
import { VPCStack } from './vpc';
import { DBStack } from './database';

export class apiStack extends Stack {
    constructor(scope: Construct, id: string, vpcStack: VPCStack, db: DBStack, props?: StackProps){
        super(scope, id, props);

        // Read OpenAPI file and load file to S3
        const asset = new Asset(this, 'SampleAsset', {
            path: 'OpenAPI_Swagger_Definition.yaml',
        });

        // Perform transformation on the file from the S3 location
        const data = Fn.transform('AWS::Include', {'Location': asset.s3ObjectUrl});

        // Create API Gateway
        const api = new apigateway.SpecRestApi(this, 'APIGateway', {
            apiDefinition: apigateway.AssetApiDefinition.fromInline(data),
            endpointTypes: [apigateway.EndpointType.REGIONAL],
            restApiName: "nwHackAPI",
            deploy: true,
            cloudWatchRole: true,
            deployOptions: {
              metricsEnabled: true,
              loggingLevel: apigateway.MethodLoggingLevel.ERROR,
              dataTraceEnabled: true,
              stageName: 'prod',
              methodOptions: {
                "/*/*": {
                  throttlingRateLimit: 100,
                  throttlingBurstLimit: 200
                }
              }
            },
        });

        /**
         * 
         * Create Integration Lambda layer for PSQL
         */ 
        const postgres = new lambda.LayerVersion(this, 'postgres', {
            code: lambda.Code.fromAsset('./lambda/layers/postgres.zip'),
            compatibleRuntimes: [lambda.Runtime.NODEJS_16_X],
            description: 'Contains the postgres library for JS',
        });

        /**
         * 
         * Create an IAM role for lambda function to assume to get access to database
         */
        //Create a role for lambda to access the postgresql database
        const lambdaRole = new iam.Role(this, "postgresLambdaRole", {
            roleName: "postgresLambdaRole",
            assumedBy: new iam.ServicePrincipal("lambda.amazonaws.com"),
        });

        // Grant access to EC2
        lambdaRole.addToPolicy(
            new iam.PolicyStatement({
              effect: iam.Effect.ALLOW,
              actions: [
                "ec2:CreateNetworkInterface",
                "ec2:DescribeNetworkInterfaces",
                "ec2:DeleteNetworkInterface",
                "ec2:AssignPrivateIpAddresses",
                "ec2:UnassignPrivateIpAddresses",
              ],
              resources: ["*"], // must be *
            })
        );

        // Grant access to Secret Manager
        lambdaRole.addToPolicy(
            new iam.PolicyStatement({
              effect: iam.Effect.ALLOW,
              actions: [
                //Secrets Manager
                "secretsmanager:GetSecretValue",
              ],
              resources: [
                `arn:aws:secretsmanager:${this.region}:${this.account}:secret:*`,
              ],
            })
        );

        // Grant access to log
        lambdaRole.addToPolicy(
            new iam.PolicyStatement({
              effect: iam.Effect.ALLOW,
              actions: [
                //Logs
                "logs:CreateLogGroup",
                "logs:CreateLogStream",
                "logs:PutLogEvents",
              ],
              resources: ["arn:aws:logs:*:*:*"],
            })
        );

        /**
         * 
         * Create Integration Lambda for Region API Gateway endpoint
         */
        const integratedLambda = new lambda.Function(this, 'IntegLambRegion', {
            runtime: lambda.Runtime.NODEJS_16_X,    // Execution environment
            code: lambda.Code.fromAsset('lambda'),  // Code loaded from "lambda" directory
            handler: 'integrated.handler',         // Code handler
            timeout: Duration.seconds(300),
            vpc: vpcStack.vpc,
            environment: {
                SM_DB_CREDENTIALS: db.secretPathAdminName,
            },
            functionName: "IntegLambRegion",
            memorySize: 512,
            layers: [postgres],
            role: lambdaRole
        });

        // Add the permission to the Lambda function's policy to allow API Gateway access
        integratedLambda.addPermission('AllowApiGatewayInvoke', {
            principal: new iam.ServicePrincipal('apigateway.amazonaws.com'),
            action: 'lambda:InvokeFunction',
            sourceArn: `arn:aws:execute-api:${this.region}:${this.account}:${api.restApiId}/*/*/appData*`
        });
        
        // Change Logical ID to match the one decleared in YAML file of Open API
        const cfnLambda = integratedLambda.node.defaultChild as lambda.CfnFunction;
        cfnLambda.overrideLogicalId("IntegLambRegion");
    }
}