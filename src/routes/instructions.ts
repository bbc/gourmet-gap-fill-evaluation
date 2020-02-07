import { Application, Request, Response } from 'express';

const buildInstructionsRoute = (app: Application) => {
  app.get('/instructions', (req: Request, res: Response) => {
    res.render('instructions', {
      title: 'PLEASE READ',
      paragraphs: [
        'Some evaluation series contain hints to help you fill the gaps. If you are provided with these please refer to them to aid your decision.',
        'In others you’ll be on your own with just the rest of the sentence as context to guide you. Make your best guess.',
        'You can of course use your knowledge to fill the gaps where no hint is provided. However please do not conduct research or speak to others to help you fill gaps. We are not assessing you, we are comparing scenarios. Additional external input may invalidate results.',
        'Please fill all gaps.',
        'If you have no hint and no clear idea just give it your best shot. Please try to make a sentence you think may have been published by either DW or BBC and avoid using words you know or suspect are not correct because it will give an amusing outcome!',
        'If you have read the above and are happy to proceed please click ‘OK’.',
      ],
      formSubmissionUrl: '/start',
      datasetSubmissionUrl: '/dataset',
      exportDataUrl: '/exportData',
    });
  });
};

export { buildInstructionsRoute };
