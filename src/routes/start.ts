import { Application, Request, Response } from 'express';
import { getSegmentSets } from '../dynamoDb/api';

const buildStartRoute = (app: Application) => {
  app.get('/start', (req: Request, res: Response) => {
    getSegmentSets().then(segmentSets => {
      res.render('start', { segmentSets, evaluatorIds });
    });
  });
};

const evaluatorIds = ['tester'];

export { buildStartRoute };
