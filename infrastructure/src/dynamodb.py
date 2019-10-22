from troposphere import Output, Parameter, Ref, Template, Tags, Join
from troposphere.dynamodb import (KeySchema, AttributeDefinition,
                                  ProvisionedThroughput)
from troposphere.dynamodb import Table
from troposphere.iam import PolicyType

t = Template()

t.set_description(
    "DynamoDB tables for storing data for analysing gap fill data")

stage = t.add_parameter(Parameter(
    "Stage",
    Description="Development stage",
    Type="String",
    Default="test",
))

segmentTableHashkeyName = t.add_parameter(Parameter(
    "SegmentTableHashKeyElementName",
    Description="Segment Table HashType PrimaryKey Name",
    Type="String",
    Default="id",
    AllowedPattern="[a-zA-Z0-9]*",
    MinLength="1",
    MaxLength="2048",
    ConstraintDescription="must contain only alphanumberic characters"
))

segmentTableHashkeyType = t.add_parameter(Parameter(
    "SegmentTableHashKeyElementType",
    Description="Segment HashType PrimaryKey Type",
    Type="String",
    Default="S",
    AllowedPattern="[S]",
    MinLength="1",
    MaxLength="1",
    ConstraintDescription="must be S"
))

segmentSetsTableHashkeyName = t.add_parameter(Parameter(
    "SegmentSetsTableHashKeyElementName",
    Description="Segment Sets Table HashType PrimaryKey Name",
    Type="String",
    Default="setId",
    AllowedPattern="[a-zA-Z0-9]*",
    MinLength="1",
    MaxLength="2048",
    ConstraintDescription="must contain only alphanumberic characters"
))

segmentSetsTableHashkeyType = t.add_parameter(Parameter(
    "SegmentSetsTableHashKeyElementType",
    Description="Segment Sets HashType PrimaryKey Type",
    Type="String",
    Default="S",
    AllowedPattern="[S]",
    MinLength="1",
    MaxLength="1",
    ConstraintDescription="must be S"
))

segmentSetsFeedbackTableHashkeyName = t.add_parameter(Parameter(
    "SegmentSetsFeedbackTableHashKeyElementName",
    Description="Segment Sets Feedback Table HashType PrimaryKey Name",
    Type="String",
    Default="feedbackId",
    AllowedPattern="[a-zA-Z0-9]*",
    MinLength="1",
    MaxLength="2048",
    ConstraintDescription="must contain only alphanumberic characters"
))

segmentSetsFeedbackTableHashkeyType = t.add_parameter(Parameter(
    "SegmentSetsFeedbackTableHashKeyElementType",
    Description="Segment Sets Feedback HashType PrimaryKey Type",
    Type="String",
    Default="S",
    AllowedPattern="[S]",
    MinLength="1",
    MaxLength="1",
    ConstraintDescription="must be S"
))

readunits = t.add_parameter(Parameter(
    "ReadCapacityUnits",
    Description="Provisioned read throughput",
    Type="Number",
    Default="5",
    MinValue="5",
    MaxValue="10000",
    ConstraintDescription="should be between 5 and 10000"
))

writeunits = t.add_parameter(Parameter(
    "WriteCapacityUnits",
    Description="Provisioned write throughput",
    Type="Number",
    Default="10",
    MinValue="5",
    MaxValue="10000",
    ConstraintDescription="should be between 5 and 10000"
))

segmentDynamoDBTable = t.add_resource(Table(
    "segmentsDynamoDBTable",
    AttributeDefinitions=[
        AttributeDefinition(
            AttributeName=Ref(segmentTableHashkeyName),
            AttributeType=Ref(segmentTableHashkeyType)
        ),
    ],
    KeySchema=[
        KeySchema(
            AttributeName=Ref(segmentTableHashkeyName),
            KeyType="HASH"
        )
    ],
    ProvisionedThroughput=ProvisionedThroughput(
        ReadCapacityUnits=Ref(readunits),
        WriteCapacityUnits=Ref(writeunits)
    ),
    Tags=Tags(app="gap-fill-evaluation", stage=Ref(stage)),
    TableName=Join("-", ["SegmentsDynamoDBTable", Ref(stage)])
))

segmentSetsDynamoDBTable = t.add_resource(Table(
    "segmentSetsDynamoDBTable",
    AttributeDefinitions=[
        AttributeDefinition(
            AttributeName=Ref(segmentSetsTableHashkeyName),
            AttributeType=Ref(segmentSetsTableHashkeyType)
        ),
    ],
    KeySchema=[
        KeySchema(
            AttributeName=Ref(segmentSetsTableHashkeyName),
            KeyType="HASH"
        )
    ],
    ProvisionedThroughput=ProvisionedThroughput(
        ReadCapacityUnits=Ref(readunits),
        WriteCapacityUnits=Ref(writeunits)
    ),
    Tags=Tags(app="gap-fill-evaluation", stage=Ref(stage)),
    TableName=Join("-", ["SegmentSetsDynamoDBTable", Ref(stage)])
))

segmentSetsFeedbackDynamoDBTable = t.add_resource(Table(
    "segmentSetsFeedbackDynamoDBTable",
    AttributeDefinitions=[
        AttributeDefinition(
            AttributeName=Ref(segmentSetsFeedbackTableHashkeyName),
            AttributeType=Ref(segmentSetsFeedbackTableHashkeyType)
        ),
    ],
    KeySchema=[
        KeySchema(
            AttributeName=Ref(segmentSetsFeedbackTableHashkeyName),
            KeyType="HASH"
        )
    ],
    ProvisionedThroughput=ProvisionedThroughput(
        ReadCapacityUnits=Ref(readunits),
        WriteCapacityUnits=Ref(writeunits)
    ),
    Tags=Tags(app="gap-fill-evaluation", stage=Ref(stage)),
    TableName=Join("-", ["SegmentSetsFeedbackDynamoDBTable", Ref(stage)])
))

t.add_output(Output(
    "SegmentTableName",
    Value=Ref(segmentDynamoDBTable),
    Description="Table name of the newly created DynamoDB table",
))

t.add_output(Output(
    "SegmentSetsTableName",
    Value=Ref(segmentSetsDynamoDBTable),
    Description="Table name of the newly created DynamoDB table",
))

t.add_output(Output(
    "SegmentSetsFeedbackTableName",
    Value=Ref(segmentSetsFeedbackDynamoDBTable),
    Description="Table name of the newly created DynamoDB table",
))

print(t.to_json())
