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
  'BBC_1_BG',
  'BBC_2_BG',
  'BBC_3_BG',
  'BBC_4_BG',
  'BBC_5_BG',
  'BBC_6_BG',
  'BBC_7_BG',
  'BBC_8_BG',
  'BBC_9_BG',
  'DW_1_BG',
  'DW_2_BG',
  'DW_3_BG',
  'DW_4_BG',
  'DW_5_BG',
  'DW_6_BG',
  'DW_7_BG',
  'DW_8_BG',
  'DW_9_BG',
  'tester',
];

export { buildStartRoute };
