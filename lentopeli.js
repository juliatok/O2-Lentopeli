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

async function update_selected_country(current_country){
    try {
      const response = await fetch('http://127.0.0.1:3000/add_selected_country/' + current_country);
      let data = response.json()
      console.log(data)
  } catch (error) {
    console.log(error.message);
  }
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
  homeCountry = document.querySelector('input[name="kotimaa_valinta"]:checked').value;

  if (username.length > 0 && username.length < 21) {
    console.log(username);
    console.log(homeCountry);
  } else {
    alert("Nimen tulee olla 1-20 merkkiä pitkä!");
  }
});

