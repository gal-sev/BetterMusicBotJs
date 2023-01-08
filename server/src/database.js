import path from 'path';
import sqlite3 from 'sqlite3';

const dbPath = path.join(process.cwd(), './playlists.db');
/* TODO: check against Sql ingection & xss */

// Open the DB
const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE, (err) => {
	if (err) return console.error(err.message);
});

// Create Playlists Table
export function createBaseTables() {
	const createMainPlaylistsTable = `CREATE TABLE IF NOT EXISTS playlists( 
		id INTEGER PRIMARY KEY AUTOINCREMENT, 
		title TEXT NOT NULL
		)`;
	const createSongsTable = `CREATE TABLE IF NOT EXISTS songs( 
		id INTEGER PRIMARY KEY AUTOINCREMENT, 
		title TEXT NOT NULL,
		length TEXT NOT NULL
		)`;
	const createPlayListsSongs = `CREATE TABLE IF NOT EXISTS playlistsSongs( 
		id INTEGER PRIMARY KEY AUTOINCREMENT, 
		playlistID INTEGER NOT NULL, 
		FOREIGN KEY (playlistID) REFERENCES playlists (id),
		songID INTEGER NOT NULL,
		FOREIGN KEY (songID) REFERENCES songs (id)
		)`;
	db.serialize(() => {
		db.run(createMainPlaylistsTable);
		db.run(createSongsTable);
		db.run(createPlayListsSongs);
	});
}

// Create A new Playlists
export function createPlaylist(playlistTitle) {
	const insertNewPlaylist = `INSERT INTO playlists(title)
		VALUES (?)`;
	db.run(insertNewPlaylist,
		[playlistTitle],
		(err) => {
			if (err) return console.error(err.message);
		}
	);
}

// Insert song to playlist
export async function insertSong(title, length, playlistID) {
	const insertToSongs = `INSERT INTO songs(title, length)
		VALUES (?, ?)`;
	const insertToPlaylistsSongs = `INSERT INTO playlistsSongs(playlistID, songID)
		VALUES (?, ?)`;
	let songID = await getSongRow(title);
	if (songID !== undefined) {
		// Song already exists in songs, insert only to playlistSongs
		db.run(insertToPlaylistsSongs,
			[playlistID, songID],
			(err) => {
				if (err) return console.error(err.message);
			}
		);
	} else {
		// Song doesn't exist, insert it to songs and playlistSongs
		db.run(insertToSongs,
			[title, length],
			(err) => {
				if (err)  {
					return console.error(err.message);
				} else {
					db.run(insertToPlaylistsSongs,
						[playlistID, this.lastID],
						(err) => {
							if (err) return console.error(err.message);
						}
					);
				}
			}
		);

	}
}

// Get song row from songs table
export function getSongRow(title) {
	return new Promise((resolve, reject) => {
		const songRow = `SELECT 1 FROM songs WHERE title = ?`;
		db.all(songRow, [title], (err, songRow) => {
			if (err) {
				reject({message: err.message});
			}
			resolve(songRow);
		});
	});
}

// Get the data from the table
export function getTableData(url) {
	return new Promise((resolve, reject) => {
		const getRows = `SELECT * FROM playlists WHERE url = ?`;
		db.all(getRows, [url], (err, rows) => {
			if (err) {
				reject({message: err.message});
			}
			resolve(rows);
		});
	});
}

// Remove the table
export function dropTable(tableName) {
	db.run(`DROP TABLE ${tableName}`, (err) => {
		if (err) return console.error(err.message);
	});
}

// Clear the data from the table
//TODO: probably wont use later, remember to delete
export function clearTableData() {
	const clearTableData = `DELETE FROM playlists`;
	db.run(clearTableData, (err) => {
		if (err) return console.error(err.message);
	});
}



