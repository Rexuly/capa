// Add your Discord bot token and server details
const DISCORD_BOT_TOKEN = "YOUR_DISCORD_BOT_TOKEN";
const SERVER_ID = "YOUR_SERVER_ID";  // Replace with your actual server ID
const REQUIRED_ROLE_ID = "1393017932610666577";  // The specific role you want to check

document.getElementById("loginForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    // Assume a function to authenticate user and get their Discord ID
    const discordId = await authenticateUser(username, password);

    // Check if user has the required Discord role
    const hasRole = await checkUserRole(discordId);

    if (hasRole) {
        loginStatus.textContent = "Logged in successfully!";
        document.getElementById("loginSection").classList.add("hidden");
        document.getElementById("infoSection").classList.remove("hidden");
        document.getElementById("redeemKeySection").classList.remove("hidden");
    } else {
        loginStatus.textContent = "You do not have the required role to log in.";
    }
});

// Function to check if user has the required role
async function checkUserRole(discordId) {
    const response = await fetch(`https://discord.com/api/guilds/${SERVER_ID}/members/${discordId}`, {
        method: 'GET',
        headers: {
            "Authorization": `Bot ${DISCORD_BOT_TOKEN}`
        }
    });

    if (response.ok) {
        const member = await response.json();
        return member.roles.includes(REQUIRED_ROLE_ID);
    }

    return false; // Default return if check fails
}
