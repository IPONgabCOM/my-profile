const DISCORD_ID = "826362723792977950"; 

async function updateLanyard() {
    try {
        const response = await fetch(`https://api.lanyard.rest/v1/users/${DISCORD_ID}`);
        const { data, success } = await response.json();

        if (success) {
            const user = data.discord_user;

            // Avatars
            const avatarBase = `https://cdn.discordapp.com/avatars/${DISCORD_ID}/${user.avatar}`;
            const avatarUrl = user.avatar.startsWith("a_") ? `${avatarBase}.gif` : `${avatarBase}.png`;
            document.getElementById('discord-avatar').src = avatarUrl;
            document.getElementById('card-avatar').src = avatarUrl;

            // Decoration Logic
            const decoEl = document.getElementById('discord-decoration');
            if (user.avatar_decoration_data) {
                decoEl.src = `https://cdn.discordapp.com/avatar-decorations/${user.avatar_decoration_data.asset}.png`;
                decoEl.style.display = "block";
            } else {
                decoEl.style.display = "none";
            }

            // Note Section Logic
            const customStatus = data.activities.find(a => a.type === 4);
            const noteSection = document.getElementById('note-section');
            const noteText = document.getElementById('discord-note');

            if (customStatus && customStatus.state) {
                noteText.innerText = customStatus.state;
                noteSection.style.display = "block";
            } else {
                noteSection.style.display = "none";
            }

            // Names & Presence
            const name = user.global_name || user.username;
            document.getElementById('display-name').innerText = name;
            document.getElementById('card-name').innerText = name;
            document.getElementById('card-username').innerText = `@${user.username}`;
            document.getElementById('discord-link').href = `https://discord.com/users/${DISCORD_ID}`;

            const status = data.discord_status;
            document.getElementById('status-dot').className = `status-dot ${status}`;
            document.getElementById('card-status-dot').className = `status-dot-small ${status}`;
        }
    } catch (e) { console.error("Lanyard Error:", e); }
}

async function handleViews() {
    try {
        const res = await fetch(`https://api.counterapi.dev/v1/monsy_final_${DISCORD_ID}/update/visits`);
        const data = await res.json();
        document.getElementById('view-count').innerText = data.value.toLocaleString();
    } catch (e) { console.log("Counter error"); }
}

function enterSite() {
    document.getElementById('overlay').classList.add('hidden');
    document.getElementById('bg-img').style.transform = "scale(1.1)";
    const music = document.getElementById('bg-music');
    music.volume = 0.2;
    music.play();
    
    updateLanyard();
    handleViews();
    setInterval(updateLanyard, 10000); // Refresh every 10 seconds
}