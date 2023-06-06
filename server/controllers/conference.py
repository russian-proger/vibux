import sqlalchemy as sql
import sqlalchemy.orm as orm
import flask as flk

from .. import app
from ..models import engine
from ..models.conference import Conference

@app.post('/api/conference/create')
def conference_create():
    result = None

    with orm.Session(engine) as session:
        conference = Conference()

        session.add(conference)
        session.flush()
        id = conference.id
        session.commit()

        result = flk.jsonify({'ok': True, 'conference_id': id})

    return result

@app.get('/api/conference/exists/<id>')
def conference_exists(id):
    result = None

    with orm.Session(engine) as session:
        conference = session.get(Conference, id)
        result = flk.jsonify({'ok': True, 'answer': conference is not None})

    return result

@app.get('/conference/get-participants/<int:id>')
def get_participants(id):
    result = None

    with orm.Session(engine) as session:
        result = "ok"

    return result