import sqlalchemy as sql
import sqlalchemy.orm as orm
import flask as flk

from .. import app

from ..models import engine
from ..models.user import User

@app.get('/login')
def login_get():
    return flk.render_template('login.html')

@app.post('/login')
def login_post():
    pass

@app.get('/signup')
def signup_get():
    
    return flk.render_template('signup.html')

@app.post('/signup')
def signup_post():
    session = orm.Session(engine)
    form = flk.request.form

    try:
        user = User(form['login'], form['password'])
        print(123)
        other = session.scalars(sql.select(User).where(User.nickname == user.nickname)).one_or_none()
        if (other != None):
            raise Exception("Пользователь с таким логином уже существует")

    except Exception as exc:
        return flk.render_template('signup.html', error=exc.args[0])

    finally:
        print("Closed")
        session.close()
    
    session.add(user)
    session.commit()
    session.close()

    return flk.redirect(flk.url_for('login_get'))

@app.route('/logout')
def logout():
    pass