const baseURL = "https://limitless-reaches-15090.herokuapp.com"

class UsersAdapter {

  static loadLeaderBoardData() {
    return fetch(`${baseURL}/leaderboard`)
      .then(response => response.json())
  }

  static getAllUsers() {
    return fetch(`${baseURL}/users`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      }).then( r => r.json() )
  }

  static createUser(name) {
    return fetch(`${baseURL}/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({name: name})
      }).then( r => r.json() )
    }


    static newScore(user, score) {
      return fetch(`${baseURL}/users/${user.id}`, {
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
