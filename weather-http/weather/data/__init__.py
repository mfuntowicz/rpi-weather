from contextlib import contextmanager

import databases
from sqlalchemy import create_engine, Column, DateTime, MetaData, Table, String, Float
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import scoped_session, sessionmaker

DATABASE_URL = 'sqlite:///storages/readouts.sqlite3'

database = databases.Database(DATABASE_URL)
metadata = MetaData()

readouts = Table(
    "sensors",
    metadata,
    Column("created_at", DateTime, primary_key=True),
    Column("kind", String, primary_key=True),
    Column("readout", Float),
)

engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False}, convert_unicode=True, echo=True)
SessionLocal = scoped_session(sessionmaker(bind=engine, autocommit=False, autoflush=True))
metadata.create_all(engine)

Base = declarative_base()


def get_database():
    try:
        session = SessionLocal()
        yield session
    finally:
        session.close()
