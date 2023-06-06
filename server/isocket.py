import uuid

import flask
from flask_socketio import emit, join_room, leave_room, send, disconnect, rooms
from . import socketio

# nickname -> disconnect function
disconnecter = dict()

# nickname -> single room UUID
uuid_sockets: dict[str, str] = dict()

# conference ID -> [nicknames]
conference_rooms: dict[str, list[str]] = dict()

@socketio.on('connect')
def connect():
    if 'nickname' not in flask.session:
        disconnect()
    
    flask.session['uuid'] = uuid.uuid4()
    nickname = flask.session['nickname']
    
    if nickname in uuid_sockets:
        pass
    # uuid_sockets[nickname] = flask.session['uuid']

@socketio.on('disconnect')
def disconnect():
    print('Client disconnected')

@socketio.on('join')
def on_join(data):
    room = data['room']
    join_room(room)
    # send()
    # send(username + ' has entered the room.', to=room)

@socketio.on('leave')
def on_leave(data):
    username = data['username']
    room = data['room']
    leave_room(room)
    send(username + ' has left the room.', to=room)