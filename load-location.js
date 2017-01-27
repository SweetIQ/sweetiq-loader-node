var api = require("./sweetiq/location-api");
var loadSQL = require("./sweetiq/load-sql");
var config = require("./configuration.json");

// startLoader is the normal data upload
var startLoader = function(){
  loadSQL.getSQLLocations()
  .then( locations =>{
    console.log("sending " + locations.length + " locations: ");
    return api.login(config.sweetiqAPI.email,
                     config.sweetiqAPI.password)
    .then( loginResponse =>{
      return api.push(loginResponse.id, {locations: locations});
    })
    .then( response_data =>{
      console.log(response_data);
    })
  })
  .catch((error) =>{
    console.log(error);
  })
}



if(process.argv[2] === 'service'){
  //startLoader is called at each set interval
  if(config.intervalOfPushInMinutes != 0)
    setInterval(startLoader, config.intervalOfPushInMinutes * 1000 * 60);
  startLoader();
}
else if (process.argv[2] === 'test') {
  //test if we can connect to the API
  console.log('testing connection');
  api.login(config.sweetiqAPI.email,
            config.sweetiqAPI.password)
  .then(response =>{
    console.log('connection successful');
  })
  .catch( err =>{
    console.log('something was wrong');
    console.log(err);
  })
}
else if (process.argv[2] === '--verify-update') {
  // Same has startLoader but calls back the API to verify if the data
  // is really updated. You'll see all the fields that are differents from
  // the request and the response.
  var token = null;
  var locationsMapped;
  loadSQL.getSQLLocations()
  .then( locations =>{
    locationsMapped = locations;
    console.log("--verify mode--");
    console.log("sending " + locationsMapped.length + " locations: ");
    return api.login(config.sweetiqAPI.email,
                     config.sweetiqAPI.password)
    .then( loginResponse =>{
      token = loginResponse.id
      return api.push(token, {locations: locationsMapped});
    })
    .then( pushResponse =>{
      console.log(pushResponse);
      for (var i in pushResponse.locations) {
        pushResponse.locations[i]
        api.search(token, {search_fields: {branches: [pushResponse.locations[i].branch]}})
        .then( searchResponse =>{
          searchedLocation = searchResponse[0];
          for (var j in locationsMapped) {
            //We search the original location Object
            if (locationsMapped.hasOwnProperty(j)) {
              if(locationsMapped[j].branch === searchResponse[0].branch){
                //And we compare it with our current object
                compareObjects(searchResponse[0], locationsMapped[j]);
              }
            }
          }
        })
      }
      //return api.search(token, searchRequest)
      return null;
    })
    .catch( error =>{
      console.log(error.stack);
    });
  })
}
else{
  startLoader();
}


function compareObjects(a, b){
  var keys = Object.keys(a);
  for (var i in keys) {
    if (keys.hasOwnProperty(i)) {
      if(typeof a[keys[i]] === 'Object')
        compareObjects(a[keys[i]], b[keys[i]]);
      else if(typeof a[keys[i]] === 'Array'){

      }
      else if(a[keys[i]] !== b[keys[i]]){
        console.log(keys[i]+": ", "'"+a[keys[i]]+"', ", "'"+b[keys[i]]+"'");
      }
    }
  }
}
