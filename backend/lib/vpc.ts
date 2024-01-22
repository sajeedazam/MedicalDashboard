import { Stack, StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";
import * as ec2 from "aws-cdk-lib/aws-ec2";
import * as secretsmanager from "aws-cdk-lib/aws-secretsmanager";
import * as iam from "aws-cdk-lib/aws-iam";
import { ManagedPolicy } from "aws-cdk-lib/aws-iam";
import { NatProvider } from "aws-cdk-lib/aws-ec2";

export class VPCStack extends Stack {
  public readonly vpc: ec2.Vpc;
  public readonly openSearchVPCPermissions: iam.CfnServiceLinkedRole;

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const natGatewayProvider = ec2.NatProvider.gateway();

    // VPC for application
    this.vpc = new ec2.Vpc(this, "nwHack-Vpc", {
      //cidr: "10.0.0.0/16",
      ipAddresses: ec2.IpAddresses.cidr('10.0.0.0/16'),
      natGatewayProvider: natGatewayProvider,
      natGateways: 1,
      maxAzs: 2,
      subnetConfiguration: [
        {
            name: "public-subnet-1",
            subnetType: ec2.SubnetType.PUBLIC,
        },
        {
          name: "private-subnet-1",
          subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS,
        },
        {
            name: "isolated-subnet-1",
            subnetType: ec2.SubnetType.PRIVATE_ISOLATED,
        },
      ]
    });

    this.vpc.addFlowLog("invasivePlant-vpcFlowLog");

    // Get default security group for VPC
    const defaultSecurityGroup = ec2.SecurityGroup.fromSecurityGroupId(
      this,
      id,
      this.vpc.vpcDefaultSecurityGroup
    );

    // Add secrets manager endpoint to VPC
    this.vpc.addInterfaceEndpoint("secret-enpoint", {
      service: ec2.InterfaceVpcEndpointAwsService.SECRETS_MANAGER,
      subnets: { subnetType: ec2.SubnetType.PRIVATE_ISOLATED },
    });

    // Add RDS endpoint to VPC
    this.vpc.addInterfaceEndpoint("rds-endpoint", {
      service: ec2.InterfaceVpcEndpointAwsService.RDS,
      subnets: { subnetType: ec2.SubnetType.PRIVATE_ISOLATED },
    });
  }
}