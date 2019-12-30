#!/usr/bin/env python3
"""Entrypoint."""

import os
import random

from flask import Flask, request

from patient_sorting import get_top_scores, get_mostly_top_scores

app = Flask(__name__)


@app.route('/patients/ranked')
def _pts_ranked():
    """Only API endpoint we provide."""
    lat = request.args.get('lat', None)
    lon = request.args.get('lon', None)
    limit = int(request.args.get('limit', 10))
    luck = request.args.get('luck', 'maybe')
    if not lat or not lon:
        return 'Missing required "lat" or "lon" parameters', 400
    if luck not in ['yes', 'no', 'maybe']:
        return '"luck" must be one of "yes", "no" or "maybe"', 400

    # Find the patient data file
    infile = os.getenv('PATIENT_DATA_FILE',
                       os.path.join(
                        os.path.dirname(__file__), 'data', 'patients.json'))

    # Make up our mind as to what maybe means
    if luck == "maybe":
        luck = random.choice(["yes", "no"])

    # Are we feeling lucky, punk?
    if luck == "no":
        df = get_top_scores(infile, lat, lon, limit)
    elif luck == "yes":
        df = get_mostly_top_scores(infile, lat, lon, limit)

    # And maybe inject
    return df.to_dict(orient='index')


if __name__ == '__main__':
    app.run(os.getenv('FLASK_PORT', 5000))
