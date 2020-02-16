from datetime import datetime

from pydantic import BaseModel


class SensorReadout(BaseModel):
    kind: str
    created_at: datetime
    readout: float

    class Config:
        arbitrary_types_allowed = True
        orm_mode = True

    def to_json(self) -> dict:
        return {
            "kind": self.kind,
            "created_at": self.created_at.isoformat(),
            "readout": self.readout
        }