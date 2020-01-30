import { Response, Application } from 'express';
import { putSegmentSet, getSegmentSets } from '../dynamoDb/api';
import { StartRequest } from '../models/requests';
import { SegmentSet } from '../models/models';
import { logger } from '../utils/logger';

const buildBeginEvaluationRoute = (app: Application) => {
  app.post('/beginEvaluation', (req: StartRequest, res: Response) => {
    const setName = req.body.setName;
    findSet(setName)
      .then(segmentSet => {
        const evaluatorId = req.body.evaluatorId;
        addEvaluatorIdToSegmentSet(evaluatorId, segmentSet)
          .then(() => {
            const segmentIdsList = Array.from(
              segmentSet.segmentIds || new Set()
            );
            res.redirect(
              `/evaluation?setId=${segmentSet.setId}&evaluatorId=${evaluatorId}&setSize=${segmentIdsList.length}&segmentNum=0`
            );
          })
          .catch(error => {
            logger.error(
              `Unable to add evaluatorId:${evaluatorId} to segment set:${segmentSet.setId}. Error: ${error}`
            );
            res.redirect('/error?errorCode=postStartFailEvaluatorId');
          });
      })
      .catch(error => {
        logger.error(
          `Unable to retrive a set with set name: ${setName}. Error: ${error}`
        );
        res.redirect('/error?errorCode=postStartFailSegmentSet');
      });
  });
};

const addEvaluatorIdToSegmentSet = (
  evaluatorId: string,
  segmentSet: SegmentSet
): Promise<string> => {
  const evaluatorIds: Set<string> =
    segmentSet.evaluatorIds === undefined
      ? (segmentSet.evaluatorIds = new Set([evaluatorId]))
      : segmentSet.evaluatorIds.add(evaluatorId);

  const updatedSegmentSet = new SegmentSet(
    segmentSet.setId,
    segmentSet.name,
    segmentSet.sourceLanguage,
    segmentSet.targetLanguage,
    segmentSet.segmentIds,
    evaluatorIds
  );
  return putSegmentSet(updatedSegmentSet);
};

const findSet = (setName: string): Promise<SegmentSet> =>
  getSegmentSets().then(segmentSets => {
    const segmentSetsArray = Array.from(segmentSets);
    const result = segmentSetsArray.find(set => set.name === setName);
    if (!result) {
      return Promise.reject(
        `Unable to retrieve a set with set name: ${setName}`
      );
    }
    return result;
  });

export { buildBeginEvaluationRoute };
