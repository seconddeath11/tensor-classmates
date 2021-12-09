import json
import sqlite3
from flask import g, request, jsonify, Response
from flask import Flask
from flask_cors import CORS, cross_origin
import pandas as pd

app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'
DATABASE = 'db/class.db'


def init_db():
    with app.app_context():
        with sqlite3.connect(DATABASE) as db:
            with app.open_resource('schema.sql', mode='r') as f:
                db.cursor().executescript(f.read())
            db.commit()


def query_db(req, method):
    with sqlite3.connect(DATABASE) as con:
        cur = con.cursor()
        cur.execute(req)
        if method != "GET":
            con.commit()
        else:
            df = pd.DataFrame.from_records(cur.fetchall(), columns=[i[0] for i in cur.description]).to_dict(orient="records")
            return df


@app.teardown_appcontext
def close_connection(exception):
    db = getattr(g, '_database', None)
    if db is not None:
        db.close()


@app.route("/", methods=["POST", "GET"])
def index():
    if request.method == "POST":
        body = json.loads(request.data)
        try:
            thing = "INSERT INTO classmates ('first-name','last-name','middle-name','study','course','city', 'phone','mail', 'url', 'vk', 'telegram', 'whatsapp', 'facebook') VALUES (\"%s\",\"%s\",\"%s\",\"%s\",%d,\"%s\",\"%s\",\"%s\",\"%s\",\"%s\",\"%s\",\"%s\",\"%s\")" % (
                body["first-name"], body["last-name"], body["middle-name"], body["study"], body["course"],
                body["city"], body["phone"], body["mail"],
                body["url"], body["vk"], body["telegram"], body["whatsapp"], body["facebook"])
            query_db(thing, "PUT")

        except Exception as e:
            print(e)

    return jsonify(query_db("SELECT * from classmates", "GET"))


if __name__ == '__main__':
    app.run(debug=True)
