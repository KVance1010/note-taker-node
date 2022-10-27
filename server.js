const express = require('express');
const fileSystem = require('fs');
const filePath = require('path');
const dataBase = require('./db/db.json');
let i = 1;

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
	res.json(dataBase);
});

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
		fileSystem.readFile('./db/db.json', 'utf8', (error, notes) => {
			if (error) {
				console.error(error);
			} else {
				let parsedNotes = JSON.parse(notes);
				parsedNotes.push(newNote);
				dataBase = parsedNotes;
				fileSystem.writeFile(
					'./db/db.json',
					JSON.stringify(parsedNotes, null, '/t'),
					(error) => {
						error
							? console.error(error)
							: console.info('Successfully updated notes!');
					}
				);
			}
		});
	}
});

app.listen(PORT, () => {
	console.log(`App listening at http://localhost:${PORT} 🚀`);
});
