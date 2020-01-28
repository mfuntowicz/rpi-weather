from datetime import datetime
from typing import List

from sqlalchemy import Integer, Column, Float
from sqlalchemy.orm import Session

from data import Base


class SensorReadoutModel(Base):
    kind: Column(Integer, primary_key=True, index=True)
    created_at: Column(Float, primary_key=True, index=True)
    readout: Column(Float, index=True)


def get_all_readouts_timespan(session: Session, start: datetime, end: datetime) -> List[SensorReadoutModel]:
    session.query(SensorReadoutModel)