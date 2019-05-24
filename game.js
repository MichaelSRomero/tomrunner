////////////////////////// GLOBALS ///////////////////////////

let mj = new Audio('assets/audio/michael-jackson_07.wav');
const playerDiv = document.querySelector('#player-bar');
const endGameDiv = document.querySelector('div.endgame');
const leaderBoardUl = document.querySelector('ol.leaderboard');
const mainMenu = document.querySelector('.menu');
let screenWidth = window.innerWidth; // 1350
let screenHeight = window.innerHeight; // 700
var playerLives = 3;

////////////////////////// FULL GAME ///////////////////////////

function startGame(){
  //....... Game Settings .......//
    var config = {
    type: Phaser.AUTO,
    width: screenWidth,
    height: screenHeight,
    physics: {
        default: 'arcade'
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    },
    transparent: true
  };

  //....... Game Variables .......//
  var game = new Phaser.Game(config)
  var player;
  var playerJumps = 0;
  var maxJumps = 2;
  var playerDash = 0;
  var maxDash = 1;
  var immovablePlatforms;
  var collapsiblePlatforms;
  var startPlatforms;
  var gameOver = false;
  var newTimer = 0;
  var finalScore = [];
  var currentUserID;
  setInterval(function(){ newTimer += 1 }, 1000);

  //....... Preload .......//
  function preload() {
    this.load.atlas('tom', 'assets/player.png', 'assets/player.json')
    this.load.image('platform', 'assets/platform.png')
    this.load.image('platform-end', 'assets/platform-end.png')
    this.load.image('small-platform', 'assets/small-platform.png')
    this.load.image('collapse-platform', 'assets/collapse-platform.png')
    this.load.image('spike', 'assets/Spike.png')
    this.load.image('spaceship', 'assets/spaceship.png')
    this.load.image('barrel', 'assets/barrel.png')
  }

  //....... Create .......//
  function create() {

    startPlatforms = this.physics.add.group({
      key: 'platform-end',
      frameQuantity: 6,
      setXY: {x: 0, y: 600, stepX: 260},
      velocityX: -300,
      immovable: true
    });

    immovablePlatforms = this.physics.add.group({
            velocityX: -300,
            immovable: true,
            randomKey: true
        });

    collapsiblePlatforms = this.physics.add.group({velocityX: -300});

    // ------------------ STILL TESTING LV1 PLATFORMS ------------------ //
    let previousWidth = null;
    let randomWidth;
    var platformTypes = [immovablePlatforms, collapsiblePlatforms];
    var platformKey;

    for (let i = 0; i < 50; i++) {
      if (previousWidth !== null) {
        randomWidth = previousWidth;
      } else {
        // between 1700 & 2000
        randomWidth = Math.round((Math.random() * (2000 - 1700) + 1700) / 10) * 10;
      }

      randomPlatformIndex = Math.round(Math.random() * (platformTypes.length - 1));
      // between 500 and 600
      randomHeight = Math.round((Math.random() * (600 - 500) + 500) / 10) * 10;

      if (randomPlatformIndex === 0) {
        platformKey = 'small-platform';
      } else {
        platformKey = 'collapse-platform'
      }

      platformTypes[randomPlatformIndex].create(randomWidth, randomHeight, platformKey)
      // adds random distance between 400 & 775 to previousWidth
      previousWidth = randomWidth + Math.round((Math.random() * (775 - 400) + 400) / 10) * 10;
    }
    // ------------------ TESTING END ------------------ //

    // spikes on right side of screen
    spikes = this.add.group({
      key: 'spike',
      setXY: {x: screenWidth - 50, y: 120, stepY: 250},
      setRotation: {value: 4.7},
      repeat: 2
    })

    // Creates player and enables physics so player will fall
    player = this.physics.add.sprite(350, 250, 'tom', 'run001.png')

    // When player falls and lands on screen end, adds a bounce
    player.setBounce(0.1);

    // Adds the heaviness to the player, the higher the amount, the more it weighs and falls quicker
    // When physics sprite is created, it is given a body property to set gravity on
    player.body.setGravityY(900);
    // Prevents player from passing through a platform
    this.physics.add.collider(player, immovablePlatforms);
    this.physics.add.collider(player, collapsiblePlatforms);
    this.physics.add.collider(player, startPlatforms);

    // running animation
    this.anims.create({
      key: 'run',
      repeat: -1,
      frames: this.anims.generateFrameNames('tom', {
        prefix: 'run',
        suffix: '.png',
        start: 2,
        end: 6,
        zeroPad: 3
      }),
      frameRate: 10
    });

    // jumping animation
    this.anims.create({
      key: 'jump',
      repeat: 0,
      frames: this.anims.generateFrameNames('tom', {
        prefix: 'jump',
        suffix: '.png',
        start: 2,
        end: 1,
        zeroPad: 3
      }),
      frameRate: 1
    })

    // allows player to jump no more than 2 times
    var jump = function() {
      if (player.body.touching.down || (playerJumps > 0 && playerJumps <= maxJumps)) {
        if (player.body.touching.down) {
          playerJumps = 0;
        }

        player.setVelocityY(-400);
        playerJumps ++;
        player.play('jump')
        mj.play();
      }
    }
    // click listener for jump()
    document.addEventListener('keydown', (e) => {
      if (!gameOver && e.keyCode === 32) {
        jump();
      }
    // document.addEventListener('click', () => {
    //   if (!gameOver) {
    //     jump();
    //   }
    })

    // set cursors to 'WASD' keys
    cursors = this.input.keyboard.addKeys(
      {up:Phaser.Input.Keyboard.KeyCodes.W,
      down:Phaser.Input.Keyboard.KeyCodes.S,
      left:Phaser.Input.Keyboard.KeyCodes.A,
      right:Phaser.Input.Keyboard.KeyCodes.D});
  }

  //....... Update .......//
  function update() {
    // updates timer
    playerDiv.querySelector('#time').innerHTML = `${newTimer} second(s)`;

    // TRUE: restarts scene as long as player has lives
    // FALSE: adds score and persists to database; gameover screen displayed
    if (((player.body.y > this.game.config.height || player.body.x < 0) || player.body.x > screenWidth - 125) && playerLives > 0) {
      playerDiv.querySelector(`#life-${playerLives}`).remove();
      playerLives--
      this.scene.restart();
      finalScore.push(newTimer);
      newTimer = 0;
    } else if (playerLives < 1) {
      UsersAdapter.newScore(currentUser, finalScore);
      gameOver = true;
      this.scene.stop()
      this.game.destroy(true)
      endGameDiv.style.height = '100%';
    }

    // run animation plays when on ground
    if (player.body.touching.down) {
      player.play('run', true)
    }

    // TRUE: player dashes once to right or left when in air
    // FALSE: resets velocity to 0 to prevent player from moving out of place
    if ((player.body.touching.none && cursors.left.isDown) && playerDash < maxDash) {
      player.setVelocityX(-350);
      playerDash++;
    } else if ((player.body.touching.none && cursors.right.isDown) && playerDash < maxDash) {
      player.setVelocityX(100);
      playerDash++;
    } else if (player.body.touching.down){
      player.setVelocityX(0);
      playerDash = 0;
    }
  }

}

