const express = require('express');
const fileSystem = require('fs');
const filePath = require('path');

const app = express();
const PORT = 3001;

app.use(express.static('./public'));
app.use(express.json());

app.get('/', (req, res) =>
  res.sendFile(filePath.join(__dirname, '/public/index.html'))
);

app.get('/notes', (req, res) => {
    res.sendFile(filePath.join(__dirname, '/public/notes.html'))   
});

app.post('/api/notes', (req, res) => {
    
    
});


// fileSystem.readFile('./db/db.json', 'utf8', (err, data) => {
//     if (err) {
//       console.error(err);
//     } else {
//       // Convert string into JSON object
//       const parsedReviews = JSON.parse(data);

//       // Add a new review
//       parsedReviews.push(newReview);
//       reviews = parsedReviews;
//       // Write updated reviews back to the file
//       //Note: The second and third arguments provided by the JSON.stringify() 
//       //method are optional arguments that help with formatting. 
//       //The first is a replacer() function, which we set to null, 
//       //and the third is the space argument that adds indentation, whitespace, 
//       //and line break characters to make it easier to read.
//       fs.writeFile(
//         './db/db.json',
//         JSON.stringify(parsedReviews, null, 4),
//         (writeErr) =>
//           writeErr
//             ? console.error(writeErr)
//             : console.info('Successfully updated reviews!')
//       );
//     }
//   });

  app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
);
