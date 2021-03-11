const client = require('../lib/client');
// import our seed data:
const favorites = require('./favorites.js');
const usersData = require('./users.js');
const { getEmoji } = require('../lib/emoji.js');

run();

//https://hidden-fjord-82693.herokuapp.com

async function run() {

  try {
    await client.connect();

    const users = await Promise.all(
      usersData.map(user => {
        return client.query(`
                      INSERT INTO users (email, hash, name)
                      VALUES ($1, $2, $3)
                      RETURNING *;
                  `,
        [user.email, user.hash, user.name]);
      })
    );
      
    const user = users[0].rows[0];

    await Promise.all(
      favorites.map(favorite => {
        return client.query(`
                    INSERT INTO favorites (name, categories, review_count, price, transactions, url, image_url, is_closed, rating, distance, display_phone, city, zip_code, state, display_address, business_id, owner_id)
                    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17);
                `,
        [
          favorite.name, 
          favorite.categories, 
          favorite.review_count, 
          favorite.price, 
          favorite.transactions, 
          favorite.url, 
          favorite.image_url, 
          favorite.is_closed, 
          favorite.rating,
          favorite.distance, 
          favorite.display_phone,  
          favorite.location.city,
          favorite.location.zip_code,
          favorite.location.state,
          favorite.location.display_address, 
          favorite.id,
          user.id
        ]);
      })
    );
    

    console.log('seed data load complete', getEmoji(), getEmoji(), getEmoji());
  }
  catch (err) {
    console.log(err);
  }
  finally {
    client.end();
  }
    
}
