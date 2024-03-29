import sqlite3 from 'sqlite3';

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

  async getLobbyByRowid(rowid){
    const rows = await this.query(`SELECT rowid, * FROM lobby WHERE rowid = ?`, [rowid]);
    console.log(rows);
    return rows;
  }

  async getLobbyOpenned() {
    const rows = await this.query('SELECT rowid, * FROM lobby where state not in (2,3) order by rowid desc');
    return rows;
  }

  async getLobbyInProgress(rowid) {
    const rows = await this.query('SELECT * FROM lobby WHERE rowid = ? AND state = 2', [rowid]);
    return rows;
  }

  async getLobbyInProgressOrOpenned(rowid) {
    const rows = await this.query('SELECT * FROM lobby WHERE rowid = ? AND state in (1,2)', [rowid]);
    return rows;
  }
  
  async uptateWinner(winner, rowid) {
    await this.run('UPDATE lobby SET winner = ? WHERE rowid = ?', [winner, rowid]);
  }

  async deleteLobby(rowid) {
    await this.run('DELETE FROM lobby WHERE rowid = ? AND state in (1)', [rowid]);
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
  
  async updateStateToInProgress(values) {
    let rowid = values[0].rowid;
    let state = 2; // in_progress
    
    await this.run(`UPDATE lobby SET state = ? where rowid = ?`, [state, rowid]);
  }
  
  async updateStateToClosed(rowid) {
    let state = 3; // in_progress
    
    await this.run(`UPDATE lobby SET state = ? where rowid = ?`, [state, rowid]);
  }

  async removePlayer(values, newplayer) {
    let rowid = values[0].rowid;
    let existingPlayers = values[0].players; // Existing players
    let parsedPlayers = JSON.parse(existingPlayers); // Parse the existing players into a JavaScript array
    var index = parsedPlayers.indexOf(newplayer);
    if (index !== -1) {
        parsedPlayers.splice(index, 1);
    }
    let newPlayers = JSON.stringify(parsedPlayers); // Encode the modified array back into a JSON string
    
    await this.run(`UPDATE lobby SET players = ? where rowid = ?`, [newPlayers, rowid]);
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

export default Lobby;
