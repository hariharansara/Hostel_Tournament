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
        <img src="assets/images/outdoor3.jpeg" />
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
  const type = getParam("type");
  const outdoorPaymentLink =
    "https://forms.easebuzz.in/register/RAJALAKSHMIbw5w4/Hostel_Sports_Day";
  const groupLinkByGame = {
    Cricket: "https://chat.whatsapp.com/DEnWsEcxIf06rdkNPdXdaG?mode=gi_t",
    Football: "https://chat.whatsapp.com/H6dKogyWrIkEA6RmX3oCnE?mode=gi_t",
    Badminton: "https://chat.whatsapp.com/KafRuv2Im5EEJwjaVNio6f?mode=hqctswa",
    Kabaddi: "https://chat.whatsapp.com/LBXdZqCEJQnLxbtj89SDWy?mode=gi_t",
    "Kho-Kho": "https://chat.whatsapp.com/DPgbHUIODRxIy8Wwz8Gfrx?mode=gi_t",
    Volleyball: "https://chat.whatsapp.com/BCslGun7RvJ5ouzuxaY32b?mode=gi_t",
    Basketball: "https://chat.whatsapp.com/FteFTHDzKosLI9Zwg9t5nT?mode=gi_t",
    Carrom: "https://chat.whatsapp.com/DFmEto3ezz47aifYdalzhC?mode=gi_t",
    Chess: "https://chat.whatsapp.com/Jd8GKlBraCMHUKK0uEIRe4?mode=hqctswa",
    PUBG: "https://chat.whatsapp.com/JSLN3awqQLbGQizWF4mIQ8?mode=gi_t",
    "Free Fire": "https://chat.whatsapp.com/BsQ2V0sMEs45EZPGv1oCId?mode=gi_t",
    "E-Football": "https://chat.whatsapp.com/B7rtIkJo5xc822CDD9IP6d?mode=gi_t",
  };

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
  const teamSizeByGame = {
    Cricket: 9,
    Football: 5,
    "Kho-Kho": 9,
    Basketball: 6,
    Volleyball: 6,
    Kabaddi: 7,
    PUBG: 4,
    "Free Fire": 4,
  };
  const nameInput = document.getElementById("name");
  const buildPlayerNameInputs = (count) => {
    let inputs = "";

    for (let i = 1; i <= count; i++) {
      inputs += `
        <input type="text" name="playerNames" placeholder="Player ${i} Name" required>
      `;
    }

    return `
      <div class="team-members-wrap">
        <span class="team-size-label">Player Names</span>
        <div class="team-members-grid">
          ${inputs}
        </div>
      </div>
    `;
  };

  if (imageInput && outdoorGames.includes(game)) {
    imageInput.insertAdjacentHTML(
      "beforebegin",
      `
      <div class="top-links">
        <a href="${outdoorPaymentLink}" class="link-card" target="_blank" rel="noopener noreferrer">
          Pay Registration Fee
        </a>
      </div>
    `,
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
      const playerNameFields = teamSizeByGame[game]
        ? buildPlayerNameInputs(teamSizeByGame[game])
        : "";

      dynamicFields.innerHTML = `
        <input type="text" id="teamName" name="teamName" placeholder="Team Name" required>
        <input type="text" id="captainName" name="captainName" placeholder="Team Captain Name" required>
        ${playerNameFields}
      `;
    }
  }

  if (nameInput && teamSizeByGame[game]) {
    nameInput.required = false;
    nameInput.disabled = true;
    nameInput.style.display = "none";

    nameInput.insertAdjacentHTML(
      "beforebegin",
      `
      <div class="team-size-note">
        <span class="team-size-label">Team Size</span>
        <strong>${game}: ${teamSizeByGame[game]} Players</strong>
      </div>
    `,
    );
  }

  // Handle form submission
  const form = document.getElementById("registrationForm");
  if (form) {
    form.addEventListener("submit", async function (e) {
      e.preventDefault();

      const formData = new FormData(form);
      formData.append("game", game);
      formData.append("type", type);
      if (teamSizeByGame[game]) {
        const playerNames = formData
          .getAll("playerNames")
          .map((value) => String(value).trim())
          .filter(Boolean);

        if (playerNames.length > 0) {
          formData.set("name", playerNames.join(", "));
        }
      }

      try {
        const response = await fetch("/api/register", {
          method: "POST",
          body: formData,
        });

        const result = await response.json();

        if (response.ok) {
          if (groupLinkByGame[game]) {
            const successOverlay = document.createElement("div");
            successOverlay.className = "success-overlay";
            successOverlay.innerHTML = `
              <div class="success-card">
                <h3>Congratulations!</h3>
                <p>Registration successful for ${game}.</p>
                <a href="${groupLinkByGame[game]}" target="_blank" rel="noopener noreferrer" class="success-link">
                  Join ${game} WhatsApp Group
                </a>
                <button type="button" class="success-home-btn">Go to Home</button>
              </div>
            `;

            document.body.appendChild(successOverlay);

            successOverlay
              .querySelector(".success-home-btn")
              .addEventListener("click", () => {
                window.location.href = "index.html";
              });

            return;
          }

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
