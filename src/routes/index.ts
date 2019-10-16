import { Application, Request, Response } from 'express';

const buildIndexRoute = (app: Application) => {
  app.get('/', (req: Request, res: Response) => {
    res.render('index');
  });
};

export { buildIndexRoute };
