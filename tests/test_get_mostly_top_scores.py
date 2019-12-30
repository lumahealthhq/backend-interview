"""Check get_mostly_top_scores."""

import os

from faker import Faker

from patient_sorting import get_mostly_top_scores
from pprint import pprint

TEST_DATA = os.path.join(os.path.dirname(__file__), 'patients_50.json')


def test_count_as_requested():
    """Make sure get_mostly_top_scores still returns the requested number."""
    lat, lon = Faker().local_latlng(coords_only=True)
    assert len(get_mostly_top_scores(TEST_DATA, lat, lon, 10)) == 10


def test_first_score_is_bad():
    """Make sure the first score is below 5.0."""
    lat, lon = Faker().local_latlng(coords_only=True)
    item = get_mostly_top_scores(TEST_DATA, lat, lon, 10).head(1)
    assert item['score'].values[0] < 5.0
