// Function to fetch all pets from the API
function fetchAllPets() {
  const apiUrl = 'https://petstore.swagger.io/v2/pet/findByStatus?status=available';

  fetch(apiUrl)
      .then(response => {
          if (!response.ok) {
              throw new Error('Network response was not ok');
          }
          return response.json();
      })
      .then(data => {
          displayPets(data, 'Available Pets');
      })
      .catch(error => {
          alert('GET Pets Error: ' + error.message);
      });
}

// Function to fetch recently adopted pets
function fetchRecentlyAdoptedPets() {
  const apiUrl = 'https://petstore.swagger.io/v2/pet/findByStatus?status=sold';

  fetch(apiUrl)
      .then(response => {
          if (!response.ok) {
              throw new Error('Network response was not ok');
          }
          return response.json();
      })
      .then(data => {
          displayPets(data, 'Recently Adopted Pets', 'recentlyAdoptedPets');
      })
      .catch(error => {
          alert('GET Recently Adopted Pets Error: ' + error.message);
      });
}

// Function to display pets in the pet container
function displayPets(pets, title, containerId = 'petContainer') {
  const petContainer = document.getElementById(containerId);
  petContainer.innerHTML = ''; // Clear previous pets

  if (pets.length === 0) {
      petContainer.innerHTML = `<p>No ${title.toLowerCase()} found.</p>`;
      return;
  }

  pets.forEach(pet => {
      const petItem = document.createElement('div');
      petItem.className = 'pet-item';
      petItem.innerHTML = `
          <strong>Pet ID:</strong> ${pet.id}<br>
          <strong>Name:</strong> ${pet.name}<br>
          <strong>Status:</strong> ${pet.status}<br>
          <button onclick="populateUpdateForm(${pet.id}, '${pet.name}', '${pet.status}')">Update</button>
          <button onclick="deletePet(${pet.id})">Delete</button>
      `;
      petContainer.appendChild(petItem);
  });
}

// Function to create a pet in the API
function createPet() {
  const petData = {
      id: Math.floor(Math.random() * 1000), // Generate a random ID
      name: document.getElementById('newPetName').value,
      status: document.getElementById('newPetStatus').value,
  };

  const postUrl = 'https://petstore.swagger.io/v2/pet';

  fetch(postUrl, {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify(petData)
  })
  .then(response => response.json())
  .then(data => {
      alert('Pet Created: ' + JSON.stringify(data, null, 2));
      fetchAllPets(); // Refresh the pet list
  })
  .catch(error => {
      alert('POST Pet Error: ' + error.message);
  });
}

// Function to update a pet in the API
function updatePet() {
  const id = document.getElementById('updatePetId').value;
  const petData = {
      id: parseInt(id),
      name: document.getElementById('updatePetName').value,
      status: document.getElementById('updatePetStatus').value,
  };

  const putUrl = `https://petstore.swagger.io/v2/pet`;

  fetch(putUrl, {
      method: 'PUT',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify(petData)
  })
  .then(response => response.json())
  .then(data => {
      alert('Pet Updated: ' + JSON.stringify(data, null, 2));
      fetchAllPets(); // Refresh the pet list
      fetchRecentlyAdoptedPets(); // Refresh the recently adopted pets list
  })
  .catch(error => {
      alert('PUT Pet Error: ' + error.message);
  });
}

// Function to adopt a pet (change status to 'sold')
function adoptPet() {
  const id = document.getElementById('adoptPetId').value;
  const petData = {
      id: parseInt(id),
      status: 'sold' // Change status to 'sold'
  };

  const adoptUrl = `https://petstore.swagger.io/v2/pet`;

  fetch(adoptUrl, {
      method: 'PUT',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify(petData)
  })
  .then(response => {
      if (response.ok) {
          return response.json();
      } else {
          throw new Error('Network response was not ok');
      }
  })
  .then(data => {
      alert(`Pet with ID "${id}" has been adopted!`);
      fetchAllPets(); // Refresh the pet list
      fetchRecentlyAdoptedPets(); // Refresh the recently adopted pets list
  })
  .catch(error => {
      alert('ADOPT Pet Error: ' + error.message);
  });
}

// Automatically fetch all pets and recently adopted pets when the page loads
window.onload = function() {
  fetchAllPets();
  fetchRecentlyAdoptedPets(); // Fetch recently adopted pets
};
