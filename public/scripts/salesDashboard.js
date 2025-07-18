const form = document.getElementById('newRequestForm');

form.addEventListener('submit', function (event) {
event.preventDefault()

const farmerName = document.getElementById('farmerName').value.trim();
const nin = document.getElementById('nin').value.trim();
const type = document.getElementById('type').value;
const breed = document.getElementById('breed').value;
const farmerType = document.getElementById('farmerType').value;
const quantity = document.getElementById('quantity').value;
const dateUpdated = document.getElementById('dateUpdated').value.trim();
const errorMsg = document.getElementById('errorMsg');
errorMsg.textContent = '';

//Form Validation
    if (!farmerName || !nin || !type || !breed || !farmerType || !quantity || !dateUpdated) {
        errorMsg.textContent = 'Please fill all fields';
        return;
    }
        if (quantity < 0) {
        errorMsg.textContent = 'Quantity must be greater than zero';
        return;
    }

    addToRequestsTable(farmerName, nin, type, breed, farmerType, quantity, dateUpdated);
    form.reset();

});
// //table handling
function addToRequestsTable(farmerName, nin, type, breed, farmerType, quantity, dateUpdated) {
    const table = document.getElementById('requestsTable').getElementsByTagName('tbody')[0];
    let row = table.insertRow();
    let cell1 = row.insertCell(0);
    let cell2 = row.insertCell(1);
    let cell3 = row.insertCell(2);
    let cell4 = row.insertCell(3);
    let cell5 = row.insertCell(4);
    let cell6 = row.insertCell(5);
    let cell7 = row.insertCell(6);
    
    // const date = new Date();
    // const formattedDate = date.toLocaleDateString('en-GB');
    // const price = 'Ugx 1,650';

    cell1.textContent= farmerName;
    cell2.textContent=nin;
    cell3.textContent=type;
    cell4.textContent=breed;
    cell5.textContent=farmerType;
    cell6.textContent=quantity;
    cell7.textContent=dateUpdated;
}
