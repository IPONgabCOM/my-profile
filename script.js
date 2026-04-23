const DISCORD_ID = "826362723792977950"; 

async function updateLanyard() {
    try {
        const response = await fetch(`https://api.lanyard.rest/v1/users/${DISCORD_ID}`);
        const { data, success } = await response.json();

        if (success) {
            const user = data.discord_user;

            // Avatar Logic
            const avatarBase = `https://cdn.discordapp.com/avatars/${DISCORD_ID}/${user.avatar}`;
            const avatarUrl = user.avatar.startsWith("a_") ? `${avatarBase}.gif` : `${avatarBase}.png`;
            document.querySelectorAll('#discord-avatar, #card-avatar').forEach(img => img.src = avatarUrl);

            // ULTIMATE DECORATION FIX
            const decoEl = document.getElementById('discord-decoration');
            if (user.avatar_decoration_data) {
                const asset = user.avatar_decoration_data.asset;
                // Added a timestamp to force refresh the image asset
                decoEl.src = `https://cdn.discordapp.com/avatar-decorations/${asset}.png?v=${Date.now()}`;
                decoEl.style.display = "block";
            } else {
                decoEl.style.display = "none";
            }

            // Names & Presence
            const name = user.global_name || user.username;
            document.getElementById('display-name').innerText = name;
            document.getElementById('card-name').innerText = name;
            
            const status = data.discord_status;
            document.getElementById('status-dot').className = `status-dot ${status}`;
        }
    } catch (e) { console.error("Update failed"); }
}

function enterSite() {
    const overlay = document.getElementById('overlay');
    overlay.classList.add('hidden');
    
    // Smooth zoom on entry
    document.querySelector('.background-container').style.transform = "scale(1.1)";
    
    const music = document.getElementById('bg-music');
    music.volume = 0.2;
    music.play();
    
    updateLanyard();
    // 15 seconds interval is better for "no lag" performance
    setInterval(updateLanyard, 15000);
}
