const express = require('express');
const fileSystem = require('fs');
const filePath = require('path');
let notesDB = require('./db/notesDB.json');

const app = express();
const PORT = 4200;

app.use(express.json());
app.use(express.static('./public'));

app.get('/', (req, res) => {
	res.sendFile(filePath.join(__dirname, '/public/index.html'));
});

app.get('/notes', (req, res) => {
	res.sendFile(filePath.join(__dirname, '/public/notes.html'));
});

app.get('/api/notes', (req, res) => {
	fileSystem.readFile('./db/notesDB.json', 'utf8', (error, notes) => {
		if (error) {
			console.error(error);
		} else {
			console.log('notes return' + notes);
			return res.json(JSON.parse(notes));
		}
	});
});

app.delete('/api/notes/:id', (req, res) => {
	const noteId = req.params.id;
	fileSystem.readFile('./db/notesDB.json', 'utf8', (error, notesObj) => {
		if (error) {
			console.error(error);
		} else {
			let notes = JSON.parse(notesObj);
			console.log('notes return' + notes);
			notes.forEach((note, index) => {
				console.log(index);
				if (note.id === noteId) {
					notes.splice(index, 1);
					notesDB = notes;
					fileSystem.writeFile(
						'./db/notesDB.json',
						JSON.stringify(notes, null, '\t'),
						(error) => {
							error
								? console.error(error)
								: console.info('Successfully updated notes!');
						}
					);
					res.json(notesDB);
				}
			});
		}
	});
});

app.post('/api/notes', (req, res) => {
	const { title, text } = req.body;
	if (title && text) {
		const newNote = {
			title,
			text,
			id: Math.floor(Math.random() * 0x10000 + 1)
				.toString(16)
				.substring(1)
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
					(error) => {
						error
							? console.error(error)
							: console.info('Successfully updated notes!');
					}
				);
				return res.json(JSON.parse(notes));
			}
		});
	}
});

app.listen(PORT, () => {
	console.log(`App listening at http://localhost:${PORT} 🚀`);
});
