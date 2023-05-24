from flask import Flask
from flask import render_template
from flask import request

app = Flask(__name__)

app.secret_key = 'lower bound'

from .controllers import index
