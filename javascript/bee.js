var distValue = "000", fieldDistance, texture, beeTexture;

function initialize() {

  varGame = {
    textureLoaded: true,
    beeBodyTextureLoaded: true,
    speedFactor: 1,
    speed: 0,
    baseSpeed: 0.00035,
    rotationGround: 0.000,
    rotationSky: 0.005,
    view: 70,
    rr: 0,

    deltaTime: 0,
    distance: 0,
    ratioSpeedDistance: 50,
    near: 1,
    far: 10000,
    farLight: 1000,

    beeInitialHeight: 100,
    beeEndUpdPosY: 0.5,
    beeEndUpdRotY: 0.01,
    planeAmpHeight: 80,
    beeSpeed: 0,
    rotationWing: 0.1,

    groundRadius: 650,
    groundLength: 800,

    coinDistanceToKeep: 15,
    scoreValue: 5,
    coinsSpeed: .5,
    coinLastAdd: 0,
    distanceForCoinAdd: 115,

    sphereDistanceToKeep: 15,
    sphereLastAdd: 0,
    distanceForSphereAdd: 170,
    score: 0,
    level: 0,
    life: 3,
    playOn: true,
    isGameOver: false,
    up: false,
    down: false,
    left: false,
    right: false
  };
}

var scene, camera, renderer, container, ambientLight, hemisphereLight, shadowLight;

var newTime = new Date().getTime();
var oldTime = new Date().getTime();

var Height, Width;

function textureRocks() {
  var side = 30;
  var amount = Math.pow(side, 5);
  var data = new Uint8Array(amount);
  for (var i = 0; i < amount; i++) {
    data[i] = Math.random() * 120;
  }
  texture = new THREE.DataTexture(data, side, side, THREE.LuminanceFormat, THREE.UnsignedByteType);
  texture.magFilter = THREE.LinearFilter;
  texture.needsUpdate = true;
}

function textureBeeBody() {
  var side = 30;
  var amount = Math.pow(side, 2);
  var data = new Uint8Array(amount);
  for (var i = 0; i < amount; i++) {
    data[i] = Math.random() * 120;
  }
  beeTexture = new THREE.DataTexture(data, side, side, THREE.LuminanceFormat, THREE.UnsignedByteType);
  beeTexture.magFilter = THREE.NearestFilter;
  beeTexture.needsUpdate = true;
}


function createPage() {
  Height = window.innerHeight;
  Width = window.innerWidth;
  scene = new THREE.Scene();
  varGame.rr = Width / Height;
  camera = new THREE.PerspectiveCamera(
    varGame.view,
    varGame.rr,
    varGame.near,
    varGame.far
  );

  camera.position.x = 0;
  camera.position.z = 250;
  camera.position.y = 100;

  renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setSize(Width, Height);
  renderer.shadowMap.enabled = true;
  container = document.getElementById('thescene');
  container.appendChild(renderer.domElement);
  window.addEventListener('resize', windowSize, false);
}

function windowSize() {
  Height = window.innerHeight;
  Width = window.innerWidth;
  renderer.setSize(Width, Height);
  camera.aspect = Width / Height;
  camera.updateProjectionMatrix();
}

function createLightsAndShadows() {
  ambientLight = new THREE.AmbientLight(0xdc8874, .5);
  hemisphereLight = new THREE.HemisphereLight(0xaaaaaa, 0x000000, 1.0);
  shadowLight = new THREE.DirectionalLight(0xffffff, .9);
  shadowLight.position.set(100, 200, 200);
  shadowLight.castShadow = true;
  shadowLight.shadow.camera.left = -300;
  shadowLight.shadow.camera.right = 300;
  shadowLight.shadow.camera.top = 300;
  shadowLight.shadow.camera.bottom = -300;
  shadowLight.shadow.camera.near = varGame.near;
  shadowLight.shadow.camera.far = varGame.farLight;
  shadowLight.shadow.mapSize.width = 2048;
  shadowLight.shadow.mapSize.height = 2048;
  scene.add(hemisphereLight);
  scene.add(shadowLight);
}

