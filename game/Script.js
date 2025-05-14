let tileSize = 32 // cit de mare este harta, 32x32
let gold = 1000; // incepem cu 500 de aur
let wave = 0;  // incepem cu level-ul 0, adica 1.
let lives = 200 // cit HP avem in total in joc 
let waveButton; // buttonul pentru a incepe wave-ul P.S la final tot este funtia
let pauseButton; // buttonul pentru pauza
let isPaused = false; // pauza initiala este falsa 
let noEnemies = 0; // aratam ca noEnemies inseamna 0
let enemiesSpawned = 0; // verifica citi inamici au fost spawnati
let enemiesInWave = 30; // 
let selectedTower = 'A'
let selectedTowerSprite = null; // selectarea turnului pentru upgrade
let ftowerImg;
let atowerImg;
let spawnIntervalId; 
let towerShootIntervalId; 
let frostShootIntervalId; 
let waveDuration = 30; // duratia pe runda
let wavesCompleted = 0; // tracam numarul de valuri complete

function preload() {
  bg = loadImage('bg.png')
  ftowerImg = loadImage('tower 2.png')
  atowerImg = loadImage('tower 1.png')
  btowerImg = loadImage('tower 3.png')
  rocketImg = loadImage('Rocket 1.png')
  soldier1Img = loadImage('Soldier1.png')
  soldier2Img = loadImage('Soldier2.png')
  soldier3Img = loadImage('Soldier3.png')
}
function setup() {
  createCanvas(windowWidth, windowHeight);
  background(255);
  allSprites.tileSize = tileSize;

  tower = new Group() // grupa pentru turnuri de tipul A
  tower.collider = 's'
  tower.type = 'A'
  tower.color = 'red'
  tower.img = atowerImg
  tower.level = 1
  tower.maxLevel = 3
  tower.damage = 0.2
  tower.upgradeCost = 50
  tower.fireRate = 1
  
  frostTower = new tower.Group()
  frostTower.color = 'blue'
  frostTower.img = ftowerImg
  frostTower.type = 'F'
  frostTower.level = 1
  frostTower.maxLevel = 3
  frostTower.damage = 0.1
  frostTower.upgradeCost = 50
  frostTower.fireRate = 0.5

  blastTower = new tower.Group()
  blastTower.color = 'purple'
  blastTower.img = btowerImg
  blastTower.type = 'B'
  blastTower.level = 1
  blastTower.maxLevel = 3
  blastTower.damage = 0.7
  blastTower.upgradeCost = 75
  blastTower.fireRate = 2.5




  let buttonContainer = createElement('div');
  buttonContainer.class('game-button-container');
  
  waveButton = createButton('▶ Start Wave');
  waveButton.parent(buttonContainer);
  waveButton.mousePressed(startWave);
  waveButton.class('game-button');

  pauseButton = createButton('⏸️ Pause');
  pauseButton.parent(buttonContainer);
  pauseButton.mousePressed(togglePause);
  pauseButton.class('game-button');


  placeable = new Group()
  placeable.tile = '1';
  placeable.w = 1;
  placeable.h = 1;
  placeable.color = 'green'
  placeable.collider = 'n'
  placeable.visible = false

  start = new Group()
  start.tile = 's'
  start.visible = false;

  end  = new Group()
  end.tile = 'f'
  end.visible = false;

  node = new Group()
  node.w = 1;
  node.h = 1;
  node.collider = 'n'

  enemies = new Group()
  enemies.w = 1;
  enemies.h = 1;
  enemies.counter = 0;
  enemies.collider = 'k'
  enemies.health = 1;
  enemies.moveSpeed = 0.05;
  enemies.scale = 0.3; // cit de mare este inamicul

  projectile = new Group()
  projectile.radius = 0.2
  projectile.collider = 'n'
  projectile.life = 100

  tileMap = new Tiles( // tiles
    [
      "111111.s1111111111",
      "111111..1111111111",
      "111111..1111111111",
      "111111..1111111111",
      "111111..1111111111",
      "111111..1111111111",
      "111111..1111111111",
      "111111.......11111",
      "111111.......11111",
      "11111111111..11111",
      "11111111111..11111",
      "1............11111",
      "1............11111",
      "1..111111111111111",
      "1..111111111111111",
      "1..111111111111111",
      "1..111111111111111",
      "1.......1111111111",
      "1........111111111",
      "11111....111111111",
      "1111111..111111111",
      "1111111.f111111111",
    ], 1, 1, 1, 1)
  var matrix = [ // harta
    //0,0
    [1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1],
    [1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1]

  ];

  let grid = new PF.Grid(matrix)
  let finder = new PF.AStarFinder()

  a = start[0].x -1
  b = start[0].y -1
  c = end[0].x -1;
  d = end[0].y -1

  path = finder.findPath(a, b, c, d, grid);

  for(p of path){
    let n = new node.Sprite(p[0] + 1, p[1] + 1)
    n.visible = false;
  }

  cursor = new Sprite(1,1)
  cursor.collider = 'n'



  // interval de spaunare
  spawnIntervalId = setInterval(spawn,1000)
  towerShootIntervalId = setInterval(towerShoot,500)
  frostShootIntervalId = setInterval(frostShoot,2000)
  blastShootIntervalId = setInterval(blastShoot,1900)

}
function spawn(){
  if(wave >= 1 && lives > 0 && !isPaused && enemiesSpawned < enemiesInWave) // Only spawn if we haven't reached the wave limit
  {
    let e = new enemies.Sprite(8,1,1)
    
    // viata maxima dupa wave-uri algorithm
    let maxHealth = min(3, ceil(wave/2));
    
    // cit mai multe waveuri se fac soldatii mai puternici
    let healthRoll = random(100);
    let enemyHealth = 1; // cel mai slab soldat
    
    if (wave <= 3) {
      // la inceput de waverui
      if (healthRoll > 80) enemyHealth = 2;
      if (healthRoll > 95) enemyHealth = 3;
    } else if (wave <= 6) {
      // mijlocul de wavuri algorithm de calculare a HP
      if (healthRoll > 60) enemyHealth = 2;
      if (healthRoll > 85) enemyHealth = 3;
    } else {
      // mai tirziu HP se calculeaza mai mult cu procentaj mai mare
      if (healthRoll > 40) enemyHealth = 2;
      if (healthRoll > 70) enemyHealth = 3;
    }
    
    // scriem ca HP maxim =  3
    enemyHealth = min(enemyHealth, maxHealth);
    e.health = enemyHealth;
    
    // viteza dupa wave
    e.moveSpeed = 0.03 + (wave * 0.003);
    if (enemyHealth === 1) e.moveSpeed += 0.01; // Weakest soldiers are faster
    if (enemyHealth === 3) e.moveSpeed -= 0.01; // Strongest soldiers are slower
    
    // o limita la viteza inamicilor
    e.moveSpeed = min(e.moveSpeed, 0.08);
    
    // wave = 5 inseamna ca facem boss wave
    if (wave % 5 === 0) {
      
      e.health += 1;
      e.scale = 0.4; 
    } else {
      e.scale = 0.3;
    }
    
    noEnemies++;
    enemiesSpawned++;
    
    // If we've finished spawning all enemies for this wave, show a message
    if (enemiesSpawned >= enemiesInWave) {
      console.log("All enemies for wave " + wave + " have been spawned!");
    }
  }
}
function chooseTower(){
  if(kb.presses('a')){
    selectedTower  = 'A'
  }
  else if(kb.presses('f')){
    selectedTower = 'F'
  }
  else if(kb.presses('b')){
    selectedTower = 'B'
  }
}
function draw() {
  clear()
  
  cursor.visible = false
  image(bg,15,15)
  if(wave > 0 && !isPaused){ // verifica daca joaca este in pauza
    placeTower()
    enemyMove()
    killEnemies()
    chooseTower()
    
    // verificam daca am completat waveul
    if(enemiesSpawned >= enemiesInWave && enemies.length === 0) {
      // wave complet trecem la urmatorul  
      if (!waveButton) {
        createWaveButton();
        
        // messaj 
        let completedText = new Sprite(width/2, height/2);
        completedText.collider = 'n';
        completedText.text = "WAVE " + wave + " COMPLETED!";
        completedText.textSize = 36;
        completedText.color = color(76, 175, 80);
        completedText.life = 80;
      }
    }
    
    if(lives <= 0){ 
      // 0 = sa terminat joaca
      lives = 0; // vietile nu poate sa se ducai n negativ
      fill(0, 0, 0, 200);
      rect(0, 0, width, height);
      fill(255, 0, 0);
      textSize(40);
      textAlign(CENTER, CENTER);
      text("GAME OVER", width/2, height/2);
      textSize(24);
      text("Wave Reached: " + wave, width/2, height/2 + 50);
      noLoop();
      // buton de restart in curind
    }
  }
  allSprites.draw()
  drawHUD()
  drawUpgradeUI() // upgrade UI
}
function killEnemies(){
  
  for (let e of enemies) {
    if (e.health <= 0) {
      e.remove();
      
      gold += 10;
    }
  }
  
  
  for (let p of projectile) {
    for (let e of enemies) {
      if (p.overlaps(e)) {
        switch(p.type) {
          case 'F':
            if (p.overlapping(enemies) > 0) {
              e.moveSpeed = 0.01;
              console.log("Hello!");
            }
            break;
          case 'B':
            e.health -= p.towerDamage;
            p.remove();
            break;
          default:
            e.health -= p.towerDamage || 0.2;
            p.remove();
            
            
        }
      }
    }
  }
}

