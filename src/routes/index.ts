import { Application, Request, Response } from 'express';

const buildIndexRoute = (app: Application) => {
  app.get('/', (req: Request, res: Response) => {
    res.render('instructions', {
      title: 'Gap Fill Evaluation Task',
      paragraphs: [
        'Thank you for agreeing to act as an evaluator for the Gourmet neural language project.',
        'The evaluation you are taking part in is a gap filling exercise.',
        'You will be shown a series of 30 sentences taken from either BBC or DW news output. Each sentence will have one or more words missing, each replaced by a gap.',
        'Your task is to try to recreate the original news sentences by typing the words that you believe are missing into each of the gaps.',
        'If you are happy to proceed please click ‘OK’.',
      ],
      formSubmissionUrl: '/instructions',
      datasetSubmissionUrl: '/dataset',
      exportDataUrl: '/exportData',
    });
  });
};

export { buildIndexRoute };
