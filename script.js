document.addEventListener('DOMContentLoaded', () => {
    const itemList = document.getElementById('item-list');
    const primaryLevelSelect = document.getElementById('primary-level');
    let itemsData = {};

    // Load data from data.json
    async function loadData() {
        try {
            const response = await fetch('data.json');
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
            itemsData = await response.json();
            loadItems(primaryLevelSelect.value); // Default to Primary 1 or selected level
        } catch (error) {
            console.error('Error loading data:', error);
        }
    }

    // Load items based on selected primary level
    function loadItems(level) {
        const levelData = itemsData[`primary${level}`];
        let allItems = [];
        if (levelData) {
            allItems = [...(levelData.books || []), ...(levelData.stationery || [])];
        }

        displayItems(allItems);
    }

    // Display items in the table
    function displayItems(items) {
        itemList.innerHTML = '';
        items.forEach((item, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td><input type="checkbox" class="acquired-checkbox" data-index="${index}"></td>
                <td class="item-name">${item.title || item.item}</td>
                <td>${item.type || 'Stationery'}</td>
                <td class="item-comment">${item.comment || ''}</td>
                <td>
                    <button class="btn btn-warning btn-sm edit-btn" data-index="${index}">Edit</button>
                    <button class="btn btn-danger btn-sm delete-btn" data-index="${index}">Delete</button>
                </td>
            `;
            itemList.appendChild(row);

            // Attach event listeners for checkbox, edit, and delete
            row.querySelector('.acquired-checkbox').addEventListener('change', toggleItemAcquired);
            row.querySelector('.edit-btn').addEventListener('click', editItem);
            row.querySelector('.delete-btn').addEventListener('click', deleteItem);
        });
    }

    // Toggle acquired checkbox
    function toggleItemAcquired(e) {
        const row = e.target.closest('tr');
        const nameCell = row.querySelector('.item-name');
        if (e.target.checked) {
            nameCell.classList.add('strikethrough');
        } else {
            nameCell.classList.remove('strikethrough');
        }
    }

    // Edit item comment
    function editItem(e) {
        const row = e.target.closest('tr');
        const commentCell = row.querySelector('.item-comment');
        const newComment = prompt("Edit Comment:", commentCell.textContent);
        if (newComment !== null) {
            commentCell.textContent = newComment;
        }
    }

    // Delete an item
    function deleteItem(e) {
        const row = e.target.closest('tr');
        row.remove();
    }

    // Handle primary level selection
    primaryLevelSelect.addEventListener('change', (e) => {
        loadItems(e.target.value);
    });

    // Wait for the DOM to load
document.addEventListener('DOMContentLoaded', () => {
    const searchButton = document.getElementById('searchButton');
    const resultsList = document.getElementById('results');
  
    searchButton.addEventListener('click', () => {
      // Get the search query from the input field
      const searchQuery = document.getElementById('searchQuery').value;
  
      if (!searchQuery.trim()) {
        alert("Please enter a search query!");
        return;
      }
  
      // Open Library API URL
      const apiUrl = `https://openlibrary.org/search.json?q=${encodeURIComponent(searchQuery)}`;
  
      // Fetch the data
      fetch(apiUrl)
        .then(response => {
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          return response.json();
        })
        .then(data => {
          // Clear any previous results
          resultsList.innerHTML = "";
  
          // Display results
          data.docs.forEach(book => {
            const listItem = document.createElement('li');
            listItem.textContent = `Title: ${book.title}, Author: ${book.author_name ? book.author_name.join(', ') : 'Unknown'}`;
            resultsList.appendChild(listItem);
          });
        })
        .catch(error => {
          console.error("Error fetching data:", error);
          alert("Failed to fetch search results. Please try again.");
        });
    });
  });
  document.getElementById('add-item-btn').addEventListener('click', () => {
    const itemName = prompt('Enter item name:');
    const itemType = prompt('Enter item type (e.g., Stationery, Book):');
    if (itemName && itemType) {
        const newItem = { item: itemName, type: itemType, comment: '' };
        itemsData[`primary${primaryLevelSelect.value}`].stationery.push(newItem);
        loadItems(primaryLevelSelect.value);
    }
});


    // Initial data load
    loadData();
});
