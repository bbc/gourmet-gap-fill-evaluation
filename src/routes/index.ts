import { Application, Request, Response } from 'express';

const buildIndexRoute = (app: Application) => {
  app.get('/', (req: Request, res: Response) => {
    res.render('instructions', {
      title: 'Gap Fill Evaluation Task',
      paragraphs: [
        'Thank you for agreeing to act as an evaluator for the Gourmet neural language project.',
        'The evaluation you are taking part in is a gap filling exercise.',
        'You will be shown a series of 30 sentences taken from either BBC or DW news output. Each sentence will have either a single word or multiple words missing, each replaced by a gap.',
        'Each gap holds the position of a single word only.',
        'Your task is to try to recreate the original news sentences by filling in the gap left by each missing word with the word you believe most likely to have been removed.',
        'On the next page you will receive specific instructions to carry out this evaluation.',
        'If you are happy to proceed please click ‘OK’.',
      ],
      formSubmissionUrl: '/instructions',
      datasetSubmissionUrl: '/dataset',
      exportDataUrl: '/exportData',
    });
  });
};

export { buildIndexRoute };
