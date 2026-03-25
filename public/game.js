const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = 800;
canvas.height = 500;

const player = {
    x: 100, y: 250, width: 40, height: 40, color: '#00ffcc',
    speed: 5, hp: 100, attacking: false, dirX: 1, dirY: 0, lastShot: 0
};

const bot = {
    x: 600, y: 250, width: 40, height: 40, color: '#ff4444',
    speed: 2, hp: 50, attacking: false
};

const bullets = [];
let score = 0;
const keys = {};

// Track key presses
window.addEventListener('keydown', e => keys[e.code] = true);
window.addEventListener('keyup', e => keys[e.code] = false);

function update() {
    // Player Movement and Direction
    if (keys['ArrowUp'] && player.y > 0) { player.y -= player.speed; player.dirX = 0; player.dirY = -1; }
    if (keys['ArrowDown'] && player.y < canvas.height - player.height) { player.y += player.speed; player.dirX = 0; player.dirY = 1; }
    if (keys['ArrowLeft'] && player.x > 0) { player.x -= player.speed; player.dirX = -1; player.dirY = 0; }
    if (keys['ArrowRight'] && player.x < canvas.width - player.width) { player.x += player.speed; player.dirX = 1; player.dirY = 0; }

    // Basic Bot AI (Chase the player)
    if (bot.x < player.x) bot.x += bot.speed;
    else if (bot.x > player.x) bot.x -= bot.speed;

    if (bot.y < player.y) bot.y += bot.speed;
    else if (bot.y > player.y) bot.y -= bot.speed;

    // Shooting Logic (Space to Shoot)
    if (keys['Space']) {
        const now = Date.now();
        if (now - player.lastShot > 300) { // 300ms cooldown
            bullets.push({
                x: player.x + player.width / 2,
                y: player.y + player.height / 2,
                vx: player.dirX * 10,
                vy: player.dirY * 10,
                radius: 5,
                color: 'yellow'
            });
            player.lastShot = now;
        }
    }

    // Update Bullets
    for (let i = bullets.length - 1; i >= 0; i--) {
        const b = bullets[i];
        b.x += b.vx;
        b.y += b.vy;

        // Check collision with bot
        if (b.x > bot.x && b.x < bot.x + bot.width && b.y > bot.y && b.y < bot.y + bot.height) {
            bot.hp -= 10;
            bullets.splice(i, 1);
            continue;
        }

        // Remove if off-screen
        if (b.x < 0 || b.x > canvas.width || b.y < 0 || b.y > canvas.height) {
            bullets.splice(i, 1);
        }
    }

    // Simple Collision / Combat Logic (Z for Melee Attack)
    player.attacking = keys['KeyZ'];

    let dx = player.x - bot.x;
    let dy = player.y - bot.y;
    let distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < 40) { // If touching
        if (player.attacking) {
            bot.hp -= 1;
            bot.x += (dx < 0 ? 20 : -20); // Knockback
        } else {
            player.hp -= 0.5; // Bot deals damage on contact
        }
    }

    // Update UI elements
    document.getElementById('hp').innerText = Math.floor(player.hp);
    document.getElementById('bothp').innerText = Math.max(0, Math.floor(bot.hp));
    document.getElementById('bullets').innerText = bullets.length;
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw Bullets
    for (let b of bullets) {
        ctx.fillStyle = b.color;
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
        ctx.fill();
    }

    // Draw Player
    ctx.fillStyle = player.attacking ? 'white' : player.color;
    ctx.fillRect(player.x, player.y, player.width, player.height);

    // Draw Bot
    if (bot.hp > 0) {
        ctx.fillStyle = bot.color;
        ctx.fillRect(bot.x, bot.y, bot.width, bot.height);
    }

    if (player.hp <= 0) {
        ctx.fillStyle = "white";
        ctx.font = "40px Arial";
        ctx.fillText("GAME OVER", 280, 250);
        return;
    }

    if (bot.hp <= 0) {
        ctx.fillStyle = "white";
        ctx.font = "40px Arial";
        ctx.fillText("YOU WIN!", 300, 250);
        return;
    }

    requestAnimationFrame(() => {
        update();
        draw();
    });
}

draw();
