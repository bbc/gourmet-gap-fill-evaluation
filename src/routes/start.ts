import { Application, Request, Response } from 'express';
import { getSegmentSets } from '../dynamoDb/api';

const buildStartRoute = (app: Application) => {
  app.get('/start', (req: Request, res: Response) => {
    getSegmentSets()
      .then(segmentSets => {
        const setsOrderedByName = segmentSets.sort((a, b) =>
          a.name.localeCompare(b.name)
        );
        res.render('start', {
          segmentSets: setsOrderedByName,
          evaluatorIds,
          paragraphs: [
            'The evaluation process is timed but there is no time limit.',
            'Please complete a series evaluation in an unbroken single sitting so that the timing is reflective of the time spent on the task.',
            'If you are ready to complete an evaluation now, select your ID and the test set you have been asked to do.',
            'Thank you again for your time.',
            'If you are ready to begin now please click ‘Start Evaluation’.',
          ],
        });
      })
      .catch(error => {
        console.error(`Could not get segment sets ${error}`);
        res.redirect('/error');
      });
  });
};

const evaluatorIds = [
  'BBC_1_GJ',
  'BBC_2_GJ',
  'BBC_3_GJ',
  'BBC_4_GJ',
  'BBC_5_GJ',
  'BBC_6_GJ',
  'BBC_7_GJ',
  'BBC_8_GJ',
  'BBC_9_GJ',
  'DW_1_GJ',
  'DW_2_GJ',
  'DW_3_GJ',
  'DW_4_GJ',
  'DW_5_GJ',
  'DW_6_GJ',
  'DW_7_GJ',
  'DW_8_GJ',
  'DW_9_GJ',
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
  'BBC_1_SW',
  'BBC_2_SW',
  'BBC_3_SW',
  'BBC_4_SW',
  'BBC_5_SW',
  'BBC_6_SW',
  'BBC_7_SW',
  'BBC_8_SW',
  'BBC_9_SW',
  'DW_1_SW',
  'DW_2_SW',
  'DW_3_SW',
  'DW_4_SW',
  'DW_5_SW',
  'DW_6_SW',
  'DW_7_SW',
  'DW_8_SW',
  'DW_9_SW',
  'BBC_1_TR',
  'BBC_2_TR',
  'BBC_3_TR',
  'BBC_4_TR',
  'BBC_5_TR',
  'BBC_6_TR',
  'BBC_7_TR',
  'BBC_8_TR',
  'BBC_9_TR',
  'DW_1_TR',
  'DW_2_TR',
  'DW_3_TR',
  'DW_4_TR',
  'DW_5_TR',
  'DW_6_TR',
  'DW_7_TR',
  'DW_8_TR',
  'DW_9_TR',
  'tester',
];

export { buildStartRoute };
