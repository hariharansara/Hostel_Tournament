const table = document.getElementById("tableBody");

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
  const imageHtml = imageSrc
    ? `<img src="${imageSrc}" alt="Registration image" onerror="this.style.display='none'; this.nextElementSibling.style.display='inline';">
       <span class="img-fallback" style="display:none;">No image</span>`
    : `<span class="img-fallback">No image</span>`;

  return `
    <tr data-id="${d._id}">
      <td>${d.name || "-"}</td>
      <td>${d.phone || "-"}</td>
      <td>${d.email || "-"}</td>
      <td>${d.game || "-"}</td>
      <td>${d.upiId || "-"}</td>
      <td>${imageHtml}</td>
      <td><button class="remove-btn" data-id="${d._id}">Remove</button></td>
    </tr>
  `;
}

function loadRegistrations() {
  fetch("/api/admin/registrations")
    .then((res) => res.json())
    .then((data) => {
      table.innerHTML = "";
      data.forEach((d) => {
        table.innerHTML += buildRow(d);
      });
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

    const row = btn.closest("tr");
    if (row) row.remove();
  } catch (err) {
    alert("Error: " + err.message);
  }
});

loadRegistrations();
