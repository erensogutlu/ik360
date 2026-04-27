const { Pool } = require('pg');
require('dotenv').config();

const havuz = new Pool({
  connectionString: process.env.VERITABANI_URL,
});

module.exports = {
  sorgu: (metin, parametreler) => havuz.query(metin, parametreler),
  icerik: havuz
};