function towerShoot(){
  if (!isPaused) { // inca o verificare pentru pauza
    for(t of tower){
      if(t.type == 'A'){
        if (enemies[0]) {
          t.rotation = t.angleTo(enemies[0])
        }
      if(enemies[0]){
        let  p = new projectile.Sprite(t.x,t.y)
        p.speed = 0.01
        p.type = t.type
        p.towerDamage = t.damage
        let dir = closest()
        if(dir){
           p.direction = p.angleTo(closest())
        }
      }
      }
    }
  }
}
function blastShoot(){
  if (!isPaused) {
    for(t of tower){
      if(t.type == 'B'){
        let target = closest(t);
        if (target) {
          t.rotation = t.angleTo(target) + 90;
          let p = new projectile.Sprite(t.x,t.y)
          p.img = rocketImg
          p.scale = 0.3
          p.radius = 0.3
          p.speed = 0.015
          p.type = t.type
          p.towerDamage = t.damage
          p.direction = t.angleTo(target)
          p.rotation = p.direction + 90
        }
      }
    }
  }
}

function frostShoot(){
  if (!isPaused) { // inca o verificarea pentru pauza
    for(t of tower){
      if(t.type == 'F'){
        if (enemies[0]) {
          t.rotation = t.angleTo(enemies[0])
        }
      if(enemies[0]){
        let  p = new projectile.Sprite(t.x,t.y)
        p.radius = 0.5
        p.speed = 0.01
        p.type = t.type;
        p.towerDamage = t.damage;
        let dir = closest()
        if(dir){
           p.direction = p.angleTo(closest())
        }



      }
      }
    }
  }
}
function closest(t, e) {
  for (to of tower) { 
    for (en of enemies) { 
      let dist1 = dist(to.x, to.y, enemies[0].x, enemies[0].y) 
      let dist2 = dist(to.x, to.y, en.x, en.y)
      if (dist2 < dist1) {
        return en
      } else {
        return enemies[0]
      }
    }
  }
}

