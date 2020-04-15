# Developing the Gap Fill Evaluation Tool

Documentation for working on the tool as a developer.

# Set up
1. Install [node v10](https://nodejs.org/en/)
2. Run `yarn install`
3. Set up pre-commit hook `./githooks/setupHooks.sh`

## Pre-commit Hook

[What are git hooks](https://githooks.com/)

This project has a pre commit hook which if set up (run the setup hooks script `./githooks/setupHooks.sh`) will run the linter, TypeScript compiler and tests that will be effected by the changes made. If you need to ignore the hook at any point use the `--no-verify` flag e.g. `git commit --no-verify`

# Running the App

The app requires local aws credentials for the GoURMET AWS account.

Run `yarn dev`

# Developing the App.

## Infrastructure

The cloudformation templates are generated using [cosmos-troposphere](https://github.com/bbc/cosmos-troposphere). This will need to be installed locally in order to update the cloudformation template. How to install this is covered in the [cosmos-troposphere README](https://github.com/bbc/cosmos-troposphere/blob/master/README.rst). Alternatively run `make venv` from within the `infrastructure` directory to set up an virtual environment and install cosmos-troposphere.

To make changes to the stack. Update the [./infrastructure/src/main.py](../infrastructure/src/main.py) and run `make templates/main.json` from inside the `infrastructure` directory.

### DNS

To make changes to the DNS template. Update the [./infrastructure/src/dns.py](../infrastructure/src/dns.py) and run `make templates/dns.json` from inside the `infrastructure` directory.

# Creating a Docker image

The [Dockerfile](../Dockerfile) provides the template for creating a Docker image for the app. From the root directory of the project run

```
docker build -t newslabsgourmet/direct-assessment-sentence-pair-tool:CURRENT_VERSION_NUMBER .
```

to create a Docker image. The Docker image is hosted on [Dockerhub](https://hub.docker.com/r/newslabsgourmet/direct-assessment-sentence-pair-tool)
