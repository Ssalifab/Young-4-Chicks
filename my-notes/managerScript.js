// Sales Agent Registration
const form3 = document.getElementById('addStockForm');

//Event-Listener for the form and Function to generate the table

form3.addEventListener('submit', function (event) {
    event.preventDefault()

    
    const sChickType = document.getElementById('chickTypeS').value.trim();
    const sBreed = document.getElementById('breedS').value;
    const sFarmerType = document.getElementById('farmerTypeS').value;
    const sQuantity = document.getElementById('quantityS').value.trim();
    const sAge = document.getElementById('age').value.trim();
    const dateUpdated = document.getElementById('dateUpdated').value.trim();
    const errorMsgS = document.getElementById('errorMsgSales');
    errorMsgS.textContent = '';

    //Form Validation
    if (!sName || !sChickType || !sBreed || !sFarmerType || !sQuantity) {
        errorMsgS.textContent = 'Please fill all fields';
        return;
    }
    if (sQuantity <= 0 || sQuantity > 500) {
        errorMsgS.textContent = 'You cant order for zero (0) or more than 500 chicks';
        return;
    }

    addToSalesTable(sChickType, sBreed, sFarmerType, sQuantity, sAge, dateUpdated);
    form3.reset();


});

//table handling
function addToSalesTable(sChickType, sBreed, sFarmerType, sQuantity, sAge, dateUpdated) {
    const table = document.getElementById('salesTable').getElementsByTagName('tbody')[0];
    let row = table.insertRow();
    let cell1 = row.insertCell(0);
    let cell2 = row.insertCell(1);
    let cell3 = row.insertCell(2);
    let cell4 = row.insertCell(3);
    let cell5 = row.insertCell(4);
    let cell6 = row.insertCell(5);

    cell1.textContent = sChickType;
    cell2.textContent = sBreed;
    cell3.textContent = sFarmerType;
    cell4.textContent = sQuantity;
    cell5.textContent = sAge;
    cell6.textContent = dateUpdated;
}