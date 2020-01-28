from fastapi import FastAPI
from starlette.middleware.gzip import GZipMiddleware
from starlette.responses import FileResponse, UJSONResponse
from starlette.staticfiles import StaticFiles
from uvicorn import run


# Setup FastAPI
app = FastAPI(debug=True)
app.mount('/static', StaticFiles(directory='static'), name='static')
app.add_middleware(GZipMiddleware, minimum_size=512)


@app.get('/')
def home() -> FileResponse:
    return FileResponse('static/index.html')


@app.put('/api/{}/{}')
async def insert():
    pass


@app.get('/api/{sensor}')
async def read() -> UJSONResponse:
    return UJSONResponse({"key": "value"})


if __name__ == '__main__':
    run(app)
