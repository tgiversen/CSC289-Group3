"""
Configuration file (database URI, SECRET_KEY)
"""

import os

basedir = os.path.abspath(os.path.dirname(__file__))


class Config:
    SECRET_KEY = os.environ.get("SECRET_KEY") or "dev_secret_key"
    SQLALCHEMY_DATABASE_URI = "sqlite:///" + os.path.join(basedir, "instance", "site.db")
    SQLALCHEMY_TRACK_MODIFICATIONS = False


# Configuration for testing
class TestConfig(Config):
    TESTING = True
    SQLALCHEMY_DATABASE_URI = "sqlite:///:memory:"
