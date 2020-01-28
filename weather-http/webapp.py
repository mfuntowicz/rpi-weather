import math
from datetime import datetime
from random import randint

from fastapi import FastAPI, Query, Body, Depends
from sqlalchemy.orm import Session
from starlette.middleware.gzip import GZipMiddleware
from starlette.responses import FileResponse, UJSONResponse
from starlette.staticfiles import StaticFiles
from uvicorn import run


# Setup FastAPI
from data import database, readouts
from data.schema import SensorReadout

app = FastAPI(debug=True)
app.mount('/static', StaticFiles(directory='static'), name='static')
app.add_middleware(GZipMiddleware, minimum_size=512)


# App Events callbacks
@app.on_event("startup")
async def startup():
    await database.connect()


@app.on_event("shutdown")
async def shutdown():
    await database.disconnect()


# HTTP UI Endpoints
@app.get('/')
def home() -> FileResponse:
    return FileResponse('static/index.html')


# REST Endpoints
@app.post('/api/readouts')
@database.transaction()
async def insert(readout: SensorReadout = Body(None)):
    query = readouts.insert()
    await database.execute(query=query, values=readout.dict())


@app.get('/api/readouts', response_model=SensorReadout)
async def read(start: int = Query(-1), end: int = Query(-1)) -> UJSONResponse:
    return UJSONResponse(SensorReadout(0, 'dummy', datetime.now().timestamp(), randint(0, 100)))


@app.get('/api/readouts/{sensor}', response_model=SensorReadout)
async def read_sensor(sensor: str, start: int = Query(-1), end: int = Query(-1)) -> UJSONResponse:
    return UJSONResponse(SensorReadout(0, 'dummy', datetime.now().timestamp(), randint(0, 100)))


if __name__ == '__main__':
    run(app)
