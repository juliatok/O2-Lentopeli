import mysql.connector
from flask import Flask, Response
from flask_cors import CORS
import json

app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'


cnx = mysql.connector.connect(
    host='localhost',
    port=3306,
    database='flight_game',
    user='root',
    password='Suzu',
    autocommit=True
)


class Tietokanta:

    def __init__(self, host, port, database, user, password):
        self.host = host
        self.port = port
        self.database = database
        self.user = user
        self.password = password

    def connect(self):
        self.cnx = mysql.connector.connect(
            host=self.host,
            port=self.port,
            database=self.database,
            user=self.user,
            password=self.password,
            autocommit=True
        )

    def get_country_options(self):
        countries = []
        sql = "select Nimi from maat ORDER BY RAND() LIMIT 3"
        cursor = self.cnx.cursor()
        cursor.execute(sql)
        result = cursor.fetchall()
        for n in result:
            countries.append(n[0])
        return countries


@app.route('/countryoptions')
def get_country_options():
    connection = Tietokanta('localhost', 3306, 'flight_game', 'root', 'Suzu')
    connection.connect()
    country_options = connection.get_country_options()
    print(country_options)

    return Response(response=json.dumps(country_options, ensure_ascii=False).encode('utf8'),
                    status=200, mimetype="application/json")


if __name__ == '__main__':
    app.run(use_reloader=True, host='127.0.0.1', port=3000)
