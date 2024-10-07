import {
  aws_s3,
  aws_cloudfront,
  aws_cloudfront_origins,
  aws_s3_deployment,
  CfnOutput,
} from "aws-cdk-lib";
import { Construct } from "constructs";

const path = "./resources/build";

const S3_BUCKET_ID = 'CDK-redux-shop-bucket'
const CLOUD_FRONT_ID = 'CDK-cloud-front-shop'

export class DeploymentService extends Construct {
  constructor(scope: Construct, id: string) {
    super(scope, id);
    const hostingBucket = new aws_s3.Bucket(this, S3_BUCKET_ID, {
      blockPublicAccess: aws_s3.BlockPublicAccess.BLOCK_ALL,
    });

    const distribution = new aws_cloudfront.Distribution(
      this,
      CLOUD_FRONT_ID,
      {
        defaultBehavior: {
          origin: aws_cloudfront_origins.S3BucketOrigin.withOriginAccessControl(hostingBucket),
          viewerProtocolPolicy:
            aws_cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        },
        
        defaultRootObject: "index.html",
        errorResponses: [
          {
            httpStatus: 404,
            responseHttpStatus: 200,
            responsePagePath: "/index.html",
          },
        ],
      }
    );

    new aws_s3_deployment.BucketDeployment(this, "BucketDeployment", {
      sources: [aws_s3_deployment.Source.asset(path)],
      destinationBucket: hostingBucket,
      distribution,
      distributionPaths: ["/*"],
    });

    new CfnOutput(this, "CloudFrontURL", {
      value: distribution.domainName,
      description: "The distribution URL",
      exportName: "CloudfrontURL",
    });

    new CfnOutput(this, "BucketName", {
      value: hostingBucket.bucketName,
      description: "The name of the S3 bucket",
      exportName: "BucketName",
    });
  }
}
