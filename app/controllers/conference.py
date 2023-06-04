import sqlalchemy as sql
import sqlalchemy.orm as orm
import flask as flk

from .. import app

@app.get('/conference/get-participants/<int:id>')
def get_participants(id):
    print(id)
    return "123"