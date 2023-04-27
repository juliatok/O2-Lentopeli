async function top10 () {
    try {
    const response = await fetch('http://127.0.0.1:3000/top10');

    return await response.json();

    fill_top10_list(top10list)

    } catch (error) {
    console.log(error.message);
  }
}

async function fill_top10_list(top10list) {
    console.log(top10list)
    let htmltop10 = '<table>';
    htmltop10 = htmltop10 + '<table>'

    document.getElementById('top10').innerHTML = htmltop10;
}

top10()

