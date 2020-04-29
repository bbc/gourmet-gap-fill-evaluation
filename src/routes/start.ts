import { Application, Request, Response } from 'express';
import { getSegmentSets } from '../dynamoDb/api';

const buildStartRoute = (app: Application) => {
  app.get('/start', (req: Request, res: Response) => {
    const setName = req.query.setName;
    getSegmentSets()
      .then(segmentSets => {
        const setsOrderedByName = segmentSets
          .sort((a, b) => a.name.localeCompare(b.name))

        const selectedSet = setsOrderedByName.find(set => set.name === setName) || null;

        let possibleEvaluatorIds: string[] = [];

        if (selectedSet && selectedSet.evaluatorIds) {
          possibleEvaluatorIds = Array.from(selectedSet.evaluatorIds)
        }

        res.render('start', {
          setName,
          segmentSets: setsOrderedByName,
          possibleEvaluatorIds: [...possibleEvaluatorIds, "tester"],
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

export { buildStartRoute };
