"""Check get_top_scores."""

import os

from faker import Faker

from patient_sorting import get_top_scores

TEST_DATA = os.path.join(os.path.dirname(__file__), 'patients_50.json')


def test_count_as_requested():
    """Make sure get_top_scores returns the requested number."""
    lat, lon = Faker().local_latlng(coords_only=True)
    assert len(get_top_scores(TEST_DATA, lat, lon, 7)) == 7
