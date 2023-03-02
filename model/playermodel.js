const sqlite3 = require('sqlite3').verbose();

class Player {
  constructor(databasePath) {
    this.db = new sqlite3.Database(databasePath);
  }

  async getPlayers() {
    const rows = await this.query('SELECT * FROM player');
    return rows;
  }

  async getPlayerByUsertag(usertag) {
    const rows = await this.query('SELECT * FROM player WHERE usertag = ?', [usertag]);
    return rows[0];
  }

  async createPlayer(usertag, name, role1, role2, addby) {
    const result = await this.run('INSERT INTO player (usertag, name, mmr, role1, role2, wins, loses, games) VALUES (?,?,100,?,?,?,0,0,0)', [usertag, name, role1, role2, addby]);
    return result.lastID;
  }

  async updatePlayerWins(usertag) {
    await this.run('UPDATE player SET wins = wins + 1 WHERE usertag = ?', [usertag]);
  }

  async updatePlayerLoses(usertag) {
    await this.run('UPDATE player SET loses = loses + 1 WHERE usertag = ?', [usertag]);
  }

  async updatePlayerGames(usertag) {
    await this.run('UPDATE player SET games = games + 1 WHERE usertag = ?', [usertag]);
  }
  
  async updatePlayerMmrWin(usertag) {
    await this.run('UPDATE player SET mmr = mmr + 10 WHERE usertag = ?', [usertag]);
  }
  
  async updatePlayerMmrLose(usertag) {
    await this.run('UPDATE player SET mmr = mmr - 10 WHERE usertag = ?', [usertag]);
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