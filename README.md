# Commonsense API module

Retrieve information from the [CommonSense](http://www.sense-os.nl/commonsense) platform.

## Install

To install, copy `senseapi.js` to the library path in your project.

There are two dependencies, `json2.js` and `md5.js`, which can be found at [JSON-js](https://github.com/douglascrockford/JSON-js) and [md5hash](http://crypto-js.googlecode.com/svn/tags/3.0.2/build/rollups/md5.js), but are also added to the `lib` directory in this repository for your convenience.

## Usage

This library can be used in the browser and in for example Cordova and other javascript frameworks on cross-platform mobile devices.

The following is a typical beginning of a use case.

````javascript
  var s = SenseAPI;
  s.createSession(username, password, successCB, errorCB);

````
See the example in the `test` directory.

The following api calls on the SenseAPI object are implemented.
The calls follow the REST-style with the verbs (create, update, delete) prefixed.
An index (list) action corresponds with the plural form and a single get with the single form.
The callback is of the form `successCB, errorCB`.
The `data` argument is an optional object of headers.

```javascript
  # A U T H E N T I C A T I O N #
  createSession(u, p, successCB, errorCB)
  deleteSession(successCB, errorCB) 

  # D A T A P R O C E S S O R S #
  dataProcessors([ data, ], successCB, errorCB) 
  dataProcessor(id, [ data, ], successCB, errorCB)
  createDataProcessor([ data, ], successCB, errorCB)
  updateDataProcessor(id, [ data, ], successCB, errorCB)
  deleteDataProcessor(id, [ data, ], successCB, errorCB)

  # D A T A  P R O C E S S O R S  &  F I L E S #
  dataProcessorsFiles([ data, ], successCB, errorCB)
  dataProcessorFile(filename, [ data, ], successCB, errorCB)
  createDataProcessorsFile(filename, [ data, ], successCB, errorCB)
  updateDataProcessorsFile(filename, [ data, ], successCB, errorCB)
  deleteDataProcessorsFile(filename, [ data, ], successCB, errorCB)

  # D E V I C E S #
  devices([ data, ], successCB, errorCB)
  device(id, [ data, ], successCB, errorCB)
  deviceSensors(id, [ data, ], successCB, errorCB)

  # E N V I R O N M E N T S #
  environments([ data, ], successCB, errorCB)
  environment(id, [ data, ], successCB, errorCB)
  createEnvironment([ data, ], successCB, errorCB)
  updateEnvironment(id, [ data, ], successCB, errorCB)
  deleteEnvironment(id, [ data, ], successCB, errorCB)

  # E N V I R O N M E N T S  &  S E N S O R S #
  environmentSensors(id, [ data, ], successCB, errorCB)
  createEnvironmentSensor(id, [ data, ], successCB, errorCB)
  deleteEnvironmentSensor(id, sensor, successCB, errorCB)

  # G R O U P S #
  allGroups([ data, ], successCB, errorCB)
  groups([ data, ], successCB, errorCB)
  group(id, [ data, ], successCB, errorCB)
  createGroup([ data, ], successCB, errorCB)
  updateGroup(id, [ data, ], successCB, errorCB)
  deleteGroup(id, [ data, ], successCB, errorCB)

  # G R O U P S  &  U S E R S #
  groupUsers(id, [ data, ], successCB, errorCB)
  groupUser(id, user, successCB, errorCB)
  createGroupUser(id, [ data, ], successCB, errorCB)
  updateGroupUser(id, user, [ data, ], successCB, errorCB)
  deleteGroupUser(id, user, successCB, errorCB)

  # G R O U P S  &  S E N S O R S #
  groupSensors(id, [ data, ], successCB, errorCB)
  createGroupSensor(id, [ data, ], successCB, errorCB)
  deleteGroupSensor(id, sensor, successCB, errorCB)

  # S E N S O R S #
  sensors([ data, ], successCB, errorCB)
  sensor(id, [ data, ], successCB, errorCB)
  createSensor([ data, ], successCB, errorCB)
  updateSensor(id, [ data, ], successCB, errorCB)
  deleteSensor(id, [ data, ], successCB, errorCB)
  sensorsFind(namespace, [ data, ], successCB, errorCB)
  findOrCreateSensor(sensor, successCB, errorCB)

  # S E N S O R S  &  D A T A #
  sensorData(id, [ data, ], successCB, errorCB)
  createSensorData(id, [ data, ], successCB, errorCB)
  createSensorsData([ data, ], successCB, errorCB)
  deleteSensorData(id, data_id, [ data, ], successCB, errorCB)

  # S E N S O R S  &  E N V I R O N M E N T S #
  sensorEnvironments(id, [ data, ], successCB, errorCB)

  # S E N S O R S  &  D E V I C E S #
  sensorDevice(id, [ data, ], successCB, errorCB)
  createSensorDevice(id, [ data, ], successCB, errorCB)
  deleteSensorDevice(id, [ data, ], successCB, errorCB)

  # S E N S O R S  &  S E R V I C E S #
  sensorsAvailableServices([ data, ], successCB, errorCB)
  sensorRunningServices(id, [ data, ], successCB, errorCB)
  sensorAvailableServices(id, [ data, ], successCB, errorCB)
  createSensorService(id, [ data, ], successCB, errorCB)
  deleteSensorService(id, service, successCB, errorCB)
  sensorServiceMethods(id, service, successCB, errorCB)
  sensorServiceLearn(id, service, [ data, ], successCB, errorCB)
  sensorServiceMethod(id, service, method, successCB, errorCB)
  createSensorServiceMethod(id, service, method, [ data, ], successCB, errorCB)

  # M E T A T A G S #
  sensorsMetatags([ data, ], successCB, errorCB)
  sensorMetatags(id, [ data, ], successCB, errorCB)
  createSensorMetatags(id, [ data, ], successCB, errorCB)
  updateSensorMetatags(id, [ data, ], successCB, errorCB)
  deleteSensorMetaTags(id, [ data, ], successCB, errorCB)

  # U S E R S #
  currentUser([ data, ], successCB, errorCB)
  users([ data, ], successCB, errorCB)
  user(id, [ data, ], successCB, errorCB)
  createUser([ data, ], successCB, errorCB)
  updateUser(id, [ data, ], successCB, errorCB)
  deleteUser(id, [ data, ], successCB, errorCB)
```

## Copyright

* Freek van Polen, Sense B.V., http://sense-os.nl
* Roemer Vlasveld, Almende B.V., http://almende.com
* Anne C. van Rossum, DoBots B.V., http://dobots.nl

Copyrights belong to the corresponding companies.

License: Apache 2.0