function placeTower(){
  cursor.x = (floor(mouse.x / tileSize))
  cursor.y = (floor(mouse.y / tileSize))
if(cursor.overlapping(placeable) &&  mouse.released() && !cursor.overlapping(tower) && gold >=50){
  switch(selectedTower){
    case 'F':
      t = new frostTower.Sprite(cursor.x,cursor.y)
      gold-=30;
      break;
    case 'A':
      t = new tower.Sprite(cursor.x,cursor.y)
      gold-=50;
      break;
    case 'B':
      t = new blastTower.Sprite(cursor.x,cursor.y)
      gold-=75;
      break;
  }
}
  cursor.visible = false; 
  
  if(cursor.overlapping(placeable)){
    
    stroke(76, 175, 80) // outline verde
    strokeWeight(2)
    noFill()
    rect(cursor.x * tileSize, cursor.y * tileSize, tileSize, tileSize, 5)
    noStroke()
  }
  else{
    
    stroke(255, 0, 0) // outline rosu
    strokeWeight(2)
    noFill()
    rect(cursor.x * tileSize, cursor.y * tileSize, tileSize, tileSize, 5)
    noStroke()
  }
}

function enemyMove(){
  for(e of enemies){
    
    e.text = floor(e.health)
    
    
    switch(floor(e.health)){
      case 3:
        e.img = soldier3Img
        e.tint = color(255, 100, 100); // o culoare mai rosie care reprezinta soldati mai puternici
        break;
      case 2:
        e.img = soldier2Img
        e.tint = color(255, 200, 100); // orange + galben pentru coloarea mai puternica
        break;
      default:
        e.img = soldier1Img;
        e.tint = color(255, 255, 255); 
    }
    
    // logica miscarii cu if
    if(node[e.counter]){
      if (!isPaused) {
        if (node[e.counter]) {
          // rotatie la inamica sa se uite in directia unde se duce
          e.rotation = e.angleTo(node[e.counter])
          
          // randomizatie pentru viteza inamicii
          let speedVariation = random(0.95, 1.05);
          e.moveTo(node[e.counter], e.moveSpeed * speedVariation)
        }
      }
      
      
      if(e.overlapping(node[e.counter])){
        e.counter += 1;
      }
    }
    
    // sfirsitul
    if(e.overlapping(end[0])){
      lives -= e.health
      
      // effect vizual (TREBUIE FINISAT PENTRU SFRSIT CSS)
      let damageText = new Sprite(e.x, e.y);
      damageText.text = "-" + e.health;
      damageText.color = 'red';
      damageText.textSize = 16;
      damageText.life = 30;
      damageText.velocity.y = -0.05;
      
      e.remove();
    }
  }
}
function drawHUD(){
  // Main HUD
  fill(40, 44, 52, 220)
  stroke(76, 175, 80)
  strokeWeight(2)
  rect(width/2 - 170, 20, 340, 90, 10)
  
  // Admin Panel UI
  rect(width - 170, height - 220, 150, 80, 10)
  
  // Tower Key UI
  rect(width - 170, height - 120, 150, 100, 10)
  
  // Admin Panel Title
  fill(76, 175, 80)
  rect(width - 170, height - 220, 150, 30, 10, 10, 0, 0)
  
  fill(255)
  textSize(14)
  textAlign(CENTER)
  text("ADMIN PANEL", width - 95, height - 202)
  
  // Admin Buttons
  fill(255, 215, 0)
  rect(width - 160, height - 180, 60, 25, 5)
  fill(255, 0, 0)
  rect(width - 90, height - 180, 60, 25, 5)
  
  fill(0)
  textSize(10)
  text("+100 GOLD", width - 130, height - 165)
  text("+100 HP", width - 60, height - 165)
  strokeWeight(1)
  noStroke()
  
  // Tower Key Title
  fill(76, 175, 80)
  rect(width - 170, height - 120, 150, 30, 10, 10, 0, 0)
  
  fill(255)
  textSize(14)
  textAlign(CENTER)
  text("TOWER KEYS", width - 95, height - 102)
  
  textAlign(LEFT)
  text("A = Tower 1", width - 160, height - 75)
  text("F = Tower 2", width - 160, height - 50)
  text("B = Tower 3", width - 160, height - 25)
  
  // titlu
  fill(76, 175, 80)
  rect(width/2 - 170, 20, 340, 30, 10, 10, 0, 0)
  
  
  fill(255)
  textSize(18)
  textStyle(BOLD)
  text("TOWER DEFENSE", width/2 - 80, 40)
  
  
  textStyle(NORMAL)
  fill(255, 215, 0)
  textSize(18)
  text("💰 " + gold, width/2 - 140, 70)
  
  fill(255, 0, 0) 
  text("❤️ " + floor(lives), width/2 - 140, 100)
  
  fill(0, 191, 255) 
  text("🏰 Tower: " + selectedTower, width/2 + 60, 70)
  
  fill(255, 165, 0) 
  text("🌊 Wave: " + wave, width/2 + 60, 100)
}

