'use strict';

let username = "";
let homeCountry = "";

async function getCountries() {

  try {
    const response = await fetch('http://127.0.0.1:3000/countryoptions');

    return await response.json();
  } catch (error) {
    console.log(error.message);
  }
}

async function listCountries() {
    getCountries().then((potential_countries) => {
        document.getElementById("maa1_b").innerHTML = potential_countries[0];
        document.getElementById("maa1_b").value = potential_countries[0];
        document.getElementById("maa2_b").innerHTML = potential_countries[1];
        document.getElementById("maa2_b").value = potential_countries[1];
        document.getElementById("maa3_b").innerHTML = potential_countries[2];
        document.getElementById("maa3_b").value = potential_countries[2];
    });
}

getCountries().then((countries) => {
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
  console.log(username);
  homeCountry = document.querySelector('input[name="kotimaa_valinta"]:checked').value;
  console.log(homeCountry);
});

document.getElementById('maa1_b').addEventListener('click', function (event){
    event.preventDefault()

    current_country = document.getElementById("maa1_b").value;
    update_selected_country(current_country)
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
    update_selected_country(current_country)
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
    update_selected_country(current_country)
    console.log(current_country);
    document.getElementById("nykyinen_maa").innerHTML = current_country;
    maaLista.push(current_country)
    changeColor(current_country, 'red')
    console.log(maaLista)
    listCountries()
});
