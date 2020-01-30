import * as express from 'express';
import { Application } from 'express';
import * as multer from 'multer';
import { Instance } from 'multer';

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
  // tslint:disable-next-line:no-console
  console.log(`App running on port ${port}`);
});
