import mysql.connector
from flask import Flask, Response
from flask_cors import CORS
import random
import json

app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'


class Tietokanta:

    def __init__(self, host, port, database, user, password="keltainenKoira123"):
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

    def leaderboard(self):
        names = []
        sql = "select nimi, pisteet from käyttäjä order by pisteet desc limit 5"
        kursori = self.cnx.cursor()
        kursori.execute(sql)
        results = kursori.fetchall()
        for rivi in results:
            names.append([rivi[0], rivi[1]])
            print(names)
        return names

    def random_country(self):
        potential_countries = []
        country_check = []
        for v_country in visited_countries:
            country_check.append(v_country)
        kerrat = 0
        while kerrat < 3:
            sql = "select Nimi from maat ORDER BY RAND() LIMIT 1"
            cursor = self.cnx.cursor()
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
        return potential_countries

    def hae_kenttä(self, maa):
        print("Arvottu maa:", maa)
        kentät = []
        sql = "select airport.name, airport.municipality from airport, maat where nimi = '" + str(
            maa) + "' and airport.iso_country = maat.iso_country and type = 'large_airport' order by rand() limit 1"
        cursor = self.cnx.cursor()
        cursor.execute(sql)
        result = cursor.fetchall()
        length = len(result)

        if length != 0:
            for n in result:
                kentät.append(n[0])
                kentät.append(n[1])
                print(kentät)
            return kentät
        else:
            sql = "select airport.name, airport.municipality from airport, maat where nimi = '" + str(
                maa) + "' and airport.iso_country = maat.iso_country and type = 'medium_airport' order by rand() limit 1"
            cursor = self.cnx.cursor()
            cursor.execute(sql)
            result = cursor.fetchall()
            for n in result:
                kentät.append(n[0])
                kentät.append(n[1])
        return kentät

    def get_question(self, id):
        kysymys = []
        sql = "select ID, kysymys from vastaukset where paikka_id = '" + str(id) + "'"
        cursor = self.cnx.cursor()
        cursor.execute(sql)
        kysymykset = cursor.fetchall()
        kysyttava_kysymys = random.choice(kysymykset)
        for n in kysyttava_kysymys:
            kysymys.append(n)
        print("Kysyttävä kysymys:", kysymys[1])
        return kysymys

    def get_correct_question(self, id):
        kysymys = []
        sql = "select oikein from vastaukset where id = '" + str(id) + "'"
        cursor = self.cnx.cursor()
        cursor.execute(sql)
        kysymykset = cursor.fetchall()
        print("Oikea vastaus:", kysymykset[0])
        for n in kysymykset:
            kysymys.append(n)
        return kysymys

    def get_vastaus(self, id):
        sql = "select oikein, väärin1, väärin2 from vastaukset where ID = '" + str(id) + "'"
        cursor = self.cnx.cursor()
        cursor.execute(sql)
        ret = list(cursor.fetchall()[0])  # tekee listan tuplesta

        vastausvaihtoehdot = []
        vastausvaihtoehdot.append([ret[0], "oikein"])
        vastausvaihtoehdot.append([ret[1], "väärin"])
        vastausvaihtoehdot.append([ret[2], "väärin"])

        random.shuffle(vastausvaihtoehdot)

        vastausvaihtoehdot[0].append("A")
        vastausvaihtoehdot[1].append("B")
        vastausvaihtoehdot[2].append("C")

        print("Vastausvaihtoehdot:", vastausvaihtoehdot)

        return vastausvaihtoehdot

    def get_country(self):
        tulos = []
        sql = "select Nimi, iso_country, ID from maat ORDER BY RAND() LIMIT 1"
        cursor = self.cnx.cursor()
        cursor.execute(sql)
        result = cursor.fetchall()
        for n in result:
            tulos.append(n)
        return tulos

@app.route('/countryoptions')
def get_country_options():
    connection = Tietokanta('localhost', 3306, 'flight_game', 'root')
    connection.connect()
    country_options = connection.get_country_options()
    print(country_options)

    return Response(response=json.dumps(country_options, ensure_ascii=False).encode('utf8'),
                    status=200, mimetype="application/json")

@app.route('/haemaankenttä/<maa>')
def get_kenttä(maa):
    connection = Tietokanta('localhost', 3306, 'flight_game', 'root')
    connection.connect()
    kenttä = connection.hae_kenttä(maa)
    print(kenttä)

    return Response(response=json.dumps(kenttä, ensure_ascii=False).encode('utf8'),
                    status=200, mimetype="application/json")
@app.route('/haemaankysymys/<id>')
def kysymys(id):
    connection = Tietokanta('localhost', 3306, 'flight_game', 'root')
    connection.connect()
    kysymys = connection.get_question(id)
    print(kysymys)

    return Response(response=json.dumps(kysymys, ensure_ascii=False).encode('utf8'),
                    status=200, mimetype="application/json")

@app.route('/haeoikeavastaus/<id>')
def oikein(id):
    connection = Tietokanta('localhost', 3306, 'flight_game', 'root')
    connection.connect()
    oikein = connection.get_correct_question(id)
    print(oikein)

    return Response(response=json.dumps(oikein, ensure_ascii=False).encode('utf8')
                    , status=200, mimetype="application/json")

@app.route('/randomcountry')
def get_random_country_list():
    connection = Tietokanta('localhost', 3306, 'flight_game', 'root')
    connection.connect()
    country_list = connection.random_country()
    print(country_list)

    return Response(response=json.dumps(country_list, ensure_ascii=False).encode('utf8')
                    , status=200, mimetype="application/json")

@app.route('/add_selected_country/<current_country>')
def add_selected_country(current_country):
    print("Python saa nykyisen maan: " + current_country)
    visited_countries.append(current_country)
    """print(visited_countries)"""

    return Response(response=json.dumps(visited_countries, ensure_ascii=False).encode('utf8')
                    , status=200, mimetype="application/json")

@app.route('/haevastaukset/<id>')
def hae_vastaukset(id):
    connection = Tietokanta('localhost', 3306, 'flight_game', 'root')
    connection.connect()
    vastaus = connection.get_vastaus(id)
    print(vastaus)

    return Response(response=json.dumps(vastaus, ensure_ascii=False).encode('utf8')
                    , status=200, mimetype="application/json")

@app.route('/top5')
def get_top5_list():
    connection = Tietokanta('localhost', 3306, 'flight_game', 'root')
    connection.connect()
    top5 = connection.leaderboard()
    print(top5)

    return Response(response=json.dumps(top5, ensure_ascii=False).encode('utf8'),
                    status=200, mimetype="application/json")

@app.route('/haerandommaa')
def hae_maa():
    connection = Tietokanta('localhost', 3306, 'flight_game', 'root')
    connection.connect()
    country = connection.get_country()
    print(country)

    return Response(response=json.dumps(country, ensure_ascii=False).encode('utf8'),
                    status=200, mimetype="application/json")

visited_countries = []

if __name__ == '__main__':
    app.run(use_reloader=True, host='127.0.0.1', port=3000)
