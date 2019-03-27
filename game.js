////////////////////////// GLOBALS ///////////////////////////

let mj = new Audio('assets/audio/michael-jackson_07.wav');
const playerDiv = document.querySelector('#player-bar');
const endGameDiv = document.querySelector('div.endgame');
const leaderBoardUl = document.querySelector('ol.leaderboard');
const mainMenu = document.querySelector('.menu');
var playerLives = 3;

////////////////////////// FULL GAME ///////////////////////////

function startGame(){
  //....... Game Settings .......//
    var config = {
    type: Phaser.AUTO,
    width: 1350,
    height: 700,
    physics: {
        default: 'arcade',
        arcade: {
          // remove later
            debug: true
        }
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
  var topPlatforms;
  var bottomPlatforms;
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
  }

  //....... Create .......//
  function create() {
    topPlatforms = this.physics.add.group({
            key: 'platform',
            frameQuantity: 30,
            setXY: { x: 350, y: 600, stepX: 800},
            velocityX: -250,
            immovable: true,
        });

    bottomPlatforms = this.physics.add.group({
              key: 'platform',
              frameQuantity: 30,
              setXY: { x: 350, y: 650, stepX: 800},
              velocityX: -50,
              immovable: true,
          });
    // platforms.getChildren()[0].setFrictionX(1);
    // platforms.getChildren()[1].setFrictionX(0.5);
    // platforms.getChildren()[2].setFrictionX(0);

    // platforms = this.physics.add.group();
    // platforms.create(100, 715, 'platform')
    // platforms.create(356, 715, 'platform-end')
    // // platforms.create(900, 715, 'platform')
    //
    // platforms.children.entries.forEach(platform => platform.setCollideWorldBounds(true) )
    // // platforms.setCollideWorldBounds(true)

    // Creates player and enables physics so player will fall
    player = this.physics.add.sprite(350, 250, 'tom', 'run001.png')
    // When player falls and lands on screen end, adds a bounce
    player.setBounce(0.1);

    // Adds the heaviness to the player, the higher the amount, the more it weighs and falls quicker
    // When physics sprite is created, it is given a body property to set gravity on
    player.body.setGravityY(400);
    // Prevents player from passing through a platform
    this.physics.add.collider(player, topPlatforms);
    this.physics.add.collider(player, bottomPlatforms);

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

        player.setVelocityY(-350);
        playerJumps ++;
        player.play('jump')
        mj.play();
      }
    }
    // click listener for jump()
    document.addEventListener('click', () => {
      if (!gameOver) {
        jump();
      }
    })
  }

  //....... Update .......//
  function update() {
    // updates timer
    playerDiv.querySelector('#time').innerHTML = `${newTimer} second(s)`;

    // TRUE: restarts scene as long as player has lives
    // FALSE: adds score and persists to database; gameover screen displayed
    if (player.body.y > this.game.config.height && playerLives > 0) {
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
    debugger;
    playerLives = 3;
    endGameDiv.style.height = "0%";
    playerDiv.innerHTML += `
      <img id="life-1" src="assets/lifecounter.gif">
      <img id="life-2" src="assets/lifecounter.gif">
      <img id="life-3" src="assets/lifecounter.gif">`
    startGame();
  }
})
