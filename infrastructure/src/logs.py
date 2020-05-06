from troposphere import Template, Parameter, Ref, Join
from troposphere.logs import LogGroup

t = Template()

t.set_description(
    "Log group for GoURMET gap fill evaluation tool")

environment = t.add_parameter(Parameter(
    "Environment",
    Description="The name of the environment.",
    Type="String",
))

logGroup = t.add_resource(LogGroup(
    "logGroup",
    RetentionInDays=14,
    LogGroupName=Join("-", ["gourmet-gap-fill-evaluation", Ref(environment)])
))

print(t.to_json())