import { Segment, SegmentSet, SegmentAnswer } from '../models/models';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import * as uuidv1 from 'uuid/v1';

const dynamoClient = new DocumentClient({ region: 'eu-west-1' });

const getSegmentSetsTableName = (): string => {
  return process.env.SEGMENT_SETS_TABLE_NAME || 'none';
};

const getSegmentsTableName = (): string => {
  return process.env.SEGMENTS_TABLE_NAME || 'none';
};

const getSegmentSetFeedbackTableName = (): string => {
  return process.env.SEGMENT_SET_FEEDBACK_TABLE_NAME || 'none';
};

const getSegmentSetAnswersTableName = (): string => {
  return process.env.SEGMENT_SET_ANSWERS_TABLE_NAME || 'none';
};

const getSegmentSets = (): Promise<SegmentSet[]> => {
  const query = {
    TableName: getSegmentSetsTableName(),
  };

  return dynamoClient
    .scan(query)
    .promise()
    .then(output => {
      const items = output.Items || [];
      return items.map(segmentSet => {
        return convertAttributeMapToSegmentSet(segmentSet);
      });
    })
    .catch(error => {
      throw error;
    });
};

const getSegmentSet = (setId: string): Promise<SegmentSet> => {
  const query = {
    TableName: getSegmentSetsTableName(),
    KeyConditionExpression: `setId = :id`,
    ExpressionAttributeValues: {
      ':id': setId,
    },
  };

  return dynamoClient
    .query(query)
    .promise()
    .then(output => {
      if (
        output.Count === undefined ||
        output.Count < 1 ||
        output.Items === undefined
      ) {
        throw new Error(`Set with id: ${setId} does not exist.`);
      } else {
        return convertAttributeMapToSegmentSet(output.Items[0]);
      }
    })
    .catch(error => {
      throw error;
    });
};

const putSegmentSet = (segmentSet: SegmentSet): Promise<string> => {
  const query = {
    Item: constructSentenceSetItem(segmentSet),
    TableName: getSegmentSetsTableName(),
  };

  return dynamoClient
    .put(query)
    .promise()
    .then(() => {
      return segmentSet.setId;
    })
    .catch(error => {
      throw error;
    });
};

const getSegment = (id: string): Promise<Segment> => {
  const query = {
    TableName: getSegmentsTableName(),
    KeyConditionExpression: `id = :id`,
    ExpressionAttributeValues: {
      ':id': id,
    },
  };

  return dynamoClient
    .query(query)
    .promise()
    .then(output => {
      if (
        output.Count === undefined ||
        output.Count < 1 ||
        output.Items === undefined
      ) {
        throw new Error(`Item with id: ${id} does not exist.`);
      } else {
        const segment: Segment = convertAttributeMapToSegment(output.Items[0]);
        return segment;
      }
    })
    .catch(error => {
      throw error;
    });
};

const putSegment = (segmentData: Segment): Promise<string> => {
  const query = {
    Item: {
      id: segmentData.id,
      translationSystem: segmentData.translationSystem,
      source: segmentData.source,
      hint: segmentData.hint,
      problem: segmentData.problem,
      gapDensity: segmentData.gapDensity,
      context: segmentData.context,
      entropyMode: segmentData.entropyMode,
      correctAnswers: segmentData.correctAnswers.reduce((acc, answer) => {
        return `${acc}:${answer}`;
      }),
      sourceLanguage: segmentData.sourceLanguage,
      targetLanguage: segmentData.targetLanguage,
    },
    TableName: getSegmentsTableName(),
  };

  return dynamoClient
    .put(query)
    .promise()
    .then(() => {
      return segmentData.id;
    })
    .catch(error => {
      throw error;
    });
};

const putSegmentAnswers = (segmentAnswer: SegmentAnswer): Promise<string> => {
  const id = segmentAnswer.answerId || uuidv1();
  const query = {
    Item: {
      answerId: id,
      segmentId: segmentAnswer.segmentId,
      evaluatorId: segmentAnswer.evaluatorId,
      answers: segmentAnswer.answers.reduce((acc, key) => {
        return `${acc}:${key}`;
      }),
      timeTaken: segmentAnswer.timeTaken,
      sourceLanguage: segmentAnswer.sourceLanguage,
      translationSystem: segmentAnswer.translationSystem,
      correctAnswers: segmentAnswer.correctAnswers,
    },
    TableName: getSegmentSetAnswersTableName(),
  };
  return dynamoClient
    .put(query)
    .promise()
    .then(() => {
      return id;
    })
    .catch(error => {
      throw error;
    });
};

