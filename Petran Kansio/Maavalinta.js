
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



async function update_selected_country(current_country){
    try {
      const response = await fetch('http://127.0.0.1:3000/add_selected_country/' + current_country);
      let data = response.json()
      console.log(data)
  } catch (error) {
    console.log(error.message);
  }
}

async function maabutton_listner(){
    maabutton1.addEventListener('click', function (event){
    event.preventDefault()

    current_country = document.getElementById("maa1_b").value;
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

    });
    maabutton2.addEventListener('click', function (event){
        event.preventDefault()

        current_country = document.getElementById("maa2_b").value;
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

let username = "Temporary";
let kotimaa = "Suomi";
let current_country = kotimaa;

const maaLista = [kotimaa];

let pisteet = 200;
let matka = 3000;

update_selected_country(current_country)

document.getElementById("nimi").innerHTML = username;
document.getElementById("kotimaa").innerHTML = kotimaa;
document.getElementById("nykyinen_maa").innerHTML = current_country;

document.getElementById("pisteet_num").innerHTML = pisteet;
document.getElementById("matka_num").innerHTML = matka + " km"

const maabutton1 = document.getElementById('maa1_b')
const maabutton2 = document.getElementById('maa2_b')
const maabutton3 = document.getElementById('maa3_b')

listCountries(current_country);

