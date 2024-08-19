import { Request, Response } from 'express';
import { IPatientScoreService } from '../services/patient-score.interface';

export class TopPatientsController {
    constructor(
        private readonly patientScorerService: IPatientScoreService
    ) { }

    public async getTopPatients(req: Request, res: Response): Promise<Response> {
        const { latitude, longitude } = req.query;
        if (!latitude || !longitude) {
            return res.status(400).send('Facility location is required, send latitude and longitude as query params');
        }

        const latitudeFloat = parseFloat(latitude as string);
        const longitudeFloat = parseFloat(longitude as string);
        if (isNaN(latitudeFloat) || isNaN(longitudeFloat)) {
            return res.status(400).send('Invalid latitude or longitude');
        }

        const patients = this.patientScorerService.getTopPatients({ lat: latitudeFloat, long: longitudeFloat });

        return res.status(200).send(patients);
    }
}