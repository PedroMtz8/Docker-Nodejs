import express, { Request, Response } from 'express';
import { createPool } from 'mysql2/promise';
import { config } from 'dotenv';
import { createClient } from 'redis';
config();

// const client = createClient({
//   url: 'redis://redis:6379',
// }).on('error', (err: Error) => {
//   console.error('Error connecting to Redis:', err);
// });

const client = createClient({
  password: process.env.REDIS_PASSWORD as string,
  socket: {
    host: process.env.REDIS_HOST as string,
    port: Number(process.env.REDIS_PORT) || 6379,
  }
});


(async () => { await client.connect(); })();

const app = express();

const pool = createPool({
  host: process.env.MYSQLDB_HOST as string,
  user: process.env.MYSQLDB_USER as string,
  password: process.env.MYSQLDB__PASSWORD as string,
  port: parseInt(process.env.MYSQLDB_DOCKER_PORT as string),
});

app.use(express.json());

app.get('/', (_, res) => {
  res.send('Hello World! changeee 2');

});


app.get('/ping', async (_, res) => {
  try {
    const result = await pool.query('SELECT NOW()')
    res.send(result[0]);

  } catch (error) {
    res.status(500).send({ error: error, message: 'error' });
  }

});

app.post('/set/:key', async (req: Request, res: Response) => {

  const { value } = req.body;
  try {
    console.log(value)
    await client.set(req.params.key, JSON.stringify(value));
    return res.status(200).send(value);
  } catch (error) {
    console.log(error);
    return res.status(500).send({ error: error, message: 'error' });
  }

  // Almacena el valor en Redis

});

app.get('/get/:key', async (req: Request, res: Response) => {

  // Obtiene el valor de Redis
  const value = await client.get(req.params.key);

  res.send(value);
})

app.delete('/delete/:key', async (req, res) => {

  // Elimina el valor de Redis
  const value = await client.del(req.params.key);

  res.send(value);

});

const PORT = process.env.NODE_LOCAL_PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
  if (process.env.NODE_ENV !== 'production') {
    console.log(`http://localhost:${PORT}`);
  }
});