from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import scoped_session, sessionmaker

engine = create_engine('sqlite:///database.sqlite3?check_same_thread=False', convert_unicode=True, echo=True)
session = scoped_session(sessionmaker(bind=engine, autocommit=False, autoflush=True))

Base = declarative_base()
Base.query = session.query_property()


from .sensors import SensorReadoutModel
Base.metadata.tables['TBL_SENSOR_READOUTS'].create(bind=engine, checkfirst=True)