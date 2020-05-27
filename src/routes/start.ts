import { Request, Response, Router } from 'express';
import { getSegmentSets } from '../dynamoDb/api';
import { logger } from '../utils/logger';

const buildStartRoute = (router: Router) => {
  router.get('/start', (req: Request, res: Response) => {
    const setName = req.query.setName;
    getSegmentSets()
      .then(segmentSets => {
        const setsOrderedByName = segmentSets.sort((a, b) =>
          a.name.localeCompare(b.name)
        );

        const selectedSet =
          setsOrderedByName.find(set => set.name === setName) || null;

        let possibleEvaluatorIds: string[] = [];
        let usedEvaluatorIds: string[] = [];
        let unusedEvaluatorIds: string[] = [];

        if (selectedSet && selectedSet.possibleEvaluatorIds) {
          possibleEvaluatorIds = Array.from(selectedSet.possibleEvaluatorIds);
          usedEvaluatorIds = Array.from(selectedSet.evaluatorIds || new Set());
          unusedEvaluatorIds = possibleEvaluatorIds.filter(
            item => !usedEvaluatorIds.includes(item)
          );
        }

        res.render('start', {
          setName,
          segmentSets: setsOrderedByName,
          possibleEvaluatorIds: [...unusedEvaluatorIds, 'tester'],
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
        logger.error(`Could not get segment sets ${error}`);
        res.redirect('/error');
      });
  });
};

export { buildStartRoute };
