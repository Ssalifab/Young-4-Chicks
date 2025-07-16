//Stock taking or chick registration
const form1 = document.getElementById('chickForm');

// Event-Listener for the form and Function to generate the table
// Syntax... element.addEventListener(eventType,function)
form1.addEventListener('submit', function (event) {
    event.preventDefault()

    const type = document.getElementById('chickType').value.trim();
    const breed = document.getElementById('chickBreed').value.trim();
    const quantity = document.getElementById('chickQuantity').value;
    const age = document.getElementById('chickAge').value;
    const reqDate = document.getElementById('dateRequested').value;
    const errorMsgChicks = document.getElementById('errorMsgChicks');
    errorMsgChicks.textContent = '';

    //Form Validation
    if (!breed || !type || !quantity || !age) {
        errorMsgChicks.textContent = 'Please fill all fields';
        return;
    }
    {
        if (age < 1 || age > 30) {
            errorMsgChicks.textContent = 'Age must be between 1 and 30 days';
            return;
        }
        if (quantity < 1 || quantity > 10500) {
            errorMsgChicks.textContent = 'Quantity must be between 1 and 10500';
            return;
        }
        addToChicksTable(type, breed, quantity, age, reqDate);
        form1.reset();
    }
});

//table handling
function addToChicksTable(type, breed, quantity, age, reqDate) {
    const table = document.getElementById('chicksTable').getElementsByTagName('tbody')[0];
    let row = table.insertRow();
    let cell1 = row.insertCell(0);
    let cell2 = row.insertCell(1);
    let cell3 = row.insertCell(2);
    let cell4 = row.insertCell(3);
    let cell5 = row.insertCell(4);

    // const date = new Date();
    // const formattedDate = date.toLocaleDateString('en-GB');

    cell1.textContent = type;
    cell2.textContent = breed;
    cell3.textContent = quantity;
    cell4.textContent = age;
    cell5.textContent = reqDate;

}


