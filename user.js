class User {
  constructor({id, name, games}) {
    this.id = id;
    this.name = name;
    this.games = games;

    User.all.push(this)
  }

  getScores() {
    return this.games.map(game => game.score);
  }

}

User.all = [];
