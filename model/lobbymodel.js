const sqlite3 = require('sqlite3').verbose();

class Lobby {
  constructor(databasePath) {
    this.db = new sqlite3.Database(databasePath);
  }

  async getLobbies() {
    const rows = await this.query('SELECT * FROM lobby');
    return rows;
  }

  async createLobby() {
    const result = await this.run('INSERT INTO lobby (players, team1, team2, winner, state) VALUES (?,?,?,?,?)', ['[]', '[]', '[]', 0, 1]);
    return result.lastID;
  }

  async getLobbyOpenned() {
    const rows = await this.query('SELECT rowid, * FROM lobby where state not in (2,3) order by rowid desc');
    return rows;
  }

  async getLobbyInProgress(rowid) {
    const rows = await this.query('SELECT * FROM lobby WHERE rowid = ? AND state = 2', [rowid]);
    return rows;
  }

  async updateTeam1(usertag) {
    await this.run('UPDATE player SET loses = loses + 1 WHERE usertag = ?', [usertag]);
  }

  async updateTeam2(usertag) {
    await this.run('UPDATE player SET games = games + 1 WHERE usertag = ?', [usertag]);
  }

  async uptateWinner(state, rowid) {
    await this.run('UPDATE player SET state = ? WHERE rowid = ?', [state, rowid]);
  }

  async uptateWinner(winner, rowid) {
    await this.run('UPDATE player SET winner = ? WHERE rowid = ?', [winner, rowid]);
  }

  async updatePlayers(values, newplayer) {
    let rowid = values[0].rowid;
    let existingPlayers = values[0].players; // Existing players
    let parsedPlayers = JSON.parse(existingPlayers); // Parse the existing players into a JavaScript array
    parsedPlayers.push(newplayer); // Add a new player to the array
    let newPlayers = JSON.stringify(parsedPlayers); // Encode the modified array back into a JSON string
    

    await this.run('UPDATE lobby SET players = ? where rowid = ?', [newPlayers, rowid]);
  }

 async updateTeams(team1, team2, lobbyid) {
    let transformedTeam1 = JSON.stringify(team1.map(team => team.usertag));
    let transformedTeam2 = JSON.stringify(team2.map(team => team.usertag));
    
    await this.run(`UPDATE lobby SET team1 = '${transformedTeam1}', team2 = '${transformedTeam2}' where rowid = ?`, [lobbyid]);
  }

  query(sql, params) {
    return new Promise((resolve, reject) => {
      this.db.all(sql, params, (error, rows) => {
        if (error) {
          reject(error);
        } else {
          resolve(rows);
        }
      });
    });
  }

  run(sql, params) {
    return new Promise((resolve, reject) => {
      this.db.run(sql, params, function (error) {
        if (error) {
          reject(error);
        } else {
          resolve(this);
        }
      });
    });
  }

  close() {
    this.db.close();
  }
}

module.exports = Lobby;