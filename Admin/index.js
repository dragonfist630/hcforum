// Function to create card element
function createCard(data) {
    return `
      <div class="col-md-4 mb-4">
        <div class="card h-100 shadow">
          <img src="${data.img}" class="card-img-top" alt="${data.name}">
          <div class="card-body">
            <h5 class="card-title">${data.name}</h5>
            <p class="card-text">Member: ${data.member}</p>
            <p class="card-text">Organization: ${data.organization.join(", ")}</p>
            <p class="card-text">Role: ${data.role.join(", ")}</p>
            <a href="${data.link}" class="btn btn-primary" target="_blank">Learn More</a>
            <button class="btn btn-danger mt-2 delete-btn" data-id="${data.size}">Delete</button>
          </div>
        </div>
      </div>
    `;
  }
  
  // Function to render cards
  function renderCards(data) {
    const cardContainer = document.getElementById("card-container");
    cardContainer.innerHTML = data.map(createCard).join("");
  }
  
  // Function to fetch data using Axios
  async function fetchData() {
    try {
      const response = await axios.get('/api/data'); // Replace with your backend endpoint
      const jsonData = response.data;
      renderCards(jsonData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }
  
  // Event listener to handle delete button click
  document.addEventListener("click", async function (event) {
    if (event.target.classList.contains("delete-btn")) {
      const idToDelete = parseInt(event.target.getAttribute("data-id"));
      try {
        await axios.delete(`/api/data/${idToDelete}`); // Replace with your backend delete endpoint
        fetchData(); // Refresh the cards after deletion
      } catch (error) {
        console.error('Error deleting data:', error);
      }
    }
  });
  
  // Initial rendering of cards on page load
  fetchData();
  