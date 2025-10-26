document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("token");
  if (!token) {
    alert("You must log in!");
    window.location.href = "login.html";
    return;
  }

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


      // Update right panel
      missionDescription.textContent = mission.description;
      missionName.textContent = mission.name;
      missionXP.textContent = mission.xp;
      missionGold.textContent = mission.gold;
      missionDifficulty.textContent = mission.difficulty;
      missionCategory.textContent = mission.category;
      missionExp.textContent = new Date(mission.expiration).toLocaleString();

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

    alert(`Mission accepted: ${data.mission.name}`);

  } catch (err) {
    console.error(err);
    alert("Error accepting mission.");
  }
});


});

