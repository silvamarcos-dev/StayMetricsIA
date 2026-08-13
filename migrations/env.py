
from logging.config import fileConfig

from sqlalchemy import engine_from_config
from sqlalchemy import pool

from alembic import context

from app.database.base import Base
from app.models.contato import Contato
from app.models.usuario import Usuario
from app.models.conversa import Conversa
from app.models.mensagem import Mensagem
from app.models.visita import Visita
from app.models.configuracao import Configuracao
from app.models.google_calendar import GoogleCalendarIntegration

# Alembic Config object
config = context.config


# Configuração de logging
if config.config_file_name is not None:
    fileConfig(config.config_file_name)


# Metadata dos models
#
# O Alembic utiliza esse metadata para comparar
# o estado atual dos models com o banco de dados.
target_metadata = Base.metadata


def run_migrations_offline() -> None:
    """Executa migrations em modo offline."""

    url = config.get_main_option("sqlalchemy.url")

    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={
            "paramstyle": "named"
        },
    )

    with context.begin_transaction():
        context.run_migrations()


def run_migrations_online() -> None:
    """Executa migrations em modo online."""

    connectable = engine_from_config(
        config.get_section(
            config.config_ini_section,
            {}
        ),
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )

    with connectable.connect() as connection:

        context.configure(
            connection=connection,
            target_metadata=target_metadata,
        )

        with context.begin_transaction():
            context.run_migrations()


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()

