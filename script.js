const DISCORD_ID = "826362723792977950"; 

/**
 * Blocks Right-Click and Inspect Element shortcuts to protect the UI
 */
function disableInspect(e) {
    if (e.keyCode == 123 || (e.ctrlKey && e.shiftKey && (e.keyCode == 73 || e.keyCode == 74)) || (e.ctrlKey && e.keyCode == 85)) {
        return false;
    }
}

/**
 * Fetches Discord data via Lanyard API
 * Handles: Avatars, Decorations, Status, and Smoothed Notes
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
            document.querySelectorAll('#discord-avatar, #card-avatar').forEach(img => {
                img.src = avatarUrl;
            });

            // 2. Avatar Decoration Fix (Force Refresh with Timestamp)
            const decoEl = document.getElementById('discord-decoration');
            if (user.avatar_decoration_data) {
                const asset = user.avatar_decoration_data.asset;
                // Adding ?v= timestamp prevents the "broken image" icon cache issue
                decoEl.src = `https://cdn.discordapp.com/avatar-decorations/${asset}.png?v=${Date.now()}`;
                decoEl.style.display = "block";
            } else {
                decoEl.style.display = "none";
            }

            // 3. Smooth Notes / Custom Status
            const customStatus = data.activities.find(a => a.type === 4);
            const noteSection = document.getElementById('note-section');
            const noteText = document.getElementById('discord-note');

            if (customStatus && customStatus.state) {
                // Only update if text changed to keep it smooth
                if (noteText.innerText !== customStatus.state) {
                    noteText.innerText = customStatus.state;
                }
                noteSection.style.display = "block";
            } else {
                noteSection.style.display = "none";
            }

            // 4. Update Identity & Presence
            const name = user.global_name || user.username;
            document.getElementById('display-name').innerText = name;
            document.getElementById('card-name').innerText = name;
            document.getElementById('card-username').innerText = `@${user.username}`;

            const status = data.discord_status;
            document.getElementById('status-dot').className = `status-dot ${status}`;
            document.getElementById('card-status-dot').className = `status-dot-small ${status}`;
        }
    } catch (e) { 
        console.error("Lanyard update failed:", e); 
    }
}

/**
 * Handles the profile view counter
 */
async function handleViews() {
    try {
        const res = await fetch(`https://api.counterapi.dev/v1/dre_bio_${DISCORD_ID}/update/visits`);
        const data = await res.json();
        document.getElementById('view-count').innerText = data.value.toLocaleString();
    } catch (e) { 
        console.log("Counter service offline."); 
    }
}

/**
 * Main Entry Point: Triggered by clicking the overlay
 */
function enterSite() {
    // 1. Hide Overlay
    const overlay = document.getElementById('overlay');
    overlay.classList.add('hidden');
    
    // 2. Background Sound Activation
    const music = document.getElementById('bg-music');
    if (music) {
        music.volume = 0.25; // Set volume to 25%
        music.play().catch(err => {
            console.log("Autoplay prevented by browser. User interaction required.");
        });
    }
    
    // 3. Smooth Background Zoom
    const bgContainer = document.querySelector('.background-container');
    if (bgContainer) {
        bgContainer.style.transform = "scale(1.1)";
    }

    // 4. Initial Load
    updateLanyard();
    handleViews();

    // Refresh Discord data every 15 seconds (keeps it smooth without lag)
    setInterval(updateLanyard, 15000);
}
