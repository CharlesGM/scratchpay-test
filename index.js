// Bring in the express server and create application
let express = require('express');
let busboy = require('connect-busboy'); //middleware for form/file upload
let app = express();
let fs = require('fs');
let multer = require('multer');
let upload = multer({ dest: 'tmp/csv/' });
let scratchRepo = require('./repos/scratchRepo');
// Use the express Router object
let router = express.Router();

app.use(express.json());
app.use(busboy());

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

//router.post('/upload', upload.single('file'), function (req, res) {
app.post('/users', upload.single('file'), function (req, res) {
            const CSVToJSON = require('csvtojson');
            // convert users.csv file to JSON array
            CSVToJSON().fromFile(req.file.path)
                .then(users => {
                  console.log(users);
                    try {
                      fs.writeFileSync('./assets/data.json', JSON.stringify(users));
                      fs.unlinkSync(req.file.path);
                      // file written successfully
                    } catch (err) {
                      console.error(err);
                    }
                }).catch(err => {
                    // log error if any
                    console.log(err);
                });
              });

// Configure router so all routes are prefixed with /users/v1
app.use('/users', router);

// Create server to listen on port 11000
var server = app.listen(11000, function () {
  console.log('Node server is running on http://localhost:11000..');
});

