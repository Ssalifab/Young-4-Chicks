// Sales Agent Registration
const form3 = document.getElementById('salesForm');

//Event-Listener for the form and Function to generate the table

form3.addEventListener('submit', function (event) {
    event.preventDefault()

    const sName = document.getElementById('farmerNameS').value.trim();
    const sChickType = document.getElementById('chickTypeS').value.trim();
    const sBreed = document.getElementById('breedS').value;
    const sFarmerType = document.getElementById('farmerTypeS').value;
    const sQuantity = document.getElementById('quantityS').value.trim();
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

    addToSalesTable(sName, sChickType, sBreed, sFarmerType, sQuantity);
    form3.reset();


});

//table handling
function addToSalesTable(sName, sChickType, sBreed, sFarmerType, sQuantity) {
    const table = document.getElementById('salesTable').getElementsByTagName('tbody')[0];
    let row = table.insertRow();
    let cell1 = row.insertCell(0);
    let cell2 = row.insertCell(1);
    let cell3 = row.insertCell(2);
    let cell4 = row.insertCell(3);
    let cell5 = row.insertCell(4);

    cell1.textContent = sName;
    cell2.textContent = sChickType;
    cell3.textContent = sBreed;
    cell4.textContent = sFarmerType;
    cell5.textContent = sQuantity;
}