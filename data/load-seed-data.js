const client = require('../lib/client');
// import our seed data:
const favorites = require('./favorites.js');
const usersData = require('./users.js');
const { getEmoji } = require('../lib/emoji.js');

run();

async function run() {

  try {
    await client.connect();

    const users = await Promise.all(
      usersData.map(user => {
        return client.query(`
                      INSERT INTO users (email, hash)
                      VALUES ($1, $2)
                      RETURNING *;
                  `,
        [user.email, user.hash]);
      })
    );
      
    const user = users[0].rows[0];

    await Promise.all(
      favorites.map(favorite => {
        return client.query(`
                    INSERT INTO favorites (name, category, attending_count, cost, description, event_site_url, image_url, is_canceled, tickets_url, time_end, time_start, city, zip_code, state,display_address, owner_id)
                    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16);
                `,
        [
          favorite.events[0].name, 
          favorite.events[0].category, 
          favorite.events[0].attending_count, 
          favorite.events[0].cost, 
          favorite.events[0].description, 
          favorite.events[0].event_site_url, 
          favorite.events[0].image_url, 
          favorite.events[0].is_canceled, 
          favorite.events[0].tickets_url, 
          favorite.events[0].time_end, 
          favorite.events[0].time_start, 
          favorite.events[0].location.city,
          favorite.events[0].location.zip_code,
          favorite.events[0].location.state,
          favorite.events[0].location.display_address, 
          user.id
        ]);
      })
    );
    

    console.log('seed data load complete', getEmoji(), getEmoji(), getEmoji());
  }
  catch(err) {
    console.log(err);
  }
  finally {
    client.end();
  }
    
}
