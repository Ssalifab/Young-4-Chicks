const form = document.getElementById('newRequestForm');

form.addEventListener('submit', function (event) {
event.preventDefault()

const chickType = document.getElementById('chickType').value.trim();
const breed = document.getElementById('breed').value.trim();
const quantity = document.getElementById('quantity').value;
const dateUpdated = document.getElementById('dateUpdated').value.trim();
const errorMsg = document.getElementById('errorMsg');
errorMsg.textContent = '';

//Form Validation
    if (!chickType || !breed || !quantity || !dateUpdated) {
        errorMsg.textContent = 'Please fill all fields';
        return;
    }

    addToStockTable(chickType, breed, quantity, dateUpdated);
    form.reset();

});
//table handling
function addToStockTable(chickType, breed, quantity, dateUpdated) {
    const table = document.getElementById('myRequestsTable').getElementsByTagName('tbody')[0];
    let row = table.insertRow();
    let cell1 = row.insertCell(0);
    let cell2 = row.insertCell(1);
    let cell3 = row.insertCell(2);
    let cell4 = row.insertCell(3);
    
    // const date = new Date();
    // const formattedDate = date.toLocaleDateString('en-GB');
    // const price = 'Ugx 1,650';

    cell1.textContent= chickType;
    cell2.textContent=breed;
    cell3.textContent=quantity;
    cell4.textContent=dateUpdated;
}
