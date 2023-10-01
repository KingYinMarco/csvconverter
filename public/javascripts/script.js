// Function to convert CSV to JSON
function convertCsvToJson(csvContent) {
    const lines = csvContent.split('\n');
    const headers = lines[0].split(',');
    const jsonData = [];

    for (let i = 1; i < lines.length; i++) {
        const currentLine = lines[i].split(',');
        const entry = {};

        for (let j = 0; j < headers.length; j++) {
            if (j === 0) {
                entry['language'] = currentLine[j];
            } else {
                entry[headers[j] + ' Popularity'] = Number(currentLine[j]);
            }
        }

        jsonData.push(entry);
    }

    return jsonData;
}

document.getElementById('uploadForm').addEventListener('click', function(event) {
    event.preventDefault(); // Prevent form submission

    // Get the selected file from the input element
    const fileInput = document.getElementById('csvFile');
    const file = fileInput.files[0];

    if (!file) {
        alert("Please select a file to upload.");
        return;
    }

    if (file.name.split('.').pop().toLowerCase() !== 'csv') {
        alert("Only .csv files are allowed.");
        return;
    }

    const reader = new FileReader();
    reader.onload = function(event) {
        const csvContent = event.target.result;
        const jsonData = convertCsvToJson(csvContent);

        // Display the table
        const tableContainer = document.getElementById('tableContainer');
        tableContainer.innerHTML = ''; // Clear previous content
        tableContainer.appendChild(generateTable(jsonData));

        // Generate and display the line chart
        const lineChartContainer = document.getElementById('lineChart');
        lineChartContainer.innerHTML = ''; // Clear previous content
        generateLineChart(jsonData);

        // Generate and display the bar chart
        const barChartContainer = document.getElementById('barChart');
        barChartContainer.innerHTML = ''; // Clear previous content
        generateBarChart(jsonData);
    };

    reader.readAsText(file, 'UTF-8');
});

document.getElementById('convert').addEventListener('click',function(event) {
    event.preventDefault(); // Prevent form submission
    const fileInput = document.getElementById('csvFile');
    const file = fileInput.files[0];

    if (!file) {
        alert("Please select a file to upload.");
        return;
    }

    if (file.name.split('.').pop().toLowerCase() !== 'csv') {
        alert("Only .csv files are allowed.");
        return;
    }

    const reader = new FileReader();
    reader.onload = function(event) {
        const csvContent = event.target.result;
        const jsonData = convertCsvToJson(csvContent);

    // Save the JSON data as a .json file in the same location as the original .csv file
    saveAsJson(jsonData, file.name.replace('.csv', '.json'));
    };

    reader.readAsText(file, 'UTF-8');
});

// Function to save JSON data as .json file
function saveAsJson(jsonData, filename) {
    const jsonDataStr = JSON.stringify(jsonData, null, 2);
    const blob = new Blob([jsonDataStr], { type: 'application/json' });

    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = filename;

    document.body.appendChild(a);
    a.click();

    document.body.removeChild(a);
}

// Function to generate the table
function generateTable(data) {
    const table = document.createElement('table');
    const headerRow = document.createElement('tr');
    const headers = Object.keys(data[0]);

    // Create table headers
    headers.forEach(headerText => {
        const th = document.createElement('th');
        th.textContent = headerText;
        headerRow.appendChild(th);
    });

    table.appendChild(headerRow);

    // Create table rows and cells
    data.forEach(item => {
        const row = document.createElement('tr');
        Object.values(item).forEach(text => {
            const cell = document.createElement('td');
            cell.textContent = text;
            row.appendChild(cell);
        });
        table.appendChild(row);
    });

    return table;
}

// Function to generate the line chart
function generateLineChart(data) {
    const labels = data.map(item => item.language);
    const year1Data = data.map(item => item['2022 Popularity']);
    const year2Data = data.map(item => item['2023\r Popularity']);

    const ctx = document.getElementById('lineChart').getContext('2d');
    const lineChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Popularity in 2022',
                    borderColor: '#007bff',
                    backgroundColor: 'rgba(0, 123, 255, 0.2)',
                    data: year1Data,
                    fill: false
                },
                {
                    label: 'Popularity in 2023',
                    borderColor: '#28a745',
                    backgroundColor: 'rgba(40, 167, 69, 0.2)',
                    data: year2Data,
                    fill: false
                }
            ]
        },
        options: {
            scales: {
                x: {
                    beginAtZero: true
                },
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}
// Function to generate the bar chart
function generateBarChart(data) {
    const labels = data.map(item => item.language);
    const year1Data = data.map(item => item['2022 Popularity']);
    const year2Data = data.map(item => item['2023\r Popularity']);

    const ctx = document.getElementById('barChart').getContext('2d');
    const barChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [
                {
                    label: '2022 Popularity',
                    backgroundColor: 'orange',
                    data: year1Data,
                },
                {
                    label: '2023 Popularity',
                    backgroundColor: 'blue',
                    data: year2Data,
                }
            ]
        },
        options: {
            scales: {
                x: {
                    beginAtZero: true
                },
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

 // Helper function to generate random colors for line chart
 function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}