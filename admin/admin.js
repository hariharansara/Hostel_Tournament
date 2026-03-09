const table = document.getElementById("tableBody");
const gameSearch = document.getElementById("gameSearch");
let registrations = [];

function getImageSrc(image) {
  if (!image) return "";
  const cleaned = image.replace(/\\/g, "/");
  if (cleaned.startsWith("http://") || cleaned.startsWith("https://")) return cleaned;
  if (cleaned.startsWith("/uploads/")) return cleaned;
  if (cleaned.startsWith("uploads/")) return "/" + cleaned;
  const fileName = cleaned.split("/").pop();
  return fileName ? "/uploads/" + encodeURIComponent(fileName) : "";
}

function buildRow(d) {
  const imageSrc = getImageSrc(d.image);
  const displayName =
    Array.isArray(d.playerNames) && d.playerNames.length > 0
      ? d.playerNames.join(", ")
      : d.name || "-";
  const imageHtml = imageSrc
    ? `<img src="${imageSrc}" alt="Registration image" onerror="this.style.display='none'; this.nextElementSibling.style.display='inline';">
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
