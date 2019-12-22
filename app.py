#!/usr/bin/env python3
"""Entrypoint."""

import os

from flask import Flask, request

from patient_sorting import get_top_scores

app = Flask(__name__)


@app.route('/patients/ranked')
def _pts_ranked():
    """Only API endpoint we provide."""
    lat = request.args.get('lat', None)
    lon = request.args.get('lon', None)
    limit = int(request.args.get('limit', 10))
    if not lat or not lon:
        return 'Missing required "lat" or "lon" parameters', 400

    # Find the patient data file
    infile = os.getenv('PATIENT_DATA_FILE',
                       os.path.join(
                        os.path.dirname(__file__), 'data', 'patients.json'))

    # Get scores
    df = get_top_scores(infile, lat, lon, limit)
    return df.to_dict(orient='index')


if __name__ == '__main__':
    app.run(os.getenv('FLASK_PORT', 5000))
