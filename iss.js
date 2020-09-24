const request = require("request");

const fetchMyIP = function(callback) {
  const url = "https://api.ipify.org?format=json";
  // use request to fetch IP address from JSON API
  request(url, (error, response, body) => {
    if (error) {
      return callback(error, null);
    }
    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching IP. Response: ${body}`;
      callback(Error(msg), null);
      return;
    }
    const IP = JSON.parse(body);
    return callback(null, IP);
  });
};

const fetchCoordsByIP = (IP, callback) => {
  const url = "https://ipvigilante.com/8.8.8.8";
  request(url, (error, response, body) => {
    if (error) {
      return callback(error, null);
    }
    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching IP. Response: ${body}`;
      callback(Error(msg), null);
      return;
    }
    const IP = JSON.parse(body);
    const data = {};
    data["latitude"] = IP.data.latitude;
    data["longitude"] = IP.data.latitude;
    return callback(null, data);
  });
};

const fetchISSFlyOverTimes = (coords, callback)  => {
  // ...
  const url = `http://api.open-notify.org/iss-pass.json?lat=${coords.latitude}&lon=${coords.longitude}`;
  request(url, (error, response, body) => {
    if (error) {
      return callback(error, null);
    }
    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching IP. Response: ${body}`;
      callback(Error(msg), null);
      return;
    }
    const data = JSON.parse(body);
    let returnedValues = [];
    const inputtedObject = {};
    inputtedObject["risetime"] = data.response[4].risetime;
    inputtedObject["duration"] = data.response[4].duration;
    returnedValues.push(inputtedObject);
    return callback(null, returnedValues);
  });
};


const nextISSTimesForMyLocation = function(callback) {
  fetchMyIP((error, ip) => {
    if (error) {
      return callback(error, null);
    }

    fetchCoordsByIP(ip, (error, loc) => {
      if (error) {
        return callback(error, null);
      }

      fetchISSFlyOverTimes(loc, (error, nextPasses) => {
        if (error) {
          return callback(error, null);
        }

        callback(null, nextPasses);
      });
    });
  });
};


module.exports = {
  nextISSTimesForMyLocation
};