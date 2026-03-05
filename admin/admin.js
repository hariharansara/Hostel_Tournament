fetch("/api/admin/registrations")
  .then((res) => res.json())
  .then((data) => {
    const table = document.getElementById("tableBody");

    data.forEach((d) => {
      table.innerHTML += `
      <tr>
        <td>${d.name}</td>
        <td>${d.phone}</td>
        <td>${d.email}</td>
        <td>${d.game}</td>
        <td>${d.upiId || "-"}</td>
        <td>
          <img src="/uploads/${d.image}" width="80">
        </td>
      </tr>`;
    });
  });
