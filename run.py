from server import app, socketio

app.config['SECRET_KEY'] = 'lower bound'
# app.run('localhost', port=8000)

if __name__ == '__main__':
    socketio.run(app, port=8000, debug=False)
    # app.run(port=8000)