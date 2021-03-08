const express = require('express');
const cors = require('cors');
const client = require('./client.js');
const app = express();
const morgan = require('morgan');
const ensureAuth = require('./auth/ensure-auth');
const createAuthRoutes = require('./auth/create-auth-routes');
const request = require('superagent');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan('dev')); 

const authRoutes = createAuthRoutes();

app.use('/auth', authRoutes);

app.use('/api', ensureAuth);

app.get('/api/test', (req, res) => {
  res.json({
    message: `in this protected route, we get the user's id like so: ${req.userId}`
  });
});


app.get('/events', async(req, res) => {
  try {
    const eventsList = await request.get('https://api.yelp.com/v3/events')
      .set('Authorization', `Bearer ${process.env.YELP_API}`)
      .set('Accept', 'application/json');
    res.json(eventsList.body);
  } catch(e) {
    
    res.status(500).json({ error: e.message });
  }
});

app.get('/api/favorites', async(req, res) => {
  try {
    const data = await client.query('SELECT * from favorites WHERE owner_id=$1', [req.userId]);
    
    res.json(data.rows);
  } catch(e) {
    
    res.status(500).json({ error: e.message });
  }
});

app.post('/api/favorites', async (req, res) => {
  try{
    const newFav = await client.query(`
    INSERT INTO favorites(
      name, 
      category, 
      attending_count, 
      cost, 
      description, 
      event_site_url, 
      image_url, 
      is_canceled, 
      tickets_url, 
      time_end, 
      time_start, 
      city, 
      zip_code, 
      state,
      display_address, 
      owner_id)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
    RETURNING *;
`, [
      req.body.name, 
      req.body.category, 
      req.body.attending_count, 
      req.body.cost, 
      req.body.description, 
      req.body.event_site_url, 
      req.body.image_url, 
      req.body.is_canceled, 
      req.body.tickets_url, 
      req.body.time_end, 
      req.body.time_start, 
      req.body.location.city,
      req.body.location.zip_code,
      req.body.location.state,
      req.body.location.display_address, 
      req.userId
    ]);
    res.json(newFav.rows);
  } catch(e) {
    res.status(500).json({ error: e.message });
  }
});

app.delete('/api/favorites/:id', async(req, res) => {
  try {
    const data = await client.query(
      'DELETE from favorites WHERE owner_id=$1 and id=$2 RETURNING *',
      [req.userId, req.params.id],
    );
    
    res.json(data.rows);
  } catch(e) {
    
    res.status(500).json({ error: e.message });
  }
});

app.use(require('./middleware/error'));

module.exports = app;
