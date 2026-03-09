/* ================= NAVIGATION ================= */

function goToCategory(type) {
  window.location.href = "category.html?type=" + type;
}

function goToGames(category) {
  window.location.href = "games.html?category=" + category;
}

function goToRegister(game, type) {
  window.location.href = "register.html?game=" + game + "&type=" + type;
}

function getParam(param) {
  return new URLSearchParams(window.location.search).get(param);
}

/* ================= CATEGORY PAGE ================= */

if (window.location.pathname.includes("category.html")) {
  const type = getParam("type");
  const title = document.getElementById("title");
  const options = document.getElementById("options");

  if (type === "online") {
    title.innerText = "Online Games";

    options.innerHTML = `
      <div class="big-card" onclick="goToRegister('PUBG','online')">
        <img src="assets/images/pubg.jpg" />
        <span>PUBG</span>
      </div>

      <div class="big-card" onclick="goToRegister('Free Fire','online')">
        <img src="assets/images/freefire.jpg" />
        <span>Free Fire</span>
      </div>

      <div class="big-card" onclick="goToRegister('E-Football','online')">
        <img src="assets/images/efootball.jpg" />
        <span>E-Football</span>
      </div>
    `;
  }

  if (type === "offline") {
    title.innerText = "Offline Games";

    options.innerHTML = `
      <div class="big-card" onclick="goToGames('indoor')">
        <img src="assets/images/indoor.jpg" />
        <span>Indoor Games</span>
      </div>

      <div class="big-card" onclick="goToGames('outdoor')">
        <img src="assets/images/outdoor2.png" />
        <span>Outdoor Games</span>
      </div>
    `;
  }
}

/* ================= GAMES PAGE ================= */

if (window.location.pathname.includes("games.html")) {
  const category = getParam("category");
  const list = document.getElementById("gameList");

  const gameImages = {
    Carrom: "assets/images/carrom.jpg",
    Chess: "assets/images/chess.jpg",
    Cricket: "assets/images/cricket.png",
    Football: "assets/images/football.jpg",
    Badminton: "assets/images/badminton.jpg",
    Kabaddi: "assets/images/kabaddi.jpg",
    "Kho-Kho": "assets/images/kho-kho.jpg",
    Volleyball: "assets/images/volleyball.jpg",
    Basketball: "assets/images/basketball.jpg",
  };

  let games = [];

  if (category === "indoor") {
    games = ["Carrom", "Chess"];
  }

  if (category === "outdoor") {
    games = [
      "Cricket",
      "Football",
      "Badminton",
      "Kabaddi",
      "Kho-Kho",
      "Volleyball",
      "Basketball",
    ];
  }

  list.innerHTML = "";

  games.forEach((game) => {
    list.innerHTML += `
      <div class="big-card" onclick="goToRegister('${game}','offline')">
        <img src="${gameImages[game]}" />
        <span>${game}</span>
      </div>
    `;
  });
}

/* ================= REGISTER PAGE ================= */

if (window.location.pathname.includes("register.html")) {
  const game = getParam("game");
  const outdoorPaymentLink =
    "https://forms.easebuzz.in/register/RAJALAKSHMIbw5w4/Hostel_Sports_Day";

  const title = document.getElementById("gameTitle");
  const dynamicFields = document.getElementById("dynamicFields");
  const imageInput = document.getElementById("image");
  const outdoorGames = [
    "Cricket",
    "Football",
    "Badminton",
    "Kabaddi",
    "Kho-Kho",
    "Volleyball",
    "Basketball",
  ];

  if (imageInput && outdoorGames.includes(game)) {
    imageInput.insertAdjacentHTML(
      "beforebegin",
      `
      <div class="top-links">
        <a href="${outdoorPaymentLink}" class="link-card" target="_blank" rel="noopener noreferrer">
          Pay Registration Fee
        </a>
      </div>
    `
    );
  }

  if (dynamicFields) {
    if (title) {
      title.innerText = "Register for " + game;
    }

    const groupGames = [
      "Carrom",
      "Cricket",
      "Football",
      "Kabaddi",
      "Kho-Kho",
      "Volleyball",
      "Basketball",
      "PUBG",
      "Free Fire",
      "E-Football",
    ];

    if (game === "Badminton") {
      dynamicFields.innerHTML = `
        <select id="division" name="division" required>
          <option value="">Select Division</option>
          <option value="Singles">Singles</option>
          <option value="Doubles">Doubles</option>
        </select>
      `;

      document
        .getElementById("division")
        .addEventListener("change", function () {
          const selected = this.value;
          dynamicFields.innerHTML = this.outerHTML;

          if (selected === "Singles") {
            // No extra dynamic fields needed for singles.
          }

          if (selected === "Doubles") {
            dynamicFields.innerHTML += `
            <input type="text" id="teamName" name="teamName" placeholder="Team Name" required>
            <input type="text" id="captainName" name="captainName" placeholder="Team Captain Name" required>
          `;
          }
        });
    } else if (groupGames.includes(game)) {
      dynamicFields.innerHTML = `
        <input type="text" id="teamName" name="teamName" placeholder="Team Name" required>
        <input type="text" id="captainName" name="captainName" placeholder="Team Captain Name" required>
      `;
    }
  }

  // Handle form submission
  const form = document.getElementById("registrationForm");
  if (form) {
    form.addEventListener("submit", async function (e) {
      e.preventDefault();

      const formData = new FormData(form);
      formData.append("game", game);
      formData.append("type", type);

      try {
        const response = await fetch("/api/register", {
          method: "POST",
          body: formData,
        });

        const result = await response.json();

        if (response.ok) {
          alert("Registration Successful!");
          window.location.href = "index.html";
        } else {
          alert("Error: " + (result.error || "Registration failed"));
        }
      } catch (err) {
        alert("Error: " + err.message);
      }
    });
  }
}
