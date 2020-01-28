from sqlalchemy import Column, DateTime, Float, String

from weather.data import Base


class SensorReadoutModel(Base):
    __tablename__ = 'TBL_SENSOR_READOUTS'

    created_at = Column(DateTime, primary_key=True)
    kind = Column(String, primary_key=True)
    value = Column(Float, nullable=False)