import * as uuidv1 from 'uuid/v1';

class SegmentSet {
  constructor(
    public setId: string,
    public name: string,
    public sourceLanguage: string,
    public targetLanguage: string,
    public segmentIds?: Set<string>,
    public evaluatorIds?: Set<string>
  ) {}
}

class Segment {
  constructor(
    public id: string,
    public translationSystem: string,
    public source: string,
    public translation: string,
    public hint: string,
    public problem: string,
    public gapDensity: string,
    public context: string,
    public entropyMode: string,
    public correctAnswers: string[],
    public sourceLanguage: string,
    public targetLanguage: string
  ) {}
}

class SegmentAnswer {
  public answerId: string;
  public timestamp: number;
  constructor(
    public segmentId: string,
    public evaluatorId: string,
    public answers: string[],
    public timeTaken: number,
    public sourceLanguage: string,
    public translationSystem: string,
    public correctAnswers: string[],
    public hint: string,
    public problem: string,
    public source: string,
    public translation: string,
    answerId?: string,
    timestamp?: number
  ) {
    this.answerId = answerId === undefined ? uuidv1() : answerId;
    this.timestamp = timestamp === undefined ? -1 : timestamp;
  }
}

interface DatasetFile {
  id: string;
  sourceLanguage: string;
  targetLanguage: string;
  segments: Segment[];
  evaluatorIds: Set<string>;
}

interface EvaluatorSet {
  setName: string;
  evaluators: string;
}

class GapAnswer {
  constructor(
    public gapId: string,
    public evaluatorId: string,
    public sourceLanguage: string,
    public segmentId: string,
    public numOfGapsInSentence: number,
    public translationSystem: string,
    public correctAnswer: string,
    public answerGiven: string,
    public autoAnswerMatch: string,
    public timeTaken: number,
    public meanTimePerGap: number,
    public problem: string,
    public hint: string,
    public translation: string,
    public source: string
  ) {}
}

export {
  SegmentSet,
  Segment,
  SegmentAnswer,
  DatasetFile,
  EvaluatorSet,
  GapAnswer,
};
