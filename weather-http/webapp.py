from fastapi import FastAPI
from starlette.requests import Request
from starlette.staticfiles import StaticFiles
from starlette.templating import Jinja2Templates

# Setup FastAPI
app = FastAPI(debug=True)
app.mount('/static', StaticFiles(directory='static'), name='static')

# Setup Templating
templates = Jinja2Templates(directory='templates/')


@app.get('/')
async def home(request: Request):
    return templates.TemplateResponse('index.html', {'request': request})


if __name__ == '__main__':
    from hypercorn import run, Config
    run.run(Config.from_mapping({'bind': ['0.0.0.0:8000'], 'debug': True, 'application_path': 'webapp:app'}))