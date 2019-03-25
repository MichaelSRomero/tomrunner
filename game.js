var config = {
  type: Phaser.AUTO,
  width: 1350,
  height: 700,
  physics: {
      default: 'arcade',
<<<<<<< HEAD
      arcade: {
          debug: true
          // gravity: { y: 200 }
      }
=======
      // arcade: {
      //      gravity: { y: 200 }
      // }
>>>>>>> mazen
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
let player;
var platforms;

function preload() {
  // PARAMETERS: (key, filePath, OPTIONAL -> configObject)
  // width: 85 || height: 100     ||OLD CODE||
  // this.load.spritesheet('tom', 'assets/tom-spritesheet.png', {frameWidth: 85, frameHeight: 130}) ||OLD CODE||
  this.load.atlas('tom', 'assets/player.png', 'assets/player.json')
  this.load.image('platform', 'assets/platform.png')
  this.load.image('platform-end', 'assets/platform-end.png')
}

function create() {

<<<<<<< HEAD
  // const platforms = this.physics.add.staticGroup();
  const platforms = this.physics.add.group();

=======
>>>>>>> mazen

  /* Creates a platform at x & y position
  PARAMETERS: (x-position, y-position, key)
  **  x-position:     the lower, the more to the left; higher is more to the right
  **  y-position:     the lower, the more up it goes; higher moves it down
  */

  platforms = this.physics.add.group({
          key: 'platform',
          frameQuantity: 100,
          setXY: { x: 350, y: 500, stepX: 100},
          velocityX: -60,
          immovable: true,

      });
;

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
<<<<<<< HEAD
  player.setBounce(0.2);

=======
  // player.setBounce(0.2);
>>>>>>> mazen
  // Prevents the player from falling through the screen

  // player.set(200,200)

  // Adds the heaviness to the player, the higher the amount, the more it weighs and falls quicker
  // When physics sprite is created, it is given a body property to set gravity on
  player.body.setGravityY(200);
  // Prevents player from passing through a platform
  this.physics.add.collider(player, platforms);

  // let arr = platforms.children.entries;
  // arr.forEach(platform => platform.x += 300)


  /* Creates animation passing in an Object as an argument
  **   key:           a Key Name that describes the animation
  **   repeat:        number of times you want the animation to run (set to -1 for infinite loop)
  **   frames:        call 'this.anims.generateFrameNames()' & pass in the key of the sprite from preload()
                      along with an Object indicating the start and end frames
  **   frameRate:     specifies the speed that the frames should run
  */
//   this.anims.create({
//     key: 'left',
//     frames: this.anims.generateFrameNumbers('tom', { start: 0, end: 3 }),
//     frameRate: 10,
//     repeat: -1
// });
//
// this.anims.create({
//     key: 'turn',
//     frames: [ { key: 'tom', frame: 4 } ],
//     frameRate: 20
// });
//
// this.anims.create({
//     key: 'right',
//     frames: this.anims.generateFrameNumbers('tom', { start: 5, end: 8 }),
//     frameRate: 10,
//     repeat: -1
// });


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
<<<<<<< HEAD
    frameRate: 1
=======
    frameRate: 2
>>>>>>> mazen
  })

  // Call play() passing in the animation key previously created to play the animation
  // player.play('run'); ||OLD CODE||
<<<<<<< HEAD
=======

  // else if (cursors.right.isDown)
  // {
  //     player.setVelocityX(160);
  //
  //     player.anims.play('right', true);
  // }
  // else
  // {
  //     player.setVelocityX(0);
  //
  //     player.anims.play('turn');
  // }
  //
  // if (cursors.up.isDown && player.body.touching.down)
  // {
  //     player.setVelocityY(-330);
  // }





>>>>>>> mazen
  cursors = this.input.keyboard.createCursorKeys();
}

function update() {
  // if (cursors.up.isDown && player.body.touching.down) {
  //   player.play('jump')
  //   player.setVelocityY(-330);
  // } else {
  //   player.play('run', true)
  // }

  if (this.game.input.activePointer.isDown && player.body.touching.down) {
    player.play('jump')
<<<<<<< HEAD
    player.setVelocityY(-330);
    player.setVelocityX(50);

  } else if (player.body.touching.down) {
    player.play('run', true)
=======
    player.setVelocityY(-200);
  } else if (player.body.touching.down) {
    player.play('run', true);
    player.setVelocityX(30);
>>>>>>> mazen
  }
}
