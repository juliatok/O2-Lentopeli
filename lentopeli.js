'use strict';

const apiKey = "895f29bb7f89a74190b92992ef6a6c59";
const tempElement = document.querySelector("#sää-teksti");
const iconElement = document.querySelector("#sää-kuva");

const button1 = document.getElementById("vaihtoehto1");
const button2 = document.getElementById("vaihtoehto2");
const button3 = document.getElementById("vaihtoehto3");

const maabutton1 = document.getElementById('maa1_b')
const maabutton2 = document.getElementById('maa2_b')
const maabutton3 = document.getElementById('maa3_b')

let pisteet = 0;
let matka = 3000;

const maaLista = [];

let username = "";
let homeCountry = "";
let current_country = "";

async function getCountries() {

  try {
    const response = await fetch('http://127.0.0.1:3000/countryoptions');

    return await response.json();
  } catch (error) {
    console.log(error.message);
  }
}

function toQuestions(username, homeCountry) {
    localStorage.setItem("username", username);
    localStorage.setItem("homeCountry",homeCountry);
    localStorage.setItem("current_country",homeCountry);
    localStorage.setItem("pisteet", 0)
    localStorage.setItem("questionsAsked", 1)
    window.location.href = "Maavalinta.html";
}


async function get_Countries() {

  try {
      let response = await fetch('http://127.0.0.1:3000/randomcountry');
      let data = response.json()
      console.log(data)
      return await data;
  } catch (error) {
    console.log(error.message);
  }
}

async function listCountries() {
    get_Countries().then((potential_countries) => {
        maabutton1.innerHTML = potential_countries[0];
        maabutton1.value = potential_countries[0];
        maabutton2.innerHTML = potential_countries[1];
        maabutton2.value = potential_countries[1];
        maabutton3.innerHTML = potential_countries[2];
        maabutton3.value = potential_countries[2];
    });
    current_country = maabutton_listner()
    console.log('listcountry funktio' + current_country)
    return current_country
}

async function update_selected_country(current_country){
    try {
      const response = await fetch('http://127.0.0.1:3000/add_selected_country/' + current_country);
      let data = response.json()

      console.log(data)
  } catch (error) {
    console.log(error.message);
  }
}