function createGround() {
  ground = new Ground();
  ground.mesh.position.y = -580;
  scene.add(ground.mesh);
}

function createSky() {
  sky = new Sky();
  sky.mesh.position.y = -580;
  scene.add(sky.mesh);
}


function createCloud() {
  cloud = new Cloud();
  cloud.mesh.position.y = -580;
  scene.add(cloud.mesh);
}

function createBee() {
  bee = new Bee("#2c3e50", 30, false, 1.0);
  bee.mesh.scale.set(.3, .3, .3);
  bee.mesh.position.y = varGame.beeInitialHeight;
  bee.mesh.position.z = 0;
  scene.add(bee.mesh);
}

function createCoin() {
  coinOwner = new CoinOwner(100);
  scene.add(coinOwner.mesh)
}

function createSphere() {
  sphereOwner = new SphereOwner(100);
  scene.add(sphereOwner.mesh)
}


var Bee = function (color, bitePosition, transparent, setOpacity) {
  this.mesh = new THREE.Object3D();
  this.mesh.name = "bee";



  var geomBody = new THREE.SphereGeometry(60, 80, 20);
  var matBody;
  geomBody.applyMatrix(new THREE.Matrix4().makeScale(1.2, 0.6, 0.6));
  if (varGame.beeBodyTextureLoaded)
    matBody = new THREE.MeshPhongMaterial({
      map: beeTexture,
      color: '#f5af19',
      side: THREE.DoubleSide
    });
  else
    matBody = new THREE.MeshPhongMaterial({
      color: '#f5af19',
      flatShading: THREE.FlatShading,
    });
  var body = new THREE.Mesh(geomBody, matBody);
  body.castShadow = true;
  body.receiveShadow = true;
  this.mesh.add(body);


  var geomBite = new THREE.ConeGeometry(8, 50, 10, 21);
  var matBite = new THREE.MeshPhongMaterial({
    color: '#5A3F37',
    flatShading: THREE.FlatShading,
    opacity: setOpacity,
    transparent: transparent
  });
  this.bite = new THREE.Mesh(geomBite, matBite);
  this.bite.position.set(-70, 0, 0);
  this.bite.rotateZ(Math.PI * 0.5);
  this.bite.castShadow = true;
  this.bite.receiveShadow = true;
  this.mesh.add(this.bite);

  var geomHead = new THREE.SphereGeometry(30, 30, 100);
  var matHead = new THREE.MeshPhongMaterial({
    color: '#FFD200',
    flatShading: THREE.FlatShading,
    opacity: setOpacity,
    transparent: transparent
  });
  this.Head = new THREE.Mesh(geomHead, matHead);
  this.Head.position.set(65, 0, 0);
  this.Head.castShadow = true;
  this.Head.receiveShadow = true;
  this.mesh.add(this.Head);

  geomHead.vertices[4].y += 9;
  geomHead.vertices[4].z -= 6;
  geomHead.vertices[5].y += 9;
  geomHead.vertices[5].z += 6;
  geomHead.vertices[6].y -= 9;
  geomHead.vertices[6].z -= 6;
  geomHead.vertices[7].y -= 9;
  geomHead.vertices[7].z += 6;


  // Create DX Wing
  var geomSideBackWing = new THREE.CircleGeometry(50, 500, 6, 2.5);
  var matSideBackWing = new THREE.MeshPhongMaterial({
    color: '#ffd89b',
    flatShading: THREE.FlatShading,
    opacity: setOpacity,
    transparent: transparent
  });
  this.sideBackWing = new THREE.Mesh(geomSideBackWing, matSideBackWing);
  this.sideBackWing.position.set(0, 20, 15);
  this.sideBackWing.castShadow = true;
  this.sideBackWing.receiveShadow = true;
  this.mesh.add(this.sideBackWing);


  // modify the structure of the wing
  geomSideBackWing.vertices[4].y += 5;
  geomSideBackWing.vertices[5].y += 5;
  geomSideBackWing.vertices[5].z += 4;
  geomSideBackWing.vertices[7].z += 4;


  // Create SX Wing
  var geomSideFrontWing = new THREE.CircleGeometry(50, 500, 6, 2.5);
  var matSideFrontWing = new THREE.MeshPhongMaterial({
    color: '#ffd89b',
    flatShading: THREE.FlatShading,
    opacity: setOpacity,
    transparent: transparent
  });
  this.sideFrontWing = new THREE.Mesh(geomSideFrontWing, matSideFrontWing);
  this.sideFrontWing.position.set(0, 20, -15);
  this.sideFrontWing.castShadow = true;
  this.sideFrontWing.receiveShadow = true;
  this.mesh.add(this.sideFrontWing);


  // modify the structure of the wing
  geomSideFrontWing.vertices[4].y += 5;
  geomSideFrontWing.vertices[5].y += 5;
  geomSideFrontWing.vertices[5].z -= 4;
  geomSideFrontWing.vertices[7].z -= 4;


}

