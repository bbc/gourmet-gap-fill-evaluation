import { Application, Request, Response } from 'express';
import { Instance } from 'multer';
import { readFileSync, unlink } from 'fs';
import { DatasetFile, SegmentSet } from '../models/models';
import { DatasetRequest } from '../models/requests';
import { putSegment, putSegmentSet } from '../dynamoDb/api';

const buildDatasetRoutes = (app: Application, upload: Instance) => {
  app.get('/dataset', (req: Request, res: Response) => {
    res.render('dataset');
  });

  app.post(
    '/dataset',
    upload.single('dataset'),
    (req: DatasetRequest, res: Response) => {
      const dataset: DatasetFile = JSON.parse(
        readFileSync(req.file.path, 'utf-8')
      );
      const name = req.body.setName || 'defaultName';
      submitDataset(dataset, name)
        .then(() => {
          res.redirect('/success');
        })
        .catch(error => {
          console.error(
            `Could not submit dataset:${JSON.stringify(
              dataset
            )}. Error: ${error}`
          );
          res.redirect('/error?errorCode=postDataset');
        })
        .finally(() => {
          unlink(req.file.path, err => {
            if (err) {
              console.error(`Failed to delete file ${req.file.path}`);
            }
          });
        });
    }
  );
};

const submitDataset = (dataset: DatasetFile, name: string) => {
  return Promise.all(
    dataset.segments.map(segment => {
      segment.sourceLanguage = dataset.sourceLanguage;
      segment.targetLanguage = dataset.targetLanguage;
      return putSegment(segment).then(() => {
        return segment.id;
      });
    })
  )
    .then(segmentIds => {
      return putSegmentSet(
        new SegmentSet(
          dataset.id,
          name,
          dataset.sourceLanguage,
          dataset.targetLanguage,
          new Set(segmentIds)
        )
      );
    })
    .catch(error => {
      throw error;
    });
};

export { buildDatasetRoutes };
