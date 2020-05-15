import { Application, Request, Response } from 'express';
import { ExportRequest } from '../models/requests';
import { getSegmentAnswers, getSegmentSets } from '../dynamoDb/api';
import {
  SegmentAnswer,
  SegmentSet,
  EvaluatorSet,
  GapAnswer,
} from '../models/models';
import * as archiver from 'archiver';
import { createWriteStream } from 'fs';
import { createObjectCsvWriter } from 'csv-writer';
import { groupBy, flatten, sortBy } from 'underscore';
import { logger } from '../utils/logger';

const buildExportDataRoutes = (app: Application) => {
  getExportData(app);
  postExportData(app);
};

const getExportData = (app: Application) => {
  app.get('/exportData', (req: Request, res: Response) => {
    const languageOptions = [
      { language: 'bg', displayName: 'Bulgarian' },
      { language: 'gu', displayName: 'Gujarati' },
      { language: 'sw', displayName: 'Swahili' },
      { language: 'tr', displayName: 'Turkish' },
    ];

    getSegmentSets()
      .then(segmentSets => {
        const evaluatorSets = segmentSets
          .sort((a, b) => a.name.localeCompare(b.name))
          .map(segmentSet => convertSegmentSetToEvaluatorSet(segmentSet));
        res.status(200).render('exportData', {
          languageOptions,
          evaluatorSets,
        });
      })
      .catch(error => {
        logger.error(`Could not get segment sets. Error: ${error}`);
        res.status(200).render('exportData', {
          languageOptions,
          evaluatorSets: [],
        });
      });
  });
};

const convertSegmentSetToEvaluatorSet = (
  segmentSet: SegmentSet
): EvaluatorSet => {
  const evaluatorIds = Array.from(segmentSet.evaluatorIds || []);
  const evaluatorIdsAsString =
    evaluatorIds.length === 0
      ? 'NONE'
      : evaluatorIds.reduce((acc, evaluator) => `${acc}, ${evaluator}`);
  return {
    setName: segmentSet.name,
    evaluators: evaluatorIdsAsString,
  };
};

const postExportData = (app: Application) => {
  app.post('/exportData', (req: ExportRequest, res: Response) => {
    const language: string = req.body.language;
    if (language === undefined) {
      logger.error(`Language not provided on POST request to export data`);
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
      logger.error(
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
  const filteredAnswers: SegmentAnswer[] = removeDuplicateAnswers(answers);
  const gapAnswers: GapAnswer[] = flatten(
    filteredAnswers.map(answer => convertSegmentAnswerToGapAnswer(answer))
  );

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

const removeDuplicateAnswers = (answers: SegmentAnswer[]): SegmentAnswer[] => {
  const segmentGroupsBySegmentId: SegmentAnswer[][] = Object.values(
    groupBy<SegmentAnswer>(answers, 'segmentId')
  );

  const filteredSegmentAnswers: SegmentAnswer[][] = segmentGroupsBySegmentId.map(
    segment => {
      const segmentGroupsByEvaluatorId: SegmentAnswer[][] = Object.values(
        groupBy<SegmentAnswer>(segment, 'evaluatorId')
      );
      const segmentAnswers: SegmentAnswer[] = segmentGroupsByEvaluatorId.map(
        segmentAnswer => {
          const earliestSegmentAnswer = sortBy<SegmentAnswer>(
            segmentAnswer,
            'timestamp'
          );
          return earliestSegmentAnswer[0];
        }
      );
      return segmentAnswers;
    }
  );
  return flatten(filteredSegmentAnswers);
};

const convertSegmentAnswerToGapAnswer = (
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
      `${segmentAnswer.segmentId}_${i + 1}`,
      segmentAnswer.evaluatorId,
      segmentAnswer.sourceLanguage,
      segmentAnswer.segmentId,
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

export {
  buildExportDataRoutes,
  convertSegmentAnswerToGapAnswer,
  removeDuplicateAnswers,
};