Cloud = function () {
  this.mesh = new THREE.Object3D();
  geom = new THREE.SphereGeometry(17, 32, 32);
  mat = new THREE.MeshPhongMaterial({ color: '#FFFFFF' });
  nBlocs = 5 + Math.floor(Math.random() * 3);
  var m = new THREE.Mesh(geom, mat);
  m.position.x = i * 15;
  m.position.y = Math.random() * 10;
  m.position.z = Math.random() * 10;
  m.rotation.z = Math.random() * Math.PI * 2;
  m.rotation.y = Math.random() * Math.PI * 2;
  var s = .1 + Math.random() * .9;
  m.scale.set(s, s, s);
  m.castShadow = true;
  m.receiveShadow = true;
  this.mesh.add(m);
}

Sky = function () {
  this.mesh = new THREE.Object3D();
  this.numELem = 12;
  this.genericBees = [];
  var stepToAdd = Math.PI * 2 / this.numELem;
  for (var i = 0; i < this.numELem; i++) {
    var c = new Bee('#fceabb', -10, true, 0.2);
    var s = Math.random() * 0.2;
    this.genericBees.push(c);
    var a = stepToAdd * i;
    var h = 800 + Math.random() * 300;
    c.mesh.position.z = -300 - Math.random() * 100;
    c.mesh.rotation.z = a + Math.PI / 2;
    c.mesh.position.y = Math.sin(a) * h;
    c.mesh.position.x = Math.cos(a) * h;
    c.mesh.scale.set(s, s, s);
    this.mesh.add(c.mesh);
  }
}


Ground = function () {
  var geom = new THREE.CylinderGeometry(600, 600, 1000, 100);
  geom.applyMatrix(new THREE.Matrix4().makeRotationX(-Math.PI / 2));
  var mat = new THREE.MeshPhongMaterial({
    color: '#52c234',
    flatShading: THREE.FlatShading,
    opacity: 1,
    transparent: false
  });
  this.mesh = new THREE.Mesh(geom, mat);
  this.mesh.receiveShadow = true;
}

Sphere = function () {
  var geom = new THREE.IcosahedronGeometry(12, 0), mat;
  if (varGame.textureLoaded)
    mat = new THREE.MeshPhongMaterial({
      map: texture,
      color: '#FF512F',
      side: THREE.DoubleSide
    });
  else
    mat = new THREE.MeshPhongMaterial({
      color: '#FF512F',
      flatShading: THREE.FlatShading,
    });
  this.mesh = new THREE.Mesh(geom, mat);
  this.mesh.castShadow = true;
  this.angle = 0;
  this.dist = 0;
}

SphereOwner = function () {
  this.mesh = new THREE.Object3D();
  this.sphereInScene = [];
  this.sphereStock = [];
  var sphere = new Sphere();
  this.sphereStock.push(sphere);
}

SphereOwner.prototype.addSphere = function () {
  var sphere;
  var dist = varGame.groundRadius + varGame.beeInitialHeight + (-1 + Math.random() * 2) * (varGame.planeAmpHeight - 20);
  if (this.sphereStock.length) {
    sphere = this.sphereStock.pop();
  } else {
    sphere = new Sphere();
  }
  this.mesh.add(sphere.mesh);
  this.sphereInScene.push(sphere);
  sphere.angle = - 0.5;
  sphere.distance = dist + Math.cos(0.7);
  sphere.mesh.position.y = -varGame.groundRadius + Math.sin(sphere.angle) * sphere.distance;
  sphere.mesh.position.x = Math.cos(sphere.angle) * sphere.distance;
}


