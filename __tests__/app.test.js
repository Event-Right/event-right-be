require('dotenv').config();

const { execSync } = require('child_process');

const fakeRequest = require('supertest');
const app = require('../lib/app');
const client = require('../lib/client');

describe('app routes', () => {
  describe('routes', () => {
    let token;
  
    beforeAll(async done => {
      execSync('npm run setup-db');
  
      client.connect();
  
      const signInData = await fakeRequest(app)
        .post('/auth/signup')
        .send({
          email: 'jon@user.com',
          password: '1234',
          name: 'Jon'
        });
      
      token = signInData.body.token; // eslint-disable-line
  
      return done();
    });
  
    afterAll(done => {
      return client.end(done);
    });

    test('returns hot dog establishments', async() => {

      const expectation = {
        'id': '_k3mpu4Id9DcRRPHI62rdw',
        'alias': 'kemuri-authentic-japanese-style-hot-dogs-beaverton-3',
        'name': 'Kemuri - Authentic Japanese Style Hot Dogs',
        'image_url': 'https://s3-media3.fl.yelpcdn.com/bphoto/e2re5J4B975l-t1L7kFapA/o.jpg',
        'is_closed': false,
        'url': 'https://www.yelp.com/biz/kemuri-authentic-japanese-style-hot-dogs-beaverton-3?adjust_creative=VlwxeBD8K9KAQQhu1J_aVg&utm_campaign=yelp_api_v3&utm_medium=api_v3_business_search&utm_source=VlwxeBD8K9KAQQhu1J_aVg',
        'review_count': 7,
        'categories': [
          {
            'alias': 'hotdog',
            'title': 'Hot Dogs'
          },
          {
            'alias': 'tradamerican',
            'title': 'American (Traditional)'
          }
        ],
        'rating': 4.5,
        'coordinates': {
          'latitude': 45.48653,
          'longitude': -122.8059
        },
        'transactions': expect.arrayContaining([
          'delivery'
        ]),
        'location': {
          'address1': '12577 SW 1st St',
          'address2': '',
          'address3': null,
          'city': 'Beaverton',
          'zip_code': '97005',
          'country': 'US',
          'state': 'OR',
          'display_address': [
            '12577 SW 1st St',
            'Beaverton, OR 97005'
          ]
        },
        'phone': '+15033360027',
        'display_phone': '(503) 336-0027',
        'distance': 12268.720229468889
      };
    
      const data = await fakeRequest(app)
        .get('/dogs')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(data.body[0]).toEqual(expectation);
    });

    test('returns a single hot dog establishment by id', async() => {

      const expectation = {
        'id': 'F5LolHgB5Yznr1j0xhudbQ',
        'alias': 'hot-dog-energy-portland',
        'name': 'Hot Dog Energy',
        'image_url': 'https://s3-media4.fl.yelpcdn.com/bphoto/9v4VxjJFgLI8WeW2Ril8Ww/o.jpg',
        'is_claimed': true,
        'is_closed': false,
        'url': 'https://www.yelp.com/biz/hot-dog-energy-portland?adjust_creative=VlwxeBD8K9KAQQhu1J_aVg&utm_campaign=yelp_api_v3&utm_medium=api_v3_business_lookup&utm_source=VlwxeBD8K9KAQQhu1J_aVg',
        'phone': '+19712795338',
        'display_phone': '(971) 279-5338',
        'review_count': 12,
        'categories': [
          {
            'alias': 'hotdog',
            'title': 'Hot Dogs'
          }
        ],
        'rating': 4.5,
        'location': {
          'address1': '8408 N Lombard St',
          'address2': null,
          'address3': '',
          'city': 'Portland',
          'zip_code': '97203',
          'country': 'US',
          'state': 'OR',
          'display_address': [
            '8408 N Lombard St',
            'Portland, OR 97203'
          ],
          'cross_streets': ''
        },
        'coordinates': {
          'latitude': 45.5895,
          'longitude': -122.75337
        },
        'photos': [
          'https://s3-media4.fl.yelpcdn.com/bphoto/9v4VxjJFgLI8WeW2Ril8Ww/o.jpg'
        ],
        'hours': [
          {
            'open': [
              {
                'is_overnight': false,
                'start': '1200',
                'end': '1800',
                'day': 0
              },
              {
                'is_overnight': false,
                'start': '1200',
                'end': '1800',
                'day': 1
              },
              {
                'is_overnight': false,
                'start': '1200',
                'end': '1800',
                'day': 2
              },
              {
                'is_overnight': false,
                'start': '1200',
                'end': '1800',
                'day': 3
              },
              {
                'is_overnight': false,
                'start': '1200',
                'end': '1800',
                'day': 4
              },
              {
                'is_overnight': false,
                'start': '1200',
                'end': '1800',
                'day': 5
              },
              {
                'is_overnight': false,
                'start': '1200',
                'end': '1800',
                'day': 6
              }
            ],
            'hours_type': 'REGULAR',
            'is_open_now': false,
          }
        ],
        'transactions': expect.arrayContaining([
          'pickup',
          'delivery',
        ]),
        'messaging': {
          'url': 'https://www.yelp.com/raq/F5LolHgB5Yznr1j0xhudbQ?adjust_creative=VlwxeBD8K9KAQQhu1J_aVg&utm_campaign=yelp_api_v3&utm_medium=api_v3_business_lookup&utm_source=VlwxeBD8K9KAQQhu1J_aVg#popup%3Araq',
          'use_case_text': 'Message the Business'
        }
      };

      const data = await fakeRequest(app)
        .get('/dogs/F5LolHgB5Yznr1j0xhudbQ')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(data.body).toEqual(expectation);
    });

    test('adds favorite hot dog establishments', async() => {

      const NewDog = { 
        name: 'Danger Dogs', 
        categories: 'Delicaious',
        review_count: 1000, 
        price: '$', 
        transactions: 'delivery',
        url: 'website.com', 
        image_url: 'website.com', 
        is_closed: false,
        rating: '5',
        distance: '0.987', 
        display_address:'somewhere out there', 
        display_phone: '(503)-555-5555',
        city: 'Portlandia',
        zip_code: '97223',
        state:'OR',
        business_id: 'a7zlhd2',  
      };
      const expectedDog = {
        ...NewDog,
        id: 4,
        owner_id: 2
      };

      const data = await fakeRequest(app)
        .post('/api/favorites')
        .set('Authorization', token)
        .send(NewDog)
        .expect('Content-Type', /json/);
        

      expect(data.body[0]).toEqual(expectedDog);
    });
    test('returns favorite hot dog establishments', async() => {

      const expectation = [{ 
        name: 'Danger Dogs',
        owner_id: 2, 
        categories: 'Delicaious',
        review_count: 1000, 
        price: '$', 
        transactions: 'delivery',
        url: 'website.com', 
        image_url: 'website.com', 
        is_closed: false,
        rating: '5',
        distance: '0.987',
        id: 4, 
        display_address:'somewhere out there', 
        display_phone: '(503)-555-5555',
        city: 'Portlandia',
        zip_code: '97223',
        state:'OR',
        business_id: 'a7zlhd2',  
      }];

      const data = await fakeRequest(app)
        .get('/api/favorites')
        .set('Authorization', token)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(data.body).toEqual(expectation);
    });
    test('deletes a favorite', async() => {

      const expectation = [{ 
        name: 'Danger Dogs',
        owner_id: 2, 
        categories: 'Delicaious',
        review_count: 1000, 
        price: '$', 
        transactions: 'delivery',
        url: 'website.com', 
        image_url: 'website.com', 
        is_closed: false,
        rating: '5',
        distance: '0.987',
        id: 4, 
        display_address:'somewhere out there', 
        display_phone: '(503)-555-5555',
        city: 'Portlandia',
        zip_code: '97223',
        state:'OR',
        business_id: 'a7zlhd2',  
      }];
        

      const data = await fakeRequest(app)
        .delete('/api/favorites/4')
        .set('Authorization', token)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(data.body).toEqual(expectation);
    });



  });
});
