import { Application, Request, Response } from 'express';

const buildInstructionsRoute = (app: Application) => {
  app.get('/instructions', (req: Request, res: Response) => {
    res.render('instructions', {
      title: 'PLEASE READ',
      paragraphs: [
        'In some evaluations participants will be presented with hint sentences. If you are provided with these please refer to them to aid your decision. ',
        'In others you’ll be on your own with just the rest of the sentence as context to guide you. Make your best guess.',
        'You can of course use your own knowledge to fill the gaps but please do not conduct research or speak to others for help.',
        'If you have no hint and really no idea just give it your best shot. However please avoid using words you suspect are not correct to give an amusing outcome!',
        'Please fill all gaps.',
        'If you have read the above and are happy to proceed please click ‘OK’.',
      ],
      formSubmissionUrl: '/start',
      datasetSubmissionUrl: '/dataset',
      exportDataUrl: '/exportData',
    });
  });
};

export { buildInstructionsRoute };
