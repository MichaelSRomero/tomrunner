let mj = new Audio('assets/audio/michael-jackson_07.wav');
const playerDiv = document.querySelector('#player-bar');

function startGame(){
    var config = {
    type: Phaser.AUTO,
    width: 1350,
    height: 700,
    physics: {
        default: 'arcade',
        arcade: {
            debug: true
            // gravity: { y: 200 }
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    },
    transparent: true
  };
  // Initializing the game passing in the configurations
  // var game = new Phaser.Game(800, 600, Phaser.AUTO, '', {
  //   preload: preload,
  //   create: create
  // });
  var game = new Phaser.Game(config)
  var player;
  var playerLives = 3;
  var platforms;
  var platforms2;
  var gameOver = false;
  var playGameOver;
  var newTimer = 0;

  function preload() {
    // PARAMETERS: (key, filePath, OPTIONAL -> configObject)
    // width: 85 || height: 100     ||OLD CODE||
    // this.load.spritesheet('tom', 'assets/tom-spritesheet.png', {frameWidth: 85, frameHeight: 130}) ||OLD CODE||
    this.load.atlas('tom', 'assets/player.png', 'assets/player.json')
    this.load.image('platform', 'assets/platform.png')
    this.load.image('platform-end', 'assets/platform-end.png')
    // this.load.image('death', 'assets/death.png')
  }

  function create() {
    // this.time.scene.time.now = 0;
    /* Creates a platform at x & y position
    PARAMETERS: (x-position, y-position, key)
    **  x-position:     the lower, the more to the left; higher is more to the right
    **  y-position:     the lower, the more up it goes; higher moves it down
    */
    this.add.text(30, 100, 'Tom Runner', { fontFamily: 'phosphate', fontSize: 40, color: '#40f2f5' });

    platforms = this.physics.add.group({
            key: 'platform',
            frameQuantity: 30,
            setXY: { x: 350, y: 600, stepX: 800},
            velocityX: -60,
            immovable: true,

        });

      platforms2 = this.physics.add.group({
              key: 'platform',
              frameQuantity: 30,
              setXY: { x: 350, y: 650, stepX: 800},
              velocityX: -160,
              immovable: true,

          });

      // death = this.physics.add.image(400, 700, 'death');




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

    let arr = platforms.children.entries;
    arr.forEach(platform => {
      platform.enableBody = true;
      platform.body.immovable = true;
    })

    /* Creates player and enables physics so player will fall
    PARAMETERS: (x-position, y-position, key, frame)
    **   x-position:    sets x-position on screen (horizontal)
    **   y-position:    sets y-position on screen (vertical)
    **   key:           a Key Name on to the sprite being created
    **   frame:         the beginning of the sprite to display
    */
    // const player = this.physics.add.sprite(100, 350, 'tom', 0) ||OLD CODE||
    player = this.physics.add.sprite(350, 250, 'tom', 'run001.png')
    // When player falls and lands on screen end, adds a bounce
    player.setBounce(0.1);

    // Prevents the player from falling through the screen
    // player.setCollideWorldBounds(true)

    // Adds the heaviness to the player, the higher the amount, the more it weighs and falls quicker
    // When physics sprite is created, it is given a body property to set gravity on
    player.body.setGravityY(200);
    // Prevents player from passing through a platform
    this.physics.add.collider(player, platforms);
    this.physics.add.collider(player, platforms2);



    // playGameOver = function(player, death) {
    //   player.setTint(0xff0000);
    //   alert('game over!')
    //   gameOver = true;
    // }

    // this.physics.add.collider(player, death, gameOver, null, this);


    // let arr = platforms.children.entries;
    // arr.forEach(platform => platform.x += 300)

    /* Creates animation passing in an Object as an argument
    **   key:           a Key Name that describes the animation
    **   repeat:        number of times you want the animation to run (set to -1 for infinite loop)
    **   frames:        call 'this.anims.generateFrameNames()' & pass in the key of the sprite from preload()
                        along with an Object indicating the start and end frames
    **   frameRate:     specifies the speed that the frames should run
    */
    this.anims.create({
      key: 'run',
      repeat: -1,
      // frames: this.anims.generateFrameNames('tom', {start: 1, end: 5}), ||OLD CODE||
      frames: this.anims.generateFrameNames('tom', {
        prefix: 'run',
        suffix: '.png',
        start: 2,
        end: 6,
        zeroPad: 3
      }),
      frameRate: 10
    });

    // Creates a Jump Animation
    this.anims.create({
      key: 'jump',
      repeat: 0,
      // frames: this.anims.generateFrameNames('tom', {start: 6, end: 8}), ||OLD CODE||
      frames: this.anims.generateFrameNames('tom', {
        prefix: 'jump',
        suffix: '.png',
        start: 2,
        end: 1,
        zeroPad: 3
      }),
      frameRate: 1
    })

    // Call play() passing in the animation key previously created to play the animation
    // player.play('run'); ||OLD CODE||
    cursors = this.input.keyboard.createCursorKeys();
  }
  setInterval(function(){ newTimer += 1 }, 1000);

  function update() {
    playerDiv.querySelector('#time').innerHTML = `${newTimer} second(s)`;

    if (player.body.y > this.game.config.height && playerLives > 0) {
      playerDiv.querySelector(`#life-${playerLives}`).remove();
      playerLives--
      this.scene.restart();
      newTimer = 0;
    } else if (playerLives < 1) {
      alert('GAME OVER')
      this.scene.stop()
    }

    if (this.game.input.activePointer.isDown && player.body.touching.down) {
      /// MJ soundbite ////
      mj.play();
      /// MJ soundbite ////
      player.play('jump')
      player.setVelocityY(-250);
      player.setVelocityX(50);

    } else if (player.body.touching.down) {
      player.play('run', true)
    }
  }
}
////////////////////////// MENU ///////////////////////////



let leaderboardLiTemplate = (username, score) => `
<li>${username}: ${score}</li>
`


const leaderBoardUl = document.querySelector('ul.leaderboard')



document.querySelector('#username').addEventListener('keypress', (e) => {
  if (e.which === 13) {
    e.target.parentElement.style.visibility = 'hidden';
  }
})


document.querySelector('.menu').addEventListener('click', (e) => {
  if (e.target.className === 'new-game-button') {
    e.target.parentElement.style.visibility = 'hidden';
    leaderBoardUl.style.visibility = 'hidden';
    startGame();
  } else if (e.target.className === 'leaderboard-button') {
    /// change the visibility of the leaderboard div to visible
    leaderBoardUl.style.visibility = 'visible';
    /// fetch request (leaderboard data)
    UsersAdapter.loadLeaderBoardData().then(users => {
      users.forEach(leader => {

        document.querySelector('.menu').style.visibility = 'hidden'
        leaderBoardUl.innerHTML += (leader.name + leader.games[0].score)
      })
  })
}})
