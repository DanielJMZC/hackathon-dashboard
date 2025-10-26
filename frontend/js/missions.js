document.addEventListener("DOMContentLoaded", async () => {
  const token = localStorage.getItem("token");
  if (!token) {
    alert("You must log in first!");
    window.location.href = "login.html";
    return;
  }

  let user;
  try {
    const res = await fetch("/api/users/me", {
      headers: { "Authorization": `Bearer ${token}` }
    });
    if (!res.ok) throw new Error("Failed to fetch user");
    user = await res.json();
  } catch (err) {
    console.error(err);
    alert("Cannot fetch user data, log in again");
    localStorage.removeItem("token");
    window.location.href = "login.html";
    return;
  }

  const userId = user._id || user.id;
  const missionForm = document.querySelector(".mission-form");
  const missionInput = document.getElementById("missionInput");
  const aiResponse = document.getElementById("aiResponse");
  const missionDescription = document.getElementById("missionDescription");
  const missionName = document.getElementById("missionName");
  const missionXP = document.getElementById("missionXP");
  const missionGold = document.getElementById("missionGold");
  const missionDifficulty = document.getElementById("missionDifficulty");
  const missionCategory = document.getElementById("missionCategory");
  const missionExp = document.getElementById("missionExp");
  const acceptBtn = document.getElementById("acceptBtn");
  const declineBtn = document.getElementById("declineBtn");
  const missionsContainer = document.getElementById("acceptedMissions");

  let currentMission = null;

  missionForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const userMessage = missionInput.value.trim() || "Generate a mission";

    aiResponse.querySelector("p").textContent = "Generating mission...";

    try {
      const res = await fetch("/api/AI/model", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ message: userMessage })
      });

      if (!res.ok) throw new Error("Failed to generate mission");
      const data = await res.json();
      if (!data.success) throw new Error(data.message);

      const mission = data.mission;
      currentMission = { mission, advice: data.advice };

      missionDescription.textContent = mission.description;
      missionName.textContent = mission.name;
      missionXP.textContent = mission.xp ?? mission.reward_xp;
      missionGold.textContent = mission.gold ?? mission.reward_gold;
      missionDifficulty.textContent = mission.difficulty;
      missionCategory.textContent = mission.category;
      missionExp.textContent = new Date(mission.expiration ?? mission.expiration_in).toLocaleString();

      aiResponse.querySelector("p").textContent = data.advice || "Mission generated!";
    } catch (err) {
      console.error(err);
      aiResponse.querySelector("p").textContent = "Error generating mission.";
    }
  });

  acceptBtn.addEventListener("click", async () => {
    if (!currentMission) {
      alert("No mission to accept! Generate one first.");
      return;
    }

    try {
      const res = await fetch("/api/AI/accept", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          aiResponse: {
            missions: [currentMission.mission],
            advice: currentMission.advice
          }
        })
      });

      if (!res.ok) throw new Error("Failed to accept mission");
      const data = await res.json();
      if (data.error) throw new Error(data.error);

      aiResponse.querySelector("p").textContent = "";
      missionDescription.textContent = "";
      missionName.textContent = "";
      missionXP.textContent = "";
      missionGold.textContent = "";
      missionDifficulty.textContent = "";
      missionCategory.textContent = "";
      missionExp.textContent = "";
      currentMission = null;

      await loadUserMissions();
    } catch (err) {
      console.error(err);
      alert("Error accepting mission.");
    }
  });

  declineBtn.addEventListener("click", () => {
    if (!currentMission) return;

    currentMission = null;
    aiResponse.querySelector("p").textContent = "";
    missionDescription.textContent = "";
    missionName.textContent = "";
    missionXP.textContent = "";
    missionGold.textContent = "";
    missionDifficulty.textContent = "";
    missionCategory.textContent = "";
    missionExp.textContent = "";
  });

  async function loadUserMissions() {
    try {
      const res = await fetch(`/api/missions/users/${userId}/missions`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (!res.ok) throw new Error("Failed to fetch missions");

      let missions = await res.json();
      missions = missions.filter(m => m.status === "on_going");

      missionsContainer.innerHTML = missions.map(mission => `
        <div class="mission-entry" data-id="${mission._id || mission.id}">
          <strong>Name:</strong> ${mission.name}<br>
          <strong>Description:</strong> ${mission.description}<br>
          <strong>XP:</strong> ${mission.reward_xp}<br>
          <strong>Gold:</strong> ${mission.reward_gold}<br>
          <strong>Difficulty:</strong> ${mission.difficulty}<br>
          <strong>Category:</strong> ${mission.category}<br>
          <strong>Expires:</strong> ${new Date(mission.expiration_in).toLocaleString()}<br>
          <button class="complete-btn">Complete</button>
          <button class="remove-btn">Remove</button>
        </div>
      `).join('');

      missionsContainer.querySelectorAll(".complete-btn").forEach(btn => {
        btn.addEventListener("click", async (e) => {
          const missionId = e.target.parentElement.dataset.id;
          try {
            await fetch("/api/missions/completeMission", {
              method: "PUT",
              headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
              body: JSON.stringify({ missionId })
            });
            await fetch("/api/badges/award", {
              method: "POST",
              headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
              body: JSON.stringify({ badgeId: "complete_mission", userId })
            });
            await loadUserMissions();
          } catch (err) {
            console.error(err);
          }
        });
      });

      missionsContainer.querySelectorAll(".remove-btn").forEach(btn => {
        btn.addEventListener("click", async (e) => {
          const missionId = e.target.parentElement.dataset.id;
          try {
            await fetch(`/api/missions/completeMission`, {
              method: "PUT",
              headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
              body: JSON.stringify({ missionId })
            });
            await loadUserMissions();
          } catch (err) {
            console.error(err);
          }
        });
      });

    } catch (err) {
      console.error("Error loading missions:", err);
      missionsContainer.innerHTML = "<p>Error loading missions.</p>";
    }
  }

  loadUserMissions();
});
