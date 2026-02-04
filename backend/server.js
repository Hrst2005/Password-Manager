const express = require('express');
const dotenv = require('dotenv');
const { MongoClient, ObjectId } = require('mongodb');
const cors = require('cors');          
dotenv.config();

const url = process.env.MONGO_URI || 'mongodb://localhost:27017';
const client = new MongoClient(url);

const dbName = process.env.DB_NAME || 'passop';
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());             

async function start() {
  try {
    await client.connect();
    console.log('MongoDB connected to', url);

    app.get('/', async (req, res) => {
      try {
        const db = client.db(dbName);
        const collection = db.collection('documents');
        const results = await collection.find({}).toArray();
        res.json(results);
      } catch (err) {
        console.error('GET / error:', err);
        res.status(500).json({ error: 'Internal Server Error' });
      }
    });

    app.post('/', async (req, res) => {
      try {
        const db = client.db(dbName);
        const collection = db.collection('documents');
        const data = req.body;

        if (!data.site || !data.username || !data.password) {
          return res.status(400).json({ error: 'Missing required fields: site, username, password' });
        }

        const insertResult = await collection.insertOne({
          ...data,
          createdAt: new Date()
        });

        res.status(201).json({ success: true, insertedId: insertResult.insertedId });
      } catch (err) {
        console.error('POST / error:', err);
        res.status(500).json({ error: 'Internal Server Error' });
      }
    });

    app.delete('/:id', async (req, res) => {
      try {
        const id = req.params.id;

        if (!ObjectId.isValid(id)) {
          return res.status(400).json({ success: false, error: 'Invalid id' });
        }

        const db = client.db(dbName);
        const collection = db.collection('documents');
        const result = await collection.deleteOne({ _id: new ObjectId(id) });

        if (result.deletedCount === 1) {
          return res.json({ success: true, deletedCount: 1 });
        } else {
          return res.status(404).json({ success: false, error: 'Not found' });
        }
      } catch (err) {
        console.error('DELETE /:id error:', err);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
      }
    });

    app.listen(port, () =>
      console.log(`Example app listening at http://localhost:${port}`)
    );

  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
}

start();