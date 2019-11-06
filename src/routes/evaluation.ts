import { Request, Response, Application } from 'express';
import { getSegmentSet, getSegment, putSegmentAnswers } from '../dynamoDb/api';
import {
  SegmentEvaluationRequest,
  SegmentEvaluationRequestBody,
} from '../models/requests';

const buildEvaluationRoutes = (app: Application) => {
  app.post('/evaluation', (req: SegmentEvaluationRequest, res: Response) => {
    const body: SegmentEvaluationRequestBody = req.body;
    const id: string = body.id;
    const setId: string = body.setId;
    const evaluatorId: string = body.evaluatorId;
    const setSize = body.setSize || 0;
    const segmentNum = body.segmentNum;
    const numberOfTranslationSegments = body.numberOfTranslationSegments;
    const answers = extractGapFillAnswersFromRequest(
      req,
      numberOfTranslationSegments
    );
    putSegmentAnswers(id, answers, evaluatorId)
      .then(() =>
        res.redirect(
          `/evaluation?setId=${setId}&evaluatorId=${evaluatorId}&setSize=${setSize}&segmentNum=${segmentNum}`
        )
      )
      .catch(error => {
        console.error(
          `Unable to store data: ${answers} for id: ${id} and evaluatorId: ${evaluatorId}. Error${error}`
        );
        res.redirect('/error?errorCode=postEvaluation');
      });
  });

  app.get('/evaluation', (req: Request, res: Response) => {
    const setId = req.query.setId;
    const evaluatorId = req.query.evaluatorId;
    const setSize = Number(req.query.setSize || 0);
    const segmentNum: number = Number(req.query.segmentNum || 0);
    getSegmentSet(setId)
      .then(segmentSet => {
        const segmentIds: string[] = Array.from(
          segmentSet.segmentIds || new Set()
        );
        const segmentId: string = segmentIds[segmentNum];
        if (segmentId !== undefined) {
          getSegment(segmentId)
            .then(segment => {
              res.render('evaluation', {
                hint: segment.hint,
                translationSegments: segment.problem.split('{ }'),
                setId,
                segmentId,
                evaluatorId,
                setSize,
                segmentNum: segmentNum + 1,
                numberOfTranslationSegments: segment.problem.split('{ }')
                  .length,
              });
            })
            .catch(error => {
              console.error(
                `Unable to get segment with id ${segmentId}. Error: ${error}`
              );
              res.redirect('/error?errorCode=getEvaluation');
            });
        } else {
          res.redirect(`/feedback?setId=${setId}&evaluatorId=${evaluatorId}`);
        }
      })
      .catch(error => {
        console.error(
          `Unable to get segment set with id: ${setId}. Error: ${error}`
        );
        res.redirect('/error?errorCode=getEvaluation');
      });
  });
};

/**
 * Work around as the number of gaps in a segment varies.
 * Takes the request and turns it into something of type 'any'.
 * From the number of translation segments we know the number of
 * gaps that will have been present is numberOfTranslationSegments - 1
 * Each input on the gaps form on the evaluation page will have been
 * given an index. As a result we can iterate through getting the input
 * from the body of the request.
 */
const extractGapFillAnswersFromRequest = (
  request: SegmentEvaluationRequest,
  numberOfTranslationSegments: number
) => {
  const answers = [];
  const numberOfGaps = numberOfTranslationSegments - 1;
  for (let i = 0; i < numberOfGaps; i++) {
    const key = i.toString() || 0;
    const body: any = request.body;
    answers.push(body[key]);
  }
  return answers;
};

export { buildEvaluationRoutes };
