class UsersAdapter {

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


    newScore(score) {
      return fetch('http://localhost:3000/games', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({score: score})
        }).then( r => r.json() )
      }
    }
    ////////////////////////////





}
