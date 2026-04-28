// ===========================
// JUEGO: ECO PEZ vs BASURA
// Lago Coatetelco - Concientización
// ===========================

(function(){
  // --- Elementos DOM ---
  const canvas = document.getElementById("gameCanvas");
  const ctx = canvas.getContext("2d");
  const uiDiv = document.getElementById("ui");
  const levelUpDiv = document.getElementById("levelup");
  const startBtn = document.getElementById("startButton");
  
  let gameActive = false;
  let animationId = null;
  let spawnIntervalId = null;
  
  // --- Variables del juego ---
  let player = {};
  let enemies = [];        // Basura (botellas, latas, bolsas)
  let bullets = [];        // Burbujas de limpieza
  let particles = [];
  let decorativeWalls = []; // fondos decorativos: plantas acuáticas / rocas
  let score = 0;
  let keysPressed = { w: false, s: false, a: false, d: false };
  
  let spawnDelay = 1200;
  let lastDifficultyScore = 0;
  
  // Funciones auxiliares de dibujo
  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  window.addEventListener("resize", () => {
    resizeCanvas();
    if(gameActive && player){
      player.x = Math.min(Math.max(player.x, 20), canvas.width-20);
      player.y = Math.min(Math.max(player.y, 20), canvas.height-20);
    }
  });
  
  // ========== DIBUJAR FONDO LAGO COATETELCO ==========
  function drawLakeBackground() {
    // Gradiente agua profunda
    const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
    grad.addColorStop(0, "#0a4c5c");
    grad.addColorStop(0.6, "#043b46");
    grad.addColorStop(1, "#02212b");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // reflejos de luz en el agua
    for(let i = 0; i < 120; i++) {
      ctx.fillStyle = `rgba(180, 240, 255, ${Math.random() * 0.2})`;
      ctx.beginPath();
      ctx.arc((i*131)%canvas.width, (i*57)%canvas.height, Math.random()*2+1, 0, Math.PI*2);
      ctx.fill();
    }
    
    // plantas acuáticas decorativas
    ctx.fillStyle = "#2b7550";
    for(let i = 0; i < 30; i++) {
      let x = (i * 173) % canvas.width;
      let y = canvas.height - 40 - (i % 70);
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x-8, y+25);
      ctx.lineTo(x+8, y+25);
      ctx.fill();
      ctx.fillStyle = "#3f9a6b";
      ctx.beginPath();
      ctx.arc(x, y-4, 5, 0, Math.PI*2);
      ctx.fill();
      ctx.fillStyle = "#2b7550";
    }
    
    // burbujas ambiente
    for(let i = 0; i < 40; i++) {
      ctx.beginPath();
      ctx.arc( (i*97)%canvas.width, (Date.now()*0.002 + i*81) % canvas.height, 2+Math.sin(i)*1, 0, Math.PI*2);
      ctx.fillStyle = "rgba(120,220,240,0.3)";
      ctx.fill();
    }
  }
  
  // ========== DIBUJAR PEZ (estilo animado) ==========
  function drawFish(x, y, angle, size = 18) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);
    ctx.shadowBlur = 0;
    // cuerpo
    ctx.fillStyle = "#FFA559";
    ctx.beginPath();
    ctx.ellipse(0, 0, size, size*0.7, 0, 0, Math.PI*2);
    ctx.fill();
    ctx.fillStyle = "#FF8C42";
    ctx.beginPath();
    ctx.ellipse(-3, -3, 4, 3, 0, 0, Math.PI*2);
    ctx.fill();
    // ojo
    ctx.fillStyle = "white";
    ctx.beginPath();
    ctx.arc(size*0.4, -size*0.2, size*0.2, 0, Math.PI*2);
    ctx.fill();
    ctx.fillStyle = "#010101";
    ctx.beginPath();
    ctx.arc(size*0.45, -size*0.25, size*0.08, 0, Math.PI*2);
    ctx.fill();
    // aleta
    ctx.fillStyle = "#E07C2C";
    ctx.beginPath();
    ctx.moveTo(-size*0.7, 0);
    ctx.lineTo(-size*1.2, -size*0.5);
    ctx.lineTo(-size*1.2, size*0.5);
    ctx.fill();
    // escamas
    ctx.fillStyle = "#FFB347";
    for(let i=-1; i<=1; i++) {
      ctx.beginPath();
      ctx.ellipse(i*5, 2, 3, 2, 0, 0, Math.PI*2);
      ctx.fill();
    }
    ctx.restore();
  }
  
  // ========== DIBUJAR BASURA (diferentes tipos) ==========
  function drawTrash(x, y, type) {
    ctx.save();
    ctx.translate(x, y);
    ctx.shadowBlur = 2;
    ctx.shadowColor = "black";
    if(type === 0) { // botella plastico
      ctx.fillStyle = "#7eb09e";
      ctx.fillRect(-6, -10, 12, 18);
      ctx.fillStyle = "#4a856b";
      ctx.beginPath();
      ctx.rect(-4, -13, 8, 5);
      ctx.fill();
    } else if(type === 1) { // lata
      ctx.fillStyle = "#b0a07c";
      ctx.fillRect(-7, -8, 14, 14);
      ctx.fillStyle = "#8b6946";
      ctx.fillRect(-5, -10, 10, 4);
    } else { // bolsa plastica
      ctx.fillStyle = "#b1c2b3aa";
      ctx.beginPath();
      ctx.ellipse(0, 0, 10, 12, 0, 0, Math.PI*2);
      ctx.fill();
      ctx.fillStyle = "#728572";
      for(let i=0;i<3;i++) ctx.fillRect(-4+i*3, -3, 2, 8);
    }
    ctx.fillStyle = "#d9c48b";
    ctx.font = "bold 14px monospace";
    ctx.shadowBlur = 0;
    ctx.restore();
  }
  
  // ========== BURBUJA DE LIMPIEZA ==========
  function drawBubble(x,y, size=4) {
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI*2);
    ctx.fillStyle = "#9ef0ffcc";
    ctx.fill();
    ctx.beginPath();
    ctx.arc(x-1, y-1, size*0.25, 0, Math.PI*2);
    ctx.fillStyle = "white";
    ctx.fill();
  }
  
  // Colisión con elementos decorativos (troncos)
  function isCollidingWithDecor(x, y, rad) {
    for(let dec of decorativeWalls){
      let dx = x - dec.x;
      let dy = y - dec.y;
      let dist = Math.hypot(dx, dy);
      if(dist < rad + dec.r) return true;
    }
    return false;
  }
  
  // Generar basura nueva
  function spawnTrash() {
    if(!gameActive) return;
    let side = Math.floor(Math.random() * 4);
    let x, y;
    if(side === 0){ x = Math.random() * canvas.width; y = -20; }
    else if(side === 2){ x = Math.random() * canvas.width; y = canvas.height + 20; }
    else if(side === 1){ x = canvas.width + 20; y = Math.random() * canvas.height; }
    else { x = -20; y = Math.random() * canvas.height; }
    
    enemies.push({
      x: x, y: y, size: 14,
      speed: 1.1 + Math.random() * 0.6,
      hp: 25 + (Math.floor(Math.random() * 15)),
      trashType: Math.floor(Math.random() * 3)
    });
  }
  
  // Disparar burbuja (limpieza)
  function shootBubble(targetX, targetY) {
    if(!gameActive) return;
    let now = Date.now();
    if(now - player.lastShot < player.fireRate) return;
    player.lastShot = now;
    
    let angle = Math.atan2(targetY - player.y, targetX - player.x);
    let shotsArray = player.multiShot ? [-0.25, 0, 0.25] : [0];
    shotsArray.forEach(offset => {
      let angleOff = angle + offset;
      bullets.push({
        x: player.x, y: player.y,
        dx: Math.cos(angleOff) * 8.5,
        dy: Math.sin(angleOff) * 8.5,
        size: player.bigShot ? 9 : 5,
        damage: player.bigShot ? 28 : 14
      });
    });
  }
  
  // Mostrar mejora (level up)
  function showLevelUp() {
    if(!gameActive) return;
    player.level++;
    player.xp = 0;
    levelUpDiv.style.display = "block";
    levelUpDiv.innerHTML = "<h3>🌿 MEJORA DEL LAGO 🌿</h3>";
    const upgrades = [
      { name: "🐟 Burbuja doble", fn: () => { player.multiShot = true; } },
      { name: "💧 Burbuja poderosa", fn: () => { player.bigShot = true; } },
      { name: "⚡ Disparo rápido", fn: () => { player.fireRate = Math.max(120, player.fireRate - 45); } },
      { name: "🛡️ Escudo natural", fn: () => { player.shield += 40; } },
      { name: "❤️ Regeneración", fn: () => { player.regen = 0.07; } }
    ];
    upgrades.forEach(up => {
      let btn = document.createElement("button");
      btn.innerText = up.name;
      btn.onclick = () => {
        up.fn();
        levelUpDiv.style.display = "none";
      };
      levelUpDiv.appendChild(btn);
    });
  }
  
  // Actualizar subida de dificultad
  function updateDifficulty() {
    if(score > 0 && score % 12 === 0 && score !== lastDifficultyScore){
      lastDifficultyScore = score;
      spawnDelay = Math.max(420, spawnDelay - 40);
      if(spawnIntervalId) clearInterval(spawnIntervalId);
      spawnIntervalId = setInterval(spawnTrash, spawnDelay);
    }
  }
  
  // Lógica principal del juego
  function updateGame() {
    if(!gameActive) return;
    
    // Movimiento fluido pez
    let moveX = 0, moveY = 0;
    if(keysPressed.w) moveY = -player.speed;
    if(keysPressed.s) moveY = player.speed;
    if(keysPressed.a) moveX = -player.speed;
    if(keysPressed.d) moveX = player.speed;
    
    let newX = player.x + moveX;
    let newY = player.y + moveY;
    newX = Math.min(Math.max(newX, 18), canvas.width - 18);
    newY = Math.min(Math.max(newY, 18), canvas.height - 18);
    if(!isCollidingWithDecor(newX, newY, player.size)){
      player.x = newX;
      player.y = newY;
    }
    
    // actualizar burbujas
    for(let i=bullets.length-1; i>=0; i--){
      let b = bullets[i];
      b.x += b.dx;
      b.y += b.dy;
      if(b.x < -50 || b.x > canvas.width+50 || b.y < -50 || b.y > canvas.height+50){
        bullets.splice(i,1);
        continue;
      }
      let hit = false;
      for(let j=enemies.length-1; j>=0; j--){
        let e = enemies[j];
        let dx = b.x - e.x, dy = b.y - e.y;
        let dist = Math.hypot(dx, dy);
        if(dist < e.size){
          e.hp -= b.damage;
          bullets.splice(i,1);
          hit = true;
          if(e.hp <= 0){
            // basura eliminada
            enemies.splice(j,1);
            score++;
            player.xp += 18;
            for(let p=0;p<6;p++) particles.push({ x: e.x, y: e.y, life: 12 });
          }
          break;
        }
      }
      if(hit) continue;
    }
    
    // Movimiento de basura hacia el pez
    for(let e of enemies){
      let angle = Math.atan2(player.y - e.y, player.x - e.x);
      e.x += Math.cos(angle) * e.speed;
      e.y += Math.sin(angle) * e.speed;
      // evitar bordes decorativos? no importa tanto
    }
    
    // Daño por contaminación
    for(let i=0; i<enemies.length; i++){
      let e = enemies[i];
      let distToPlayer = Math.hypot(player.x - e.x, player.y - e.y);
      if(distToPlayer < player.size + e.size){
        if(player.shield > 0){
          player.shield -= 2;
        } else {
          player.hp -= 0.45;
        }
        // pequeño retroceso a la basura
        let angleAway = Math.atan2(e.y - player.y, e.x - player.x);
        e.x += Math.cos(angleAway) * 4;
        e.y += Math.sin(angleAway) * 4;
      }
    }
    
    // regeneración
    if(player.regen > 0 && player.hp < player.maxHp) player.hp = Math.min(player.maxHp, player.hp + player.regen);
    // actualizar partículas
    for(let i=0;i<particles.length;i++) {
      particles[i].life--;
    }
    particles = particles.filter(p => p.life > 0);
    
    // subir nivel
    if(player.xp >= 100 && gameActive) showLevelUp();
    // Dificultad
    updateDifficulty();
    
    // game over
    if(player.hp <= 0){
      gameActive = false;
      if(spawnIntervalId) clearInterval(spawnIntervalId);
      if(animationId) cancelAnimationFrame(animationId);
      alert("🌱 GAME OVER 🌱\nEl lago necesita más cuidadores. ¡Vuelve a intentarlo!\nPuntuación: " + score);
      location.reload();
    }
  }
  
  // Dibujar todo
  function draw() {
    if(!gameActive && !canvas) return;
    drawLakeBackground();
    
    // rocas decorativas / troncos
    for(let dec of decorativeWalls){
      ctx.fillStyle = "#5c4e3b";
      ctx.beginPath();
      ctx.ellipse(dec.x, dec.y, dec.r, dec.r*0.8, 0, 0, Math.PI*2);
      ctx.fill();
      ctx.fillStyle = "#3a2e22";
      ctx.beginPath();
      ctx.ellipse(dec.x-3, dec.y-2, 3, 4, 0, 0, Math.PI*2);
      ctx.fill();
    }
    
    // Basura
    for(let e of enemies){
      drawTrash(e.x, e.y, e.trashType);
      // barra de vida de basura grande
      ctx.fillStyle = "#dd4444aa";
      ctx.fillRect(e.x-12, e.y-14, (e.hp/35)*24, 4);
    }
    
    // Burbujas de limpieza
    for(let b of bullets){
      drawBubble(b.x, b.y, b.size-1);
    }
    
    // Ángulo del pez hacia el mouse
    if(gameActive && window.lastMouseX){
      let angleTo = Math.atan2(window.lastMouseY - player.y, window.lastMouseX - player.x);
      drawFish(player.x, player.y, angleTo, 16);
    } else if(gameActive) {
      drawFish(player.x, player.y, 0, 16);
    }
    
    // partículas
    for(let p of particles){
      ctx.fillStyle = `rgba(250, 200, 100, ${p.life/10})`;
      ctx.beginPath();
      ctx.arc(p.x, p.y, 3, 0, Math.PI*2);
      ctx.fill();
    }
    
    // UI texto
    uiDiv.innerHTML = `❤️ SALUD: ${Math.floor(player.hp)}  |  🛡️ ESCUDO: ${Math.floor(player.shield)}  |  🧠 NIVEL: ${player.level}  |  🗑️ BASURA ELIMINADA: ${score}  |  ✨ XP: ${player.xp}/100`;
  }
  
  // Loop principal
  function gameLoop() {
    if(!gameActive) return;
    updateGame();
    draw();
    animationId = requestAnimationFrame(gameLoop);
  }
  
  // Inicializar partida
  function initGame() {
    gameActive = true;
    resizeCanvas();
    enemies = [];
    bullets = [];
    particles = [];
    score = 0;
    lastDifficultyScore = 0;
    spawnDelay = 1150;
    
    player = {
      x: canvas.width/2, y: canvas.height/2,
      size: 16, speed: 4,
      hp: 110, maxHp: 110,
      xp: 0, level: 1,
      fireRate: 350, lastShot: 0,
      multiShot: false,
      bigShot: false,
      regen: 0,
      shield: 20
    };
    
    // elementos decorativos del lago (rocas/troncos donde el pez no puede pasar)
    decorativeWalls = [];
    for(let i=0;i<12;i++){
      decorativeWalls.push({
        x: 80 + Math.random() * (canvas.width-160),
        y: 60 + Math.random() * (canvas.height-120),
        r: 18 + Math.random() * 15
      });
    }
    
    if(spawnIntervalId) clearInterval(spawnIntervalId);
    spawnIntervalId = setInterval(spawnTrash, spawnDelay);
    
    // registro teclas y mouse
    window.addEventListener("keydown", (e) => {
      let k = e.key.toLowerCase();
      if(k === 'w' || k === 's' || k === 'a' || k === 'd') keysPressed[k] = true;
    });
    window.addEventListener("keyup", (e) => {
      let k = e.key.toLowerCase();
      if(k === 'w' || k === 's' || k === 'a' || k === 'd') keysPressed[k] = false;
    });
    
    canvas.addEventListener("mousemove", (e) => {
      window.lastMouseX = e.clientX;
      window.lastMouseY = e.clientY;
    });
    canvas.addEventListener("click", (e) => {
      if(gameActive) shootBubble(e.clientX, e.clientY);
    });
    
    gameLoop();
  }
  
  // Evento start desde menú
  startBtn.onclick = () => {
    document.getElementById("menu").style.display = "none";
    initGame();
  };
  
  resizeCanvas();
})();