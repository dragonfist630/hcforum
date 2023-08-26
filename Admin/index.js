var jsondata = {};

// Function to open Edit Member Modal
const editMember = (index) => {
  const memberData = jsondata[index];
  console.log(memberData);
  const modalBody = document.querySelector("#editMemberModal .modal-body");
  modalBody.innerHTML = `
  <form id="editForm">
    <div class="form-group">
      <label for="name">Memeber</label>
      <input type="text" class="form-control" id="member" value="${memberData.member}" required>
    </div>
    <div class="form-group">
      <label for="name">Name</label>
      <input type="text" class="form-control" id="name" value="${memberData.name}" required>
    </div>
    <div class="form-group">
      <label for="organization">Organization</label>
      <input type="text" class="form-control" id="organization" value="${memberData.organization.join(", ")}" required>
    </div>
    <div class="form-group">
      <label for="role">Role</label>
      <input type="text" class="form-control" id="role" value="${memberData.role.join(", ")}" required>
    </div>
    <div class="form-group">
      <label for="link">Link</label>
      <input type="text" class="form-control" id="link" value="${memberData.link}" required>
    </div>
  </form>
  <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
            <button type="button" class="btn btn-primary" onclick="saveEditedMember('${memberData._id}')">Save Changes</button>
          </div>
`;
};

// Function to save edited member details
function saveEditedMember(_id) {
  const formObject = {
    member: document.getElementById("member").value,
    name : document.getElementById("name").value,
    organization: document.getElementById("organization").value.split(", "),
    role: document.getElementById("role").value.split(", "),
    link: document.getElementById("link").value,
  };
  console.log(_id, formObject);
}

// Function to delete a member card
function deleteMember(id,index) {
  if(document.getElementById(`delete${index}`).checked){
  axios
    .delete("http://localhost:3000/deleteEntries", {
      data: { id: id }, // Send the ID in the request body
    })
    .then((res) => {
      alert(res.data.message);
      location.reload();
    })
    .catch((error) => console.log(error));
  }
}

function fetchData() {
  return new Promise((resolve, reject) => {
    axios
      .get("http://localhost:3000/showAdmin")
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
}
fetchData()
  .then((jsonData) => {
    jsondata = jsonData;
    console.log(jsondata);

    // Function to create and render member cards
    const renderMemberCards = () => {
      const cardsContainer = document.getElementById("cardsContainer");

      jsonData.forEach((data, index) => {
        const card = `
    <div class="col-md-3 mb-3">
      <form class="card">
        <img src="../img/male_user.png" class="card-img-top" alt="Member Image" class="w-25 col-6">
        <div class="card-body">
          <h5 class="card-title">${data.member}</h5>
          <p class="card-text">Organization: ${data.organization.join(", ")}</p>
          <p class="card-text">Role: ${data.role.join(", ")}</p>
          <p class="card-text"><input type="checkbox" id='delete${index}' name="deleteCheckbox" required><lable>check this to delete</label> </p>
          <button class="btn btn-secondary ml-2" onclick="editMember(${index})" data-toggle="modal"
            data-target="#editMemberModal">Edit</button>
          <button class="btn btn-danger ml-2" type="submit" onclick="deleteMember('${data._id}','${index}')">Delete</button>
        </div>
      </form>
    </div>
  `;
        cardsContainer.innerHTML += card;
      });
    };

    // Initial render
    renderMemberCards();
  })
  .catch((error) => {
    console.log(error);
  });
