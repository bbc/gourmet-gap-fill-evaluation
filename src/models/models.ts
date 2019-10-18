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
    public reference: string,
    public translation: string,
    public type: string,
    public keys: string[],
    public sourceLanguage?: string,
    public targetLanguage?: string
  ) {}
}

interface DatasetFile {
  id: string;
  sourceLanguage: string;
  targetLanguage: string;
  segments: Segment[];
}

export { SegmentSet, Segment, DatasetFile };
