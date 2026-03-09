const table = document.getElementById("tableBody");
const gameSearch = document.getElementById("gameSearch");
let registrations = [];

function getImageCandidates(image) {
  if (!image) return [];
  const cleaned = image.replace(/\\/g, "/");
  if (cleaned.startsWith("http://") || cleaned.startsWith("https://")) return [cleaned];

  const fileName = cleaned.split("/").pop();
  if (!fileName) return [];

  const encodedFileName = encodeURIComponent(fileName);
  const candidates = [];

  if (cleaned.startsWith("/uploads/")) {
    candidates.push(cleaned);
  }

  if (cleaned.startsWith("uploads/")) {
    candidates.push("/" + cleaned);
  }

  if (cleaned.startsWith("server/uploads/")) {
    candidates.push("/" + cleaned);
  }

  candidates.push("/uploads/" + encodedFileName);
  candidates.push("/server/uploads/" + encodedFileName);

  return [...new Set(candidates)];
}

window.handlePreviewImageError = function (imgEl) {
  const fallbackList = (imgEl.dataset.fallback || "")
    .split("|")
    .map((item) => item.trim())
    .filter(Boolean);

  if (fallbackList.length > 0) {
    const [nextSrc, ...remaining] = fallbackList;
    imgEl.dataset.fallback = remaining.join("|");
    imgEl.src = nextSrc;
    return;
  }

  imgEl.style.display = "none";
  const fallback = imgEl.nextElementSibling;
  if (fallback) fallback.style.display = "inline";
};

function ensureImageModal() {
  let modal = document.getElementById("imagePreviewModal");
  if (modal) return modal;

  modal = document.createElement("div");
  modal.id = "imagePreviewModal";
  modal.className = "image-modal";
  modal.innerHTML = `
    <div class="image-modal-content">
      <button type="button" class="image-modal-close" aria-label="Close image preview">&times;</button>
      <img src="" alt="Registration preview" id="imagePreviewLarge" />
    </div>
  `;

  document.body.appendChild(modal);

  modal.addEventListener("click", (e) => {
    if (e.target === modal || e.target.classList.contains("image-modal-close")) {
      modal.classList.remove("open");
    }
  });

  return modal;
}

function openImageModal(src) {
  const modal = ensureImageModal();
  const img = modal.querySelector("#imagePreviewLarge");
  img.src = src;
  modal.classList.add("open");
}

function buildRow(d) {
  const imageCandidates = getImageCandidates(d.image);
  const [primaryImage, ...fallbackImages] = imageCandidates;
  const displayName =
    Array.isArray(d.playerNames) && d.playerNames.length > 0
      ? d.playerNames.join(", ")
      : d.name || "-";
  const imageHtml = primaryImage
    ? `<img src="${primaryImage}" alt="Registration image" class="preview-image" data-fallback="${fallbackImages.join("|")}" onerror="window.handlePreviewImageError(this)">
       <span class="img-fallback" style="display:none;">No image</span>`
    : `<span class="img-fallback">No image</span>`;

  return `
    <tr data-id="${d._id}">
      <td data-label="Name">${displayName}</td>
      <td data-label="Team Name">${d.teamName || "-"}</td>
      <td data-label="Captain Name">${d.captainName || "-"}</td>
      <td data-label="Phone">${d.phone || "-"}</td>
      <td data-label="Email">${d.email || "-"}</td>
      <td data-label="Game">${d.game || "-"}</td>
      <td data-label="Transaction ID">${d.transactionId || d.upiId || "-"}</td>
      <td data-label="Image">${imageHtml}</td>
      <td data-label="Action"><button class="remove-btn" data-id="${d._id}">Remove</button></td>
    </tr>
  `;
}

function getFilteredRegistrations() {
  const query = (gameSearch?.value || "").trim().toLowerCase();
  if (!query) return registrations;

  return registrations.filter((entry) =>
    String(entry.game || "")
      .toLowerCase()
      .includes(query)
  );
}

function renderTable() {
  const rows = getFilteredRegistrations();
  table.innerHTML = "";

  if (rows.length === 0) {
    table.innerHTML = `
      <tr class="no-results-row">
        <td colspan="9">No registrations match this game.</td>
      </tr>
    `;
    return;
  }

  rows.forEach((d) => {
    table.innerHTML += buildRow(d);
  });
}

function loadRegistrations() {
  fetch("/api/admin/registrations")
    .then((res) => res.json())
    .then((data) => {
      registrations = Array.isArray(data) ? data : [];
      renderTable();
    });
}

table.addEventListener("click", async (e) => {
  const clickedImage = e.target.closest(".preview-image");
  if (clickedImage) {
    openImageModal(clickedImage.currentSrc || clickedImage.src);
    return;
  }

  const btn = e.target.closest(".remove-btn");
  if (!btn) return;

  const id = btn.dataset.id;
  if (!id) return;

  const ok = window.confirm("Remove this registration?");
  if (!ok) return;

  try {
    const res = await fetch(`/api/admin/registrations/${id}`, { method: "DELETE" });
    const result = await res.json();

    if (!res.ok) {
      alert(result.error || "Failed to remove registration");
      return;
    }

    registrations = registrations.filter((item) => item._id !== id);
    renderTable();
  } catch (err) {
    alert("Error: " + err.message);
  }
});

if (gameSearch) {
  gameSearch.addEventListener("input", renderTable);
}

loadRegistrations();
