import * as express from 'express';
import { Request, Response, Application } from 'express';
import {
  getSentenceSet,
  getSentence,
  putSentenceAnswers,
  putSentenceSetFeedback,
  getSentenceSets,
  putSentenceSet,
} from './api';
import {
  SentenceEvaluationRequest,
  SentenceEvaluationRequestBody,
  FeedbackRequest,
  StartRequest,
} from './models/requests';
import { getErrorText } from './uiText';
import { SentenceSet } from './models/models';

const app: Application = express();
const port = process.env.PORT || 8080;

// support parsing of application/json type post data
app.use(express.json());
// support parsing of application/x-www-form-urlencoded post data
app.use(express.urlencoded({ extended: true }));
// Serve static assets in the public folder
app.use(express.static('public'));
// Use handlebars to render templates
app.set('view engine', 'hbs');

app.get('/', (req: Request, res: Response) => {
  res.render('index');
});

app.get('/start', (req: Request, res: Response) => {
  getSentenceSets().then(sentenceSets => {
    res.render('start', { sentenceSets });
  });
});

app.post('/beginEvaluation', (req: StartRequest, res: Response) => {
  const setId = req.body.setId;
  const evaluatorId = req.body.evaluatorId;
  getSentenceSet(setId)
    .then(sentenceSet => {
      addEvaluatorIdToSentenceSet(evaluatorId, sentenceSet)
        .then(() => {
          const sentenceIdsList = Array.from(
            sentenceSet.sentenceIds || new Set()
          );
          res.redirect(
            `/evaluation?setId=${setId}&numOfPracticeSentences=5&evaluatorId=${evaluatorId}&setSize=${sentenceIdsList.length}&currentSentenceNum=0`
          );
        })
        .catch(error => {
          console.error(
            `Unable to add evaluatorId:${evaluatorId} to sentence set:${setId}. Error: ${error}`
          );
          res.redirect('/error?errorCode=postStartFailEvaluatorId');
        });
    })
    .catch(error => {
      console.error(
        `Unable to retrieve sentence set with id: ${setId}. Error: ${error}`
      );
      res.redirect('/error?errorCode=postStartFailSentenceSet');
    });
});

const addEvaluatorIdToSentenceSet = (
  evaluatorId: string,
  sentenceSet: SentenceSet
): Promise<string> => {
  const evaluatorIds: Set<string> =
    sentenceSet.evaluatorIds === undefined
      ? (sentenceSet.evaluatorIds = new Set([evaluatorId]))
      : sentenceSet.evaluatorIds.add(evaluatorId);

  const updatedSentenceSet = new SentenceSet(
    sentenceSet.name,
    sentenceSet.sourceLanguage,
    sentenceSet.targetLanguage,
    sentenceSet.sentenceIds,
    sentenceSet.setId,
    evaluatorIds
  );
  return putSentenceSet(updatedSentenceSet);
};

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

app.get('/evaluation', (req: Request, res: Response) => {
  const setId = req.query.setId;
  const evaluatorId = req.query.evaluatorId;
  const numOfPracticeSentences = Number(req.query.numOfPracticeSentences || 0);
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

app.post('/feedback', (req: FeedbackRequest, res: Response) => {
  const feedback: string = req.body.feedback;
  const setId: string = req.body.setId;
  const evaluatorId: string = req.body.evaluatorId;
  putSentenceSetFeedback(setId, feedback, evaluatorId)
    .then(() => res.redirect('/end'))
    .catch(error => {
      console.error(
        `Could not save feedback: ${feedback} for sentence set id: ${setId}. Error:${error}`
      );
      res.redirect('/error?errorCode=postFeedback');
    });
});

app.get('/feedback', (req: Request, res: Response) => {
  const setId = req.query.setId;
  const evaluatorId = req.query.evaluatorId;
  res.render('feedback', { setId, evaluatorId });
});

app.get('/end', (req: Request, res: Response) => {
  res.render('infoGeneric', {
    title: 'Evaluation Complete',
    subtitle: 'Thank you for taking part.',
  });
});

app.get('/error', (req: Request, res: Response) => {
  const errorCode = req.query.errorCode || 'generalError';
  const errorMessage = getErrorText(errorCode);
  res.status(404).render('error', { errorMessage });
});

app.get('/status', (req: Request, res: Response) => {
  res.status(200).send(`OK`);
});

app.listen(port, () => {
  // tslint:disable-next-line:no-console
  console.log(`App running on port ${port}`);
});
