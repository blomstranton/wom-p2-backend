import os, requests
from flask import Flask, jsonify, request
from dotenv import load_dotenv

from flask_sqlalchemy import SQLAlchemy


# Load variables from .env
load_dotenv()
print(os.environ.get('FOO')) 

# Create Flask instance
app = Flask(__name__)
# Tillåt utf-8 i JSON:
app.config['JSON_AS_ASCII'] = False

# Konfiguration för SQLAlchemy 
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

# User-model skapar en tabell med kolumner i PostgreSQL
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(), nullable=False)
    updated_at = db.Column(db.DateTime(), default=db.func.now(), onupdate=db.func.now())

    def __refr__(self):
        return '<User {}>'.format(self.email)

    # För att skapa tabellen via terminalen:
    #
    # python
    # >>> from app.main import db
    # >>> db.create_all()
    ### För att skapa en första användare i databasen
    # >>> from app.main import db
    # >>> user = User(email='john@doe.com')
    # >>> db.session.add(user)
    # >>> db.session.commit()


#notes_token = os.environ.get('NOTES_TOKEN')

try:
    url = 'https://wom21-notes.azurewebsites.net/users/login'
    header = { 'Content-Type': 'application/json' }
    body = {  "email": "jane@doe.com",  "password": os.environ.get('NOTES_PASSWORD')}

    response = requests.post(url, headers=header, json=body)

    notes_token = response.content.decode('utf-8')
    print("Token: {}".format(response.content.decode('utf-8')))

except Exception as e:
    print(e)



# Default route to /
@app.route("/", methods = ['GET', 'POST', 'PUT'])
def index():
    ret = []
    if request.method == 'GET':
        # Loopa varje rad i User-tabellen och lägg till i ret
        for u in User.query.all():
            ret.append({'id': u.id, 'email': u.email, 'updated_at': u.updated_at})

    if request.method == 'POST':
        body = request.get_json()

        new_user = User(email=body['email'])
        db.session.add(new_user)
        db.session.commit()

        ret = [ "added new user!" ]

    if request.method == 'PUT':
        ret = [ "put!" ]

    return jsonify(ret)


# Route: /notes
@app.route("/notes")
def notes():
    print("GET notes")
    url = 'https://wom21-notes.azurewebsites.net/notes'
    header = { 'Authorization': 'Bearer {}'.format(notes_token) }

    response = requests.get(url, headers=header)
    return jsonify(response.json())













# Run app if called directly
if __name__ == "__main__":
        app.run()    