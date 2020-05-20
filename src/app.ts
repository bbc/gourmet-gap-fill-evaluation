import * as express from 'express';
import { Application } from 'express';
import * as multer from 'multer';
import { Instance } from 'multer';
import * as basicAuth from 'express-basic-auth';

import { buildIndexRoute } from './routes/index';
import { buildInstructionsRoute } from './routes/instructions';
import { buildStartRoute } from './routes/start';
import { buildBeginEvaluationRoute } from './routes/beginEvaluation';
import { buildEvaluationRoutes } from './routes/evaluation';
import { buildEndRoute } from './routes/end';
import { buildStatusRoute } from './routes/status';
import { buildDatasetRoutes } from './routes/dataset';
import { buildSuccessRoute } from './routes/success';
import { buildErrorRoute } from './routes/error';
import { buildExportDataRoutes } from './routes/exportData';

import './config';
import { logger } from './utils/logger';

const app: Application = express();
const port = process.env.PORT || 8080;

// support parsing of application/json type post data
app.use(express.json());
// support parsing of application/x-www-form-urlencoded post data
app.use(express.urlencoded({ extended: true }));
// Serve static assets in the public folder
app.use(express.static('public'));
// Use handlebars to render templates
app.set('view engine', 'hbs');
// Instantiate multer for uploads
const upload: Instance = multer({ dest: 'uploads/' });
// Enable Log in
if (process.env.ENABLE_AUTH === 'true') {
  if (
    process.env.PASSWORD === undefined ||
    process.env.USERNAME === undefined
  ) {
    throw new Error(
      'Log in cannot be enabled on the tool unless a password and username are specified in the config.'
    );
  } else {
    app.use(
      basicAuth({
        users: { [process.env.USERNAME]: process.env.PASSWORD },
        challenge: true, // To show login UI
      })
    );
  }
}

buildIndexRoute(app);
buildInstructionsRoute(app);
buildStartRoute(app);
buildBeginEvaluationRoute(app);
buildEvaluationRoutes(app);
buildEndRoute(app);
buildStatusRoute(app);
buildDatasetRoutes(app, upload);
buildSuccessRoute(app);
buildExportDataRoutes(app);
buildErrorRoute(app);

app.listen(port, () => {
  logger.info(`App running on port ${port}`);
});
