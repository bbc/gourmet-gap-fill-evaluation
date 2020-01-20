import { Application, Request, Response } from 'express';
import { getSegmentSets } from '../dynamoDb/api';

const buildStartRoute = (app: Application) => {
  app.get('/start', (req: Request, res: Response) => {
    getSegmentSets()
      .then(segmentSets => {
        res.render('start', { segmentSets, evaluatorIds });
      })
      .catch(error => {
        console.error(`Could not get segment sets ${error}`);
        res.redirect('/error');
      });
  });
};

const evaluatorIds = ['tester', 'BBC_1'];

export { buildStartRoute };
