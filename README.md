# Gap Fill Evaluation Tool

GoURMET project tool. The user is presented with a series of sentences that have been translated by a human and asked to 'fill in the gaps'. The evaluator fills in the gaps and based on how closely their answers match the quality of the translation model can be assessed.

# Set up
1. Install [node v10](https://nodejs.org/en/)
2. Run `yarn install`

# Running the App

The app requires local aws credentials for the GoURMET AWS account.

Run `yarn dev`

# Developing the App.

## A note on PRs

Currently this is a single dev project so changes are being made and features are added without going through the standard PR review process. PRs are still being opened as they offer a form of documentation but are being merged without review.

## Infrastructure

The cloudformation templates are generated using [cosmos-troposphere](https://github.com/bbc/cosmos-troposphere). This will need to be installed locally in order to update the cloudformation template. How to install this is covered in the [cosmos-troposphere README](https://github.com/bbc/cosmos-troposphere/blob/master/README.rst). Alternatively run `make venv` from within the `infrastructure` directory to set up an virtual environment and install cosmos-troposphere.

To make changes to the stack. Update the [./infrastructure/src/main.py](./infrastructure/src/main.py) and run `make templates/main.json` from inside the `infrastructure` directory.

### DNS

To make changes to the DNS template. Update the [./infrastructure/src/dns.py](./infrastructure/src/dns.py) and run `make templates/dns.json` from inside the `infrastructure` directory.
