import { z } from 'zod';

import { coordinatesSchema } from './coordinates';

const patientRecordSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  age: z.number(),
  acceptedOffers: z.number(),
  canceledOffers: z.number(),
  averageReplyTime: z.number(),
  location: coordinatesSchema,
});

const notParsedpatientRecordSchema = patientRecordSchema.extend({
  location: z.object({
    latitude: z.string(),
    longitude: z.string(),
  }),
});

const patientRecordWithScoreSchema = patientRecordSchema.extend({
  score: z.number(),
});

const patientRecordWithScoreAndDistanceSchema =
  patientRecordWithScoreSchema.extend({
    distance: z.number(),
  });

type TNotParsedPatientRecord = z.infer<typeof notParsedpatientRecordSchema>;
type TPatientRecord = z.infer<typeof patientRecordSchema>;
type TPatientRecordWithScore = z.infer<typeof patientRecordWithScoreSchema>;
type TPatientRecordWithScoreAndDistance = z.infer<
  typeof patientRecordWithScoreAndDistanceSchema
>;

export {
  patientRecordSchema,
  TPatientRecord,
  notParsedpatientRecordSchema,
  TNotParsedPatientRecord,
  patientRecordWithScoreSchema,
  TPatientRecordWithScore,
  patientRecordWithScoreAndDistanceSchema,
  TPatientRecordWithScoreAndDistance,
};
