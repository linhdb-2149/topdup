from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from . import _config

app = Flask(__name__)
app.config.from_pyfile("../settings.py")
app.config["SQLALCHEMY_DATABASE_URI"] = _config.DATABASE_URI
db = SQLAlchemy(app)

from . import routes
