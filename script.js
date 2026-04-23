// Your Discord ID for pulling data and view counting
const DISCORD_ID = "826362723792977950"; 

/**
 * Fetches real-time data from Discord via Lanyard
 * Updates: Avatar, Decoration, Status Dot, and Notes
 */
async function updateLanyard() {
    try {
        const response = await fetch(`https://api.lanyard.rest/v1/users/${DISCORD_ID}`);
        const { data, success } = await response.json();

        if (success) {
            const user = data.discord_user;

            // 1. Update Avatars
            const avatarBase = `https://cdn.discordapp.com/avatars/${DISCORD_ID}/${user.avatar}`;
            const avatarUrl = user.avatar.startsWith("a_") ? `${avatarBase}.gif` : `${avatarBase}.png`;
            document.getElementById('discord-avatar').src = avatarUrl;
            document.getElementById('card-avatar').src = avatarUrl;

            // 2. Update Avatar Decoration (Fix for broken images)
            const decoEl = document.getElementById('discord-decoration');
            if (user.avatar_decoration_data) {
                const asset = user.avatar_decoration_data.asset;
                decoEl.src = `https://cdn.discordapp.com/avatar-decorations/${asset}.png`;
                decoEl.style.display = "block";
            } else {
                decoEl.style.display = "none";
            }

            // 3. Update Custom Status (Notes)
            const customStatus = data.activities.find(a => a.type === 4);
            const noteSection = document.getElementById('note-section');
            const noteText = document.getElementById('discord-note');

            if (customStatus && customStatus.state) {
                noteText.innerText = customStatus.state;
                noteSection.style.display = "block";
            } else {
                noteSection.style.display = "none";
            }

            // 4. Update Names and Profile Link
            const name = user.global_name || user.username;
            document.getElementById('display-name').innerText = name;
            document.getElementById('card-name').innerText = name;
            document.getElementById('card-username').innerText = `@${user.username}`;
            document.getElementById('discord-link').href = `https://discord.com/users/${DISCORD_ID}`;

            // 5. Update Status Dots (Online, Idle, DND, Offline)
            const status = data.discord_status;
            document.getElementById('status-dot').className = `status-dot ${status}`;
            document.getElementById('card-status-dot').className = `status-dot-small ${status}`;
        }
    } catch (e) { 
        console.error("Lanyard Connection Error:", e); 
    }
}

/**
 * Updates and displays the profile visitor count
 */
async function handleViews() {
    try {
        const res = await fetch(`https://api.counterapi.dev/v1/dre_profile_${DISCORD_ID}/update/visits`);
        const data = await res.json();
        document.getElementById('view-count').innerText = data.value.toLocaleString();
    } catch (e) { 
        console.log("View counter service unavailable."); 
    }
}

/**
 * Handles the click-to-enter logic
 * Fades the overlay, zooms the background, and starts the music
 */
function enterSite() {
    // Hide the blur overlay
    const overlay = document.getElementById('overlay');
    overlay.classList.add('hidden');

    // Smoothly zoom the background image
    const bgImg = document.getElementById('bg-img');
    if (bgImg) {
        bgImg.style.transform = "scale(1.1)";
    }

    // Play background music with controlled volume
    const music = document.getElementById('bg-music');
    if (music) {
        music.volume = 0.25;
        music.play().catch(err => console.log("Audio play blocked by browser. Click again."));
    }
    
    // Initial data fetch
    updateLanyard();
    handleViews();

    // Set interval to keep Discord status updated every 10 seconds
    setInterval(updateLanyard, 10000);
}
