from setuptools import setup, find_packages

requires = [
    'pyramid',
    'pyramid_retry',
    'pyramid_tm',
    'SQLAlchemy',
    'zope.sqlalchemy',
    'waitress',
    'psycopg2-binary',
    'alembic',
]

setup(
    name='matakuliah_api',
    version='0.1',
    description='API CRUD Matakuliah menggunakan Pyramid dan PostgreSQL',
    packages=find_packages(),
    include_package_data=True,
    install_requires=requires,
    entry_points={
        'paste.app_factory': ['main = matakuliah_api:main'],
        'console_scripts': [
            'initialize_matakuliah_api_db = matakuliah_api.scripts.initialize_db:main',
        ],
    },
)
