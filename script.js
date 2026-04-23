const DISCORD_ID = "826362723792977950";

const el = (id) => document.getElementById(id);

// Cache DOM (faster)
const DOM = {
    avatar: el('discord-avatar'),
    cardAvatar: el('card-avatar'),
    favicon: el('dynamic-favicon'),
    decoration: el('discord-decoration'),
    noteSection: el('note-section'),
    noteText: el('discord-note'),
    displayName: el('display-name'),
    cardName: el('card-name'),
    username: el('card-username'),
    statusDot: el('status-dot'),
    statusSmall: el('card-status-dot-small'),
    discordLink: el('discord-link'),
    views: el('view-count'),
    music: el('bg-music'),
    overlay: el('overlay')
};

let lastStatus = "";
let lastNote = "";
let retryDelay = 5000;

// 🔒 Anti-inspect (cleaner)
document.addEventListener("keydown", (e) => {
    if (
        e.key === "F12" ||
        (e.ctrlKey && e.shiftKey && ["I", "J"].includes(e.key)) ||
        (e.ctrlKey && e.key === "U")
    ) {
        e.preventDefault();
    }
});

// 🎧 Smooth music fade-in
function playMusic() {
    const audio = DOM.music;
    audio.volume = 0;
    audio.play().catch(() => {});

    let vol = 0;
    const fade = setInterval(() => {
        vol += 0.02;
        if (vol >= 0.2) {
            audio.volume = 0.2;
            clearInterval(fade);
        } else {
            audio.volume = vol;
        }
    }, 100);
}

// 🌐 Lanyard fetch
async function updateLanyard() {
    try {
        const res = await fetch(`https://api.lanyard.rest/v1/users/${DISCORD_ID}`);
        const json = await res.json();

        if (!json.success) throw new Error("API failed");

        const data = json.data;
        const user = data.discord_user;

        // 🖼 Avatar
        const base = `https://cdn.discordapp.com/avatars/${DISCORD_ID}/${user.avatar}`;
        const avatar = user.avatar.startsWith("a_") ? `${base}.gif` : `${base}.png`;

        if (DOM.avatar.src !== avatar) {
            DOM.avatar.src = avatar;
            DOM.cardAvatar.src = avatar;
            DOM.favicon.href = avatar;
        }

        // ✨ Decoration
        if (user.avatar_decoration_data) {
            const asset = user.avatar_decoration_data.asset;
            const decoURL = `https://cdn.discordapp.com/avatar-decorations/${asset}.png?v=${Date.now()}`;

            if (DOM.decoration.src !== decoURL) {
                DOM.decoration.src = decoURL;
            }

            DOM.decoration.style.display = "block";
        } else {
            DOM.decoration.style.display = "none";
        }

        // 📝 Custom status
        const custom = data.activities.find(a => a.type === 4);

        if (custom && custom.state) {
            if (lastNote !== custom.state) {
                DOM.noteText.innerText = custom.state;
                lastNote = custom.state;
            }
            DOM.noteSection.style.display = "block";
        } else {
            DOM.noteSection.style.display = "none";
        }

        // 👤 Name
        const name = user.global_name || user.username;
        DOM.displayName.innerText = name;
        DOM.cardName.innerText = name;
        DOM.username.innerText = `@${user.username}`;
        DOM.discordLink.href = `https://discord.com/users/${DISCORD_ID}`;

        // 🟢 Status
        if (lastStatus !== data.discord_status) {
            lastStatus = data.discord_status;
            DOM.statusDot.className = `status-dot ${lastStatus}`;
            DOM.statusSmall.className = `status-dot-small ${lastStatus}`;
        }

        retryDelay = 5000; // reset retry

    } catch (err) {
        console.log("Lanyard retrying...");
        setTimeout(updateLanyard, retryDelay);
        retryDelay = Math.min(retryDelay * 2, 30000); // exponential backoff
    }
}

// 👁️ Views
async function handleViews() {
    try {
        const res = await fetch(`https://api.counterapi.dev/v1/dre_${DISCORD_ID}/visits`);
        const data = await res.json();

        DOM.views.innerText = Number(data.value || 0).toLocaleString();
    } catch {
        DOM.views.innerText = "—";
    }
}

// 🚪 Enter site
function enterSite() {
    DOM.overlay.classList.add("hidden");
    document.querySelector('.background-container').style.transform = "scale(1.1)";

    playMusic();
    updateLanyard();
    handleViews();

    setInterval(updateLanyard, 15000); // less spam, smoother
}
