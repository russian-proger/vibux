from flask_socketio import emit

from . import socketio

@socketio.on('connect')
def disconnect():
    print('Client connected')
    emit('my response', {'data': 'connected'})

@socketio.on('disconnect')
def disconnect():
    print('Client disconnected')