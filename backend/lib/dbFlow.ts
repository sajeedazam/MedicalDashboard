import {Stack, StackProps, triggers } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { Duration } from 'aws-cdk-lib';

// Service files import
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as iam from 'aws-cdk-lib/aws-iam';

// Stack import
import { VPCStack } from './vpc';
import {DBStack} from './database';

export class DBFlowStack extends Stack {
    constructor(scope: Construct, id: string, vpcStack: VPCStack, db: DBStack, props?: StackProps){
        super(scope, id, props);

        /**
         * 
         * Create an database initializer using lambda
         */
        // Create a layer for the initializer function containing psyscopg2 library, a PSQL for Python
        const psyscopg2 = new lambda.LayerVersion(this, "psyscopg2", {
            code: lambda.Code.fromAsset("./lambda/layers/psycopg2.zip"),
            compatibleRuntimes: [lambda.Runtime.PYTHON_3_9],
            description: "psycopg2 library for connecting to the PostgreSQL database",
        });

        // Create an initilizer for the RDS instance, only invoke during deployment
        const initializerLambda = new triggers.TriggerFunction(this, "nwHacks-triggerLambda", {
            functionName: "nwHack-initializerFunction",
            runtime: lambda.Runtime.PYTHON_3_9,
            handler: "initializer.handler",
            timeout: Duration.seconds(300),
            memorySize: 512,
            environment:{
              DB_SECRET_NAME: db.secretPathAdminName,     // Admin Secret Manager name that only use once here.
            },
            vpc: vpcStack.vpc,
            code: lambda.Code.fromAsset("lambda"),
            layers: [psyscopg2]
        });

        initializerLambda.addToRolePolicy(
            new iam.PolicyStatement({
              effect: iam.Effect.ALLOW,
              actions: [
                //Secrets Manager
                "secretsmanager:GetSecretValue"
              ],
              resources: [
                `arn:aws:secretsmanager:${this.region}:${this.account}:secret:*`,
              ],
            })
        );

        initializerLambda.addToRolePolicy(
            new iam.PolicyStatement({
              effect: iam.Effect.ALLOW,
              actions: [
                // CloudWatch Logs
                "logs:CreateLogGroup",
                "logs:CreateLogStream",
                "logs:PutLogEvents",
              ],
              resources: ["arn:aws:logs:*:*:*"],
            })
        );
    }
}