import * as express from 'express';
import { Application } from 'express';

import { buildIndexRoute } from './routes/index';
import { buildStartRoute } from './routes/start';
import { buildBeginEvaluationRoute } from './routes/beginEvaluation';
import { buildEvaluationRoutes } from './routes/evaluation';
import { buildFeedbackRoutes } from './routes/feedback';
import { buildEndRoute } from './routes/end';
import { buildStatusRoute } from './routes/status';

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

buildIndexRoute(app);
buildStartRoute(app);
buildBeginEvaluationRoute(app);
buildEvaluationRoutes(app);
buildFeedbackRoutes(app);
buildEndRoute(app);
buildStatusRoute(app);

app.listen(port, () => {
  // tslint:disable-next-line:no-console
  console.log(`App running on port ${port}`);
});