function startWave(){
  wave += 1;
  
  
  enemiesSpawned = 0;
  
  // nefinzaliazat
  let waveAnnouncement = new Sprite(width/2, height/2);
  waveAnnouncement.collider = 'n';
  waveAnnouncement.text = "WAVE " + wave;
  waveAnnouncement.textSize = 40;
  waveAnnouncement.color = color(255, 165, 0);
  waveAnnouncement.life = 60;
  
  
  if (wave % 5 === 0) {
    let bossWaveText = new Sprite(width/2, height/2 + 50);
    bossWaveText.collider = 'n';
    bossWaveText.text = "BOSS WAVE!";
    bossWaveText.textSize = 28;
    bossWaveText.color = color(255, 0, 0);
    bossWaveText.life = 60;
  }
  
  // la sfirsit aur bonus
  let waveBonus = 50 + (wave * 10);
  gold += waveBonus;
  
  // cind incepe runda noua sa primim gold bonus
  let bonusText = new Sprite(width/2, height/2 + 80);
  bonusText.collider = 'n';
  bonusText.text = "+" + waveBonus + " Gold";
  bonusText.textSize = 24;
  bonusText.color = color(255, 215, 0);
  bonusText.life = 60;
  
  
  let spawnInterval = max(1000 - (wave * 50), 300); 
  clearInterval(spawnIntervalId); 
  spawnIntervalId = setInterval(spawn, spawnInterval);
  
  if (waveButton) {
    waveButton.remove();
    waveButton = null;
  }
}



