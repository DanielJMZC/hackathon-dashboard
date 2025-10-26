document.addEventListener("DOMContentLoaded", async  () => {
    const token = localStorage.getItem("token");
    if (!token) {
        alert("You must log in first!");
        window.location.href = "login.html";
        return; 
    }

    const inputReason = document.getElementById("inputReasonTrans");
    const inputAmount = document.getElementById("inputBoxTrans");
    const transContainer = document.getElementById("transContainer");
    const saldoTotal = document.getElementById("saldoTotal");
    const addBtn = document.getElementById("addTransactionBTN");

   let user;
        try {
            const res = await fetch("/api/users/me", {
                headers: { "Authorization": `Bearer ${token}` }
            });
            if (!res.ok) throw new Error("Failed to fetch user");
            user = await res.json(); // This should contain the user, including balance
        } catch (err) {
            console.error(err);
            alert("Cannot fetch user data, log in again");
            localStorage.removeItem("token");
            window.location.href = "login.html";
            return;
        }

    let saldo = user.balance || 0;
    saldoTotal.textContent = `Saldo: $${saldo.toFixed(2)}`;

    async function addTransac() {
        const reason = inputReason.value.trim();
        const amount = parseFloat(inputAmount.value.trim());
        if (isNaN(amount)) {
            alert("Enter a valid number");
            return;
        }

        try {
            const res = await fetch("/api/transaction/users/me/money", {
                method: "POST",
                headers: { 
                    "Content-Type": "application/json", 
                    "Authorization": `Bearer ${token}` 
                },
                body: JSON.stringify({ amount, reason })
            });

            if (!res.ok) {
                const error = await res.json();
                alert(error.message || "Failed to add transaction");
                return;
            }

            const data = await res.json(); // optional if backend returns something

        } catch (err) {
            console.error("Backend error:", err);
            alert("Server error occurred");
            return;
        }

        // Update UI
        const card = document.createElement("li");
        card.classList.add("transCard");
        card.dataset.amount = amount;
        card.innerHTML = `
            <div class="trans-content">
                <p class="trans-reason">${reason || "Sin descripción"}</p>
                <p class="trans-amount" style="color: ${amount >= 0 ? 'green' : 'red'}">
                    ${amount >= 0 ? "+" : ""}$${amount.toFixed(2)}
                </p>
            </div>
        `;
        transContainer.appendChild(card);

        saldo += amount;
        saldoTotal.textContent = `Saldo actual: $${saldo.toFixed(2)}`;

        inputReason.value = "";
        inputAmount.value = "";
    }

    if (addBtn) addBtn.addEventListener("click", addTransac);
});