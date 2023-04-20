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

@app.route('/maat')
def arvokolmemaata():
    käydytmaat = []  # LISTAA KAIKKI MAAT JOSSA PELAAJA ON KÄYNYT
    kerrat = 0
    arvotutmaat = []
    while kerrat != 3:
        numero = random.randint(1, 30)
        sql = "select Nimi from maat where ID = '" + str(numero) + "'"
        kursori = yhteys.cursor()
        kursori.execute(sql)
        tulos = kursori.fetchall()
        for n in tulos:
            if n not in käydytmaat:
                if n not in arvotutmaat:
                    arvotutmaat.append(n)
                    kerrat = kerrat + 1

        paluujson = json.dumps(tulos)
        tilakoodi = 200

    return Response(response=paluujson, status=tilakoodi, mimetype="application/json")

if __name__ == '__main__':
    app.run(use_reloader=True, host='127.0.0.1', port=3000)