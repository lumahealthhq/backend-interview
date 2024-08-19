import { Request, Response } from 'express';
import { TopPatientsController } from "./top-patients";

let mockPatientScorerService = {
    getTopPatients: jest.fn(() => [
        {
            id: '541d25c9-9500-4265-8967-240f44ecf723',
            name: 'Samir Pacocha',
            age: 47,
            location: {
                latitude: 46.7110,
                longitude: -63.1150
            },
            acceptedOffers: 49,
            canceledOffers: 92,
            averageReplyTime: 2598,
            distance: 2000,
            score: 6.197,
        },
        {
            id: '90592106-a0d9-4329-8159-af7ce4ba45ad',
            name: 'Theo Effertz',
            age: 67,
            location: {
                latitude: -35.5336,
                longitude: -25.2795
            },
            acceptedOffers: 69,
            canceledOffers: 24,
            averageReplyTime: 3452,
            distance: 1000,
            score: 5.299,
        },
    ])
}

describe('top patients controller', () => {
    const topPatientsController = new TopPatientsController(mockPatientScorerService);

    it('should return bad request when no location is provided', () => {
        let req: Request;
        let res: Response;

        req = {
            query: {}
        } as Request;

        res = {
            send: jest.fn().mockReturnThis(),
            status: jest.fn().mockReturnThis(),
        } as any;

        topPatientsController.getTopPatients(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.send).toHaveBeenCalledWith('Facility location is required, send latitude and longitude as query params');
    });

    it('should return bad request when invalid latitude or longitude is provided', () => {
        let req: Request;
        let res: Response;

        req = {
            query: {
                latitude: 'not a number',
                longitude: 'not a number'
            }
        } as any;

        res = {
            send: jest.fn().mockReturnThis(),
            status: jest.fn().mockReturnThis(),
        } as any;

        topPatientsController.getTopPatients(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.send).toHaveBeenCalledWith('Invalid latitude or longitude');
    });

    it('should return top patients', () => {
        let req: Request;
        let res: Response;

        req = {
            query: {
                latitude: '37.79044690045309',
                longitude: '-122.40248653374681'
            }
        } as any;

        res = {
            send: jest.fn().mockReturnThis(),
            status: jest.fn().mockReturnThis(),
        } as any;

        topPatientsController.getTopPatients(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.send).toHaveBeenCalledWith([
            {
                id: '541d25c9-9500-4265-8967-240f44ecf723',
                name: "Samir Pacocha",
                age: 47,
                location: {
                    latitude: 46.7110,
                    longitude: -63.1150
                },
                acceptedOffers: 49,
                canceledOffers: 92,
                averageReplyTime: 2598,
                distance: 2000,
                score: 6.197,
            },
            {
                id: '90592106-a0d9-4329-8159-af7ce4ba45ad',
                name: 'Theo Effertz',
                age: 67,
                location: {
                    latitude: -35.5336,
                    longitude: -25.2795
                },
                acceptedOffers: 69,
                canceledOffers: 24,
                averageReplyTime: 3452,
                distance: 1000,
                score: 5.299,
            }
        ]);
    });
});