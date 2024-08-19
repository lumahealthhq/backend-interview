import express, { Request, Response } from 'express';
import { config } from 'dotenv';
import { TopPatientsController } from './controllers/top-patients';
import { PatientScoreService } from './services/patient-score.service';
import { IPatientScoreService } from './services/patient-score.interface';

config();

const app = express();
const port = process.env.PORT || 3000;
const apiRouter = express.Router();
const v1Router = express.Router();

const patientScoreService: IPatientScoreService = new PatientScoreService('./sample-data/patients.json');
const topPatientController = new TopPatientsController(patientScoreService);

v1Router.get('/top-patients', (req, res) => topPatientController.getTopPatients(req, res));

apiRouter.use('/v1', v1Router);

app.use(express.json());
app.use('/api', apiRouter);

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

// TODO add readme