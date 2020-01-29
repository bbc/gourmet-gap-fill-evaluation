import { Application, Request, Response } from 'express';
import { getSegmentSets } from '../dynamoDb/api';

const buildStartRoute = (app: Application) => {
  app.get('/start', (req: Request, res: Response) => {
    getSegmentSets()
      .then(segmentSets => {
        const setsOrderedByName = segmentSets.sort((a, b) =>
          a.name.localeCompare(b.name)
        );
        res.render('start', { segmentSets: setsOrderedByName, evaluatorIds });
      })
      .catch(error => {
        console.error(`Could not get segment sets ${error}`);
        res.redirect('/error');
      });
  });
};

const evaluatorIds = [
  'BBC_1',
  'BBC_2',
  'BBC_3',
  'BBC_4',
  'BBC_5',
  'BBC_6',
  'BBC_7',
  'BBC_8',
  'BBC_9',
  'DW_1',
  'DW_2',
  'DW_3',
  'DW_4',
  'DW_5',
  'DW_6',
  'DW_7',
  'DW_8',
  'DW_9',
  'tester',
];

export { buildStartRoute };
