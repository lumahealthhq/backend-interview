from flask import Flask
app = Flask(__name__)
from app import scorePatients
from app import views