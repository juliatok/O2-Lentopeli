'use strict';

/* HAKEE VÄLIAIKAISESTI RANDOM MAAN */
async function haeRandomMaa() {
  try {
    const response = await fetch('http://127.0.0.1:3000/haerandommaa');

    return await response.json();
  } catch (error) {
    console.log(error.message);
  }
}
async function haeMaanKenttä(countries) {
  try {
    const response = await fetch(`http://127.0.0.1:3000/haemaankenttä/${countries}`);
    console.log(response)

    return await response.json();
  } catch (error) {
    console.log(error.message);
  }
}

async function haeMaanKysymys(id) {
  try {
    const response = await fetch(`http://127.0.0.1:3000/haemaankysymys/${id}`);
    console.log(response)

    return await response.json();
  } catch (error) {
    console.log(error.message);
  }
}

async function haevastaukset(id) {
  try {
    const response = await fetch(`http://127.0.0.1:3000/haevastaukset/${id}`);
    console.log(response)

    return await response.json();
  } catch (error) {
    console.log(error.message);
  }
}

haeRandomMaa().then((countries) => {
  document.getElementById("maa-nimi-teksti").innerHTML = countries[0][0];
  haeMaanKenttä(countries[0][0]).then((kenttä) => {
    document.getElementById("maa-lentokenttä-teksti").innerHTML = kenttä[0];
      haeMaanKysymys(countries[0][2]).then((kysymys) => {
      document.getElementById("kysymys").innerHTML = kysymys[1];
        haevastaukset(kysymys[0]).then((vastaukset) => {
          document.getElementById("vaihtoehto1").innerHTML = vastaukset[0][0];
          document.getElementById("vaihtoehto2").innerHTML = vastaukset[1][0];
          document.getElementById("vaihtoehto3").innerHTML = vastaukset[2][0];
          document.getElementById("lippu").src = "https://flagsapi.com/"+countries[0][1]+"/shiny/64.png";
  });
  });
});
});