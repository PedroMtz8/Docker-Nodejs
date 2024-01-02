import express from 'express';
import { createPool } from 'mysql2/promise';
import { config } from 'dotenv';
config();

const app = express();

const pool = createPool({
  host: process.env.MYSQLDB_HOST as string,
  user: process.env.MYSQLDB_USER as string,
  password: process.env.MYSQLDB__PASSWORD as string,
  port: parseInt(process.env.MYSQLDB_DOCKER_PORT as string)
})

app.get('/', (_, res) => {
  res.send('Hello World!');
});

app.get('/ping', async (_, res) => {
  try {
    const result = await pool.query('SELECT NOW()')
    res.send(result[0]);

  } catch (error) {
    res.status(500).send({ error: error, message: 'error' });
  }

});

const PORT = process.env.NODE_LOCAL_PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
  if (process.env.NODE_ENV !== 'production') {
    console.log(`http://localhost:${PORT}`);
  }
});