const getErrorText = (errorCode: string): string => {
  switch (errorCode) {
    case 'postEvaluation':
      return 'Unable to save evaluation score.';
    case 'getEvaluation':
      return 'Unable to retrieve sentence.';
    case 'postStartFailSentenceSet':
      return 'Could not get set of sentences for evaluation.';
    case 'postStartFailEvaluatorId':
      return 'Could not save your evaluation ID.';
    case 'postFeedback':
      return 'Could not save your feedback, please contact us directly to give us feedback. Your scores for the gap fill evaluation have been saved you do not need to complete the test again.';
    default:
      return 'It is not possible to complete that action right now.';
  }
};

export { getErrorText };
