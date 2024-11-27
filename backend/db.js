require('dotenv').config();

const pg = require('pg');
const { Client } = pg;

const client = new Client({
  host: process.env.POSTGRES_HOST,
  port: Number(process.env.POSTGRES_PORT),
  database: process.env.POSTGRES_DBNAME,
  user: process.env.POSTGRES_USERNAME,
  password: process.env.POSTGRES_PASSWORD,
  ssl: {
    rejectUnauthorized: false
  }
});

client.connect();

const query = async (text) => {
    try {
        console.log("query to be executed:", text);
        const res = await client.query(text);
        return res;
    } catch (err) {
        console.error("Problem executing query");
        console.error(err);
        throw err;
    }
};

module.exports = { query };