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

function fetchPetById() {
    const petId = document.getElementById('getPetId').value;
    const apiUrl = `https://petstore.swagger.io/v2/pet/${petId}`;

    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            displaySinglePet(data);
        })
        .catch(error => {
            alert('GET Pet by ID Error: ' + error.message);
        });
}

function displaySinglePet(pet) {
    const singlePetContainer = document.getElementById('singlePetContainer');
    singlePetContainer.innerHTML = ''; 

    if (!pet || !pet.id) {
        singlePetContainer.innerHTML = '<p>Pet not found.</p>';
        return;
    }

    const petItem = document.createElement('div');
    petItem.className = 'pet-item';
    petItem.innerHTML = `
        <strong>Pet ID:</strong> ${pet.id}<br>
        <strong>Name:</strong> ${pet.name}<br>
        <strong>Status:</strong> ${pet.status}<br>
        <button onclick="populateUpdateForm(${pet.id}, '${pet.name}', '${pet.status}')">Update</button>
        <button onclick="deletePet(${pet.id})">Delete</button>
    `;
    singlePetContainer.appendChild(petItem);
}

function displayPets(pets, title, containerId = 'petContainer') {
    const petContainer = document.getElementById(containerId);
    petContainer.innerHTML = ''; 
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

function populateUpdateForm(id, name, status) {
    document.getElementById('updatePetId').value = id;
    document.getElementById('updatePetName').value = name;
    document.getElementById('updatePetStatus').value = status;

  
    document.getElementById('updateForm').style.display = 'block';
}

function cancelUpdate() {
    document.getElementById('updateForm').style.display = 'none';

    document.getElementById('updatePetId').value = '';
    document.getElementById('updatePetName').value = '';
    document.getElementById('updatePetStatus').value = '';
}

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
        fetchAllPets(); 
        fetchRecentlyAdoptedPets(); 

  
        cancelUpdate();
    })
    .catch(error => {
        alert('PUT Pet Error: ' + error.message);
    });
}

function deletePet(id) {
    const deleteUrl = `https://petstore.swagger.io/v2/pet/${id}`;

    fetch(deleteUrl, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (response.ok) {
            alert(`Pet with ID ${id} has been deleted.`);
            fetchAllPets(); 
        } else {
            throw new Error('Failed to delete the pet.');
        }
    })
    .catch(error => {
        alert('DELETE Pet Error: ' + error.message);
    });
}

function createPet() {
    const petData = {
        id: Math.floor(Math.random() * 1000), 
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
        fetchAllPets(); 
    })
    .catch(error => {
        alert('POST Pet Error: ' + error.message);
    });
}

function adoptPet() {
    const id = document.getElementById('adoptPetId').value;
    const petData = {
        id: parseInt(id),
        status: 'sold' 
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
        fetchAllPets(); 
        fetchRecentlyAdoptedPets(); 
    })
    .catch(error => {
        alert('ADOPT Pet Error: ' + error.message);
    });
}


window.onload = function() {
    fetchAllPets();
    fetchRecentlyAdoptedPets(); 
};
