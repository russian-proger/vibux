from flask import render_template
from flask import request
from .. import app

from . import login

@app.get('/login')
def login_get():
    print(request.headers)
    return render_template('login.html')

@app.post('/login')
def login_post():
    pass

@app.get('/signup')
def signup_get():
    print(request.headers)
    return render_template('signup.html')

@app.post('/signup')
def signup_post():
    pass

@app.route('/logout')
def logout():
    pass