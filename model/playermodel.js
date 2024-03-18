import sqlite3 from 'sqlite3';

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
    return rows;
  }

  async getPlayerByTopMMR() {
    const rows = await this.query('SELECT * FROM player ORDER BY mmr DESC LIMIT 10');
    return rows;
  }

  async getPlayerByBotMMR() {
    const rows = await this.query('SELECT * FROM player ORDER BY mmr LIMIT 10');
    return rows;
  }

  async getPlayerByTopWins() {
    const rows = await this.query('SELECT * FROM player ORDER BY win LIMIT 10');
    return rows;
  }

  async getPlayerByTopLoses() {
    const rows = await this.query('SELECT * FROM player ORDER BY lose LIMIT 10');
    return rows;
  }

  async getPlayersListWithIn(stringWithoutBrackets, usertag) {
    const rows = await this.query(`SELECT rowid, * FROM player WHERE usertag IN (${stringWithoutBrackets},"${usertag}")`, []);
    return rows;
  }

  async createPlayer(usertag, name, addby) {
    const result = await this.run('INSERT INTO player (usertag, name, mmr, addby, win, lose, games) VALUES (?,?,50,?,0,0,0)', [usertag, name, addby]);
    return result.lastID;
  }

  async updatePlayerWins(usertag) {
    await this.run('UPDATE player SET win = win + 1 WHERE usertag = ?', [usertag]);
  }

  async updatePlayerLoses(usertag) {
    await this.run('UPDATE player SET lose = lose + 1 WHERE usertag = ?', [usertag]);
  }

  async updatePlayerGames(usertag) {
    await this.run('UPDATE player SET games = games + 1 WHERE usertag = ?', [usertag]);
  }

  async updatePlayerMmrWin(usertag) {
    await this.run('UPDATE player SET mmr = mmr + 5 WHERE usertag = ?', [usertag]);
  }

  async updatePlayerMmrLose(usertag) {
    await this.run('UPDATE player SET mmr = mmr - 5 WHERE usertag = ?', [usertag]);
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

export default Player;
