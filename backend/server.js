const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const path = require('path');
const http = require('http');
const { Server } = require('socket.io');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const fetch = require('node-fetch');

dotenv.config();

const app = express();
const server = http.createServer(app);

// ── Socket.io Real-Time Engine ──
const io = new Server(server, {
  cors: { origin: '*', methods: ['GET', 'POST'] },
});

const roomMessages = {};
const roomUsers = {};

io.on('connection', (socket) => {
  console.log(`[WS] Connected: ${socket.id}`);

  socket.on('join_room', ({ room, username }) => {
    socket.join(room);
    socket.data.room = room;
    socket.data.username = username || 'Traveler';

    if (!roomUsers[room]) roomUsers[room] = [];
    if (!roomUsers[room].find(u => u === username)) roomUsers[room].push(username);

    socket.emit('chat_history', roomMessages[room] || []);
    io.to(room).emit('user_joined', { username, onlineUsers: roomUsers[room], timestamp: new Date().toISOString() });
  });

  socket.on('send_message', ({ room, message, username, avatar }) => {
    const msg = {
      id: `msg_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      username, avatar: avatar || null, text: message,
      timestamp: new Date().toISOString(), room,
    };
    if (!roomMessages[room]) roomMessages[room] = [];
    roomMessages[room].push(msg);
    if (roomMessages[room].length > 100) roomMessages[room].shift();
    io.to(room).emit('receive_message', msg);
  });

  socket.on('typing', ({ room, username }) => socket.to(room).emit('user_typing', { username }));
  socket.on('stop_typing', ({ room, username }) => socket.to(room).emit('user_stop_typing', { username }));

  socket.on('itinerary_update', ({ room, tripId, update, updatedBy }) => {
    socket.to(room).emit('itinerary_changed', { tripId, update, updatedBy });
  });

  socket.on('disconnect', () => {
    const { room, username } = socket.data;
    if (room && roomUsers[room]) {
      roomUsers[room] = roomUsers[room].filter(u => u !== username);
      io.to(room).emit('user_left', { username, onlineUsers: roomUsers[room] });
    }
  });
});

// Swagger
const swaggerSpec = swaggerJsdoc({
  definition: {
    openapi: '3.0.0',
    info: { title: 'PlanYatri API', version: '1.0.0', description: 'PlanYatri Travel Planner API' },
    components: { securitySchemes: { bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' } } },
  },
  apis: [path.join(__dirname, './routes/*.js')],
});
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(cors({ origin: '*', credentials: true }));
app.use(express.json());
app.use(morgan('dev'));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/trips', require('./routes/tripRoutes'));
app.use('/api/upload', require('./routes/uploadRoutes'));
app.use('/api/bookings', require('./routes/bookingRoutes'));
app.use('/api/emergency', require('./routes/emergencyRoutes'));
app.use('/api/gemini', require('./routes/geminiRoutes'));

// ── Currency Proxy (open.er-api.com — free tier) ──
app.get('/api/currency/:base', async (req, res) => {
  try {
    const resp = await fetch(`https://open.er-api.com/v6/latest/${req.params.base.toUpperCase()}`);
    const data = await resp.json();
    res.json(data);
  } catch (e) {
    res.status(500).json({ error: 'Currency fetch failed', rates: {} });
  }
});

// ── Weather Proxy (Open-Meteo — completely free, no key needed) ──
app.get('/api/weather', async (req, res) => {
  try {
    const { lat = 28.6139, lon = 77.209, city = 'New Delhi' } = req.query;
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weathercode,windspeed_10m,relative_humidity_2m&daily=temperature_2m_max,temperature_2m_min,precipitation_sum&forecast_days=7&timezone=auto`;
    const resp = await fetch(url);
    const data = await resp.json();
    res.json({ city, ...data });
  } catch (e) {
    res.status(500).json({ error: 'Weather fetch failed' });
  }
});

// ── Flight Status Proxy (AviationStack free tier or mock fallback) ──
app.get('/api/flight-status', async (req, res) => {
  try {
    const { flight } = req.query;
    const key = process.env.AVIATION_API_KEY;
    if (key) {
      const resp = await fetch(`http://api.aviationstack.com/v1/flights?access_key=${key}&flight_iata=${flight}`);
      const data = await resp.json();
      if (data.data && data.data.length > 0) return res.json(data.data[0]);
    }
    // Mock fallback (for demo when no API key)
    res.json({
      flight_date: new Date().toISOString().split('T')[0],
      flight_status: ['scheduled', 'active', 'landed'][Math.floor(Math.random() * 3)],
      departure: { airport: 'Kempegowda Intl Airport', iata: 'BLR', scheduled: new Date(Date.now() + 3600000).toISOString(), estimated: new Date(Date.now() + 3700000).toISOString(), terminal: '2', gate: `G${Math.floor(10 + Math.random() * 20)}` },
      arrival: { airport: 'Chhatrapati Shivaji Intl Airport', iata: 'BOM', scheduled: new Date(Date.now() + 7200000).toISOString(), estimated: new Date(Date.now() + 7300000).toISOString(), terminal: '1', gate: `A${Math.floor(5 + Math.random() * 15)}` },
      airline: { name: 'IndiGo Airlines', iata: '6E' },
      flight: { iata: flight || '6E-501', number: (flight || '6E-501').split('-').pop() },
    });
  } catch (e) {
    res.status(500).json({ error: 'Flight lookup failed' });
  }
});

app.get('/', (req, res) => res.send('PlanYatri API + Socket.io running ✓'));

app.use((err, req, res, next) => {
  res.status(res.statusCode === 200 ? 500 : res.statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});

const PORT = process.env.PORT || 5000;

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`[PlanYatri] Port ${PORT} is already in use. Please terminate existing node process or specify a different PORT in .env`);
  } else {
    console.error('[PlanYatri] Server listener error:', err);
  }
});

server.listen(PORT, () => {
  console.log(`[PlanYatri] Server + Socket.io running on http://localhost:${PORT}`);
});