////////////////////////// MENU ///////////////////////////

//....... Login .......//
document.querySelector('.login').addEventListener('keydown', (e) => {
  if (e.which === 13) {
    let username = e.target.value
    // adds users name to top right corner
    UsersAdapter.createUser(username).then(newUser => {
      document.querySelector('#player-name').innerHTML = newUser.name;
      currentUser = newUser;
    });
    // hides login screen and transitions to "NewGame|Leaderboard"
    e.target.parentElement.style.height = '0%';
    e.target.parentElement.style.transition = '2s';
  }
})

//....... NewGame | Leaderboard .......//
document.querySelector('.menu').addEventListener('click', (e) => {
  // TRUE: hides menu screen; begins game
  // FALSE: leaderboard screen loads up
  if (e.target.className === 'new-game-button') {
    e.target.parentElement.style.height = "0%";
    e.target.parentElement.style.transition = '2s';
    endGameDiv.style.height = "0%";
    leaderBoardUl.style.height = "0%";
    startGame();
  } else if (e.target.className === 'leaderboard-button') {
    /// change the visibility of the leaderboard div to visible
    e.target.parentElement.style.height = '0%';
    e.target.parentElement.style.transition = '2s';
    /// load Leaderboard
    UsersAdapter.loadLeaderBoardData().then(leaderboard => {
      leaderBoardUl.innerHTML = '<div class="back">BACK</div> <h1>Leaderboard</h1>';
      leaderboard.forEach(leader => leaderBoardUl.innerHTML += `<li>${leader.name}   -   ${leader.score}</li>`)
    })
}})

////////////////////////// DOM LOADED ///////////////////////////

document.addEventListener('DOMContentLoaded', () => {
  UsersAdapter.getAllUsers().then(users => {
    users.forEach(user => new User(user));
  })
})

////////////////////////// back button //////////////////////

leaderBoardUl.addEventListener('click', (e) => {
  if (e.target.className === "back"){
    e.target.parentElement.height = "0%";
    mainMenu.style.height = "100%";

  }
})

endGameDiv.addEventListener('click', (e) => {
  if (e.target.className === "back"){
    endGameDiv.style.height = "0";
    mainMenu.style.height = "100%";
  } else if (e.target.className === 'play-again-button') {
    playerLives = 3;
    endGameDiv.style.height = "0%";
    playerDiv.querySelector('div.life-container').innerHTML += `
      <img id="life-1" src="assets/lifecounter.gif">
      <img id="life-2" src="assets/lifecounter.gif">
      <img id="life-3" src="assets/lifecounter.gif">`
    startGame();
  }
})
