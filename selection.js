const roundToFileMap = {
    "1": "data1.csv",
    "2": "data2.csv",
    "3": "veterinary.csv"
};

function updateCategoryOptions() {
    const roundSelect = document.getElementById('round_select');
    const selectedRound = roundSelect.value;
    const filePath = roundToFileMap[selectedRound];

    if (filePath) {
        fetch(filePath)
            .then(response => response.text())
            .then(csvData => {
                const categories = parseCSV(csvData);
                console.log('Parsed categories:', categories);
                populateCategoryOptions(categories);
            })
            .catch(error => console.error('Error fetching CSV:', error));
    } else {
        populateCategoryOptions([]); // Clear options if no round is selected
    }
}

function parseCSV(csvData) {
    const rows = csvData.trim().split('\n');
    const categories = new Set();

    rows.slice(1).forEach(row => {
        const columns = row.split(',');
        if (columns[2]) { // Assuming category is in the second column
            categories.add(columns[2].trim());
        }
    });

    return Array.from(categories);
}

function populateCategoryOptions(options) {
    const selectElement = document.getElementById('input2');
    selectElement.innerHTML = '<option value="">Select Category</option>';

    options.forEach(option => {
        const optionElement = document.createElement('option');
        optionElement.value = option;
        optionElement.textContent = option;
        selectElement.appendChild(optionElement);
    });

}

document.getElementById('round_select').addEventListener('change', updateCategoryOptions);