async function main() {
  try {
      try {
          getCountries().then((countries) => {
              console.log(countries)
          document.getElementById("kotimaa_valinta_1_label").innerHTML = countries[0];
          document.getElementById("kotimaa_1").value = countries[0];
          document.getElementById("kotimaa_valinta_2_label").innerHTML = countries[1];
          document.getElementById("kotimaa_2").value = countries[1];
          document.getElementById("kotimaa_valinta_3_label").innerHTML = countries[2];
          document.getElementById("kotimaa_3").value = countries[2];
        });

          document.getElementById("nimi_kotimaa_tallennusnappi").addEventListener("click", function(event){
              event.preventDefault()

          username = document.getElementById("nimi").value;
          homeCountry = document.querySelector('input[name="kotimaa_valinta"]:checked').value;

          if (username.length > 0 && username.length < 21) {
            console.log(username);
            console.log(homeCountry);
            toQuestions(username, homeCountry);
          } else {
            alert("Nimen tulee olla 1-20 merkkiä pitkä!");
          }
        });
      } catch (error) {
    console.log(error.message);}

       try {
        document.getElementById("h2-tulokset").innerHTML = "Onneksi olkoon "+ localStorage.getItem("username") +"! Läpäisit pelin!<br>Tervetuloa takaisin kotimaahasi "+ localStorage.getItem("homeCountry") +"!";
        document.getElementById("p-tulokset").innerHTML = "Pisteet:<br><strong>"+ localStorage.getItem("pisteet") +"</strong>";
    } catch (error) {
    console.log(error.message);
    }


    try {
          const kayttaja = localStorage.getItem("username")
          const kotimaa = localStorage.getItem("homeCountry")
          const nykyinen_maa = localStorage.getItem("current_country")
      document.getElementById("nimi").innerHTML = "Käyttäjänimi: " + kayttaja;
      document.getElementById("kotimaa").innerHTML = "Kotimaa: " + kotimaa;
      document.getElementById("nykyinen_maa").innerHTML = "Sijainti: " + nykyinen_maa;

        const pisteet = localStorage.getItem("pisteet")
      document.getElementById("pisteet_num").innerHTML = pisteet;
      document.getElementById("matka_num").innerHTML = matka + " km"

      update_selected_country(current_country)
       current_country = listCountries(current_country);
      console.log('Petran jutut' + current_country )
    } catch (error) {
    console.log(error.message);
}

    console.log('main alku')
      console.log(current_country)

    const haettuMaa = await haeRandomMaa(localStorage.getItem("current_country"));
    console.log('maa haettu')
    document.getElementById("maa-nimi-teksti").innerHTML = haettuMaa[0][0];
    const kenttä = await haeMaanKenttä(haettuMaa[0][0]);
    document.getElementById("maa-lentokenttä-teksti").innerHTML = kenttä[0];
    const kysymys = await haeMaanKysymys(haettuMaa[0][2]);
    document.getElementById("kysymys").innerHTML = localStorage.getItem("questionsAsked") + ". " + kysymys[1];
    const vastaukset = await haevastaukset(kysymys[0]);
    console.log(kysymys[0])
    document.getElementById("vaihtoehto1").innerHTML = vastaukset[0][0];
    document.getElementById("vaihtoehto2").innerHTML = vastaukset[1][0];
    document.getElementById("vaihtoehto3").innerHTML = vastaukset[2][0];
    document.getElementById("lippu").src = `https://flagsapi.com/${haettuMaa[0][1]}/shiny/64.png`;
    try {
      const säätilaData = await haeSäätila(kenttä[1]);
      const tempCelsius = kelvinToCelsius(säätilaData.main.temp);
      const iconUrl = haeSäätilaKuva(säätilaData.weather[0].icon);
      tempElement.innerHTML = `${tempCelsius}&deg;C`;
      iconElement.setAttribute("src", iconUrl);
      iconElement.setAttribute("alt", säätilaData.weather[0].description);
    } catch (error) {
      console.log(error.message);
      tempElement.innerHTML = `Säätilaa ei löytynyt.`;
    }


    const correctAnswer = await haeOikeaVastaus(kysymys[0]); // haetaan kysymyksen oikea vastaus. Kysymys[0] on kysymyksen id
    button1.addEventListener("click", async function(event) {
      checkAnswer(event, correctAnswer); // tarkistetaan onko vastaus oikein
        setTimeout(() => { // Odottaa kaksi sekuntia ja lataa sivun uudestaan
      window.location.href = "Maavalinta.html";
      console.log('Loppu')
  }, 2000);
    });
    button2.addEventListener("click", async function(event) {
      checkAnswer(event, correctAnswer);
      setTimeout(() => { // Odottaa kaksi sekuntia ja lataa sivun uudestaan
      window.location.href = "Maavalinta.html";
      console.log('Loppu')
  }, 2000);
    });
    button3.addEventListener("click", async function(event) {
      checkAnswer(event, correctAnswer);
      setTimeout(() => { // Odottaa kaksi sekuntia ja lataa sivun uudestaan
      window.location.href = "Maavalinta.html";
      console.log('Loppu')
  }, 2000);
    });
  } catch (error) {
    console.log(error.message);
    }
    try {
      tulosten_tallennus();
      fetching_top5(document.querySelector('table'))
    } catch (error) {
    console.log(error.message);
    }
}

async function checkAnswer(event, oikea_vastaus) {
  const selectedAnswer = event.target.innerHTML; // valittu vastaus on sama kuin napin teksti
  console.log("Oikea vastaus:", oikea_vastaus[0][0])
    pisteet = localStorage.getItem("pisteet")

  if (selectedAnswer === oikea_vastaus[0][0]) { // valittu vastaus on sama kuin oikea vastaus
    event.target.style.backgroundColor = "green";
    document.getElementById("tulos").style.color = "green";
    document.getElementById("tulos").innerHTML = "<strong>Oikein! +80 pistettä<strong>";
    pisteet = +pisteet + 80;
    localStorage.setItem("pisteet", pisteet);
  } else { // valittu vastaus on eri kuin oikea vastaus
    event.target.style.backgroundColor = "#E34234";
    document.getElementById("tulos").style.color = "#E34234";
    document.getElementById("tulos").innerHTML = "<strong>Väärin! -20 pistettä<strong>";
    if (pisteet > 0){

        pisteet -= 20;
        localStorage.setItem("pisteet", pisteet);
    }
  }
  button1.disabled = true; // Ottaa napit pois käytöstä
  button2.disabled = true;
  button3.disabled = true;

  let kysymykset = localStorage.getItem("questionsAsked")
        kysymykset++;
        localStorage.setItem("questionsAsked",kysymykset)
        console.log("KYSYMYKSIÄ KYSYTTY:",kysymykset)
  if (kysymykset === 11) {
        localStorage.setItem("questionsAsked",1)
        console.log('Tuloksiin');
        window.location.href = "tulokset.html";
    }
}
async function tulosten_tallennus(){
    try {
        username = localStorage.getItem('username');
        pisteet = localStorage.getItem('pisteet');
    const response = await fetch('http://127.0.0.1:3000/tuloksenlisays/'+ username + pisteet);

    return await response.json();
  } catch (error) {
    console.log(error.message);
  }
}
function changeColor(id, color){
    let svg = document.getElementById(id);
    svg.style.fill = color;
}

