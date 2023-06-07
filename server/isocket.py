import uuid

import flask
from flask_socketio import emit, join_room, leave_room, send, disconnect, rooms
from . import socketio

# nickname -> SID
user_sid: dict[str, str] = dict()

# SID -> nickname
sid_user: dict[str, str] = dict()

# SID -> room ID
sid_room: dict[str, str] = dict()

def auth(f):
    def g(*args):
        sid = flask.request.sid # type: ignore
        nickname = flask.session['nickname']
        f(sid, nickname, *args)
    return g

@socketio.on('connect')
@auth
def on_connect(sid, nickname):
    # If unauthorized
    if 'nickname' not in flask.session:
        disconnect(sid)

    # Disconnect old connection
    if nickname in user_sid:
        prev_sid = user_sid[nickname]
        disconnect(prev_sid)
        sid_user.pop(prev_sid)

    # Update dicts
    user_sid[nickname] = sid
    sid_user[sid] = nickname

@socketio.on('disconnect')
@auth
def on_disconnect(sid, nickname):
    room = sid_room[sid]
    if room != None:
        leave_room(room)
        emit('remove-peer', {'sid': sid, 'nickname': nickname}, to=room)

    sid_user.pop(sid)
    user_sid.pop(nickname)

@socketio.on('join')
@auth
def on_join(sid, nickname, data):
    room = data['room']
    sid_room[sid] = room

    # notice others in room about the new socket
    emit('add-peer', {'sid': sid, 'nickname': nickname}, to=room)

    # join this socket to conference room
    join_room(room, sid)