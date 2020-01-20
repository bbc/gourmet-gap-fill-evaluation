import { Application, Request, Response } from 'express';
import { ExportRequest } from '../models/requests';
import { getSegmentAnswers } from '../dynamoDb/api';
import { SegmentAnswer } from '../models/models';
import * as archiver from 'archiver';
import { createWriteStream } from 'fs';
import { createObjectCsvWriter } from 'csv-writer';

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
    const language: string = req.body.language;
    if (language === undefined) {
      console.error(`Language not provided on POST request to export data`);
      res.redirect(404, '/error?errorCode=postExportFailLanguage');
    } else {
      sendData(language, res);
    }
  });
};

const sendData = (language: string, res: Response) => {
  const zipFileName = `/tmp/${language}.zip`;
  generateAnswersCSV(language)
    .then(fileToZip => zipFiles(fileToZip, zipFileName))
    .then(_ => {
      res.set({
        'Content-Disposition': `attachment; filename="${language}.zip"`,
      });
      res.sendFile(zipFileName);
    })
    .catch(error => {
      console.error(
        `Could not retrieve data for language: ${language}. Error${error}`
      );
      res.status(500).send('500');
    });
};

const zipFiles = (fileToZip: string, zipFileName: string): Promise<void> => {
  const stream = createWriteStream(zipFileName);
  const archive = archiver('zip');
  archive.pipe(stream);
  archive.file(fileToZip, {});
  archive.finalize();

  return new Promise<void>((resolve, reject) => {
    stream.on('close', resolve);
    stream.on('error', reject);
  });
};

const generateAnswersCSV = (language: string) => {
  const filename = `/tmp/${language}-gap-fill-answers.csv`;
  return getSegmentAnswers(language)
    .then(answers => createAnswersCSVFile(answers, filename, language))
    .then(_ => filename);
};

const createAnswersCSVFile = (
  answers: SegmentAnswer[],
  filename: string,
  language: string
) => {
  const csvWriter = createObjectCsvWriter({
    path: filename,
    header: [
      { id: 'evaluatorId', title: 'evaluatorId' },
      { id: 'sourceLanguage', title: 'sourceLanguage' },
    ],
  });

  csvWriter.writeRecords(answers);
};

export { buildExportDataRoutes };