SphereOwner.prototype.sphereAnimation = function () {
  for (var i = 0; i < this.sphereInScene.length; i++) {
    var sphere = this.sphereInScene[i];
    if (sphere.exploding) continue;
    sphere.angle += varGame.speed * varGame.deltaTime * varGame.coinsSpeed;
    if (sphere.angle > Math.PI * 2) sphere.angle -= Math.PI * 2;
    sphere.mesh.position.y = -(varGame.groundRadius - 100) + Math.sin(sphere.angle) * sphere.distance;
    sphere.mesh.position.x = Math.cos(sphere.angle) * (sphere.distance * varGame.speedFactor);
    sphere.mesh.rotation.z += Math.random() * .1;
    sphere.mesh.rotation.y += Math.random() * .1;

    var dist = bee.mesh.position.clone().sub(sphere.mesh.position.clone()).length();
    if (dist < varGame.sphereDistanceToKeep) {
      updateLife();
      this.sphereStock.unshift(this.sphereInScene.splice(i, 1)[0]);
      bee.mesh.position.x -= 30;
      this.mesh.remove(sphere.mesh);
      ambientLight.intensity = 2;
      if (scene.children[4].name == "bee") {
        var visible = false;  // initial opacity
        var op = 1.0;  // initial opacity
        alarmmsg.style.opacity = op;
        alarmmsg.style.display = "block";
        var timer = setInterval(function () {
          if (op <= 0) {
            visible = true;
            alarmmsg.style.display = "none";
            scene.children[4].visible = visible;
            clearInterval(timer);
          }
          scene.children[4].visible = visible;
          visible = !visible;
          alarmmsg.style.opacity = op;
          alarmmsg.style.filter = 'alpha(opacity=' + op + ")";
          op -= 0.03;
        }, 50);
      }
      i--;
    }
  }
}

Coin = function () {
  var geom = new THREE.CylinderGeometry(5, 5, 2, 32);
  var mat = new THREE.MeshPhongMaterial({
    color: "#f8b500",
    vertexShader: document.getElementById('vertexShaderId').textContent,
    fragmentShader: document.getElementById('fragmentShaderId').textContent
  });
  this.mesh = new THREE.Mesh(geom, mat);
  this.mesh.castShadow = true;
  this.angle = 0;
  this.dist = 0;
}

CoinOwner = function (num) {
  this.mesh = new THREE.Object3D();
  this.coinInScene = [];
  this.coinStock = [];
  for (var i = 0; i < num; i++) {
    var coin = new Coin();
    this.coinStock.push(coin);
  }
}

CoinOwner.prototype.addCoin = function () {
  var num = Math.floor(Math.random() * 5) + 2;
  var amp = Math.round(Math.random() * 10);
  var dist = varGame.groundRadius + varGame.beeInitialHeight + (-1 + Math.random() * 2) * (varGame.planeAmpHeight - 20);
  for (var i = 0; i < num; i++) {
    var coin;
    if (this.coinStock.length) {
      coin = this.coinStock.pop();
    } else {
      coin = new Coin();
    }
    this.mesh.add(coin.mesh);
    this.coinInScene.push(coin);
    coin.distance = dist + Math.cos(i * .5) * amp;
    coin.angle = -(i * 0.02);
    coin.mesh.position.y = -varGame.groundRadius + Math.sin(coin.angle) * coin.distance;
    coin.mesh.position.x = Math.cos(coin.angle) * coin.distance;
  }
}

