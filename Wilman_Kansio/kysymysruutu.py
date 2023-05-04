import mysql.connector
from flask import Flask, Response
from flask_cors import CORS
import json
import random

app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

cnx = mysql.connector.connect(
    host='localhost',
    port=3306,
    database='flight_game',
    user='root',
    password='assiponi',
    autocommit=True
)

''' 
--- HAKEE RANDOM MAAN ---
Palauttaa maan nimen ja id:n
'''
@app.route('/haerandommaa')
def get_country():
    tulos = []
    sql = "select Nimi, iso_country, ID from maat ORDER BY RAND() LIMIT 1"
    cursor = cnx.cursor()
    cursor.execute(sql)
    result = cursor.fetchall()
    for n in result:
        tulos.append(n)
    return Response(response=json.dumps(tulos, ensure_ascii=False).encode('utf8')
                    , status=200, mimetype="application/json")


''' 
--- HAKEE MAAN LENTOKENTÄN ---
Saa parametrina maan nimen
Palauttaa lentokentän nimen
(jos ei ole isoa kenttää, palauttaa medium-kentän)
'''
@app.route('/haemaankenttä/<maa>')
def get_kenttä(maa):
    print("Arvottu maa:", maa)
    kentät = []
    sql = "select airport.name, airport.municipality from airport, maat where nimi = '" + str(
        maa) + "' and airport.iso_country = maat.iso_country and type = 'large_airport' order by rand() limit 1"
    cursor = cnx.cursor()
    cursor.execute(sql)
    result = cursor.fetchall()
    length = len(result)

    if length != 0:
        for n in result:
            kentät.append(n[0])
            kentät.append(n[1])
            print(kentät)
        return Response(response=json.dumps(kentät, ensure_ascii=False).encode('utf8')
                        , status=200, mimetype="application/json")
    else:
        sql = "select airport.name, airport.municipality from airport, maat where nimi = '" + str(
            maa) + "' and airport.iso_country = maat.iso_country and type = 'medium_airport' order by rand() limit 1"
        cursor = cnx.cursor()
        cursor.execute(sql)
        result = cursor.fetchall()
        for n in result:
            kentät.append(n[0])
            kentät.append(n[1])
        return Response(response=json.dumps(kentät, ensure_ascii=False).encode('utf8')
                        , status=200, mimetype="application/json")

''' 
--- HAKEE MAAN KYSYMYKSEN ---
Saa parametrina maan ID:n
Palauttaa kysymyksen ID:n ja kysymyksen
'''
@app.route('/haemaankysymys/<id>')
def get_question(id):
    kysymys = []
    sql = "select ID, kysymys from vastaukset where paikka_id = '" + str(id) + "'"
    cursor = cnx.cursor()
    cursor.execute(sql)
    kysymykset = cursor.fetchall()
    kysyttava_kysymys = random.choice(kysymykset)
    for n in kysyttava_kysymys:
        kysymys.append(n)
    print("Kysyttävä kysymys:",kysymys[1])
    return Response(response=json.dumps(kysymys, ensure_ascii=False).encode('utf8')
                    , status=200, mimetype="application/json")

@app.route('/haeoikeavastaus/<id>')
def get_correct_question(id):
    kysymys = []
    sql = "select oikein from vastaukset where id = '" + str(id) + "'"
    cursor = cnx.cursor()
    cursor.execute(sql)
    kysymykset = cursor.fetchall()
    print("Oikea vastaus:",kysymykset[0])
    for n in kysymykset:
        kysymys.append(n)
    return Response(response=json.dumps(kysymys, ensure_ascii=False).encode('utf8')
                    , status=200, mimetype="application/json")

@app.route('/haevastaukset/<id>')
def get_vastaus(id):
    sql = "select oikein, väärin1, väärin2 from vastaukset where ID = '" + str(id) + "'"
    cursor = cnx.cursor()
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

    print("Vastausvaihtoehdot:",vastausvaihtoehdot)

    return Response(response=json.dumps(vastausvaihtoehdot, ensure_ascii=False).encode('utf8')
                    , status=200, mimetype="application/json")


if __name__ == '__main__':
    app.run(use_reloader=True, host='127.0.0.1', port=3000)