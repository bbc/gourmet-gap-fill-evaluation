import { Request, Response, Application } from 'express';
import { putSegmentSetFeedback } from '../dynamoDB/api';
import { FeedbackRequest } from '../models/requests';

const buildFeedbackRoutes = (app: Application) => {
  app.post('/feedback', (req: FeedbackRequest, res: Response) => {
    const feedback: string = req.body.feedback;
    const setId: string = req.body.setId;
    const evaluatorId: string = req.body.evaluatorId;
    putSegmentSetFeedback(setId, feedback, evaluatorId)
      .then(() => res.redirect('/end'))
      .catch(error => {
        console.error(
          `Could not save feedback: ${feedback} for segment set id: ${setId}. Error:${error}`
        );
        res.redirect('/error?errorCode=postFeedback');
      });
  });

  app.get('/feedback', (req: Request, res: Response) => {
    const setId = req.query.setId;
    const evaluatorId = req.query.evaluatorId;
    res.render('feedback', { setId, evaluatorId });
  });
};

export { buildFeedbackRoutes };
