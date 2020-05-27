import * as express from 'express';
import { Application } from 'express';
import * as multer from 'multer';
import { Instance } from 'multer';
import secureRouter from './utils/secureRouter';

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

// Serve static assets in the public folder
app.use(express.static('public'));
// Enable password authentication on any path starting with /auth
app.use('/auth', secureRouter);
// Use handlebars to render templates
app.set('view engine', 'hbs');
// Instantiate multer for uploads
const upload: Instance = multer({ dest: 'uploads/' });

buildIndexRoute(app);
buildInstructionsRoute(app);
buildEndRoute(app);
buildSuccessRoute(app);
buildErrorRoute(app);
buildStatusRoute(app);

buildStartRoute(secureRouter);
buildBeginEvaluationRoute(secureRouter);
buildEvaluationRoutes(secureRouter);
buildDatasetRoutes(secureRouter, upload);
buildExportDataRoutes(secureRouter);

app.listen(port, () => {
  logger.info(`App running on port ${port}`);
});
