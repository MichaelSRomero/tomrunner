class UsersAdapter {

  static loadLeaderBoardData() {
    return fetch('http://localhost:3000/users')
      .then(response => response.json())
  }
  
  static getAllUsers() {
    return fetch('http://localhost:3000/users', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      }).then( r => r.json() )
  }

  static createUser(name) {
    return fetch('http://localhost:3000/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({name: name})
      }).then( r => r.json() )
    }


    static newScore(user, score) {
      return fetch(`http://localhost:3000/users/${user.id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({user: user, score: score})
        }).then( r => r.json() )
      }








}
    ////////////////////////////
