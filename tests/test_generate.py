"""Testing generation of records."""

from uuid import UUID

from faker import Faker
from geopy.distance import great_circle

from patient_sorting import generate


def test_count_0():
    """If we ask for no records (we shouldn't), get none back."""
    assert len(generate(0, 0, 0)) == 0


def test_count_50():
    """If we ask for 50 records, ensure there's 50 records."""
    lat, lon = Faker().local_latlng(coords_only=True)
    assert len(generate(50, lat, lon)) == 50


def test_data_structure():
    """Make sure the data structure is right."""
    lat, lon = Faker().local_latlng(coords_only=True)
    item = generate(1, lat, lon)[0]

    # ID and name are strings
    for key in ['id', 'name']:
        assert isinstance(item[key], str)

    # Make sure UUID is a UUID
    assert isinstance(UUID(item['id'], version=4), UUID)

    # Make sure all of these keys are ints and within their desired ranges
    ranged_ints = {
        'age': (21, 90),
        'acceptedOffers': (0, 100),
        'canceledOffers': (0, 100),
        'averageReplyTime': (1, 3600),
    }
    for key, (lower, upper) in ranged_ints.items():
        assert isinstance(item[key], int)
        assert item[key] >= lower and item[key] <= upper

    # Make sure we have latitude and longitude and they can be cast as floats
    assert isinstance(item['location'], dict)
    for key in ['latitude', 'longitude']:
        # This should be castable to a float
        assert isinstance(float(item['location'][key]), float)


def test_distance_not_over_100_miles():
    """Make sure all records are within 100 miles of the reference point."""
    lat, lon = Faker().local_latlng(coords_only=True)
    records = generate(10, lat, lon)
    assert len(records) == 10
    for record in records:
        assert great_circle((lat, lon),
                            (record['location']['latitude'],
                             record['location']['longitude'])).miles <= 100
