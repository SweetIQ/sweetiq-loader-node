# SweetIQ's Location Loader

Introduction
---------------------
SweetIQ's Location Loader is a software template for integrating
with SweetIQ's Location API.  It is a node.js application that connects
to your database, extracts the mapped data and sends it to SweetIQ. It
also offers you the option of running it as a service to ensure that your data is
always up-to-date on the SweetIQ database.


Installation
------------
`git clone repositoryName`

`npm install`

Before running the script for the first time, there are a few things you will
need to setup.

Configuration
-------------
Configure your credentials in `config.js` to
*  access to SweetIQ's API using your credentials, and
*  establish a connection with your database.

Setup the service by setting the push interval in `config.js`.

Test Connection to SweetIQ
--------------------------
To test the connection to SweetIQ, be sure to put your authentication data in
`config.js` and run:

`node load_location.js test`

You should see

~~~
testing connection
connection successful
~~~

In the event of an error, you should see the error code from the server. This
error message should include the http error codes.

Setup Data Mapping
-----------------

Map your data fields (i.e. location name, address, phone number, etc) to
those supported by SweetIQ by overwriting the appropriate fields in `sweetiq/load_sql`.  

This file does two things:
* select your field and maps them to the associated field name in the SweetIQ API, and
* performs extra data transformations that are easier to do in Javascript.

See the SweetIQ Location API Specification (`http://locs.swiq3.com/docs/api-doc-v2.pdf`)
for the complete list of fields, their supported formats and short descriptions.

Test Your Mapping
-----------------
Once you are done with mapping, you should test to see if it works
properly. Do so by running the application using

`node load_location.js --verify-update`.

This call does three things:
* pushes the data from your database to SweetIQ's,
* performs a search in the SweetIQ db for all current data, and
* compares the two data sets and highlights the differences.  

Please note that `--verify-update` should not be run in the production environment.
Instead, these changes will be reviewed by your SweetIQ Account Manager.
