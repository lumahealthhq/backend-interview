"""Some basic tests."""
import os

from patient_sorting import (load_from_file,
                             normalize_score_and_renormalize,
                             WEIGHTS)

TEST_DATA_0 = os.path.join(os.path.dirname(__file__), 'patient_0.json')


def test_all_zeros():
    """This is a simple test, all inputs are zero."""
    df = normalize_score_and_renormalize(
        load_from_file(TEST_DATA_0, 0, 0))
    for column in WEIGHTS.keys():
        assert df[f'{column}_scaled'].values[0] == 1.0
