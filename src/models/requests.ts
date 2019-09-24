import { Request } from 'express';

interface SentenceEvaluationRequestBody {
  id: string;
  setId: string;
  evaluatorId: string;
  numOfPracticeSentences: number;
  setSize: number;
  sentenceNum: number;
  numberOfTranslationSegments: number;
}

interface SentenceEvaluationRequest extends Request {
  body: SentenceEvaluationRequestBody;
}

interface FeedbackRequest extends Request {
  body: FeedbackRequestBody;
}

interface FeedbackRequestBody {
  setId: string;
  feedback: string;
  evaluatorId: string;
}

interface StartRequest extends Request {
  body: StartBody;
}

interface StartBody {
  setId: string;
  evaluatorId: string;
}

export {
  SentenceEvaluationRequest,
  SentenceEvaluationRequestBody,
  FeedbackRequest,
  StartRequest,
};