CoinOwner.prototype.coinAnimation = function () {
  for (var i = 0; i < this.coinInScene.length; i++) {
    var coin = this.coinInScene[i];
    coin.angle += varGame.speed * varGame.deltaTime * varGame.coinsSpeed;
    if (coin.angle > Math.PI * 2) coin.angle -= Math.PI * 2;
    coin.mesh.position.x = Math.cos(coin.angle) * (coin.distance * varGame.speedFactor);
    coin.mesh.position.y = -(varGame.groundRadius - 100) + Math.sin(coin.angle) * coin.distance;
    coin.mesh.rotation.y += Math.random() * .1;
    coin.mesh.rotation.z += Math.random() * .1;
    var dist = bee.mesh.position.clone().sub(coin.mesh.position.clone()).length();
    if (dist < varGame.coinDistanceToKeep) {
      updateScore();
      if (pointWin.style.display != "block") {
        var op = 1.0;  // initial opacity
        pointWin.style.display = "block";
        var timer = setInterval(function () {
          if (op <= 0) {
            clearInterval(timer);
            pointWin.style.display = "none";
          }
          pointWin.style.opacity = op;
          pointWin.style.filter = 'alpha(opacity=' + op + ")";
          op -= 0.03;
        }, 50);
      }
      this.coinStock.unshift(this.coinInScene.splice(i, 1)[0]);
      this.mesh.remove(coin.mesh);
      i--;
    }
  }
}


var ground, bee, sky, cloud, coinOwner, sphereOwner;



function loop() {

  newTime = new Date().getTime();
  varGame.deltaTime = newTime - oldTime;
  oldTime = newTime;
  if (varGame.playOn) {
    if (Math.floor(varGame.distance) % varGame.distanceForCoinAdd == 0 && Math.floor(varGame.distance) > varGame.coinLastAdd) {
      varGame.coinLastAdd = Math.floor(varGame.distance);
      coinOwner.addCoin();
    }
    if (Math.floor(varGame.distance) % varGame.distanceForSphereAdd == 0 && Math.floor(varGame.distance) > varGame.sphereLastAdd) {
      varGame.sphereLastAdd = Math.floor(varGame.distance);
      sphereOwner.addSphere();
    }
    updateBee();
    updateGenericBee();
    updateDistance();
    varGame.speed = varGame.baseSpeed * varGame.beeSpeed;
    coinOwner.coinAnimation();
    sphereOwner.sphereAnimation();
    ground.mesh.rotation.z += varGame.rotationGround;
    sky.mesh.rotation.z += varGame.rotationSky;
    renderer.render(scene, camera);
    requestAnimationFrame(loop);
  }
}

function firstInit() {

  var scene = document.getElementById("thescene");
  scene.style.display = "none";
  document.getElementById("myButtonStart").onclick = function () {
    init();
  };
}


function init() {
  var x = document.getElementById("playAudio");
  x.autoplay = true;
  x.load();

  var scene = document.getElementById("thescene");
  scene.style.display = "block";
  fieldDistance = distValue;
  document.addEventListener('keydown', manageAnimation, false);
  gameOver = document.getElementById("gameOver");
  totalScore = document.getElementById("totalScore");
  actualLevel = document.getElementById("actualLevel");
  stopPauseGame = document.getElementById("stopPauseGame");
  alarmMsg = document.getElementById("alarmmsg");
  pointWin = document.getElementById("pointWin");
  document.getElementById("pageReset").onclick = function () { varGame.life = 1; updateLife() };
  initialize();
  textureRocks();
  textureBeeBody();
  createPage();
  createLightsAndShadows();
  createGround();
  createSky();
  createBee();
  createCoin();
  createSphere();
  loop();
}


function manageAnimation(event) {
  if (gameOver.style.display != "block") {
    if (event.keyCode == 32) {
      varGame.playOn = !varGame.playOn;
      if (!varGame.playOn) {
        stopPauseGame.style.display = "block";
      }
      else {
        stopPauseGame.style.display = "none";
        loop();
      }
    }
  }
}

function move() {
  if (varGame.up) {
    bee.mesh.position.y += 5;
    bee.mesh.rotation.z = 0.2;
    if (bee.mesh.position.y >= 260) varGame.up = false;
  }

  if (varGame.down) {
    bee.mesh.position.y -= 5;
    bee.mesh.rotation.z = -0.2;
    if (bee.mesh.position.y <= 70) varGame.down = false;
  }


  if (varGame.left) {
    bee.mesh.position.x -= 10;
    bee.mesh.rotation.y = -0.2;
    if (bee.mesh.position.x <= 260) varGame.left = false;
  }


  if (varGame.right) {
    bee.mesh.position.x += 10;
    bee.mesh.rotation.y = 0.2;
    if (bee.mesh.position.x <= 70) varGame.right = false;
  }

  if (varGame.life == 0) {
    varGame.isGameOver = true;
    showGameOver();
  }
}

