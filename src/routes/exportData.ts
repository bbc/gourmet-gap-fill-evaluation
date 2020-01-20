import { Application, Request, Response } from 'express';
import { ExportRequest } from '../models/requests';

const buildExportDataRoutes = (app: Application) => {
  getExportData(app);
  postExportData(app);
};

const getExportData = (app: Application) => {
  app.get('/exportData', (req: Request, res: Response) => {
    res.status(200).render('exportData', {
      languageOptions: [{ language: 'bg', displayName: 'Bulgarian' }],
    });
  });
};

const postExportData = (app: Application) => {
  app.post('/exportData', (req: ExportRequest, res: Response) => {
    res.send(req.body.language);
  });
};

export { buildExportDataRoutes };
