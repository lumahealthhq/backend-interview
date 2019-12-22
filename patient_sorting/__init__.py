"""Stuff."""

import json

import pandas as pd
from faker import Faker
from geopy.distance import great_circle
from pandas.io.json import json_normalize
from sklearn.preprocessing import MinMaxScaler

WEIGHTS = {
    'age': 0.1,
    'distance': 0.1,
    'acceptedOffers': 0.3,
    'canceledOffers': -0.3,
    'averageReplyTime': 0.2,
}


def generate(number, lat, lon):
    """Come up with some new patient rosters."""
    bogus_patients = []
    fake = Faker()
    entries = 0
    while entries < number:
        our_lat, our_lon = fake.local_latlng(coords_only=True)
        if great_circle((our_lat, our_lon), (lat, lon)).miles > 100:
            continue
        bogus_patients.append({
            'id': fake.uuid4(),
            'name': fake.name(),
            'age': fake.random_int(min=21, max=90, step=1),
            'location': {
                'latitude': our_lat,
                'longitude': our_lon,
            },
            'acceptedOffers': fake.random_int(min=0, max=100, step=1),
            'canceledOffers': fake.random_int(min=0, max=100, step=1),
            'averageReplyTime': fake.random_int(min=1, max=3600, step=1),
        })
        entries += 1
    return bogus_patients


def get_top_scores(datafile, lat, lon, num):
    """Get the top N scores."""
    df = normalize_score_and_renormalize(
        load_from_file(datafile, lat, lon))
    return df.nlargest(num, 'score', keep='all')


def get_random_low_score(datafile, lat, lon):
    """Get a single entry with a score < 5.0."""
    df = normalize_score_and_renormalize(
        load_from_file(datafile, lat, lon))
    return df.query('score <= 5.0').sample()


def load_from_file(datafile, lat, lon):
    """Load the data and compute the distance column."""
    # Load the JSON file, flatten the latitude/longitude dict
    with open(datafile, 'r') as infile:
        json_obj = json.loads(infile.read())
    df = json_normalize(json_obj)

    # Calculate the distance from the office
    df['distance'] = df.apply(
        lambda col: great_circle((col['location.latitude'],
                                  col['location.longitude']),
                                 (lat, lon)).miles,
        axis=1)

    # Index by ID column
    df.set_index('id', inplace=True)

    return df


def normalize_score_and_renormalize(df):
    """
    Given a DataFrame, normalize & add + weight the scores.

    Then normalize again, so we have pretty scores.
    """
    df = normalize_values_to_scale(df)

    # Now we can make a weighted score
    df['score'] = df.apply(
        lambda col: (
                     (col.age_scaled * WEIGHTS['age']) +
                     (col.distance_scaled * WEIGHTS['distance']) +
                     (col.acceptedOffers_scaled * WEIGHTS['acceptedOffers']) +
                     (col.canceledOffers_scaled * WEIGHTS['canceledOffers']) +
                     (col.averageReplyTime_scaled *
                      WEIGHTS['averageReplyTime'])
                    ),
        axis=1
    )

    # Re-normalize so they're all 1-10 again.
    df = normalize_score(df)

    return df


def normalize_values_to_scale(df):
    """Scale all all the fields that make up the score."""
    min_max_scaler = MinMaxScaler(feature_range=(1, 10))
    columns = list(WEIGHTS.keys())
    new_cols = [f'{n}_scaled' for n in columns]
    x = df[columns].values
    x_scaled = min_max_scaler.fit_transform(x)
    df_temp = pd.DataFrame(x_scaled, columns=new_cols, index=df.index)
    df[new_cols] = df_temp
    return df


def normalize_score(df):
    """Turn the score back into 1-10 for easy usage."""
    min_max_scaler = MinMaxScaler(feature_range=(1, 10))
    columns = ['score']
    x = df[columns].values
    x_scaled = min_max_scaler.fit_transform(x)
    df_temp = pd.DataFrame(x_scaled, columns=columns, index=df.index)
    df[columns] = df_temp
    return df
