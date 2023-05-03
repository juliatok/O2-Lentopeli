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

@app.route('/randomcountry')
def random_country():
    potential_countries = []
    country_check = []
    for v_country in visited_countries:
        country_check.append(v_country)
    kerrat = 0
    while kerrat < 3:
        sql = "select Nimi from maat ORDER BY RAND() LIMIT 1"
        cursor = yhteys.cursor()
        cursor.execute(sql)
        result = cursor.fetchall()
        """print(result)"""
        for n in result:
            country = n[0]
            if country not in country_check:
                print(country)
                print(country_check)
                if country not in potential_countries:
                    potential_countries.append(country)
                    kerrat = kerrat + 1
                else:
                    print('Mukana Potential: ' + country)
            else:
                print('Mukana Visited: ' + country)

    return Response(response=json.dumps(potential_countries, ensure_ascii=False).encode('utf8')
                    , status=200, mimetype="application/json")

@app.route('/add_selected_country/<current_country>')
def add_selected_country(current_country):
    print("Python saa nykyisen maan: " + current_country)
    visited_countries.append(current_country)
    """print(visited_countries)"""

    return Response(response=json.dumps(visited_countries, ensure_ascii=False).encode('utf8')
                    , status=200, mimetype="application/json")


"""    @app.route('/nimi&pisteet/<username>&<pisteet>')
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
matka = 3000

visited_countries = []

if __name__ == '__main__':
    app.run(use_reloader=True, host='127.0.0.1', port=3000)