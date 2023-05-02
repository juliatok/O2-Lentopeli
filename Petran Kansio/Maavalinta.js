
async function getCountries() {

  try {
      let response = await fetch('http://127.0.0.1:3000/randomcountry');
      return await countries;
  } catch (error) {
    console.log(error.message);
  }
}

async function listCountries() {
    getCountries().then((countries) => {
        document.getElementById("maa1_b").innerHTML = countries[0];
        document.getElementById("maa1_b").value = countries[0];
        document.getElementById("maa2_b").innerHTML = countries[1];
        document.getElementById("maa2_b").value = countries[1];
        document.getElementById("maa3_b").innerHTML = countries[2];
        document.getElementById("maa3_b").value = countries[2];
    });
}

function changeColor(id, color){
    let svg = document.getElementById(id);
    svg.style.fill = color;
}

let username = "Temporary";
let kotimaa = "Suomi";
let current_country = "";

const maaLista = [kotimaa];

let pisteet = 200;
let matka = 3000;

document.getElementById("nimi").innerHTML = username;
document.getElementById("kotimaa").innerHTML = kotimaa;
document.getElementById("nykyinen_maa").innerHTML = kotimaa;

document.getElementById("pisteet_num").innerHTML = pisteet;
document.getElementById("matka_num").innerHTML = matka + " km"

listCountries();
document.getElementById('maa1_b').addEventListener('click', function (event){
    event.preventDefault()

    current_country = document.getElementById("maa1_b").value;
    console.log(current_country);
    document.getElementById("nykyinen_maa").innerHTML = current_country;
    maaLista.push(current_country)
    changeColor(current_country, 'red')
    console.log(maaLista)
    listCountries()
});
document.getElementById('maa2_b').addEventListener('click', function (event){
    event.preventDefault()

    current_country = document.getElementById("maa2_b").value;
    console.log(current_country);
    document.getElementById("nykyinen_maa").innerHTML = current_country;
    maaLista.push(current_country)
    changeColor(current_country, 'red')
    console.log(maaLista)
    listCountries()
    });

document.getElementById('maa3_b').addEventListener('click', function (event){
    event.preventDefault()

    current_country = document.getElementById("maa3_b").value;
    console.log(current_country);
    document.getElementById("nykyinen_maa").innerHTML = current_country;
    maaLista.push(current_country)
    changeColor(current_country, 'red')
    console.log(maaLista)
    listCountries()
});
