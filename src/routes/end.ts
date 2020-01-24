import { Request, Response, Application } from 'express';

const buildEndRoute = (app: Application) => {
  app.get('/end', (req: Request, res: Response) => {
    res.render('infoButtonGeneric', {
      title: 'Evaluation Complete',
      subtitle: 'Thank you for taking part.',
      url: '/',
      buttonText: 'Evaluate another set',
    });
  });
};

export { buildEndRoute };
