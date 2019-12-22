#!/usr/bin/env python3
"""Generate the patient sample data."""

import json
import os
from argparse import ArgumentParser, FileType

from patient_sorting import generate


def _get_args():
    """Get our command line args."""
    parser = ArgumentParser(description='Generate fake data on patients.')
    parser.add_argument('--outfile', type=FileType('w'), metavar='FILENAME',
                        help='Filename to output the sample data to.',
                        default=os.path.join(
                            os.path.dirname(__file__),
                            'data',
                            'patients.json'))
    parser.add_argument('--number', type=int, metavar='NUMBER_OF_PATIENTS',
                        help='How many patients are there?', default=50)
    parser.add_argument('latitude', type=float)
    parser.add_argument('longitude', type=float)
    return parser.parse_args()


def main():
    """Generate a bunch of fake data and write to disk."""
    args = _get_args()
    json.dump(generate(args.number, args.latitude, args.longitude),
              args.outfile, indent=4)
    print(f'{args.outfile.name} populated with {args.number} records')
    print(f'Utilized {args.latitude},{args.longitude} as the '
          f'provider office (all patients are within 100 miles)')


if __name__ == '__main__':
    main()
