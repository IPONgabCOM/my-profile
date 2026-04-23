* { margin: 0; padding: 0; box-sizing: border-box; cursor: crosshair; -webkit-user-select: none; -moz-user-select: none; -ms-user-select: none; user-select: none; }
body { height: 100vh; overflow: hidden; font-family: 'Courier New', monospace; background: #000; color: #fff; }

.background-container { position: fixed; top: 0; left: 0; width: 100%; height: 100%; z-index: -1; transition: transform 3s cubic-bezier(0.1, 0, 0.3, 1); }
.background-container img { width: 100%; height: 100%; object-fit: cover; filter: grayscale(100%) brightness(20%); }

#overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.98); backdrop-filter: blur(30px); display: flex; justify-content: center; align-items: center; z-index: 100; transition: opacity 1.5s ease; }
#overlay.hidden { opacity: 0; pointer-events: none; }
.click-text { font-size: 14px; letter-spacing: 12px; animation: breathe 3s infinite; text-transform: uppercase; }

.main-content { display: flex; justify-content: center; align-items: center; height: 100vh; }

.profile-wrapper { position: relative; transition: transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1); }
/* Slight Zoom on Profile when hovering */
.profile-wrapper:hover { transform: scale(1.03); }

.discord-card {
    position: absolute; bottom: 105%; left: 50%; transform: translateX(-50%) translateY(15px) scale(0.9);
    width: 280px; background: #070707; border-radius: 12px; padding: 18px; opacity: 0; visibility: hidden;
    transition: all 0.4s cubic-bezier(0.18, 0.89, 0.32, 1.28); box-shadow: 0 15px 50px rgba(0,0,0,0.9); z-index: 10;
}
.profile-wrapper:hover .discord-card { opacity: 1; visibility: visible; transform: translateX(-50%) translateY(0) scale(1); }

.avatar-container { position: relative; width: 140px; height: 140px; margin: 0 auto 15px; display: flex; justify-content: center; align-items: center; }
.avatar { width: 100px; height: 100px; border-radius: 50%; z-index: 1; position: relative; }
/* Refined Decoration Positioning */
.avatar-decoration { position: absolute; width: 140px; height: 140px; z-index: 2; pointer-events: none; top: 0; left: 0; object-fit: contain; }
.status-dot { width: 24px; height: 24px; border-radius: 50%; position: absolute; bottom: 20px; right: 20px; border: 4px solid #000; z-index: 3; }

.profile-card { background: rgba(255, 255, 255, 0.01); backdrop-filter: blur(10px); border: 1px solid rgba(255, 255, 255, 0.05); padding: 50px; border-radius: 25px; width: 380px; text-align: center; box-shadow: 0 0 30px rgba(0,0,0,0.5); }

.online { background: #43b581; box-shadow: 0 0 15px #43b581; }
.dnd { background: #f04747; box-shadow: 0 0 15px #f04747; }
.idle { background: #faa61a; box-shadow: 0 0 15px #faa61a; }
.offline { background: #747f8d; }

.now-playing { background: rgba(255,255,255,0.03); padding: 12px 20px; border-radius: 40px; font-size: 11px; margin: 25px 0; border: 1px solid rgba(255,255,255,0.05); }
.socials a { color: #fff; font-size: 24px; opacity: 0.3; transition: 0.4s; margin: 0 12px; text-decoration: none; display: inline-block; }
.socials a:hover { opacity: 1; transform: translateY(-5px); text-shadow: 0 0 10px #fff; }
.view-pill { font-size: 10px; color: #444; margin-top: 30px; letter-spacing: 2px; }

@keyframes breathe { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
