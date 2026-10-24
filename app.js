// API: pehle 20 users ka data deti hai (male aur female dono)
const API_URL = "https://dummyjson.com/users?limit=20";

const grid = document.getElementById("grid");
const message = document.getElementById("message");
const search = document.getElementById("search");
const modal = document.getElementById("modal");

let users = []; // API ka data yahan save hoga

// 1. API se data lana
async function loadUsers() {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error("Request failed: " + response.status);

    const data = await response.json();
    users = data.users;
    showCards(users);
  } catch (error) {
    message.textContent = "Could not load users. Check your internet connection and refresh the page.";
    message.className = "error";
    console.error(error);
  }
}

// 2. Cards banana
function showCards(list) {
  grid.innerHTML = "";

  if (list.length === 0) {
    message.textContent = "No user matches your search.";
    return;
  }
  message.textContent = "";

  list.forEach(function (user) {
    const card = document.createElement("article");
    card.className = "card";
    card.innerHTML =
      '<img src="' + user.image + '" alt="">' +
      "<h3>" + user.firstName + " " + user.lastName + "</h3>" +
      '<p class="job">' + user.company.title + "</p>" +
      '<span class="gender ' + user.gender + '">' + user.gender + "</span>" +
      '<button type="button">View details</button>';

    // Button par click karne se details khulein
    card.querySelector("button").addEventListener("click", function () {
      openDetails(user);
    });

    grid.appendChild(card);
  });
}

// Ek row banata hai (label + value)
function row(label, value) {
  return '<div class="row"><b>' + label + "</b><span>" + value + "</span></div>";
}

// 3. Details popup mein dikhana
function openDetails(user) {
  document.getElementById("m-img").src = user.image;
  document.getElementById("m-name").textContent = user.firstName + " " + user.lastName;
  document.getElementById("m-sub").textContent = user.company.title + " at " + user.company.name;

  document.getElementById("m-personal").innerHTML =
    row("Age", user.age) +
    row("Gender", user.gender) +
    row("Date of birth", user.birthDate) +
    row("Email", user.email) +
    row("Phone", user.phone);

  document.getElementById("m-address").innerHTML =
    row("Street", user.address.address) +
    row("City", user.address.city) +
    row("State", user.address.state) +
    row("Postal code", user.address.postalCode) +
    row("Country", user.address.country);

  document.getElementById("m-job").innerHTML =
    row("Job title", user.company.title) +
    row("Department", user.company.department);

  document.getElementById("m-company").innerHTML =
    row("Company name", user.company.name) +
    row("Street", user.company.address.address) +
    row("City", user.company.address.city) +
    row("State", user.company.address.state) +
    row("Country", user.company.address.country);

  modal.showModal();
}

// Close button aur popup ke bahar click par band karna
document.getElementById("close").addEventListener("click", function () {
  modal.close();
});
modal.addEventListener("click", function (event) {
  if (event.target === modal) modal.close();
});

// 4. Name se search (filter)
search.addEventListener("input", function () {
  const text = search.value.toLowerCase().trim();
  const filtered = users.filter(function (user) {
    return (user.firstName + " " + user.lastName).toLowerCase().includes(text);
  });
  showCards(filtered);
});

loadUsers();