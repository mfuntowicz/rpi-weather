from typing import List

from datetime import datetime

from fastapi import FastAPI, Query, Body
from sqlalchemy import and_
from starlette.middleware.gzip import GZipMiddleware
from starlette.responses import FileResponse, UJSONResponse
from starlette.staticfiles import StaticFiles
from uvicorn import run


# Setup FastAPI
from data import database, readouts
from data.schema import SensorReadout

app = FastAPI(debug=True)
app.mount('/static', StaticFiles(directory='dist'), name='dist')
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
    return FileResponse('dist/index.html')


# REST Endpoints
@app.post('/api/readouts')
@database.transaction()
async def insert(readout: SensorReadout = Body(None)):
    query = readouts.insert()
    await database.execute(query=query, values=readout.dict())


@app.get('/api/readouts', response_model=List[SensorReadout])
async def read(start: datetime = Query(datetime.now()), end: datetime = Query(datetime.now())) -> UJSONResponse:
    query = readouts.select(readouts.c.created_at.between(start, end))
    results = await database.fetch_all(query)
    return UJSONResponse([dict(zip(query.columns, readout)) for readout in results])


@app.get('/api/readouts/{sensor}', response_model=List[SensorReadout])
async def read_sensor(sensor: str, start: datetime = Query(datetime.now()), end: datetime = Query(datetime.now())) -> UJSONResponse:
    query = readouts.select(
        and_(readouts.c.kind == sensor, readouts.c.created_at.between(start, end)),
    )
    results = await database.fetch_all(query)
    return UJSONResponse([dict(zip(query.columns, readout)) for readout in results])


if __name__ == '__main__':
    run(app)
