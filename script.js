// --- Music Player System ---
const music = document.getElementById("bgMusic");
const button = document.getElementById("musicButton");

if (music && button) {
    music.volume = 1;

    button.addEventListener("click", async () => {
        if (music.paused) {
            music.volume = 0;
            await music.play();

            let fadeIn = setInterval(() => {
                if (music.volume < 0.95) {
                    music.volume += 0.05;
                } else {
                    music.volume = 1;
                    clearInterval(fadeIn);
                }
            }, 50);

            button.textContent = "❚❚ Pause: i just wanted to be yours - bunii";
        } else {
            let fadeOut = setInterval(() => {
                if (music.volume > 0.07) {
                    music.volume -= 0.07;
                } else {
                    clearInterval(fadeOut);
                    music.pause();
                    music.volume = 1;
                }
            }, 37);

            button.textContent = "▶ Play: i just wanted to be yours - bunii";
        }
    });
}

// --- Discord Status Integration ---
const USER_ID = "1272350993677549689";

async function updateDiscordStatus() {
    try {
        const response = await fetch(`https://api.lanyard.rest/v1/users/${USER_ID}`);
        const json = await response.json();

        if (!json.success) {
            throw new Error("Lanyard API internal failure");
        }

        const data = json.data;
        const status = data.discord_status; 

        const statusText = document.getElementById("discordStatus");
        const dot = document.getElementById("statusDot");
        const customEmojiEl = document.getElementById("customEmoji");
        const customTextEl = document.getElementById("customText");

        if (dot) {
            if (status === "online") dot.style.background = "#23a55a"; 
            else if (status === "idle") dot.style.background = "#f0b232"; 
            else if (status === "dnd") dot.style.background = "#f23f43"; 
            else dot.style.background = "#80848e";
        }

        if (statusText) {
            if (status === "dnd") statusText.textContent = "Do Not Disturb";
            else statusText.textContent = status.charAt(0).toUpperCase() + status.slice(1);
        }

        const customStatus = data.activities.find(activity => activity.type === 4);

        if (customStatus) {
            if (customTextEl) {
                customTextEl.textContent = customStatus.state || (status === "offline" ? "Offline" : status.toUpperCase());
            }

            if (customEmojiEl) {
                if (customStatus.emoji) {
                    if (customStatus.emoji.id) {
                        const ext = customStatus.emoji.animated ? "gif" : "png";
                        customEmojiEl.innerHTML = `<img src="https://cdn.discordapp.com/emojis/${customStatus.emoji.id}.${ext}" style="width: 20px; height: 20px; vertical-align: middle;" alt="" />`;
                    } else {
                        customEmojiEl.textContent = customStatus.emoji.name;
                    }
                } else {
                    customEmojiEl.textContent = "";
                }
            }
        } else {
            if (customEmojiEl) customEmojiEl.textContent = "";
            if (customTextEl) {
                if (status === "offline") customTextEl.textContent = "Offline";
                else if (status === "dnd") customTextEl.textContent = "Do Not Disturb";
                else customTextEl.textContent = status.charAt(0).toUpperCase() + status.slice(1);
            }
        }

    } catch (e) {
        const fallbackText = document.getElementById("customText");
        const fallbackDot = document.getElementById("statusDot");
        if (fallbackText) fallbackText.textContent = "Offline";
        if (fallbackDot) fallbackDot.style.background = "#80848e";
    }
}

updateDiscordStatus();
setInterval(updateDiscordStatus, 15000);

// --- Dynamic Falling Snow Effect ---
function createSnowflake() {
    const snowContainer = document.getElementById("snow");
    if (!snowContainer) return;

    const snowflake = document.createElement("div");
    snowflake.classList.add("snowflake");
    
    snowflake.textContent = "•"; 
    snowflake.style.left = Math.random() * 100 + "vw";
    snowflake.style.fontSize = Math.random() * 14 + 10 + "px"; 
    
    const duration = Math.random() * 3 + 4; 
    snowflake.style.animationDuration = duration + "s";
    snowflake.style.opacity = Math.random() * 0.7 + 0.3;

    snowContainer.appendChild(snowflake);

    setTimeout(() => {
        snowflake.remove();
    }, duration * 1000);
}

setInterval(createSnowflake, 100);


// --- Visitor Counter Logic (CounterAPI) ---
async function updateVisitCount() {
    const countEl = document.getElementById('visitCount');
    if (!countEl) return;

    // A unique namespace name for your link page
    const namespace = "emptyletters_biolink"; 
    const key = "visits";

    try {
        // Fetching from a live, active counter API service
        const response = await fetch(`https://api.counterapi.dev/v1/${namespace}/${key}/up`);
        const data = await response.json();
        
        if (data && data.count) {
            countEl.textContent = data.count.toLocaleString();
        } else {
            countEl.textContent = "1";
        }
    } catch (error) {
        console.error("Counter error:", error);
        countEl.textContent = "1";
    }
}

// Fire the counter tracking on page load
updateVisitCount();