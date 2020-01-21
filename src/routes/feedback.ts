import { Request, Response, Application } from 'express';
import { putSegmentSetFeedback } from '../dynamoDb/api';
import { FeedbackRequest } from '../models/requests';
import { SegmentSetFeedback } from '../models/models';

const buildFeedbackRoutes = (app: Application) => {
  app.post('/feedback', (req: FeedbackRequest, res: Response) => {
    const body = req.body;
    putSegmentSetFeedback(
      new SegmentSetFeedback(
        body.evaluatorId,
        body.setId,
        body.feedback,
        body.sourceLanguage
      )
    )
      .then(() => res.redirect('/end'))
      .catch(error => {
        console.error(
          `Could not save feedback: ${body.feedback} for segment set id: ${body.setId}. Error:${error}`
        );
        res.redirect('/error?errorCode=postFeedback');
      });
  });

  app.get('/feedback', (req: Request, res: Response) => {
    const setId = req.query.setId;
    const evaluatorId = req.query.evaluatorId;
    const sourceLanguage = req.query.sourceLanguage;
    res.render('feedback', { setId, evaluatorId, sourceLanguage });
  });
};

export { buildFeedbackRoutes };
