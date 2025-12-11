import logging
from logging.config import fileConfig

from alembic import context
from pyramid.paster import get_appsettings
from sqlalchemy import engine_from_config, pool

from matakuliah_api.models.meta import Base
from matakuliah_api import models  # noqa: F401 ensures model metadata is registered

config = context.config

if config.config_file_name is not None:
    fileConfig(config.config_file_name)
logger = logging.getLogger('alembic.env')

settings = get_appsettings(config.config_file_name)
target_metadata = Base.metadata


def run_migrations_offline():
    url = settings.get('sqlalchemy.url')
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={'paramstyle': 'named'},
        compare_type=True,
    )

    with context.begin_transaction():
        context.run_migrations()


def run_migrations_online():
    connectable = engine_from_config(
        settings,
        prefix='sqlalchemy.',
        poolclass=pool.NullPool,
    )

    with connectable.connect() as connection:
        context.configure(
            connection=connection,
            target_metadata=target_metadata,
            compare_type=True,
        )

        with context.begin_transaction():
            context.run_migrations()


def run_migrations():
    if context.is_offline_mode():
        run_migrations_offline()
    else:
        run_migrations_online()


run_migrations()
