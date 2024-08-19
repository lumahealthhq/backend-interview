import fs from 'fs/promises'
import PatientsRepository from './patients.repository.abstract';
import Patient from '../../../@types/patient';
import path from 'path';
import { z } from 'zod';

class PatientsJsonRepositoryImpl implements PatientsRepository {
  async getPatientsWaitlist(): Promise<Patient[]> {
    const patientsJsonPath = path.join(process.cwd(), 'assets', 'patients.json')
    const raw = await fs.readFile(patientsJsonPath, 'utf-8')
    const serialized = JSON.parse(raw)

    const schema = this.getPatientsSchema()
    const patients = schema.parse(serialized)
    return patients
  }

  private getPatientsSchema() {
    return z.array(
      z.object({
        id: z.string().uuid(),
        name: z.string(),
        age: z.coerce.number().min(0),
        acceptedOffers: z.coerce.number().min(0),
        canceledOffers: z.coerce.number().min(0),
        averageReplyTime: z.coerce.number().min(0),
        location: z.object({
          latitude: z.coerce.number().min(-90).max(90),
          longitude: z.coerce.number().min(-180).max(180),
        })
      })
    )
  }
}

export default PatientsJsonRepositoryImpl
