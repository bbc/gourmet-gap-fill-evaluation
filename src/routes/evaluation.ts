import { Request, Response, Application } from 'express';
import { getSentenceSet, getSentence, putSentenceAnswers } from '../api';
import {
  SentenceEvaluationRequest,
  SentenceEvaluationRequestBody,
} from '../models/requests';

const buildEvaluationRoutes = (app: Application) => {
  app.post('/evaluation', (req: SentenceEvaluationRequest, res: Response) => {
    const body: SentenceEvaluationRequestBody = req.body;
    const id: string = body.id;
    const setId: string = body.setId;
    const evaluatorId: string = body.evaluatorId;
    const numOfPracticeSentences = body.numOfPracticeSentences || 0;
    const setSize = body.setSize || 0;
    const sentenceNum = body.sentenceNum;
    const numberOfTranslationSegments = body.numberOfTranslationSegments;
    if (numOfPracticeSentences > 0) {
      res.redirect(
        `/evaluation?setId=${setId}&evaluatorId=${evaluatorId}&numOfPracticeSentences=${numOfPracticeSentences -
          1}&setSize=${setSize}&sentenceNum=${sentenceNum}`
      );
    } else {
      const answers = extractGapFillAnswersFromRequest(
        req,
        numberOfTranslationSegments
      );
      putSentenceAnswers(id, answers, evaluatorId)
        .then(() =>
          res.redirect(
            `/evaluation?setId=${setId}&evaluatorId=${evaluatorId}&setSize=${setSize}&sentenceNum=${sentenceNum}`
          )
        )
        .catch(error => {
          console.error(
            `Unable to store data: ${answers} for id: ${id} and evaluatorId: ${evaluatorId}. Error${error}`
          );
          res.redirect('/error?errorCode=postEvaluation');
        });
    }
  });

  app.get('/evaluation', (req: Request, res: Response) => {
    const setId = req.query.setId;
    const evaluatorId = req.query.evaluatorId;
    const numOfPracticeSentences = Number(
      req.query.numOfPracticeSentences || 0
    );
    const setSize = Number(req.query.setSize || 0);
    const sentenceNum: number = Number(req.query.sentenceNum || 0);
    getSentenceSet(setId)
      .then(sentenceSet => {
        const sentenceIds: string[] = Array.from(
          sentenceSet.sentenceIds || new Set()
        );
        const sentenceId: string = sentenceIds[sentenceNum];
        if (sentenceId !== undefined) {
          getSentence(sentenceId)
            .then(sentence => {
              res.render('evaluation', {
                reference: sentence.reference,
                translationSegments: sentence.translation.split('{ }'),
                setId,
                sentenceId,
                evaluatorId,
                numOfPracticeSentences,
                setSize,
                sentenceNum: sentenceNum + 1,
              });
            })
            .catch(error => {
              console.error(
                `Unable to get sentence with id ${sentenceId}. Error: ${error}`
              );
              res.redirect('/error?errorCode=getEvaluation');
            });
        } else {
          res.redirect(`/feedback?setId=${setId}&evaluatorId=${evaluatorId}`);
        }
      })
      .catch(error => {
        console.error(
          `Unable to get sentence set with id: ${setId}. Error: ${error}`
        );
        res.redirect('/error?errorCode=getEvaluation');
      });
  });
};

/**
 * Work around as the number of gaps in a sentence varies.
 * Takes the request and turns it into something of type 'any'.
 * From the number of translation segments we know the number of
 * gaps that will have been present is numberOfTranslationSegments - 1
 * Each input on the gaps form on the evaluation page will have been
 * given an index. As a result we can iterate through getting the input
 * from the body of the request.
 */
const extractGapFillAnswersFromRequest = (
  request: SentenceEvaluationRequest,
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
