from fastapi import FastAPI

app = FastAPI()

@app.get('/')
def hello():
    return {'message': 'Dundalk Market is ALIVE!'}

@app.get('/test')
def test():
    return {'status': 'API working', 'stores': 0, 'version': '0.0.1'}
