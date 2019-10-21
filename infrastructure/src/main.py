from cosmosTroposphere import CosmosTemplate
from cosmosTroposphere.component.iam import IAM
from awacs.aws import Action, Allow, Statement

t = CosmosTemplate(description="GoURMET Gap Fill Evaluation",
                   project_name="gourmet", component_name="gap-fill-evaluation")

t.resources[IAM.COMPONENT_POLICY].PolicyDocument.Statement.extend([
    Statement(
        Action=[
            Action('dynamodb', '*')
        ],
        Resource=["*"],
        Effect=Allow
    ),
])

print(t.to_json())
