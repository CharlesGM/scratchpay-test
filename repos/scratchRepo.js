let fs = require('fs');

const FILE_NAME = './assets/data.json';

let scratchRepo = {
    get: function (resolve, reject) {
        fs.readFile(FILE_NAME, function (err, data) {
            if (err) {
                reject(err);
            }
            else {
                resolve(JSON.parse(data));
            }
        });
    },
    getById: function (id, resolve, reject) {
      fs.readFile(FILE_NAME, function (err, data) {
        if (err) {
          reject(err);
        }
        else {
          let scratch = JSON.parse(data).find(p => p.id == id);
          resolve(scratch);
        }
      });
    },
    search: function (searchObject, resolve, reject) {
      fs.readFile(FILE_NAME, function (err, data) {
        if (err) {
          reject(err);
        }
        else {
          let scratch = JSON.parse(data);
          // Perform search
          if (searchObject) {
            scratch = scratch.filter(
              p => (searchObject.id ? p.id == searchObject.id : true) &&
                (searchObject.name ? p.name.toLowerCase().indexOf(searchObject.name) >= 0 : true));
          }
          resolve(scratch);
        }
      });
    },
    insert: function (newData, resolve, reject) {
      fs.readFile(FILE_NAME, function (err, data) {
        if (err) {
          reject(err);
        }
        else {
          let scratch = JSON.parse(data);
          scratch.push(newData);
          fs.writeFile(FILE_NAME, JSON.stringify(scratch), function (err) {
            if (err) {
              reject(err);
            }
            else {
              resolve(newData);
            }
          });
        }
      });
    }
};


module.exports = scratchRepo;