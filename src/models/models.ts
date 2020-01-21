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
  public answerId?: string;
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
    answerId?: string
  ) {
    this.answerId = answerId === undefined ? uuidv1() : answerId;
  }
}

class SegmentSetFeedback {
  public feedbackId: string;
  constructor(
    public evaluatorId: string,
    public setId: string,
    public feedback: string,
    public sourceLanguage: string,
    feedbackId?: string
  ) {
    this.feedbackId = feedbackId === undefined ? uuidv1() : feedbackId;
  }
}

interface DatasetFile {
  id: string;
  sourceLanguage: string;
  targetLanguage: string;
  segments: Segment[];
}

export { SegmentSet, Segment, SegmentAnswer, SegmentSetFeedback, DatasetFile };
