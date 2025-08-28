// Load schemes data
let schemesData = [];
fetch("schemes.json")
  .then(res => res.json())
  .then(data => {
    schemesData = data;
    renderSchemes(data);
  });

// State CM images mapping
const cmPhotos = {
  "West Bengal": "images/mamata.jpg",
  "Bihar": "images/nitish.jpg",
  "Odisha": "images/naveen.jpg",
  "Delhi": "images/kejriwal.jpg",
  "Maharashtra": "images/eknath.jpg"
};

// Elements
const stateSelect = document.getElementById("stateSelect");
const searchBox = document.getElementById("searchBox");
const languageSelect = document.getElementById("languageSelect");
const schemesList = document.getElementById("schemesList");
const cmPhoto = document.getElementById("cm-photo");

// Render schemes
function renderSchemes(schemes) {
  schemesList.innerHTML = "";
  if (schemes.length === 0) {
    schemesList.innerHTML = "<p>No schemes found.</p>";
    return;
  }
  schemes.forEach(scheme => {
    const div = document.createElement("div");
    div.className = "scheme-card";
    div.innerHTML = `
      <h3>${scheme.name}</h3>
      <p><strong>State:</strong> ${scheme.state}</p>
      <p>${scheme.description}</p>
      <a href="${scheme.link}" target="_blank">Apply Now</a>
    `;
    schemesList.appendChild(div);
  });
}

// Filter & search
function filterSchemes() {
  const state = stateSelect.value;
  const search = searchBox.value.toLowerCase();
  let filtered = schemesData;

  if (state !== "all") {
    filtered = filtered.filter(s => s.state === state);
    cmPhoto.src = cmPhotos[state] || "";
    cmPhoto.style.display = "inline-block";
  } else {
    cmPhoto.style.display = "none";
  }

  if (search) {
    filtered = filtered.filter(s => s.name.toLowerCase().includes(search));
  }

  renderSchemes(filtered);
}

stateSelect.addEventListener("change", filterSchemes);
searchBox.addEventListener("input", filterSchemes);// Load schemes data
let schemesData = [];
fetch("schemes.json")
  .then(res => res.json())
  .then(data => {
    schemesData = data;
    renderSchemes(data);
  });

// State CM images mapping
const cmPhotos = {
  "West Bengal": "images/mamata.jpg",
  "Bihar": "images/nitish.jpg",
  "Odisha": "images/naveen.jpg",
  "Delhi": "images/kejriwal.jpg",
  "Maharashtra": "images/eknath.jpg"
};

// Elements
const stateSelect = document.getElementById("stateSelect");
const searchBox = document.getElementById("searchBox");
const languageSelect = document.getElementById("languageSelect");
const schemesList = document.getElementById("schemesList");
const cmPhoto = document.getElementById("cm-photo");

// Render schemes
function renderSchemes(schemes) {
  schemesList.innerHTML = "";
  if (schemes.length === 0) {
    schemesList.innerHTML = "<p>No schemes found.</p>";
    return;
  }
  schemes.forEach(scheme => {
    const div = document.createElement("div");
    div.className = "scheme-card";
    div.innerHTML = `
      <h3>${scheme.name}</h3>
      <p><strong>State:</strong> ${scheme.state}</p>
      <p>${scheme.description}</p>
      <a href="${scheme.link}" target="_blank">Apply Now</a>
    `;
    schemesList.appendChild(div);
  });
}

// Filter & search
function filterSchemes() {
  const state = stateSelect.value;
  const search = searchBox.value.toLowerCase();
  let filtered = schemesData;

  if (state !== "all") {
    filtered = filtered.filter(s => s.state === state);
    cmPhoto.src = cmPhotos[state] || "";
    cmPhoto.style.display = "inline-block";
  } else {
    cmPhoto.style.display = "none";
  }

  if (search) {
    filtered = filtered.filter(s => s.name.toLowerCase().includes(search));
  }

  renderSchemes(filtered);
}

stateSelect.addEventListener("change", filterSchemes);
searchBox.addEventListener("input", filterSchemes);
