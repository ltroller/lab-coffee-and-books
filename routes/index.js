const express = require('express');
const router  = express.Router();
const Place = require('../models/places');

/* GET home page */
router.get('/', (req, res, next) => {
  Place.find()
  .then(places => {
    let data = {
      addSuccess: req.query.add_success == 1 ? true : false,
      addError: req.query.add_success == 0 ? true : false,
      places: places
  
    }
    // console.log(places);
    res.render('index', data);
  })
  .catch(err => {
    console.log(err);
  });

});

router.get('/api', (req, res, next) => {
  Place.find({}, {name: 1, description: 1, place_type: 1, location: 1})
  .then(places => {
    res.json(places);
  })
  .catch(err => {
    console.log(err);
  });
});

router.get('/add-place', (req, res, next) => {
  res.render('add-place');
})

router.post('/add-place', (req, res, next) => {

  let location = {
    type: 'Point',
    coordinates: [req.body.longitude, req.body.latitude]
  }

  let thePlace = new Place({
    name: req.body.name,
    description: req.body.description,
    address: req.body.address,
    place_type: req.body.type,
    location: location
  });

  console.log(thePlace);

  thePlace.save((err) => {
    if (err) {
      console.log(err);
      // res.redirect("/?add_success=0");
    } else {
      res.redirect("/?add_success=1");
    }
  });
})

module.exports = router;
