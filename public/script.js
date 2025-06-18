console.log("Script.js is loaded and running!");

document.addEventListener("DOMContentLoaded", () => {
  
  //======================================================
  // INDEX PAGE
  //======================================================
  const continueBtn = document.getElementById("continue-btn");
  const indexBody = document.getElementById("indexbody");

  if (continueBtn && indexBody) {
    continueBtn.addEventListener('click', function(e) {
      indexBody.classList.add('fade-out');
      e.preventDefault();
      setTimeout(() => {
        window.location.href = '/home.html';
      }, 1000);
    });
  }

  //======================================================
  // MODAL MANAGEMENT
  //======================================================
  const addBtn = document.querySelector('.subbtn');
  const modal = document.getElementById('add-subscription-modal');
  const closeBtn = document.getElementById('close-modal');

  if (addBtn && modal && closeBtn) {
    // Open modal
    addBtn.addEventListener('click', () => {
      modal.style.display = 'flex';
    });

    // Close modal with button
    closeBtn.addEventListener('click', () => {
      modal.style.display = 'none';
      document.getElementById('subscription-form').reset();
      document.getElementById('subscription-form').dataset.editing = '';
    });

    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.style.display = 'none';
        document.getElementById('subscription-form').reset();
        document.getElementById('subscription-form').dataset.editing = '';
      }
    });
  }

  //======================================================
  // SORTING FUNCTIONALITY
  //======================================================
  const sortButtons = document.querySelectorAll('.sortbtn');
  
  // Add event listeners to all sort buttons
  if (sortButtons.length > 0) {
    sortButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        const sortBy = e.target.textContent.trim();
        console.log(`Sorting by: ${sortBy}`);
        
        // Map the button text to table column names
        const sortMapping = {
          'name': 'Name',
          'date': 'Date_Due',
          'category': 'Category',
          'price': 'Amount'
        };
        
        // Get the column to sort by
        const column = sortMapping[sortBy];
        
        if (column) {
          loadSortedSubscriptions(column);
        }
      });
    });
  }
  
  // Function to load sorted subscriptions
  function loadSortedSubscriptions(sortColumn) {
    // console.log(`Loading subscriptions sorted by ${sortColumn}...`);
    
    fetch(`/subscriptions?sort=${sortColumn}`)
      .then(res => {
        return res.json();
      })
      .then(data => {
        updateSubscriptionTable(data);
        
        // Highlight the active sort button
        highlightActiveSortButton(sortColumn);
      })
      .catch(err => {
        // console.error('Error loading sorted subscriptions:', err);
      });
  }
  
  // Highlight the active sort button
  function highlightActiveSortButton(sortColumn) {
    // Remove highlight from all buttons first
    document.querySelectorAll('.sortbtn').forEach(btn => {
      btn.classList.remove('active-sort');
    });
    
    // Map the column name back to button text
    const reverseMapping = {
      'Name': 'name',
      'Date_Due': 'date',
      'Category': 'category',
      'Amount': 'price'
    };
    
    // Find and highlight the active button
    const buttonText = reverseMapping[sortColumn];
    if (buttonText) {
      const activeButton = Array.from(document.querySelectorAll('.sortbtn')).find(
        btn => btn.textContent.trim() === buttonText
      );
      
      if (activeButton) {
        activeButton.classList.add('active-sort');
      }
    }
  }

  //======================================================
  // DATA FETCHING - STATISTICS
  //======================================================
  function loadStatistics() {
    // console.log("Loading statistics...");
    fetch('/statistics')
      .then(res => {
        // console.log("Statistics response status:", res.status);
        return res.json();
      })
      .then(data => {
        // console.log("Statistics received:", data);
        
        // Update active subscriptions count
        const activeSubscriptionsElement = document.querySelector('.box-info span:first-child');
        if (activeSubscriptionsElement) {
          activeSubscriptionsElement.textContent = `NO. OF ACTIVE SUBSCRIPTIONS: ${data.activeCount}`;
        }
        
        // Update monthly expenses
        const monthlyExpensesElement = document.querySelector('.expense:first-child .amount');
        if (monthlyExpensesElement) {
          monthlyExpensesElement.textContent = `$${data.monthlyTotal}`;
        }
        
        // Update yearly expenses
        const yearlyExpensesElement = document.querySelector('.expense:last-child .amount');
        if (yearlyExpensesElement) {
          yearlyExpensesElement.textContent = `$${data.yearlyTotal}`;
        }
      })
      .catch(err => {
        // console.error('Error loading statistics:', err);
      });
  }

  //======================================================
  // DATA FETCHING - SUBSCRIPTIONS
  //======================================================
  function loadSubscriptions() {
    // console.log("Loading subscriptions...");
    fetch('/subscriptions')
      .then(res => {
        // console.log("Response status:", res.status);
        return res.json();
      })
      .then(data => {
        // console.log("Data received:", data);
        updateSubscriptionTable(data);
        
        // Load statistics after subscriptions are loaded
        loadStatistics();
      })
      .catch(err => {
        // console.error('Error loading subscriptions:', err);
      });
  }

  // Update table with subscription data
  function updateSubscriptionTable(data) {
    const tableBody = document.getElementById('subscription-table-body');
    if (!tableBody) {
      // console.log("Table body element not found");
      return;
    }

    tableBody.innerHTML = ''; // clear current table

    if (data.length === 0) {
      // console.log("No subscription data received");
    }

    data.forEach(row => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>
          <img src="edit.png" class="icon edit-icon" data-subscription='${JSON.stringify(row)}' />
          ${row.Name}
          <img src="trash.png" class="icon trash-icon" data-name="${row.Name}" />
        </td>
        <td>${row.Amount}</td>
        <td>${row.Frequency}</td>
        <td>${row.Category}</td>
        <td>${row.Card_Used}</td>
        <td>${row.User}</td>
        <td>${row.Date_Due}</td>
      `;
      tableBody.appendChild(tr);
    });
  }

  // Initial load of subscriptions
  if (document.getElementById('subscription-table-body')) {
    // console.log("Table body found, loading subscriptions");
    loadSubscriptions();
  } else {
    // console.log("No table body found in this page");
  }

  //======================================================
  // CRUD OPERATIONS - DELETE
  //======================================================
  document.addEventListener('click', async (e) => {
    if (e.target.classList.contains('trash-icon')) {
      const name = e.target.dataset.name;
      if (confirm(`Sure you want to delete ${name}?`)) {
        try {
          const response = await fetch(`/delete-subscription/${encodeURIComponent(name)}`, {
            method: 'DELETE'
          });
          const result = await response.json();
          if (result.success) {
            alert(`${name} deleted!`);
            loadSubscriptions();
            // Statistics will be updated by loadSubscriptions
          } else {
            alert('Failed to delete.');
          }
        } catch (err) {
          // console.error('Delete error:', err);
          alert('Server error');
        }
      }
    }
  });

  //======================================================
  // CRUD OPERATIONS - EDIT
  //======================================================
  document.addEventListener('click', (e) => {
    if (e.target.classList.contains('edit-icon')) {
      const data = JSON.parse(e.target.dataset.subscription);
      
      // Reset form first
      const form = document.getElementById('subscription-form');
      form.reset();
      
      // Map table column names to form field names
      const fieldMapping = {
        'Name': 'subscription_name',
        'Amount': 'price',
        'Frequency': 'plan_type',
        'Category': 'category_name',
        'Card_Used': 'payment_provider', // This might need special handling
        'User': 'full_name',
        'Date_Due': 'due_day'
      };
      
      // Fill form fields based on mapping
      for (const key in data) {
        const formFieldName = fieldMapping[key];
        if (formFieldName) {
          const input = form.querySelector(`[name="${formFieldName}"]`);
          if (input) input.value = data[key];
        }
      }
      
      // Handle Card_Used special case (contains provider and type)
      if (data.Card_Used) {
        const cardParts = data.Card_Used.split(' - ');
        if (cardParts.length === 2) {
          const providerInput = form.querySelector('[name="payment_provider"]');
          const typeInput = form.querySelector('[name="payment_type"]');
          if (providerInput) providerInput.value = cardParts[0];
          if (typeInput) typeInput.value = cardParts[1];
        }
      }
      
      // Show modal
      const modal = document.getElementById('add-subscription-modal');
      modal.style.display = 'flex';
      
      // Save ID to update later
      form.dataset.editing = data.Name;
    }
  });

  //======================================================
  // CRUD OPERATIONS - CREATE/UPDATE
  //======================================================
  const form = document.getElementById('subscription-form');

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      // console.log("Form submitted");
      
      const formData = new FormData(form);
      const data = Object.fromEntries(formData.entries());
      // console.log("Form data:", data);
      
      const editingName = form.dataset.editing;
      const url = editingName 
        ? `/update-subscription/${encodeURIComponent(editingName)}`
        : '/add-subscription';
      
      // console.log("Request URL:", url);
      const method = editingName ? 'PUT' : 'POST';
      
      try {
        const response = await fetch(url, {
          method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
        
        // console.log("Response status:", response.status);
        const result = await response.json();
        // console.log("Response data:", result);
        
        if (result.success) {
          alert(editingName ? 'Subscription updated!' : 'Subscription added!');
          form.reset();
          form.dataset.editing = '';
          modal.style.display = 'none';
          // Update Statistics
          loadSubscriptions();
        } else {
          alert('Failed to save: ' + (result.error || 'Unknown error'));
        }
      } catch (err) {
        console.error('Form submit error:', err);
        alert('Server error: ' + err.message);
      }
    });
  }
});