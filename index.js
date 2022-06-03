// Bring in the express server and create application
let express = require('express');
let app = express();
let scratchRepo = require('./repos/scratchRepo');
// Use the express Router object
let router = express.Router();

app.use(express.json());


// Create GET to return a list of all scratchs
router.get('/', function (req, res, next) {
    scratchRepo.get(function (data) {
      res.status(200).json({
        "status": 200,
        "statusText": "OK",
        "message": "Successfully retrieved data.",
        "data": data
      });
    }, function (err) {
      next(err);
    });
  });

// Create GET/search?id=n&name=str to search for scratchs by 'id' and/or 'name'
router.get('/search', function (req, res, next) {
  let searchObject = {
    "id": req.query.id,
    "name": req.query.name
  };

  scratchRepo.search(searchObject, function (data) {
    res.status(200).json({
      "status": 200,
      "statusText": "OK",
      "message": "All data retrieved.",
      "data": data
    });
  }, function (err) {
    next(err);
  });
});

  // Create GET/id to return a single scratch
router.get('/:id', function (req, res, next) {
  scratchRepo.getById(req.params.id, function (data) {
    if (data) {
      res.status(200).json({
        "status": 200,
        "statusText": "OK",
        "message": "All data retrieved.",
        "data": data
      });
    }
    else {
      res.status(404).send({
        "status": 404,
        "statusText": "Not Found",
        "message": " The scratch '" + req.params.id + "' could not be found.",
        "error": {
          "code": "NOT_FOUND",
          "message": "The data '" + req.params.id + "' could not be found."
        }
      });
    }
  }, function (err) {
    next(err);
  });
});


router.post('/', function (req, res, next) {
  scratchRepo.insert(req.body, function(data) {
    res.status(201).json({
      "status": 201,
      "statusText": "Created",
      "message": "A new entry has added.",
      "data": data
    });
  }, function(err) {
    next(err);
  });
})
// Configure router so all routes are prefixed with /api/v1
app.use('/users/', router);

// Create server to listen on port 11000
var server = app.listen(11000, function () {
  console.log('Node server is running on http://localhost:11000..');
});
