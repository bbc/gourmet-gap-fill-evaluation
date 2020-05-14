import {
  convertSegmentAnswerToGapAnswer,
  removeDuplicateAnswers,
} from '../exportData';
import { SegmentAnswer, GapAnswer } from '../../models/models';

describe('convertSegmentAnswerToGapAnswer', () => {
  test('should convert segment answer to gap fill answers', () => {
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

describe('removeDuplicateAnswers', () => {
  test('should remove duplicate old answers from segments', () => {
    const segmentId1AnswerDuplicate = new SegmentAnswer(
      'segmentId1',
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
      200
    );

    const segmentId1AnswerEarliest = new SegmentAnswer(
      'segmentId1',
      'evaluatorId1',
      ['c', 'd'],
      12,
      'sourceLanguage',
      'translationSystem',
      ['a', 'b'],
      'hint',
      'problem',
      'source',
      'translation',
      'answerId',
      100
    );

    const segmentId1Answer = new SegmentAnswer(
      'segmentId1',
      'evaluatorId2',
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

    const segmentId2Answer = new SegmentAnswer(
      'segmentId2',
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

    const segmentAnswers = [
      segmentId1AnswerDuplicate,
      segmentId1AnswerEarliest,
      segmentId1Answer,
      segmentId2Answer,
    ];

    const expectedResult = [
      segmentId1AnswerEarliest,
      segmentId1Answer,
      segmentId2Answer,
    ];

    expect(removeDuplicateAnswers(segmentAnswers)).toEqual(expectedResult);
  });
});
