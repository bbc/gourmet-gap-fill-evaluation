import { Request, Response, Application } from 'express';
import { getSegmentSet, getSegment, putSegmentAnswers } from '../dynamoDb/api';
import {
  SegmentEvaluationRequest,
  SegmentEvaluationRequestBody,
} from '../models/requests';
import { SegmentAnswer } from '../models/models';
import {
  convertListToColonSeparatedString,
  convertColonSeparatedStringToList,
} from '../utils';

const buildEvaluationRoutes = (app: Application) => {
  app.post('/evaluation', (req: SegmentEvaluationRequest, res: Response) => {
    const body: SegmentEvaluationRequestBody = req.body;
    const setId: string = body.setId;
    const evaluatorId: string = body.evaluatorId;
    const segmentId: string = body.segmentId;
    const setSize = body.setSize || 0;
    const segmentNum = body.segmentNum;
    const numberOfTranslationSegments = body.numberOfTranslationSegments;
    const startTime: number = body.startTime || NaN;
    const answers = extractGapFillAnswersFromRequest(
      req,
      numberOfTranslationSegments
    );
    const timeTaken = timeElapsed(startTime);
    putSegmentAnswers(
      new SegmentAnswer(
        segmentId,
        evaluatorId,
        answers,
        timeTaken,
        body.sourceLanguage,
        body.translationSystem,
        convertColonSeparatedStringToList(body.correctAnswers),
        body.hint,
        body.problem,
        body.source,
        body.translation
      )
    )
      .then(() =>
        res.redirect(
          `/evaluation?setId=${setId}&evaluatorId=${evaluatorId}&setSize=${setSize}&segmentNum=${segmentNum}`
        )
      )
      .catch(error => {
        console.error(
          `Unable to store data: ${answers} for id: ${segmentId} and evaluatorId: ${evaluatorId}. Error${error}`
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
                problem: segment.problem,
                source: segment.source,
                translationSegments: segment.problem.split('{ }'),
                setId,
                segmentId,
                evaluatorId,
                setSize,
                segmentNum: segmentNum + 1,
                numberOfTranslationSegments: segment.problem.split('{ }')
                  .length,
                startTime: new Date().getTime(),
                sourceLanguage: segment.sourceLanguage,
                translationSystem: segment.translationSystem,
                correctAnswers: convertListToColonSeparatedString(
                  segment.correctAnswers
                ),
                translation: segment.translation,
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

const timeElapsed = (
  timeStamp: number,
  currentTime: number = new Date().getTime()
): number => {
  if (isNaN(timeStamp)) {
    return 0;
  } else {
    return currentTime - timeStamp;
  }
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
): string[] => {
  const answers = [];
  const numberOfGaps = numberOfTranslationSegments - 1;
  for (let i = 0; i < numberOfGaps; i++) {
    const key = i.toString() || 0;
    const body: any = request.body;
    answers.push(body[key]);
  }
  return answers;
};

export { buildEvaluationRoutes, timeElapsed };
