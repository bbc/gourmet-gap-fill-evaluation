import { DocumentClient } from './node_modules/aws-sdk/clients/dynamodb';
import { Segment, SegmentSet } from '../models/models';

const dynamoClient = new DocumentClient({ region: 'eu-west-1' });

const getSegmentsTableName = (): string => {
  return process.env.SEGMENTS_TABLE_NAME || 'none';
};

const getSegmentSets = (): Promise<SegmentSet[]> => {
  return Promise.resolve([
    new SegmentSet('123', 'set 1', 'bg', 'en', new Set(['1:inf24:KU-13:24'])),
  ]);
};

const getSegmentSet = (setId: string): Promise<SegmentSet> => {
  return Promise.resolve(
    new SegmentSet('123', 'set 1', 'bg', 'en', new Set(['1:inf24:KU-13:24']))
  );
};

// tslint:disable-next-line:variable-name
const putSegmentSet = (segmentSet: SegmentSet): Promise<string> => {
  return Promise.resolve('ok');
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
        const sentencePair: Segment = convertAttributeMapToSegment(
          output.Items[0]
        );
        return sentencePair;
      }
    });
};

const convertAttributeMapToSegment = (
  item: DocumentClient.AttributeMap
): Segment => {
  const keys = item['keys'].split(':');
  return new Segment(
    item['id'],
    item['translationSystem'],
    item['source'],
    item['reference'],
    item['translation'],
    item['type'],
    keys,
    item['sourceLanguage'],
    item['targetLanguage']
  );
};

/**
 * Returns the Id of the segment
 */
const putSegment = (segmentData: Segment): Promise<string> => {
  const query = {
    Item: {
      id: segmentData.id,
      translationSystem: segmentData.translationSystem,
      source: segmentData.source,
      reference: segmentData.reference,
      translation: segmentData.translation,
      type: segmentData.type,
      keys: segmentData.keys.reduce((acc, key) => {
        return `${acc}:${key}`;
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
    });
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
