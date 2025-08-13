// Custom JavaScript for Farmer Dashboard
document.addEventListener('DOMContentLoaded', function() {
  // ======================
  // 1. REQUEST COOLDOWN SYSTEM
  // ======================
  const newRequestButton = document.getElementById('newRequestButton');
  const dateRestrictionModal = document.getElementById('dateRestrictionModal');
  const restrictionMessage = document.getElementById('restrictionMessage');
  const closeModal = document.querySelector('.close');

  // Check for existing requests and apply cooldown
  function checkRequestCooldown() {
    const requestRows = document.querySelectorAll('#myRequestsTable tbody tr');
    if (requestRows.length === 0) return;

    let latestRequestDate = null;
    
    requestRows.forEach(row => {
      const dateCell = row.cells[6]; // Date is in 7th column (index 6)
      if (dateCell) {
        const [day, month, year] = dateCell.textContent.split('-');
        const requestDate = new Date(`${year}-${month}-${day}`);
        
        if (!latestRequestDate || requestDate > latestRequestDate) {
          latestRequestDate = requestDate;
        }
      }
    });

    if (latestRequestDate) {
      const cooldownPeriod = 4; // months
      const nextAvailableDate = new Date(latestRequestDate);
      nextAvailableDate.setMonth(nextAvailableDate.getMonth() + cooldownPeriod);
      
      const today = new Date();
      
      if (today < nextAvailableDate) {
        // Disable and style the button
        newRequestButton.disabled = true;
        newRequestButton.classList.add('btn-secondary');
        newRequestButton.classList.remove('btn-success');
        
        // Format date for display
        const formattedDate = nextAvailableDate.toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        });
        
        restrictionMessage.textContent = 
          `You cannot make new requests until ${formattedDate}. The cooldown period is 4 months from your last request.`;
        
        dateRestrictionModal.style.display = 'block';
      }
    }
  }

  // ======================
  // 2. MODAL CONTROLS
  // ======================
  closeModal.addEventListener('click', function() {
    dateRestrictionModal.style.display = 'none';
  });

  window.addEventListener('click', function(event) {
    if (event.target === dateRestrictionModal) {
      dateRestrictionModal.style.display = 'none';
    }
  });

  // ======================
  // 3. FORM CALCULATIONS
  // ======================
  const quantityInput = document.getElementById('quantity');
  const unitPrice = 1650; // Fixed price per chick
  
  if (quantityInput) {
    quantityInput.addEventListener('input', function() {
      const quantity = parseInt(this.value) || 0;
      const totalPriceInput = document.getElementById('totalPrice');
      
      if (totalPriceInput) {
        totalPriceInput.value = quantity * unitPrice;
        
        // Validate against max quantity
        const farmerType = document.querySelector('input[name="farmerType"]:checked').value;
        const maxQuantity = farmerType === 'starter' ? 100 : 500;
        
        if (quantity > maxQuantity) {
          document.getElementById('errorMsg').textContent = 
            `Maximum ${maxQuantity} chicks allowed for ${farmerType} farmers`;
        } else {
          document.getElementById('errorMsg').textContent = '';
        }
      }
    });
  }

  // ======================
  // 4. FARMER TYPE TOGGLE
  // ======================
  const farmerTypeRadios = document.querySelectorAll('input[name="farmerType"]');
  farmerTypeRadios.forEach(radio => {
    radio.addEventListener('change', function() {
      const quantityInput = document.getElementById('quantity');
      if (quantityInput) {
        const max = this.value === 'starter' ? 100 : 500;
        quantityInput.max = max;
        quantityInput.placeholder = `Max ${max} chicks`;
        
        // Update validation message if needed
        if (parseInt(quantityInput.value) > max) {
          document.getElementById('errorMsg').textContent = 
            `Please reduce quantity to ${max} or below`;
        }
      }
    });
  });

  // ======================
  // 5. INITIALIZATION
  // ======================
  checkRequestCooldown();
});