// See getSQLLocations below for doc
var Sequelize = require("Sequelize");
var config = require('../configuration.json')

const sql = `
    select
      loc_branchid as branch,
      loc_name as name,
      loc_bizcontact as businessContact_name,
      loc_emailcontact as businessContact_email,
      loc_sab as serviceArea,
      loc_addr1 as address,
      loc_addr2 as address_extended,
      loc_city as locality,
      loc_state as region,
      loc_zip as postCode,
      loc_country as country,
      loc_mall as mallName,
      loc_mainphone as phone,
      loc_fax as fax,
      loc_email as emailToPublish,
      loc_trackedwebsite as websiteToTrack,
      loc_publishedwebsite as websiteToPublish,
      loc_cat as categories,                       #comma separated list
      loc_hours as hoursOfOperation,
      loc_hoursadd as hoursAdditionalNotes,
      loc_payments as paymentMethods,
      loc_descsnippet as snippetDescription,
      loc_descshort as shortDescription,
      loc_desclong as longDescription,
      loc_keywords as keywords,
      loc_geo as geomodifiers,
      loc_dirpackage as dirPackage,
      loc_yearfounded as yearFounded,
      loc_info as otherInformation,
      loc_tags as tags,
      loc_logo as imgLogo,
      loc_banner as imgBanner,
      loc_images as imgOthers,
      loc_sabunit as serviceArea_unit,
      loc_sabdistance as serviceArea_distance,
      loc_sabregions as serviceArea_regions,        #comma separated list
      loc_distto as distributionTo,
      loc_distcc as distributionCC,
      loc_storeCode as storeCode,
      loc_brandname as brandName,
      loc_canceldate as canceldate,
      loc_closeddoorsdate as closedDoorsDate,
      loc_socialmediaurls as socialMediaUrls,       #comma separated list
      loc_alternativewebsites as alternateWebsites, #comma separated list
      loc_services as services,                     #comma separated list
      loc_suppresslistings as suppresslistings,
      loc_professional as isProfessional,
      loc_providedlatitude as latitude,
      loc_providedlongitude as longitude
    from location
      where client_id = 73
      and loc_status = 4
    limit 2
`

/*
* This returns a promise that resolves to location array. The objects of the
* array has to correspond to the web API specification.
* // https://locs-stag.swiq3.com/docs/api-doc-v2.pdf
*/
exports.getSQLLocations = function(){
  return new Promise(function(resolve, reject){
    var sequelize = new Sequelize(config.database.databaseName,
                                  config.database.userName,
                                  config.database.password, {
      host: config.databaseHost,
      dialect: 'mysql',
      logging: false,
      pool: {
        max: 5,
        min: 0,
        idle: 10000
      },
    });


    sequelize.query(sql)
    .then(queryResponse =>{
      sequelize.close();
      var locations = queryResponse[0];
      var mappedLocations = locations.map(function(location){
        location.businessContact = {
          name: location.businessContact_name,
          email: location.businessContact_email
        }
        if(location.alternateWebsites)
          location.alternateWebsites = location.alternateWebsites.split(',');
        if(location.categories)
          location.categories = location.categories.split(',');
        if(location.keywords)
          location.keywords = location.keywords.split(',');
        if(location.tags)
          location.tags = location.tags.split(',');
        if(location.imgOthers)
          location.imgOthers = location.imgOthers.split(',');
        if(location.paymentMethods)
          location.paymentMethods = location.paymentMethods.split(',');
        location.serviceArea = {
          distance: location.serviceArea_distance,
          unit: location.serviceArea_unit,
        };
        if(location.serviceArea_regions)
          location.serviceArea.regions = location.serviceArea_regions.split(',');
        if(location.services)
          location.services = location.services.split(',');

        if(location.socialMediaUrls){
          var socialMediaUrls = location.socialMediaUrls;
          location.socialMediaUrls = {};
          for (var url of socialMediaUrls.split(',')) {
            if(url.includes('facebook'))
              location.socialMediaUrls.facebook = url;
            else if(url.includes('twitter'))
              location.socialMediaUrls.twitter = url;
            else if(url.includes('foursquare'))
              location.socialMediaUrls.foursquare = url;
            else if(url.includes('yelp'))
              location.socialMediaUrls.yelp = url;
          }
        }

        if(location.hoursOfOperation){
          location.hoursOfOperationRaw = location.hoursOfOperation;
          delete location.hoursOfOperation;
        }

        return location;
      })// end of map

      resolve(mappedLocations);
    })
    .catch( error =>{
      reject(error);
      sequelize.close();
    })
  });//  end of promise

} // end of getSQLLocations
