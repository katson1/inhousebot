import sqlite3 from 'sqlite3';

export function createTablePlayer() {
    const db = new sqlite3.Database('mydb.sqlite', (err) => {
        if (err) {
          console.error(err.message);
        }
        //console.log('Connected to the mydb.sqlite database.');
    });

    db.run(`
    CREATE TABLE IF NOT EXISTS player (
        usertag text PRIMARY KEY NOT NULL,
        name text NOT NULL,
        mmr int NOT NULL,
        addby text,
        win int,
        lose int,
        games int
    )`, [], err => {
        if(err) {
            console.error(err.message);
        } else {
            //console.log("Table 'player' created or already exists.");
        }
    });

    db.close((err) => {
        if (err) {
          console.error(err.message);
        }
        //console.log('Database connection closed.');
    });
}

export function createTableLobby() {
    const db = new sqlite3.Database('mydb.sqlite', (err) => {
        if (err) {
          console.error(err.message);
        }
        //console.log('Connected to the mydb.sqlite database.');
    });

    db.run(`
    CREATE TABLE IF NOT EXISTS lobby (
        players json NOT NULL,
        team1 json NOT NULL,
        team2 json NOT NULL,
        winner int,
        state int
    )`, [], err => {
        if(err) {
            console.error(err.message);
        } else {
            //console.log("Table 'lobby' created or already exists.");
        }
    });

    db.close((err) => {
        if (err) {
          console.error(err.message);
        }
        //console.log('Database connection closed.');
    });
}