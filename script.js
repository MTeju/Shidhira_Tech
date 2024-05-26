document.addEventListener("DOMContentLoaded", function() {
    const form = document.getElementById('userForm');

    form.addEventListener('submit', function(event) {
        event.preventDefault();

        const rank = document.getElementById('select1').value;
        const branch = document.getElementById('input1').value;
        const round = document.getElementById('round_select').value;
        const category = document.getElementById('input2').value;

        document.querySelector('.rank').innerHTML = rank;
        document.querySelector('.branch').innerHTML = branch;
        document.querySelector('.round').innerHTML = `Round ${round}`;
        document.querySelector('.category').innerHTML = category;
       
        sendData(branch, category, rank, round);
    });

    loadCollegeNames();
});

let collegeNames = {};

function loadCollegeNames() {
    fetch('college_names.json')
        .then(response => response.json())
        .then(data => {
            collegeNames = data;
            console.log('College names loaded:', collegeNames);
        })
        .catch(error => {
            console.error('Error loading college names:', error);
        });
}

function sendData(branch, category, rank, round) {
  

    const csvFile = roundToFileMap[round];
    
    if (!csvFile) {
        console.error('CSV file not found for round:', round);
        return;
    }

    console.log('CSV file selected:', csvFile);

    fetch(csvFile)
        .then(response => response.text())
        .then(csvData => {
            console.log('CSV data loaded:', csvData);
            processData(csvData, branch, category, parseInt(rank));
        })
        .catch(error => {
            console.error('Error loading CSV file:', error);
        });
}

function processData(csvData, branch, category, rank) {
    const rows = csvData.trim().split('\n').slice(1); // Skip the header row
    const results = [];

    console.log('Processing CSV data...');

    rows.forEach(row => {
        const cols = row.split(',');
        const csvCollegeId = cols[0];
        const csvBranch = cols[1];
        const csvCategory = cols[2];
        const csvRank = parseInt(cols[3]);
        const csvCollege = cols[0]; // Assume college ID is in the first column

        if (csvBranch === branch && csvCategory === category && csvRank >= rank) {
            results.push({ id: csvCollegeId, college: csvCollege, rank: csvRank });
        }
    });


    results.sort((a, b) => a.rank - b.rank);

    const sortedColleges = results.map(result => ({ id: result.id, college: result.college }));

    displayResults(sortedColleges);
}

function displayResults(results) {
    const tableBody = document.querySelector('#resultsTable tbody');
    tableBody.innerHTML = '';

    if (results.length > 0) {
        results.forEach(result => {
            const row = document.createElement('tr');
            
            // College ID cell
            const idCell = document.createElement('td');
            idCell.textContent = result.id;
            row.appendChild(idCell);
            
            // College name cell
            const nameCell = document.createElement('td');
            nameCell.textContent = collegeNames[result.college] || result.college;
            nameCell.style.textAlign = "left";
            row.appendChild(nameCell);

            tableBody.appendChild(row);
        });
    } else {
        const row = document.createElement('tr');
        const cell = document.createElement('td');
        cell.textContent = 'No colleges found matching the criteria.';
        cell.colSpan = 2; // Span both columns
        row.appendChild(cell);
        tableBody.appendChild(row);
    }
    
    document.querySelector

    document.getElementById('select1').value = "";
    document.getElementById('input1').value = "";
    document.getElementById('round_select').value = "";
    document.getElementById('input2').value = "";
}

