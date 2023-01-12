import path from 'path';
import sqlite3 from 'sqlite3';
import { fetchYoutubeStats } from './shared/youtubeHandler.js';

const dbPath = path.join(process.cwd(), './playlists.db');
/* TODO: check against Sql ingection & xss */

// Open the DB
const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE, (err) => {
	if (err) return console.error(err.message);
});

// Create Playlists Table
export function createBaseTables() {
	const createMainPlaylistsTable = `CREATE TABLE IF NOT EXISTS playlists( 
		id INTEGER PRIMARY KEY, 
		title TEXT NOT NULL,
		UNIQUE(title)
		)`;
	const createSongsTable = `CREATE TABLE IF NOT EXISTS songs( 
		id TEXT PRIMARY KEY, 
		title TEXT NOT NULL,
		duration TEXT NOT NULL
		)`;
	const createPlayListsSongs = `CREATE TABLE IF NOT EXISTS playlistsSongs( 
		id INTEGER PRIMARY KEY AUTOINCREMENT, 
		playlistID INTEGER NOT NULL,
		songID TEXT NOT NULL,
		FOREIGN KEY (playlistID) REFERENCES playlists (id),
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
	return new Promise((resolve, reject) => {
		const insertNewPlaylist = `INSERT INTO playlists(title)
			VALUES (?)`;
		db.run(insertNewPlaylist,
			[playlistTitle],
			(err) => {
				if (err) {
					reject(err.message);
				} else {
					resolve(`Inserted playlist ${playlistTitle}`);
				}
			}
		);
	});
}

// Insert song to playlist
export async function insertSong(songID, playlistID) {
	const insertToSongs = `INSERT INTO songs(id, title, duration) 
	VALUES (?, ?, ?)`;
	const insertToPlaylistsSongs = `INSERT INTO playlistsSongs(playlistID, songID)
	VALUES (?, ?)`;
	if((await playlistExists(playlistID)).length != 0) {
		let songRow = await getSongRow(songID);
		if (songRow.length != 0) {
			// Song already exists in songs, insert only to playlistSongs
			db.run(insertToPlaylistsSongs,
				[playlistID, songID],
				(err) => {
					if (err) return console.error(err.message);
				}
			);
		} else {
			// Song doesn't exist, insert it to songs and playlistSongs
			let youtubeStats = await fetchYoutubeStats(songID);

			db.run(insertToSongs,
				[songID, youtubeStats.title, youtubeStats.duration],
				(err) => {
					if (err)  {
						return console.error(err.message);
					} else {
						db.run(insertToPlaylistsSongs,
							[playlistID, songID],
							(err) => {
								if (err) return console.error(err.message);
							}
						);
					}
				}
			);
		}
	} else {
		throw new Error("Error while adding song to playlist: the playlist doesn't exist");
	}
	return `inserted song ${songID} to playlist ${playlistID}`;
}

// Get song row from songs table
export function getSongRow(songID) {
	return new Promise((resolve, reject) => {
		const getSongRow = `SELECT 1 FROM songs WHERE id = ?`;
		db.all(getSongRow, [songID], (err, songRow) => {
			if (err) {
				reject({message: err.message});
			}
			resolve(songRow);
		});
	});
}

// Get playlist row from playlists table if it exists
export function playlistExists(playlistID) {
	return new Promise((resolve, reject) => {
		const getPlaylistRow = `SELECT 1 FROM playlists WHERE id = ?`;
		db.all(getPlaylistRow, [playlistID], (err, playlistRow) => {
			if (err) {
				reject({message: err.message});
			}
			resolve(playlistRow);
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



