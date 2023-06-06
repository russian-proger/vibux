import hashlib
import sqlalchemy as sql
import sqlalchemy.orm as orm
import flask as flk

from .. import app

from ..models import engine
from ..models.user import User

@app.get('/login')
def login_get():
    if 'nickname' in flk.session:
        return flk.redirect(flk.url_for('index'))
    return flk.render_template('login.html')

@app.post('/login')
def login_post():
    session = orm.Session(engine)
    form = flk.request.form

    try:
        hsh = hashlib.sha512(form['password'].encode()).hexdigest()
        user = User(form['login'], hsh)
        other = session.query(User).where(User.nickname == user.nickname).one_or_none()
        if other == None:
            raise Exception('Такого пользователя не существует')
        if other.password != user.password:
            raise Exception('Пароль неверный')

    except Exception as exc:
        session.close()
        return flk.render_template('login.html', error=exc.args[0])

    session.close()
    flk.session['nickname'] = form['login']

    return flk.redirect(flk.url_for('index'))

@app.get('/signup')
def signup_get():
    return flk.render_template('signup.html')

@app.post('/signup')
def signup_post():
    session = orm.Session(engine)
    form = flk.request.form

    try:
        if form['password'] != form['repeat_password']:
            raise Exception("Пароли не совпадают")

        hsh = hashlib.sha512(form['password'].encode()).hexdigest()
        user = User(form['login'], hsh)
        other = session.scalars(sql.select(User).where(User.nickname == user.nickname)).one_or_none()

        if (other != None):
            raise Exception("Пользователь с таким логином уже существует")

    except Exception as exc:
        session.close()
        return flk.render_template('signup.html', error=exc.args[0])

    session.add(user)
    session.commit()
    session.close()

    return flk.redirect(flk.url_for('login_get'))

@app.route('/logout')
def logout():
    if 'nickname' in flk.session:
        del flk.session['nickname']
    return flk.redirect(flk.url_for('login_get'))