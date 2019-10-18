import { Segment, SegmentSet } from './models/models';

const getSegmentSets = (): Promise<SegmentSet[]> => {
  return Promise.resolve([
    new SegmentSet('123', 'set 1', 'bg', 'en', new Set(['1'])),
  ]);
};

const getSegmentSet = (setId: string): Promise<SegmentSet> => {
  return Promise.resolve(
    new SegmentSet('123', 'set 1', 'bg', 'en', new Set(['1']))
  );
};

// tslint:disable-next-line:variable-name
const putSegmentSet = (segmentSet: SegmentSet): Promise<string> => {
  return Promise.resolve('ok');
};

const getSegment = (id: string): Promise<Segment> => {
  return Promise.resolve(
    new Segment(
      '1',
      'gourmet',
      'This is a segment, really it should be in Bulgarian',
      'the brittle , almost hostile sound awakes dösenden fishermen , the sleepy , sleepy after his cigarette packet fish , but before he has found what you it has the busy tourist already a box in the nose , he kept the cigarette not just put in the mouth , but in the hand , and a fourth click , the Feuerzeugs overlook , includes the courtesy .',
      'The snapping , almost hostile sound awakens the dozing { } , who sleepily sits up , sleepily { } for his cigarettes ; but before he has found what he is looking for , the eager { } is already holding a { } under his nose , not exactly sticking a cigarette between his { } but putting { } in his hand , and a { } click , that of the lighter , completes the overeager { } .',
      '20',
      [
        'fisherman',
        'gropes',
        'tourist',
        'pack',
        'lips',
        'one',
        'fourth',
        'courtesy',
      ]
    )
  );
};

/**
 * Returns the Id of the segment
 */
const putSegment = (segmentData: Segment): Promise<string> => {
  return Promise.resolve('ok');
};

const putSegmentAnswers = (
  segmentId: string,
  answers: string[],
  evaluatorId: string
): Promise<string> => {
  return Promise.resolve('ok');
};

const putSegmentSetFeedback = (
  setId: string,
  feedback: string,
  evaluatorId: string
): Promise<string> => {
  return Promise.resolve('ok');
};

export {
  getSegmentSets,
  getSegmentSet,
  putSegmentSet,
  getSegment,
  putSegment,
  putSegmentAnswers,
  putSegmentSetFeedback,
};
