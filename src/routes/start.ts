import { Application, Request, Response } from 'express';
import { getSentenceSets } from '../api';

const buildStartRoute = (app: Application) => {
  app.get('/start', (req: Request, res: Response) => {
    getSentenceSets().then(sentenceSets => {
      res.render('start', { sentenceSets, evaluatorIds });
    });
  });
};

const evaluatorIds = ['tester'];

export { buildStartRoute };
