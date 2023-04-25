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
    password='m!näk00d44n',
    autocommit=True
)


@app.route('/countryoptions')
def get_country_options():
    countries = []
    sql = "select Nimi from maat ORDER BY RAND() LIMIT 3"
    cursor = cnx.cursor()
    cursor.execute(sql)
    result = cursor.fetchall()
    for n in result:
        countries.append(n[0])

    print(countries)
    return Response(response=json.dumps(countries, ensure_ascii=False).encode('utf8')
                    , status=200, mimetype="application/json")


if __name__ == '__main__':
    app.run(use_reloader=True, host='127.0.0.1', port=3000)