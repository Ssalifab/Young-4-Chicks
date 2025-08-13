     document.addEventListener('DOMContentLoaded', function() {
        const newRequestButton = document.getElementById('newRequestButton');
        const dateRestrictionModal = document.getElementById('dateRestrictionModal');
        const restrictionMessage = document.getElementById('restrictionMessage');
        const closeModal = document.querySelector('.close');
        
        // Get the latest request date from the table
        const requestDates = Array.from(document.querySelectorAll('#myRequestsTable tbody tr td:last-child')).map(td => {
          const [day, month, year] = td.textContent.split('-');
          return new Date(`${year}-${month}-${day}`);
        });
        
        if (requestDates.length > 0) {
          const latestRequestDate = new Date(Math.max(...requestDates));
          const cooldownPeriod = 4; // months
          const nextAvailableDate = new Date(latestRequestDate);
          nextAvailableDate.setMonth(nextAvailableDate.getMonth() + cooldownPeriod);
          
          const today = new Date();
          
          if (today < nextAvailableDate) {
            // Disable the new request button
            newRequestButton.disabled = true;
            newRequestButton.classList.add('btn-secondary');
            newRequestButton.classList.remove('btn-success');
            
            // Format the next available date for display
            const options = { year: 'numeric', month: 'long', day: 'numeric' };
            const formattedDate = nextAvailableDate.toLocaleDateString('en-US', options);
            
            // Set the restriction message
            restrictionMessage.textContent = `You cannot make any new requests until ${formattedDate}. The cooldown period is 4 months from your last request.`;
            
            // Show the modal
            dateRestrictionModal.style.display = 'block';
          }
        }
        
        // Close modal when clicking the X
        closeModal.addEventListener('click', function() {
          dateRestrictionModal.style.display = 'none';
        });
        
        // Close modal when clicking outside
        window.addEventListener('click', function(event) {
          if (event.target === dateRestrictionModal) {
            dateRestrictionModal.style.display = 'none';
          }
        });
        
        // Quantity calculation logic
        document.getElementById('quantity')?.addEventListener('input', function() {
          const quantity = parseInt(this.value) || 0;
          const unitPrice = 1650;
          const totalPriceInput = document.getElementById('totalPrice');
          if (totalPriceInput) {
            totalPriceInput.value = quantity * unitPrice;
          }
        });
      });