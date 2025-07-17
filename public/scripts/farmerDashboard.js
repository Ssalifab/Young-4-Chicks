const form = document.getElementById('addStockForm');

form.addEventListener('submit', function (event) {
event.preventDefault()

const chickType = document.getElementById('chickType').value.trim();
const breed = document.getElementById('breed').value.trim();
const quantity = document.getElementById('quantity').value;
const age = document.getElementById('age').value;
const dateUpdated = document.getElementById('dateUpdated').value.trim();
const errorMsg = document.getElementById('errorMsg');
errorMsg.textContent = '';

//Form Validation
    if (!chickType || !breed || !quantity || !age || !dateUpdated) {
        errorMsg.textContent = 'Please fill all fields';
        return;
    }
        if (quantity < 0 || age < 0) {
        errorMsg.textContent = 'Age or Quantity must be greater than zero';
        return;
    }

    addToStockTable(chickType, breed, quantity, age, dateUpdated);
    form.reset();

});
// //table handling
function addToStockTable(chickType, breed, quantity, age, dateUpdated) {
    const table = document.getElementById('stockTable').getElementsByTagName('tbody')[0];
    let row = table.insertRow();
    let cell1 = row.insertCell(0);
    let cell2 = row.insertCell(1);
    let cell3 = row.insertCell(2);
    let cell4 = row.insertCell(3);
    let cell5 = row.insertCell(4);
    
    // const date = new Date();
    // const formattedDate = date.toLocaleDateString('en-GB');
    // const price = 'Ugx 1,650';

    cell1.textContent= chickType;
    cell2.textContent=breed;
    cell3.textContent=quantity;
    cell4.textContent=age;
    cell5.textContent=dateUpdated;
}
