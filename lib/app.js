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
    message: `in this protected route, we get the user's id like so: ${req.userId}`,
  });
});

app.get('/dogs', async (req, res) => {
  try {
    const location = req.query.location;
    const sort_by = req.query.sort_by;
    const businessList = await request
      .get(
        `https://api.yelp.com/v3/businesses/search?location=
        ${location}&sort_by=${sort_by}&term=hotdog`
      )
      .set('Authorization', `Bearer ${process.env.YELP_API}`)
      .set('Accept', 'application/json');
    res.json(businessList.body.businesses);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.get('/dogs/:id', async (req, res) => {
  try {
    const id = req.body.id;
    const businessList = await request
      .get(`https://api.yelp.com/v3/businesses/${id}`)
      .set('Authorization', `Bearer ${process.env.YELP_API}`)
      .set('Accept', 'application/json');
    res.json(businessList.body);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.get('/api/favorites', async (req, res) => {
  try {
    const data = await client.query(
      'SELECT * from favorites WHERE owner_id=$1',
      [req.userId]
    );

    res.json(data.rows);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.post('/api/favorites', async (req, res) => {
  try {
    const newFav = await client.query(
      `
    INSERT INTO favorites(
      name, 
      categories,
      review_count, 
      price, 
      transactions,
      url, 
      image_url, 
      is_closed,
      rating,
      distance, 
      display_address, 
      display_phone,
      city,
      zip_code,
      state,  
      owner_id)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
    RETURNING *;
`,
      [
        req.body.name,
        req.body.categories,
        req.body.review_count,
        req.body.price,
        req.body.transactions,
        req.body.url,
        req.body.image_url,
        req.body.is_closed,
        req.body.rating,
        req.body.distance,
        req.body.display_address,
        req.body.display_phone,
        req.body.city,
        req.body.zip_code,
        req.body.state,
        req.userId,
      ]
    );
    res.json(newFav.rows);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.delete('/api/favorites/:id', async (req, res) => {
  try {
    const data = await client.query(
      'DELETE from favorites WHERE owner_id=$1 and id=$2 RETURNING *',
      [req.userId, req.params.id]
    );

    res.json(data.rows);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.use(require('./middleware/error'));

module.exports = app;