const putSegmentSetFeedback = (
  setId: string,
  feedback: string,
  evaluatorId: string
): Promise<string> => {
  const feedbackId = uuidv1();
  const query = {
    Item: {
      feedbackId,
      setId,
      feedback,
      evaluatorId,
    },
    TableName: getSegmentSetFeedbackTableName(),
  };

  return dynamoClient
    .put(query)
    .promise()
    .then(() => {
      return feedbackId;
    })
    .catch(error => {
      throw error;
    });
};

// Helper Functions

/**
 * DynamoDB returns an attribute map when queried. This converts a generic attribute map to a Segment object
 */
const convertAttributeMapToSegment = (
  item: DocumentClient.AttributeMap
): Segment => {
  const correctAnswers = item['correctAnswers'].split(':');
  return new Segment(
    item['id'],
    item['translationSystem'],
    item['source'],
    item['hint'],
    item['problem'],
    item['gapDensity'],
    item['context'],
    item['entropyMode'],
    correctAnswers,
    item['sourceLanguage'],
    item['targetLanguage']
  );
};

/**
 * DynamoDB returns an attribute map when queried. This converts a generic attribute map to a SegmentSet object
 */
const convertAttributeMapToSegmentSet = (
  item: DocumentClient.AttributeMap
): SegmentSet => {
  const segmentIdsSet: DocumentClient.StringSet = item['segmentIds'];
  const segmentIds = segmentIdsSet === undefined ? [] : segmentIdsSet.values;
  const evaluatorIdsSet: DocumentClient.StringSet = item['evaluatorIds'];
  const evaluatorIds =
    evaluatorIdsSet === undefined ? [] : evaluatorIdsSet.values;
  return new SegmentSet(
    item['setId'],
    item['name'],
    item['sourceLanguage'],
    item['targetLanguage'],
    new Set(segmentIds),
    new Set(evaluatorIds)
  );
};

/** A set of segmentIds and a set of evaluatorIds can be undefined or empty.
 * Some fairly horrible logic to ensure that an empty or undefined set is not put into dynamo
 */
const constructSentenceSetItem = (segmentSet: SegmentSet) => {
  const segmentIds: Set<string> = segmentSet.segmentIds || new Set();
  const evaluatorIds: Set<string> = segmentSet.evaluatorIds || new Set();
  if (segmentIds.size < 1 && evaluatorIds.size < 1) {
    return {
      setId: segmentSet.setId,
      name: segmentSet.name,
      sourceLanguage: segmentSet.sourceLanguage.toUpperCase(),
      targetLanguage: segmentSet.targetLanguage.toUpperCase(),
    };
  }
  if (segmentIds.size < 1) {
    return {
      setId: segmentSet.setId,
      name: segmentSet.name,
      sourceLanguage: segmentSet.sourceLanguage.toUpperCase(),
      targetLanguage: segmentSet.targetLanguage.toUpperCase(),
      evaluatorIds: dynamoClient.createSet(Array.from(evaluatorIds)),
    };
  }
  if (evaluatorIds.size < 1) {
    return {
      setId: segmentSet.setId,
      segmentIds: dynamoClient.createSet(Array.from(segmentIds)),
      name: segmentSet.name,
      sourceLanguage: segmentSet.sourceLanguage.toUpperCase(),
      targetLanguage: segmentSet.targetLanguage.toUpperCase(),
    };
  } else {
    return {
      setId: segmentSet.setId,
      segmentIds: dynamoClient.createSet(Array.from(segmentIds)),
      name: segmentSet.name,
      sourceLanguage: segmentSet.sourceLanguage.toUpperCase(),
      targetLanguage: segmentSet.targetLanguage.toUpperCase(),
      evaluatorIds: dynamoClient.createSet(Array.from(evaluatorIds)),
    };
  }
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
