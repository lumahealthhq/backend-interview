import { Router } from "express";
import { getPatientsTopList } from "../../lib";

const patientsSample = require("../../../patients.json");

export default (router: Router) => {
  router.get("/patients-recommended", (request, response) => {
    const { lat, lng } = request.query;

    if (!lat || !lng) {
      return response
        .status(400)
        .json({ error: 'Missing required params "lat" and/or "lng"' });
    }

    try {
      const facilityCoordinates = {
        latitude: lat as string,
        longitude: lng as string,
      };

      const patientsList = getPatientsTopList(
        patientsSample,
        facilityCoordinates
      );

      if (patientsList.length === 0) {
        return response.status(204).send(null);
      }

      return response.status(200).json(patientsList);
    } catch (err) {
      console.error(err);
      return response
        .status(500)
        .json({ error: "An error has occurred, please try again later." });
    }
  });
};
