
async function getCountries() {

  try {
    const response = await fetch('http://127.0.0.1:3000/countryoptions');

    return await response.json();
  } catch (error) {
    console.log(error.message);
  }
}

async function haeNappi() {
    console.log('nappi toimii');



    try {

    } catch (error) {
        console.log(error.message);
    } finally {
        console.log('asynchronous load complete');
    }
}

let username = "Temporary";
let kotimaa = "Suomi";
let current_country = "";

document.getElementById("nimi").innerHTML = username;
document.getElementById("kotimaa").innerHTML = kotimaa;
document.getElementById("nykyinen_maa").innerHTML = kotimaa;

getCountries().then((countries) => {
    document.getElementById("maa1_b").innerHTML = countries[0];
    document.getElementById("maa2_b").innerHTML = countries[1];
    document.getElementById("maa3_b").innerHTML = countries[2];
});

document.getElementById('maa1_b').addEventListener('click', haeNappi);
document.getElementById('maa2_b').addEventListener('click', haeNappi);
document.getElementById('maa3_b').addEventListener('click', haeNappi);

