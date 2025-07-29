document.addEventListener("DOMContentLoaded", () => {
  // 🔐 Login form handler
  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    loginForm.addEventListener("submit", async function (e) {
      e.preventDefault();
      const formData = new FormData(this);
      const data = Object.fromEntries(formData.entries());

      try {
        const res = await fetch("/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data)
        });

        const result = await res.json();
        console.log("Login response:", result);

        const msg = document.getElementById("loginMsg");
        if (result.success) {
          msg.innerText = "✅ " + result.message;

          setTimeout(() => {
            window.location.href = result.isAdmin
              ? "/create-account.html"
              : "/dashboard.html";
          }, 800);
        } else {
          msg.innerText = "❌ " + result.message;
        }
      } catch (err) {
        console.error(err);
        document.getElementById("loginMsg").innerText = "⚠️ Server not responding.";
      }
    });
  }

  // 🔑 Redemption form handler
  const redeemForm = document.getElementById("redeemForm");
  if (redeemForm) {
    redeemForm.addEventListener("submit", async function (e) {
      e.preventDefault();

      const productKey = document.getElementById("productKey").value;
      const authKey = document.getElementById("authKey").value;
      const responseMsg = document.getElementById("responseMsg");
      const webhookURL = "YOUR_DISCORD_WEBHOOK_URL"; // 🔧 Replace with your actual webhook

      if (!productKey || !authKey) {
        responseMsg.innerText = "⚠️ Please fill out all fields.";
        return;
      }

      const payload = {
        embeds: [{
          title: "🔑 New Key Redemption",
          color: 3447003,
          fields: [
            { name: "Product Key", value: productKey, inline: false },
            { name: "Authentication Key", value: authKey, inline: false }
          ],
          footer: { text: "Rip.CapTcha Security System" },
          timestamp: new Date()
        }]
      };

      try {
        const response = await fetch(webhookURL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });

        responseMsg.innerText = response.ok
          ? "✅ Submitted successfully!"
          : "❌ Error submitting data.";
      } catch (error) {
        console.error(error);
        responseMsg.innerText = "⚠️ Network error.";
      }
    });
  }
});
