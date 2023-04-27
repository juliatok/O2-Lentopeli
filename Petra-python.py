import mysql.connector
from flask import Flask, Response
from flask_cors import CORS
import random
import json

app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

yhteys = mysql.connector.connect(
    host='localhost',
    port=3306,
    database='flight_game',
    user='root',
    password='Suzu',
    autocommit=True
)

@app.route('/countryoptions')
def get_country_options():
    countries = []
    sql = "select Nimi from maat ORDER BY RAND() LIMIT 3"
    cursor = yhteys.cursor()
    cursor.execute(sql)
    result = cursor.fetchall()
    for n in result:
        countries.append(n[0])

    print(countries)
    return Response(response=json.dumps(countries, ensure_ascii=False).encode('utf8')
                    , status=200, mimetype="application/json")

"""    @app.route('/nimi&pisteet')
    def tuloksenlisäys(käyttäjänimi, pisteet):
        sql = "insert into käyttäjä(nimi,pisteet) values ('" + käyttäjänimi + "', '" + str(pisteet) + "')"
        kursori = yhteys.cursor()
        kursori.execute(sql)
        yhteys.commit()"""

@app.route('/top10')
def leaderboard():
    sql = "select nimi, pisteet from käyttäjä order by pisteet desc limit 10"
    kursori = yhteys.cursor()
    kursori.execute(sql)
    results = kursori.fetchall()


    return Response(response=json.dumps(results, ensure_ascii=False).encode('utf8')
                    , status=200, mimetype="application/json")

if __name__ == '__main__':
    app.run(use_reloader=True, host='127.0.0.1', port=3000)