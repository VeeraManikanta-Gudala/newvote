const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

const contestantsFilePath = path.join(__dirname, 'contestants.json');

// Function to read contestants from the JSON file
function readContestants() {
  const data = fs.readFileSync(contestantsFilePath, 'utf-8');
  return JSON.parse(data);
}

// Function to write contestants to the JSON file
function writeContestants(contestants) {
  fs.writeFileSync(contestantsFilePath, JSON.stringify(contestants, null, 2));
}

let contestants = readContestants();

// Get all contestants
app.get('/contestants', (req, res) => {
  res.json(contestants);
});

// Cast a vote
app.post('/vote', (req, res) => {
  const { id } = req.body;
  const contestant = contestants.find((c) => c.id === id);
  if (contestant) {
    contestant.votes += 1;
    writeContestants(contestants);  // Save updated votes to JSON file
    res.status(200).json({ message: 'Vote counted successfully!' });
  } else {
    res.status(404).json({ message: 'Contestant not found' });
  }
});

// Reset votes (optional for debugging)
app.post('/reset', (req, res) => {
  contestants = contestants.map((c) => ({ ...c, votes: 0 }));
  writeContestants(contestants);  // Save reset votes to JSON file
  res.status(200).json({ message: 'Votes reset successfully!' });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Backend is running on http://localhost:${PORT}`);
});
