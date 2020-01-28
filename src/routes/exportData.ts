import { Application, Request, Response } from 'express';
import { ExportRequest } from '../models/requests';
import { getSegmentAnswers } from '../dynamoDb/api';
import { SegmentAnswer } from '../models/models';
import * as archiver from 'archiver';
import { createWriteStream } from 'fs';
import { createObjectCsvWriter } from 'csv-writer';
import { groupBy, flatten } from 'underscore';

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
    .then(fileToZip => zipFiles([fileToZip], zipFileName))
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
      res.redirect(500, '/error?errorCode=postExportDataFailCSVCreate');
    });
};

const zipFiles = (filesToZip: string[], zipFileName: string): Promise<void> => {
  const stream = createWriteStream(zipFileName);
  const archive = archiver('zip');
  archive.pipe(stream);
  filesToZip.map(filename => archive.file(filename, {}));
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
  const gapAnswers = transformSegmentAnswersToGapAnswers(answers, language);

  const csvWriter = createObjectCsvWriter({
    path: filename,
    header: [
      { id: 'gapId', title: 'Gap Id' },
      { id: 'evaluatorId', title: 'Evaluator Id' },
      { id: 'segmentId', title: 'Sentence Id' },
      { id: 'sourceLanguage', title: 'Source Language' },
      { id: 'numOfGapsInSentence', title: 'Number of Gaps' },
      { id: 'translationSystem', title: 'Hint Type' },
      { id: 'correctAnswer', title: 'Missing Word' },
      { id: 'answerGiven', title: 'Answer Given' },
      { id: 'autoAnswerMatch', title: 'Auto Answer Match' },
      { id: 'autoAnswerMatch', title: 'Manual Answer Match' },
      { id: 'timeTaken', title: 'Sentence Submission Time (ms)' },
      { id: 'meanTimePerGap', title: 'Mean Time per Gap (ms)' },
      { id: 'problem', title: 'Sentence as seen by evaluator' },
      { id: 'hint', title: 'Hint sentence as seen by evaluator' },
      { id: 'translation', title: 'Sentence without gaps' },
      { id: 'source', title: 'Source' },
    ],
  });

  csvWriter.writeRecords(gapAnswers);
};

const transformSegmentAnswersToGapAnswers = (
  answers: SegmentAnswer[],
  language: string
): GapAnswer[] => {
  const answersGroupedBySegmentId = groupBy<SegmentAnswer>(
    answers,
    'segmentId'
  );
  const segmentGroups: SegmentAnswer[][] = Object.values(
    answersGroupedBySegmentId
  );

  // Segment Ids must be assigned human readable ids
  const gapAnswers = segmentGroups.map((segmentAnswers, i) => {
    return segmentAnswers.map(segmentAnswer =>
      convertSegmentAnswerToGapAnswer(
        `${language.toUpperCase()}_GF_${i + 1}`,
        segmentAnswer
      )
    );
  });
  return flatten(gapAnswers);
};

const convertSegmentAnswerToGapAnswer = (
  segmentId: string,
  segmentAnswer: SegmentAnswer
): GapAnswer[] => {
  const answers = segmentAnswer.answers;
  const correctAnswers = segmentAnswer.correctAnswers;
  const meanTimePerGapInMilliseconds = Math.round(
    segmentAnswer.timeTaken / answers.length
  );

  return answers.map((answer, i) => {
    const isCorrect: string = checkAnswer(answer, correctAnswers[i]);

    return new GapAnswer(
      `${segmentId}_${i + 1}`,
      segmentAnswer.evaluatorId,
      segmentAnswer.sourceLanguage,
      segmentId,
      answers.length,
      segmentAnswer.translationSystem,
      correctAnswers[i],
      answer,
      isCorrect,
      segmentAnswer.timeTaken,
      meanTimePerGapInMilliseconds,
      segmentAnswer.problem,
      segmentAnswer.hint,
      segmentAnswer.translation,
      segmentAnswer.source
    );
  });
};

const checkAnswer = (answer: string, correctAnswer: string): string =>
  answer.toLowerCase() === correctAnswer.toLowerCase() ? 'YES' : 'NO';

class GapAnswer {
  constructor(
    public gapId: string,
    public evaluatorId: string,
    public sourceLanguage: string,
    public segmentId: string,
    public numOfGapsInSentence: number,
    public translationSystem: string,
    public correctAnswer: string,
    public answerGiven: string,
    public autoAnswerMatch: string,
    public timeTaken: number,
    public meanTimePerGap: number,
    public problem: string,
    public hint: string,
    public translation: string,
    public source: string
  ) {}
}

export { buildExportDataRoutes };
