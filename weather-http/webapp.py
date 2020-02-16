from asyncio.queues import Queue
from datetime import datetime
from starlette.requests import HTTPConnection
from typing import List, Union

from fastapi import FastAPI, Query, Body
from sqlalchemy import and_
from starlette.middleware.gzip import GZipMiddleware
from starlette.responses import FileResponse, UJSONResponse
from starlette.staticfiles import StaticFiles
from starlette.websockets import WebSocket
from uvicorn import run


# Setup FastAPI
from data import database, readouts
from data.schema import SensorReadout

app = FastAPI(debug=True)
app.mount('/static', StaticFiles(directory='dist'), name='dist')
app.add_middleware(GZipMiddleware, minimum_size=512)

# Client queues - Used to dispatch readout to each client
websocket_clients = []


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
async def insert(readout: Union[SensorReadout, List[SensorReadout]] = Body(None)):
    if not isinstance(readout, List):
        readout = [readout]

    # Generate the insert query
    query = readouts.insert()
    insert_co = database.execute_many(query=query, values=[r.dict() for r in readout])

    # Dispatch to WS clients
    for client in websocket_clients:
        for r in readout:
            client.put_nowait(r.to_json())

    # Await the insert into DB
    await insert_co


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


@app.websocket("/ws/readouts")
async def ws_readouts(websocket: WebSocket):
    global websocket_clients

    # Await for connection
    await websocket.accept()
    websocket_queue = Queue()
    websocket_clients += [websocket_queue]

    # Dispatch through WebSocket
    while websocket.application_state.CONNECTED:
        readout = await websocket_queue.get()
        websocket_queue.task_done()

        await websocket.send_json(readout)

    # Remove from the queue
    websocket_clients.remove(websocket_queue)

if __name__ == '__main__':
    run(app, host='0.0.0.0')
