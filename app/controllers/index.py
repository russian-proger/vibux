import os
from flask import redirect, url_for
from flask import render_template
from flask import send_from_directory
from .. import app

from . import login

@app.route('/')
def index():
    return redirect(url_for('login_get'))

@app.route('/static/<string:path>')
def send_static(path):
    return send_from_directory('static', path)