document.onkeydown = function (e) {
  if (e.keyCode == 38) {
    varGame.up = true;
  }
  if (e.keyCode == 40) {
    varGame.down = true;
  }

}

document.onkeyup = function (e) {
  if (e.keyCode == 38) varGame.up = false;
  if (e.keyCode == 40) varGame.down = false;
  if (bee != undefined) bee.mesh.rotation.z = 0;
}


document.onkeyleft = function (e) {
  if (e.keyCode == 37) {
    varGame.left = true;
  }
  if (e.keyCode == 39) {
    varGame.right = true;
  }

}

document.onkeyright = function (e) {
  if (e.keyCode == 37) varGame.left = false;
  if (e.keyCode == 39) varGame.right = false;
  if (bee != undefined) bee.mesh.rotation.X = 0;
}

function roundToOneValue(v, vmin, vmax, tmin, tmax) {
  var nv = Math.max(Math.min(v, vmax), vmin);
  var dv = vmax - vmin;
  var pc = (nv - vmin) / dv;
  var dt = tmax - tmin;
  var tv = tmin + (pc * dt);
  return tv;
}

function updateDistance() {
  varGame.distance += varGame.speed * varGame.deltaTime * varGame.ratioSpeedDistance;
}

function updateBee() {
  varGame.beeSpeed = roundToOneValue(0, -.5, .5, 1, 3);
  if (bee.sideBackWing.rotation.x > 0.7 || bee.sideBackWing.rotation.x < -0.7) varGame.rotationWing *= -1;
  bee.sideBackWing.rotation.x += varGame.rotationWing;
  bee.sideFrontWing.rotation.x += -varGame.rotationWing;
  bee.bite.rotation.y += -varGame.rotationWing;
  move();
}

function updateGenericBee() {
  sky.genericBees.forEach(function (nextElem) {
    nextElem.sideBackWing.rotation.x += varGame.rotationWing;
    nextElem.sideFrontWing.rotation.x += -varGame.rotationWing;
    nextElem.bite.rotation.y += -varGame.rotationWing;
  });
}


function updateScore() {

  if (!varGame.isGameOver) {
    varGame.score += varGame.scoreValue;
    var value = document.getElementById("score");
    value.textContent = varGame.score;

    var x = document.getElementById("eatcoin");
    x.autoplay = true;
    x.load();

    if (varGame.score % 100 == 0 && varGame.score != 0)
      updateLevelAndSpeed();
  }

}

function updateLife() {

  if (varGame.life > 0) {
    varGame.life -= 1;
    var value = document.getElementById("life");
    value.textContent = varGame.life;
  }
}

function updateLevelAndSpeed() {

  varGame.level += 1;
  var value = document.getElementById("level");
  value.textContent = varGame.level;
  varGame.rotationSky += .0005;
  varGame.rotationGround += .0005;
  varGame.speedFactor += 0.25;
}

function showGameOver() {


  playOn = false;
  var timer = setInterval(function () {
    if (bee.mesh.position.y <= -50) {
      var x = document.getElementById("gameover");
      x.autoplay = true;
      x.load();

      varGame.playOn = false;
      clearInterval(timer);
    }
    bee.mesh.position.y -= varGame.beeEndUpdPosY;
    bee.mesh.rotation.y -= varGame.beeEndUpdRotY;
  }, 100);
  if (gameOver.style.display != "block" && totalScore.style.display != "block" && actualLevel.style.display != "block") {
    var x = document.getElementById("gameover");
    x.autoplay = true;
    x.load();
    totalScore.textContent += varGame.score;
    actualLevel.textContent += varGame.level;
    gameOver.style.display = "block";
    totalScore.style.display = "block";
    actualLevel.style.display = "block";
  }
}

window.addEventListener('load', firstInit, false);

