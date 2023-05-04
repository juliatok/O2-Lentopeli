
const apiKey = "895f29bb7f89a74190b92992ef6a6c59";
const tempElement = document.querySelector("#sää-teksti");
const iconElement = document.querySelector("#sää-kuva");

const button1 = document.getElementById("vaihtoehto1");
const button2 = document.getElementById("vaihtoehto2");
const button3 = document.getElementById("vaihtoehto3");

let username = "Temporary";
let kotimaa = "Suomi";
let current_country = kotimaa;

const maaLista = [kotimaa];

const maabutton1 = document.getElementById('maa1_b')
const maabutton2 = document.getElementById('maa2_b')
const maabutton3 = document.getElementById('maa3_b')

let pisteet = 200;
let matka = 3000;

async function getCountries() {

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
    getCountries().then((potential_countries) => {
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
      document.getElementById("nimi").innerHTML = username;
      document.getElementById("kotimaa").innerHTML = kotimaa;
      document.getElementById("nykyinen_maa").innerHTML = current_country;

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
    document.getElementById("kysymys").innerHTML = kysymys[1];
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
    }


    const correctAnswer = await haeOikeaVastaus(kysymys[0]); // haetaan kysymyksen oikea vastaus. Kysymys[0] on kysymyksen id
    button1.addEventListener("click", async function(event) {
      checkAnswer(event, correctAnswer); // tarkistetaan onko vastaus oikein
    });
    button2.addEventListener("click", async function(event) {
      checkAnswer(event, correctAnswer);
    });
    button3.addEventListener("click", async function(event) {
      checkAnswer(event, correctAnswer);
    });
  } catch (error) {
    console.log(error.message);
}
}

async function checkAnswer(event, oikea_vastaus) {
  const selectedAnswer = event.target.innerHTML; // valittu vastaus on sama kuin napin teksti
  console.log("Oikea vastaus:", oikea_vastaus[0][0])

  if (selectedAnswer === oikea_vastaus[0][0]) { // valittu vastaus on sama kuin oikea vastaus
    event.target.style.backgroundColor = "green";
    document.getElementById("tulos").style.color = "green";
    document.getElementById("tulos").innerHTML = "<strong>Oikein! +80 pistettä<strong>";
  } else { // valittu vastaus on eri kuin oikea vastaus
    event.target.style.backgroundColor = "#E34234";
    document.getElementById("tulos").style.color = "#E34234";
    document.getElementById("tulos").innerHTML = "<strong>Väärin! -20 pistettä<strong>";
  }
  button1.disabled = true; // Ottaa napit pois käytöstä
  button2.disabled = true;
  button3.disabled = true;

  setTimeout(() => { // Odottaa kaksi sekuntia ja lataa sivun uudestaan
     window.location.href = "Maavalinta.html";
  }, 2000);
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
    document.getElementById("nykyinen_maa").innerHTML = current_country;
    maaLista.push(current_country)
    changeColor(current_country, 'red')
    console.log(maaLista)
    maabutton1.disabled = true;

    setTimeout(() => { // Odottaa kaksi sekuntia ja lataa kysymys sivun
        window.location.href = "kysymysruutu.html";
        }, 2000);
    return current_country

    });
    maabutton2.addEventListener('click', function (event){
        event.preventDefault()

        current_country = document.getElementById("maa2_b").value;
        localStorage.setItem("current_country",current_country)
        update_selected_country(current_country)
        console.log(current_country);
        document.getElementById("nykyinen_maa").innerHTML = current_country;
        maaLista.push(current_country)
        changeColor(current_country, 'red')
        console.log(maaLista)
        maabutton2.disabled = true;

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
        document.getElementById("nykyinen_maa").innerHTML = current_country;
        maaLista.push(current_country)
        changeColor(current_country, 'red')
        console.log(maaLista)
        maabutton3.disabled = true;

        setTimeout(() => { // Odottaa kaksi sekuntia ja lataa kysymys sivun
            window.location.href = "kysymysruutu.html";
            }, 2000);
    });
}

function changeColor(id, color){
    let svg = document.getElementById(id);
    svg.style.fill = color;
}




main();

