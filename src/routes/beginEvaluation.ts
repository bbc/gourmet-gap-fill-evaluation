import { Response, Application } from 'express';
import { getSegmentSet, putSegmentSet } from '../dynamoDb/api';
import { StartRequest } from '../models/requests';
import { SegmentSet } from '../models/models';

const buildBeginEvaluationRoute = (app: Application) => {
  app.post('/beginEvaluation', (req: StartRequest, res: Response) => {
    const setId = req.body.setId;
    const evaluatorId = req.body.evaluatorId;
    getSegmentSet(setId)
      .then(segmentSet => {
        addEvaluatorIdToSegmentSet(evaluatorId, segmentSet)
          .then(() => {
            const segmentIdsList = Array.from(
              segmentSet.segmentIds || new Set()
            );
            res.redirect(
              `/evaluation?setId=${setId}&evaluatorId=${evaluatorId}&setSize=${segmentIdsList.length}&segmentNum=0`
            );
          })
          .catch(error => {
            console.error(
              `Unable to add evaluatorId:${evaluatorId} to segment set:${setId}. Error: ${error}`
            );
            res.redirect('/error?errorCode=postStartFailEvaluatorId');
          });
      })
      .catch(error => {
        console.error(
          `Unable to retrieve segment set with id: ${setId}. Error: ${error}`
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

export { buildBeginEvaluationRoute };
