const express = require('express');
const fileSystem = require('fs');
const filePath = require('path');
let notesDB = require('./db/notesDB.json');

const app = express();
const PORT = process.env.PORT || 4200;

app.use(express.json());
app.use(express.static('./public'));

// Homepage link
app.get('/', (req, res) => {
	res.sendFile(filePath.join(__dirname, '/public/index.html'));
});

// Default notes page
app.get('/notes', (req, res) => {
	res.sendFile(filePath.join(__dirname, '/public/notes.html'));
});

// Generates all notes that are currently available
app.get('/api/notes', (req, res) => {
	fileSystem.readFile('./db/notesDB.json', 'utf8', (error, notes) => {
		 error ? console.error(error) : res.json(JSON.parse(notes));
	});
});

// Deletes a note by its ID
app.delete('/api/notes/:id', (req, res) => {
	const noteId = req.params.id;
	fileSystem.readFile('./db/notesDB.json', 'utf8', (error, notesObj) => {
		if (error) {
			console.error(error);
		} else {
			let notes = JSON.parse(notesObj);
			notes.forEach((note, index) => {
				if (note.id === noteId) {
					notes.splice(index, 1);
					notesDB = notes;
					fileSystem.writeFile(
						'./db/notesDB.json',
						JSON.stringify(notes, null, '\t'),
						error => error ? console.error(error) : console.log('')					
					);
					res.json(notesDB);
				}
			});
		}
	});
});

// Creates a new note and adds it to the list of notes
app.post('/api/notes', (req, res) => {
	const { title, text } = req.body;
	if (title && text) {
		const newNote = {
			title,
			text,
			id: Math.floor(Math.random() * 0x10000 + 1)
				.toString(16)
				.substring(1),
		};
		fileSystem.readFile('./db/notesDB.json', 'utf8', (error, notes) => {
			if (error) {
				console.error(error);
			} else {
				let parsedNotes = JSON.parse(notes);
				parsedNotes.push(newNote);
				notesDB = parsedNotes;
				fileSystem.writeFile(
					'./db/notesDB.json',
					JSON.stringify(parsedNotes, null, '\t'),
					error =>  error ? console.error(error) : console.log('')	
				);
				res.json(JSON.parse(notes));
			}
		});
	}
});

// Creates an listen on the server that will respond to request
app.listen(PORT, () => {
	console.log(`App listening at http://localhost:${PORT} 🚀`);
});
