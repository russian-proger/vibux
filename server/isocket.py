from flask_socketio import emit

from . import socketio


@socketio.on('connect')
def disconnect():
    emit('my response', {'data': 'connected'})
    print('Client disconnected')

@socketio.on('disconnect')
def disconnect():
    print('Client disconnected')