function upgradeTower(towerSprite) {
  if (gold >= towerSprite.upgradeCost && towerSprite.level < towerSprite.maxLevel) {
    gold -= towerSprite.upgradeCost;
    towerSprite.level++;

    
    if (towerSprite.type == 'A') {
      towerSprite.damage += 0.1;
      towerSprite.fireRate *= 0.9; 
    } else if (towerSprite.type == 'F') {
      towerSprite.damage += 0.05;
      towerSprite.fireRate *= 0.9; 
    } else if (towerSprite.type == 'B') {
      towerSprite.damage += 0.15;
      towerSprite.fireRate *= 0.85;
    }

    
    towerSprite.scale = 1 + (towerSprite.level - 1) * 0.1; 
  }
}

function drawUpgradeUI() {
  if (selectedTowerSprite) {
    // Fixed position on the right side of the screen
    let bx = width - 120;
    let by = 150;
    
    // Draw tower info box
    fill(40, 44, 52, 220);
    stroke(76, 175, 80);
    strokeWeight(2);
    rect(bx - 10, by - 10, 110, 120, 10);
    
    // Draw upgrade button
    fill(255, 215, 0); 
    stroke(0);
    strokeWeight(1);
    rect(bx, by, 90, 30, 5);
    
    fill(0);
    textSize(12);
    textAlign(CENTER, CENTER);
    text("Upgrade\n" + selectedTowerSprite.upgradeCost + "G", bx + 45, by + 15);
    
    // Draw stats
    textAlign(LEFT);
    fill(255);
    textSize(12);
    text("Selected Tower:", bx, by + 45);
    text("Level: " + selectedTowerSprite.level + "/" + selectedTowerSprite.maxLevel, bx, by + 65);
    text("Damage: " + selectedTowerSprite.damage.toFixed(1), bx, by + 85);
    text("Fire Rate: " + selectedTowerSprite.fireRate.toFixed(1), bx, by + 105);
    
    textAlign(LEFT, BASELINE); 
  }
}

function mousePressed() {
  // Admin panel buttons
  if (mouseY > height - 180 && mouseY < height - 155) {
    // Gold button
    if (mouseX > width - 160 && mouseX < width - 100) {
      gold += 100;
      return;
    }
    // Health button
    if (mouseX > width - 90 && mouseX < width - 30) {
      lives += 100;
      return;
    }
  }

  let bx = width - 120;
  let by = 150;
  
  // Check if clicking upgrade button when a tower is selected
  if (selectedTowerSprite) {
    if (mouseX > bx && mouseX < bx + 90 && 
        mouseY > by && mouseY < by + 30) {
      upgradeTower(selectedTowerSprite);
      return;
    }
    
    // If clicking outside the upgrade menu area, deselect tower
    if (!(mouseX > bx - 10 && mouseX < bx + 100 && 
          mouseY > by - 10 && mouseY < by + 110)) {
      selectedTowerSprite = null;
      return;
    }
    return; // Prevent selecting another tower while one is selected
  }
  
  // Only allow selecting a tower if none is currently selected
  for (let t of tower) {
    if (dist(mouseX, mouseY, t.x * tileSize, t.y * tileSize) < tileSize) {
      selectedTowerSprite = t;
      return;
    }
  }
}

function togglePause() {
  isPaused = !isPaused;
  if (isPaused) {
    pauseButton.html('▶ Resume');
    pauseButton.style('background-color', '#FF9800');
    
    
    let pauseText = new Sprite(width/2, height/2);
    pauseText.collider = 'n';
    pauseText.text = "PAUSED";
    pauseText.textSize = 36;
    pauseText.color = color(255, 255, 255, 180);
    pauseText.life = 1; 
    pauseText.name = "pauseText";
  } else {
    pauseButton.html('⏸️ Pause');
    pauseButton.style('background-color', '#4CAF50');
    
    
    let pauseTextSprite = allSprites.find(sprite => sprite.name === "pauseText");
    if (pauseTextSprite) pauseTextSprite.remove();
  }
}


function createWaveButton() {
  waveButton = createButton('▶ Start Wave ' + (wave + 1));
  waveButton.position(20, 120);
  waveButton.mousePressed(startWave);
  waveButton.class('game-button');
}  