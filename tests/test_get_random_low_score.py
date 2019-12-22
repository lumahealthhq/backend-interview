"""Check get_random_low_score."""

import os

from faker import Faker

from patient_sorting import get_random_low_score

TEST_DATA = os.path.join(os.path.dirname(__file__), 'patients_50.json')


def test_count_is_1():
    """Make sure get_top_scores returns the requested number."""
    lat, lon = Faker().local_latlng(coords_only=True)
    assert len(get_random_low_score(TEST_DATA, lat, lon)) == 1


def test_score_below_5():
    """Make sure the one result's score is < 5.0."""
    lat, lon = Faker().local_latlng(coords_only=True)
    item = get_random_low_score(TEST_DATA, lat, lon)
    assert item['score'].values[0] < 5.0
