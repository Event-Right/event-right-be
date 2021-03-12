# Fave Dogs (Back End) v1.0.0

## Meet The Team

* [Tyler Farris](https://www.linkedin.com/in/tyler-p-farris/)
* [Eion Nelson](https://www.linkedin.com/in/eionnelson/)
* [Minh Ngo](https://www.linkedin.com/in/minhnngo/)
* [Edmond Zhan](https://www.linkedin.com/in/edmondzhan/)

---
### Our Vision

Our goal for this app was to solve a problem nobody even knew they had: the ability to find businesses that sells hot dogs. When looking up food joints, it can be very overwhelming due to the amount of food places available. This project helps solve this issue by giving the user the ability to look up businesses that specifically sells hot dogs to find the right hot dog for them!

---
### Description

Our app aims to provide the user the ability to look up their favorite hot dog businesses. They'll have the option to look up by location as well as sort by various different categories to get the most satisfying results! Afterwards, they can add it to their favorites so they'll be able to see all of their favorite locations in one spot.

---
### It Just Works

You simply need to just go to the netlify site and you're good to go!

---

### Libraries

  * `npm i`
  * `react`
  * `react-router-dom`

---
### API Endpoint Example

```
app.get('/dogs/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const businessList = await request
      .get(`https://api.yelp.com/v3/businesses/${id}`)
      .set('Authorization', `Bearer ${process.env.YELP_API}`)
      .set('Accept', 'application/json');
    res.json(businessList.body);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});
```
returns 
```
{
    'id': 'rCS4w1A24k33FFTzZ52Vog',
    'alias': 'oh-k-dog-new-york',
    'name': 'Oh K-Dog',
    'image_url': 'https://s3-media2.fl.yelpcdn.com/bphoto/
    ...
    ...
    ...
    },
    'phone': '+16464484836',
    'display_phone': '(646) 448-4836',
    'distance': 671.1416782812253
  }
```