import math
from datetime import datetime
from random import randint

from fastapi import FastAPI, Query, Body, Depends
from sqlalchemy import and_
from sqlalchemy.orm import Session
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


@app.get('/api/readouts', response_model=SensorReadout)
async def read(start: datetime = Query(datetime.now()), end: datetime = Query(datetime.now())) -> UJSONResponse:
    query = readouts.select(readouts.c.created_at.between(start, end))
    result = await database.fetch_all(query)
    items = list(map(lambda e: dict(zip(query.columns, e)), result))
    return UJSONResponse(items)


@app.get('/api/readouts/{sensor}', response_model=SensorReadout)
async def read_sensor(sensor: str, start: datetime = Query(datetime.now()), end: datetime = Query(datetime.now())) -> UJSONResponse:
    # "WHERE kind = :sensor AND createdAt BETWEEN :start AND :end",
    # values={"sensor": sensor, "start": start, "end": end}

    query = readouts.select(
        and_(readouts.c.kind == sensor, readouts.c.created_at.between(start, end)),
    )

    return UJSONResponse(await database.fetch_all(query))


if __name__ == '__main__':
    run(app)
