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

class pelaaja:

    lennot = 0
    visited_countries = []
    def __init__(self,kotimaa,pisteet,lennot,matka, maat):
        self.kotimaa = kotimaa
        self.pisteet = pisteet
        self.matka = matka

    def update_country(self, current_country):
        pelaaja.visited_countries.append(current_country)
        pelaaja.lennot = pelaaja.lennot + 1

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

@app.route('/randomcountry')
def random_country():
    countries = []
    sql = "select Nimi from maat ORDER BY RAND() LIMIT 1"
    cursor = yhteys.cursor()
    cursor.execute(sql)
    result = cursor.fetchall()
    if pelaaja.lennot < 10:
        for n in result:
            if n not in pelaaja.visited_countries:
                if n not in countries:
                    countries.append(n)
                    kerrat = kerrat + 1
    return countries

    print(result)
    return Response(response=json.dumps(result, ensure_ascii=False).encode('utf8')
                    , status=200, mimetype="application/json")

@app.route('/currentcountry')
def current_country(current_country):
    pelaaja.update_country(current_country)


"""    @app.route('/nimi&pisteet')
    def tuloksenlisäys(käyttäjänimi, pisteet):
        sql = "insert into käyttäjä(nimi,pisteet) values ('" + käyttäjänimi + "', '" + str(pisteet) + "')"
        kursori = yhteys.cursor()
        kursori.execute(sql)
        yhteys.commit()"""

@app.route('/top5')
def leaderboard():
    sql = "select nimi, pisteet from käyttäjä order by pisteet desc limit 5"
    kursori = yhteys.cursor()
    kursori.execute(sql)
    results = kursori.fetchall()
    names = []
    for rivi in results:
        names.append([rivi[0],rivi[1]])
        print(names)

    return Response(response=json.dumps(names, ensure_ascii=False).encode('utf8')
                    , status=200, mimetype="application/json")

kotimaa = "Suomi"
pisteet = 200

if __name__ == '__main__':
    app.run(use_reloader=True, host='127.0.0.1', port=3000)