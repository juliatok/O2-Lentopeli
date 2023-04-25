'use strict';

async function getCountries() {

  try {
    const response = await fetch('http://127.0.0.1:3000/countryoptions');

    return await response.json();
  } catch (error) {
    console.log(error.message);
  }
}

getCountries().then((countries) => {
  document.getElementById("kotimaa_valinta_1_label").innerHTML = countries[0];
  document.getElementById("kotimaa_valinta_2_label").innerHTML = countries[1];
  document.getElementById("kotimaa_valinta_3_label").innerHTML = countries[2];
});