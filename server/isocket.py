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

    # Update dicts
    user_sid[nickname] = sid
    sid_user[sid] = nickname

    print("Connect user:", nickname)

@socketio.on('disconnect')
@auth
def on_disconnect(sid, nickname):
    room = sid_room.get(sid, None)
    if room != None:
        leave_room(room)
        emit('remove-peer', {'sid': sid, 'nickname': nickname}, to=room)

    sid_room.pop(sid)
    sid_user.pop(sid)
    user_sid.pop(nickname)
    print("Disconnect user:", nickname)

@socketio.on('join')
@auth
def on_join(sid, nickname, data):
    room = data['room']
    sid_room[sid] = room

    # notice others in room about the new socket
    emit('add-peer', {'sid': sid, 'nickname': nickname}, to=room)

    # join this socket to conference room
    join_room(room, sid)

@socketio.on('relay-sdp')
@auth
def relay_sdp(sid, nickname, data):
    destination = data['destination']
    sessionDescription = data['sessionDescription']
    print("SDP", sid, destination)

    # send sdp packet
    emit('relay-sdp', {'sid': sid, 'nickname': nickname, 'sessionDescription': sessionDescription}, to=destination)


@socketio.on('relay-ice')
@auth
def relay_ice(sid, nickname, data):
    destination = data['destination']
    candidate = data['candidate']
    print("ICE", sid, destination)

    # send ice packet
    emit('relay-ice', {'sid': sid, 'nickname': nickname, 'candidate': candidate}, to=destination)



@socketio.on('remove-peer')
@auth
def remove_peer(sid, nickname, data):
    destination = data['destination']

    # send ice packet
    emit('relay-ice', {'sid': sid, 'nickname': nickname}, to=destination)