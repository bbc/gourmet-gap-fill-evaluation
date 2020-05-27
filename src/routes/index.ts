import { Application, Request, Response } from 'express';

const buildIndexRoute = (app: Application) => {
  app.get('/', (req: Request, res: Response) => {
    res.render('instructions', {
      title: 'Gap Fill Evaluation Task',
      paragraphs: [
        'Thank you for agreeing to act as an evaluator for the Gourmet neural language project.',
        'The evaluation you are taking part in is a gap filling exercise.',
        'You will be shown a series of 30 sentences. Each sentence will have one or more words missing. Missing words will be replaced by a gap.',
        'Your task is to try to recreate the original sentences by typing the word that you believe is missing into each gap.',
        'If you are happy to proceed please click ‘OK’.',
      ],
      formSubmissionUrl: '/instructions',
      datasetSubmissionUrl: '/auth/dataset',
      exportDataUrl: '/auth/exportData',
    });
  });
};

export { buildIndexRoute };
