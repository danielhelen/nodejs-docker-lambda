# Node.js Docker Lambda

This uses the AWS-provided base image for Node.js to build a container image that will run a function in Lambda using the Docker runtime.

## Local Development

The Lambda Runtime Interface Emulator is included with all AWS-provided base images. This provides a proxy for the Lambda Runtime API that allows you to run your Lambda function packaged as a container image locally.

Build the image:

```
docker build -t nodejs-docker-lambda .
```

Then run the container:

```
docker run -p 9000:8080 nodejs-docker-lambda:latest
```

(You can also use `yarn start` to run the above two commands.)

This runs a lightweight web server locally. Make the following HTTP request to invoke the Lambda function and observe the response:

```
curl -X POST -H "Content-Type: application/json" -d '{"input": "test"}' http://localhost:9000/2015-03-31/functions/function/invocations
```

## Deployment

Deploying a container image is a bit fiddly. Here we use CloudFormation templates to create the AWS resources - you could also use the AWS Management Console or CLI. Ensure you have Docker Desktop and the AWS CLI installed.

1. Create the AWS ECR private repository using the `repository.json` CloudFormation template.

1. Create the IAM user using the `user.json` CloudFormation template and note the access key and secret access key available as outputs. Specify the above stack name as a parameter.

1. Add a new profile to your AWS CLI:
    ```
    aws configure --profile nodejs-docker-lambda
    ```

1. Build the image (you can also run `yarn build-image`):
    ```
    docker build -t nodejs-docker-lambda .
    ```

1. Tag the image (specifiy your AWS account number and region):
    ```
    docker tag nodejs-docker-lambda:latest AWS_ACCOUNT_ID.dkr.ecr.AWS_REGION.amazonaws.com/nodejs-docker-lambda:latest
    ```

1. Before you can push that tag you need to authenticate the Docker CLI to the Amazon ECR private repository (specify the AWS account number and region again):
    ```
    aws ecr get-login-password --profile nodejs-docker-lambda | docker login --username AWS --password-stdin AWS_ACCOUNT_ID.dkr.ecr.AWS_REGION.amazonaws.com
    ```

1. Push the tagged image to the ECR repository (again specify your AWS account number and region):
    ```
    docker push AWS_ACCOUNT_ID.dkr.ecr.AWS_REGION.amazonaws.com/nodejs-docker-lambda:latest
    ```

1. Create the Lambda function using the `lambda.json` CloudFormation template. Specify the URI of the image in ECR as a parameter and note the function name in the outputs.

1. Invoke the Lambda function from your local machine (specify the function name) and observe the output `response.json` file:
    ```
    aws lambda invoke --profile nodejs-docker-lambda --function-name FUNCTION_NAME --cli-binary-format raw-in-base64-out --payload '{ "input": "test" }' response.json
    ```
