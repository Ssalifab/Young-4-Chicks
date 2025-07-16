//Farmer registration
 const form2 = document.getElementById('farmerForm');

// //Event-Listener for the form and Function to generate the table
// //Syntax... element.addEventListener(eventType,function)
form2.addEventListener('submit', function (event) {
event.preventDefault()

const fName = document.getElementById('farmerName').value.trim();
const fEmail = document.getElementById('farmerEmail').value.trim();
const fPassword = document.getElementById('farmerPassword').value;
const fPasswordConfirm = document.getElementById('farmerPasswordConfirm').value;
const fAge = document.getElementById('farmerAge').value.trim();
const fGender = document.getElementById('farmerGender').value.trim();
const fFarmerNin = document.getElementById('farmerNin').value.trim();
const fFarmerContact = document.getElementById('farmerContactNumber').value.trim();
const fFarmerRecommender = document.getElementById('farmerRecommender').value.trim();
const fFarmerRecommenderNin = document.getElementById('farmerRecommenderNin').value.trim();
const fFarmerRecommenderContact = document.getElementById('farmerRecommenderContact').value.trim();
const fErrorMsgFarmer = document.getElementById('errorMsgFarmer');
fErrorMsgFarmer.textContent = '';

//Form Validation
    if (!fName || !fEmail || !fPassword || !fPasswordConfirm || !fAge || !fGender || !fFarmerNin || !fFarmerContact || !fFarmerRecommender || !fFarmerRecommenderNin || !fFarmerRecommenderContact) {
        fErrorMsgFarmer.textContent = 'Please fill all fields';
        return;
    }
    if (fPassword !== fPasswordConfirm) {
        fErrorMsgFarmer.textContent = 'Your passwords do not match';
        return;
    }
    if (fAge < 18 || fAge > 30) {
        fErrorMsgFarmer.textContent = 'Age must be between 18 and 30 years';
        return;
    }
    addToFarmerTable(fName, fEmail, fPassword, fPasswordConfirm, fAge, fGender, fFarmerNin, fFarmerContact, fFarmerRecommender, fFarmerRecommenderNin, fFarmerRecommenderContact);
    form2.reset();

});

// //table handling
function addToFarmerTable(fName, fEmail, fPassword, fPasswordConfirm, fAge, fGender, fFarmerNin, fFarmerContact, fFarmerRecommender, fFarmerRecommenderNin, fFarmerRecommenderContact) {
    const fTable = document.getElementById('farmerTable').getElementsByTagName('tbody')[0];
    let row = fTable.insertRow();
    let cell1 = row.insertCell(0);
    let cell2 = row.insertCell(1);
    let cell3 = row.insertCell(2);
    let cell4 = row.insertCell(3);
    let cell5 = row.insertCell(4);
    let cell6 = row.insertCell(5);
    let cell7 = row.insertCell(6);
    let cell8 = row.insertCell(7);
    let cell9 = row.insertCell(8);
    let cell10 = row.insertCell(9);
    let cell11 = row.insertCell(10);

    cell1.textContent= fName;
    cell2.textContent=fEmail;
    cell3.textContent=fPassword;
    cell4.textContent=fPasswordConfirm;
    cell5.textContent=fAge;
    cell6.textContent=fGender;
    cell7.textContent=fFarmerNin;
    cell8.textContent=fFarmerContact;
    cell9.textContent=fFarmerRecommender;
    cell10.textContent=fFarmerRecommenderNin;
    cell11.textContent=fFarmerRecommenderContact;
}