async function haeOikeaVastaus(kysymys_id) {
  const response = await fetch(`http://127.0.0.1:3000/haeoikeavastaus/${kysymys_id}`);
  return await response.json();
}

async function haeRandomMaa(maa) {
  const response = await fetch('http://127.0.0.1:3000/haerandommaa/' + maa);
  return await response.json();
}

async function haeMaanKenttä(countries) {
  const response = await fetch(`http://127.0.0.1:3000/haemaankenttä/${countries}`);
  console.log(response)
  return await response.json();
}

async function haeMaanKysymys(id) {
  const response = await fetch(`http://127.0.0.1:3000/haemaankysymys/${id}`);
  console.log(response)
  return await response.json();
}

async function haevastaukset(id) {
  const response = await fetch(`http://127.0.0.1:3000/haevastaukset/${id}`);
  console.log(response)
  return await response.json();
}

async function haeSäätila(city) {
  try {
    console.log(city);
    const cityEncoded = encodeURIComponent(city);
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityEncoded}&appid=${apiKey}`);
    return await response.json();
  } catch (error) {
    throw new Error(`Säätilaa ei voitu hakea kaupungille ${city}: ${error.message}`);
  }
}

function kelvinToCelsius(tempKelvin) {
  return (tempKelvin - 273.15).toFixed(1);
}

function haeSäätilaKuva(iconCode) {
  const baseUrl = "http://openweathermap.org/img/w/";
  return `${baseUrl}${iconCode}.png`;
}

async function maabutton_listner(){
    maabutton1.addEventListener('click', function (event){
    event.preventDefault()

    current_country = maabutton1.value; //Vaihtaa maan
        localStorage.setItem("current_country",current_country)
        console.log(current_country)
    update_selected_country(current_country)
    console.log(current_country);
    document.getElementById("nykyinen_maa").innerHTML = "Sijainti: " + current_country;
    maaLista.push(current_country)
    changeColor(current_country, 'red')
    console.log(maaLista)
    maabutton1.disabled = true;
    maabutton2.disabled = true;
    maabutton3.disabled = true;

    setTimeout(() => { // Odottaa kaksi sekuntia ja lataa kysymys sivun
        window.location.href = "kysymysruutu.html";
        }, 2000);

    });
    maabutton2.addEventListener('click', function (event){
        event.preventDefault()

        current_country = document.getElementById("maa2_b").value;
        localStorage.setItem("current_country",current_country)
        update_selected_country(current_country)
        console.log(current_country);
        document.getElementById("nykyinen_maa").innerHTML = "Sijainti: " + current_country;
        maaLista.push(current_country)
        changeColor(current_country, 'red')
        console.log(maaLista)
        maabutton1.disabled = true;
        maabutton2.disabled = true;
        maabutton3.disabled = true;

        setTimeout(() => { // Odottaa kaksi sekuntia ja lataa kysymys sivun
            window.location.href = "kysymysruutu.html";
            console.log("Toimii")
            }, 2000);

        });

    maabutton3.addEventListener('click', function (event){
        event.preventDefault()

        current_country = document.getElementById("maa3_b").value;
        localStorage.setItem("current_country",current_country)
        update_selected_country(current_country)
        console.log(current_country);
        document.getElementById("nykyinen_maa").innerHTML = "Sijainti: " + current_country;
        maaLista.push(current_country)
        changeColor(current_country, 'red')
        console.log(maaLista)
        maabutton1.disabled = true;
        maabutton2.disabled = true;
        maabutton3.disabled = true;

        setTimeout(() => { // Odottaa kaksi sekuntia ja lataa kysymys sivun
            window.location.href = "kysymysruutu.html";
            }, 2000);
    });
}

async function fetching_top5 (table) {
    try {
        const tableBody = table.querySelector('tbody')
        const response = await fetch('http://127.0.0.1:3000/top5')
        const data = await response.json()
        console.log(data)
        tableBody.innerHTML = "";

        for (const row of data){
            const rowElement = document.createElement('tr');
            for (const cellText of row) {
                const cellElement = document.createElement('td');
                cellElement.textContent = cellText;
                rowElement.appendChild(cellElement);
            }
            tableBody.appendChild(rowElement);
        }
    } catch (error) {
    console.log(error.message);
  }
}

main();



