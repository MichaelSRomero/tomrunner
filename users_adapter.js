class UsersAdapter {

  static loadLeaderBoardData() {
    return fetch('http://localhost:3000/users')
      .then(response => response.json())
  }

}
