const express = require('express');
const bcrypt = require('bcrypt');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const app = express();
const port = process.env.PORT || 3001; // Changed port from 3000 to 3001

app.use(express.json());

const uri = "mongodb+srv://b022210259:Aiman_140703@cluster0.2duvje6.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});



    // Create a new game session with hashed player names
    app.post('/sessions', hashNamesMiddleware, async (req, res) => {
      const { player1Name, player2Name } = req.body;
      const session = {
        player1Name,
        player2Name,
        player1Score: 0,
        player2Score: 0,
        isActive: true,
      };
      try {
        const result = await sessionsCollection.insertOne(session);
        res.status(201).json(result.ops[0]);
      } catch (error) {
        res.status(500).json({ message: 'Failed to create session', error });
      }
    });

    // Get all sessions
    app.get('/sessions', async (req, res) => {
      try {
        const sessions = await sessionsCollection.find({}).toArray();
        res.status(200).json(sessions);
      } catch (error) {
        res.status(500).json({ message: 'Failed to retrieve sessions', error });
      }
    });

    // Get a single session by ID
    app.get('/sessions/:id', async (req, res) => {
      const { id } = req.params;
      try {
        const session = await sessionsCollection.findOne({ _id: new ObjectId(id) });
        if (!session) {
          return res.status(404).json({ message: 'Session not found' });
        }
        res.status(200).json(session);
      } catch (error) {
        res.status(500).json({ message: 'Failed to retrieve session', error });
      }
    });

    // Update a session score
    app.patch('/sessions/:id', async (req, res) => {
      const { id } = req.params;
      const { player1Score, player2Score } = req.body;
      try {
        const result = await sessionsCollection.updateOne(
          { _id: new ObjectId(id) },
          { $set: { player1Score, player2Score } }
        );
        if (result.matchedCount === 0) {
          return res.status(404).json({ message: 'Session not found' });
        }
        res.status(200).json({ message: 'Scores updated successfully' });
      } catch (error) {
        res.status(500).json({ message: 'Failed to update scores', error });
      }
    });

    // Delete a session
    app.delete('/sessions/:id', async (req, res) => {
      const { id } = req.params;
      try {
        const result = await sessionsCollection.deleteOne({ _id: new ObjectId(id) });
        if (result.deletedCount === 0) {
          return res.status(404).json({ message: 'Session not found' });
        }
        res.status(200).json({ message: 'Session deleted successfully' });
      } catch (error) {
        res.status(500).json({ message: 'Failed to delete session', error });
      }
    });

    // Root route
    app.get('/', (req, res) => {
      res.send('Hello World!');
    });

    app.listen(port, () => {
      console.log(`Example app listening on port ${port}`);
    });

  } catch (err) {
    console.error('Failed to connect to MongoDB', err);
  }
}

run().catch(console.dir);

// Example usage of bcrypt
const saltRounds = 10;
const myPlaintextPassword = 's0/\/\P4$$w0rD';
bcrypt.hash(myPlaintextPassword, saltRounds, function (err, hash) {
  // Store hash in your password DB.
  console.log('Hashed password:', hash);
});

// Example usage of mongodb
const localUri = "mongodb://localhost:27017";
const localClient = new MongoClient(localUri, { useNewUrlParser: true, useUnifiedTopology: true });

async function localRun() {
  try {
    await localClient.connect();
    const database = localClient.db('test');
    const collection = database.collection('documents');
    const doc = { name: "test", value: 1 };
    const result = await collection.insertOne(doc);
    console.log(`A document was inserted with the _id: ${result.insertedId}`);
  } finally {
    await localClient.close();
  }
}

async function run() {
    try {
      await client.connect();
      console.log('Connected successfully to MongoDB');
  
      const database = client.db("pong_game");
      const sessionsCollection = database.collection("sessions");
  
      // Middleware to hash player names
      const hashNamesMiddleware = async (req, res, next) => {
        const { player1Name, player2Name } = req.body;
        try {
          req.body.player1Name = await bcrypt.hash(player1Name, 10);
          req.body.player2Name = await bcrypt.hash(player2Name, 10);
          next();
        } catch (error) {
          res.status(500).json({ message: 'Failed to hash names', error });
        }
      };
    }
}

localRun().catch(console.dir);

