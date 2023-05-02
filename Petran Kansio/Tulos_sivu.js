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

fetching_top5(document.querySelector('table'))
