from pyramid.config import Configurator
from pyramid.response import Response


def main(global_config, **settings):
    """Return a Pyramid WSGI application."""
    with Configurator(settings=settings) as config:
        # Enable transaction manager and retry middleware
        config.include('pyramid_tm')
        config.include('pyramid_retry')
        # Attach database session helpers
        config.include('.models')
        # Register routes then scan views
        config.include('.routes')
        config.scan('.views')
    return config.make_wsgi_app()
