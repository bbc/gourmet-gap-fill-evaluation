import { convertSegmentAnswerToGapAnswer } from '../exportData';
import { SegmentAnswer, GapAnswer } from '../../models/models';

describe('convertSegmentAnswerToGapAnswer', () => {
  test('', () => {
    const segmentAnswer = new SegmentAnswer(
      'segmentId',
      'evaluatorId1',
      ['a', 'b'],
      12,
      'sourceLanguage',
      'translationSystem',
      ['a', 'b'],
      'hint',
      'problem',
      'source',
      'translation',
      'answerId',
      123
    );

    const expectedResult = [
      new GapAnswer(
        'segmentId_1',
        'evaluatorId1',
        'sourceLanguage',
        'segmentId',
        2,
        'translationSystem',
        'a',
        'a',
        'YES',
        12,
        6,
        'problem',
        'hint',
        'translation',
        'source'
      ),
      new GapAnswer(
        'segmentId_2',
        'evaluatorId1',
        'sourceLanguage',
        'segmentId',
        2,
        'translationSystem',
        'b',
        'b',
        'YES',
        12,
        6,
        'problem',
        'hint',
        'translation',
        'source'
      ),
    ];
    expect(convertSegmentAnswerToGapAnswer(segmentAnswer)).toEqual(
      expectedResult
    );
  });
});
