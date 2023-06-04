import os
import flask
from flask import redirect, url_for
from flask import render_template
from flask import send_from_directory
from .. import app

from . import login

@app.route('/')
def index():
    if 'nickname' not in flask.session:
        return flask.redirect(flask.url_for('login_get'))
    return flask.render_template('client.html', nickname=flask.session['nickname'])