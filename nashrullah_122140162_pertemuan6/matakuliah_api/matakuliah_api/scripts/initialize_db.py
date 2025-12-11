import argparse
import sys
from pyramid.paster import bootstrap, setup_logging
from sqlalchemy.exc import OperationalError
from ..models import Matakuliah


def setup_models(dbsession):
    seed = [
        {'kode_mk': 'IF101', 'nama_mk': 'Algoritma dan Pemrograman', 'sks': 3, 'semester': 1},
        {'kode_mk': 'IF201', 'nama_mk': 'Struktur Data', 'sks': 3, 'semester': 3},
        {'kode_mk': 'IF301', 'nama_mk': 'Basis Data', 'sks': 3, 'semester': 4},
    ]
    for item in seed:
        exists = dbsession.query(Matakuliah).filter_by(kode_mk=item['kode_mk']).first()
        if exists:
            continue
        dbsession.add(Matakuliah(**item))


def parse_args(argv):
    parser = argparse.ArgumentParser(description='Initialize Matakuliah database with seed data')
    parser.add_argument('config_uri', help='Configuration file, e.g., development.ini')
    return parser.parse_args(argv[1:])


def main(argv=sys.argv):
    args = parse_args(argv)
    setup_logging(args.config_uri)
    env = bootstrap(args.config_uri)
    request = env['request']
    try:
        with request.tm:
            dbsession = request.dbsession
            setup_models(dbsession)
        print('Database initialized with sample matakuliah.')
    except OperationalError:
        print('Failed to initialize database. Check database server and sqlalchemy.url in your .ini file.')
    finally:
        env['closer']()


if __name__ == '__main__':
    main()
