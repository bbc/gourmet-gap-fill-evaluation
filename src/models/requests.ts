import { Request } from 'express';

interface SegmentEvaluationRequestBody {
  id: string;
  setId: string;
  evaluatorId: string;
  setSize: number;
  segmentNum: number;
  numberOfTranslationSegments: number;
  startTime: number;
}

interface SegmentEvaluationRequest extends Request {
  body: SegmentEvaluationRequestBody;
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

interface DatasetRequest extends Request {
  body: DatasetBody;
}

interface DatasetBody {
  setName: string;
}

export {
  SegmentEvaluationRequest,
  SegmentEvaluationRequestBody,
  FeedbackRequest,
  StartRequest,
  DatasetRequest,
};
