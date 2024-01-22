import { Stack, StackProps, RemovalPolicy, SecretValue } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { Duration } from 'aws-cdk-lib';

// Service files import
import * as rds from 'aws-cdk-lib/aws-rds';
import * as ec2 from "aws-cdk-lib/aws-ec2";
import * as secretmanager from 'aws-cdk-lib/aws-secretsmanager';
import * as logs from "aws-cdk-lib/aws-logs";

// Stack import
import { VPCStack } from './vpc';


export class DBStack extends Stack {
    public readonly dbInstance: rds.DatabaseInstance;
    public readonly secretPathAdminName: string;

    constructor(scope: Construct, id: string, vpcStack: VPCStack, props?: StackProps){
        super(scope, id, props);
        

        /**
         * 
         * aws secretsmanager create-secret \
            --name DbInitialSecrets \
            --secret-string "{\"dbUsername\":\"nwHack\"}"\
            --profile <your-profile-name>
         */
        const secret = secretmanager.Secret.fromSecretNameV2(this, "ImportedSecrets", "DbInitialSecrets");
        this.secretPathAdminName = "nwHack/credentials/dbCredentials"; // Name in the Secret Manager to store DB credentials

        // Creater RDS with PSQL
        this.dbInstance = new rds.DatabaseInstance(this, "nwHack-db", {
            vpc: vpcStack.vpc,
            vpcSubnets: {
                subnetType: ec2.SubnetType.PRIVATE_ISOLATED,
            },
            engine: rds.DatabaseInstanceEngine.postgres({
                version: rds.PostgresEngineVersion.VER_14_5,
            }),
            instanceType: ec2.InstanceType.of(
                ec2.InstanceClass.BURSTABLE3,
                ec2.InstanceSize.MICRO
            ),
            credentials: rds.Credentials.fromUsername(secret.secretValueFromJson("dbUsername").unsafeUnwrap(), {
                secretName: this.secretPathAdminName,
            }),
            multiAz: true,
            allocatedStorage: 100,
            maxAllocatedStorage: 115,
            allowMajorVersionUpgrade: false,
            autoMinorVersionUpgrade: true,
            backupRetention: Duration.days(7),
            deleteAutomatedBackups: true,
            deletionProtection: true,/// To be chanaged
            databaseName: "nwHackDB",
            publiclyAccessible: false,
            cloudwatchLogsRetention: logs.RetentionDays.INFINITE,
            storageEncrypted: true, // storage encryption at rest
            monitoringInterval: Duration.seconds(60), // enhanced monitoring interval
        });

        this.dbInstance.connections.securityGroups.forEach(function (securityGroup) {
            // 10.0.0.0/16 match the cidr range in vpc stack
            securityGroup.addIngressRule(
              ec2.Peer.ipv4("10.0.0.0/16"),
              ec2.Port.tcp(5432),
              "Postgres Ingress"
            );
        });

    }
}