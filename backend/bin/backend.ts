#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { BackendStack } from '../lib/backend-stack';
import { VPCStack } from '../lib/vpc';
import { DBStack } from '../lib/database';
import { DBFlowStack } from '../lib/dbFlow';
import { apiStack } from '../lib/api';

const app = new cdk.App();

// Create instance of a VPC stack
const vpcStack = new VPCStack(app, 'VpcStack');

// Create instance of a Database stack
const dbStack = new DBStack(app, 'DBStack', vpcStack);

// Create instance of a Database Flow stack
const dbFlowStack = new DBFlowStack(app, 'DBFlowStack', vpcStack, dbStack);

// Create an instance of an API stack
const api = new apiStack(app, 'APIStack', vpcStack, dbStack);
