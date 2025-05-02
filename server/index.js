const express = require('express');
const cors = require('cors');
const path = require('path');
const routes = require('../routes'); 

const server = express();
const PORT = process.env.PORT || 3300;

server.use(express.json());
server.use(express.urlencoded({ extended: true }));

server.use(cors({
  origin: '*', 
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

server.use('/frontend', express.static(path.join(__dirname, '../frontend')));

server.use('/api', routes); 

server.use((err, req, res, next) => {
  console.error('Error en el servidor:', err);
  res.status(500).json({ error: 'Error interno del servidor' });
});

module.exports = server;
