// This is a mapping of the calls to the SweetIQ location API as defined
// here: https://locs-stag.swiq3.com/docs/#!/Location/post_api_pois_search
// (note that this address is a staging one. Don't use it to make production
// requests)
//
// By following the link, you can find the informations about the data
// involved in the API

var request = require("request-promise");
var config = require('../configuration.json')

//  Returns a promise that resolve to the response data:
//  {
//    "id": "eIR98bD09kcDVEvqCNpMYPev4qxpargmRfo4sEdihlkdHHG1X8hkOqxD8fOYM7Qf",
//    "ttl": 1209600,
//    "created": "2017-01-04T19:33:01.792Z",
//    "userId": "586d4db31b66533a23601929"
//  }
exports.login = function(email, password){
  var login_request = {
    uri: config.sweetiqAPI.serverURL+'api/users/login',
    method: 'POST',
    json: {
      "email": email,
      "password"  : password
    }
  };

  return request(login_request);
}

// update, add or validate the locations sent
//
// returns:
//    {
//      "client": "string",
//      "count": 0,
//      "locations": [
//        {
//          "action": "string",
//          "status": "string"
//        }
//      ]
//    }
exports.push = function(authentication_id, request_data){
  var login_request = {
    uri: config.sweetiqAPI.serverURL+'api/pois/push',
    method: 'POST',
    headers: {
      'Authorization': authentication_id
    },
    json: request_data
  };

  return request(login_request);
}

//
// request_data:
// {
//   "search_fields": {
//     "branches": [
//       "string"
//     ],
//     "storeCode": "string",
//     "name": "string",
//     "phone": "string",
//     "locality": "string",
//     "region": "string",
//     "country": "string",
//     "postCode": "string"
//   }
// }
//
// returns an array of location objects ()
exports.search = function(authentication_id, request_data){
  var search_request = {
    uri: config.sweetiqAPI.serverURL+'api/pois/search',
    method: 'POST',
    headers: {
      'Authorization': authentication_id
    },
    json: request_data
  };

  return request(search_request)
}
