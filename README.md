# Gap Fill Evaluation Tool

This project has received funding from the European Union’s Horizon 2020 research and innovation programme under grant agreement No 825299. <img src="./docs/images/EU_flag.jpg" width="25px">

This tool was built as part of the [GoURMET Project](https://gourmet-project.eu/). To complete [Gap Fill Evaluation](https://arxiv.org/abs/1809.00315). The user is presented with a series of segments. For each segment there is an original segment in the source language there is also a translation of that segment that has been translated by a human and a translation of that segment that has been translated by a machine translation system.

The evaluator will be presented with the full segment that has been translated by a human and the machine translated segment with gaps in. They will be asked to 'fill in the gaps' in the machine translated segment using the human translated segment as a 'hint'.  The evaluator fills in the gaps and based on how closely their answers match the missing word the quality of the translation model can be assessed.

## Running and using the Gap Fill Evaluation Tool

This tool is open sourced under GPL v3. Please view the [usage docs](./docs/usage.md) for how to set up and run this software. Issues should be raised via the GitHub issues. Code changes can be proposed by opening a pull request.

## Creating Data Sets for the App

TODO: Add link to Mikel's scripts for creating a data set once they have been open sourced.

## Developing the Gap Fill Evaluation Tool

Details on maintaining and developing the tool are in the [development docs](./docs/development.md).
