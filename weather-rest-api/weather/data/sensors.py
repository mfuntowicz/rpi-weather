from sqlalchemy import Column, DateTime, Number, Integer, String

from weather.data import Base


class SensorReadoutModel(Base):
    __tablename__ = 'TBL_SENSOR_READOUTS'

    created_at = Column(DateTime, primary_key=True)
    kind = Column(String, required=True)
    value = Column(Number, required=True)