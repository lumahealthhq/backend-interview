import express from 'express'
import { createPatientPriorityList } from './index.js'
import { readFile } from 'fs/promises';

const app = express()
const PORT = 3000;

app.get('/v1/patients', async (req, res) => {
  try {
    const patients = JSON.parse(
      await readFile(
        new URL('./src/sample-data/patients.json', import.meta.url)
      )
    )

    const { latitude, longitude } = req.query

    const list = createPatientPriorityList({
      patients,
      facilityLatitude: latitude,
      facilityLongitude: longitude,
    })

    res.status(200).json({ patients: list })
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
})

app.listen(PORT, function (err) {
  if (err) console.log(err);
  console.log("Server listening on PORT", PORT);
});