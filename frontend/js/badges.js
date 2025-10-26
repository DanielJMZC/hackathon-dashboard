document.addEventListener("DOMContentLoaded", async () => {
  const token = localStorage.getItem("token");
  if (!token) {
    alert("Debes iniciar sesión primero!");
    window.location.href = "login.html";
    return;
  }

  const achievementsGrid = document.querySelector(".achievements-grid");

  let user;
  try {
    const res = await fetch("/api/users/me", {
      headers: { "Authorization": `Bearer ${token}` }
    });
    if (!res.ok) throw new Error("No se pudo obtener el usuario");
    user = await res.json();
  } catch (err) {
    console.error(err);
    alert("Error al obtener datos del usuario, inicia sesión de nuevo");
    localStorage.removeItem("token");
    window.location.href = "login.html";
    return;
  }

  let allBadges, userBadges;
  try {
    const [allRes, userRes] = await Promise.all([
      fetch("/api/badges/all", { headers: { "Authorization": `Bearer ${token}` } }),
      fetch(`/api/badges/user/${user.id}`, { headers: { "Authorization": `Bearer ${token}` } })
    ]);

    if (!allRes.ok || !userRes.ok) throw new Error("Error al cargar badges");

    allBadges = await allRes.json();
    userBadges = await userRes.json();

  } catch (err) {
    console.error(err);
    alert("Error al cargar logros");
    return;
  }

  const unlockedIds = userBadges.map(b => b.badgeId);

achievementsGrid.innerHTML = allBadges.map(badge => {
  const unlocked = unlockedIds.includes(badge.id) ? "unlocked" : "locked";
  return `
      <div class="achievement ${unlocked}">
        <img src="./Assets/${badge.icon_url}" alt="${badge.title}" class="achievement-icon" />
        <h2 class="achievement-title">${badge.name}</h2>
        <p class="achievement-desc">${badge.description}</p>
      </div>
    `;
  }).join('');
});