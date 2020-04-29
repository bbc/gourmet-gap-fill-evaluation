import { Request } from 'express';

interface SegmentEvaluationRequestBody {
  setId: string;
  segmentId: string;
  evaluatorId: string;
  setSize: number;
  segmentNum: number;
  numberOfTranslationSegments: number;
  startTime: number;
  sourceLanguage: string;
  translationSystem: string;
  correctAnswers: string;
  hint: string;
  problem: string;
  source: string;
  translation: string;
}

interface SegmentEvaluationRequest extends Request {
  body: SegmentEvaluationRequestBody;
}

interface StartRequest extends Request {
  body: StartBody;
}

interface StartBody {
  setId: string;
  setName: string;
  evaluatorId: string;
}

interface DatasetRequest extends Request {
  body: DatasetBody;
}

interface DatasetBody {
  setName: string;
}

interface ExportRequest extends Request {
  body: ExportBody;
}

interface ExportBody {
  language: string;
}

export {
  SegmentEvaluationRequest,
  SegmentEvaluationRequestBody,
  StartRequest,
  DatasetRequest,
  ExportRequest,
};
