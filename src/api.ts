import { Sentence, SentenceSet, Language } from './models/models';

const getSentenceSets = (): Promise<SentenceSet[]> => {
  return Promise.resolve([
    new SentenceSet(
      'set 1',
      Language.BULGARIAN,
      Language.ENGLISH,
      new Set(['1']),
      '123'
    ),
  ]);
};

const getSentenceSet = (setId: string): Promise<SentenceSet> => {
  return Promise.resolve(
    new SentenceSet(
      'set 1',
      Language.BULGARIAN,
      Language.ENGLISH,
      new Set(['1']),
      '123'
    )
  );
};

// tslint:disable-next-line:variable-name
const putSentenceSet = (sentenceSet: SentenceSet): Promise<string> => {
  return Promise.resolve('ok');
};

const getSentence = (id: string): Promise<Sentence> => {
  return Promise.resolve(
    new Sentence(
      'This is a sentence, really it should be in Bulgarian',
      'the brittle , almost hostile sound awakes dösenden fishermen , the sleepy , sleepy after his cigarette packet fish , but before he has found what you it has the busy tourist already a box in the nose , he kept the cigarette not just put in the mouth , but in the hand , and a fourth click , the Feuerzeugs overlook , includes the courtesy .',
      'The snapping , almost hostile sound awakens the dozing { } , who sleepily sits up , sleepily { } for his cigarettes ; but before he has found what he is looking for , the eager { } is already holding a { } under his nose , not exactly sticking a cigarette between his { } but putting { } in his hand , and a { } click , that of the lighter , completes the overeager { } .',
      [
        'fisherman',
        'gropes',
        'tourist',
        'pack',
        'lips',
        'one',
        'fourth',
        'courtesy',
      ],
      Language.BULGARIAN,
      Language.ENGLISH,
      '1'
    )
  );
};

/**
 * Returns the Id of the sentence
 */
const putSentence = (id: string, sentenceData: Sentence): Promise<string> => {
  return Promise.resolve('ok');
};

const putSentenceAnswers = (
  sentenceId: string,
  answers: string[],
  evaluatorId: string
): Promise<string> => {
  return Promise.resolve('ok');
};

const putSentenceSetFeedback = (
  setId: string,
  feedback: string,
  evaluatorId: string
): Promise<string> => {
  return Promise.resolve('ok');
};

export {
  getSentenceSets,
  getSentenceSet,
  putSentenceSet,
  getSentence,
  putSentence,
  putSentenceAnswers,
  putSentenceSetFeedback,
};
