
*This module is under heavy development.*

# Commonsense API module

Retrieve information from the [CommonSense](http://www.sense-os.nl/commonsense) platform.

## Install

To install, copy `senseapi.js` to the library path in your project.

There are two dependencies, `json2.js` and `md5.js`, which can be found at [JSON-js](https://github.com/douglascrockford/JSON-js) and [md5hash](http://crypto-js.googlecode.com/svn/tags/3.0.2/build/rollups/md5.js), but are also added to the `lib` directory in this repository for your convenience.

## Usage

This library can be used in the browser and in for example Cordova and other javascript frameworks on cross-platform mobile devices.

When available in your project, the following is a typical beginning of a usecase.

````javascript
  sense = new Sense()
  username = 'some_username'
  password = 'md5_of_password'

````

The following api calls on the Sense object are implemented.
The calls follow the REST-style with the verbs (create, update, delete) prefixed.
An index (list) action corresponds with the plural form and a single get with the single form.
The callback is of the form `next(err, response)`.
The `data` argument is an optional object of headers.

```javascript
  # A U T H E N T I C A T I O N #
  createSession(u, p)
  deleteSession() 

  # D A T A P R O C E S S O R S #
  dataProcessors([ data, ]) 
  dataProcessor(id, [ data, ])
  createDataProcessor([ data, ])
  updateDataProcessor(id, [ data, ])
  deleteDataProcessor(id, [ data, ])

  # D A T A  P R O C E S S O R S  &  F I L E S #
  dataProcessorsFiles([ data, ])
  dataProcessorFile(filename, [ data, ])
  createDataProcessorsFile(filename, [ data, ])
  updateDataProcessorsFile(filename, [ data, ])
  deleteDataProcessorsFile(filename, [ data, ])

  # D E V I C E S #
  devices([ data, ])
  device(id, [ data, ])
  deviceSensors(id, [ data, ])

  # E N V I R O N M E N T S #
  environments([ data, ])
  environment(id, [ data, ])
  createEnvironment([ data, ])
  updateEnvironment(id, [ data, ])
  deleteEnvironment(id, [ data, ])

  # E N V I R O N M E N T S  &  S E N S O R S #
  environmentSensors(id, [ data, ])
  createEnvironmentSensor(id, [ data, ])
  deleteEnvironmentSensor(id, sensor,)

  # G R O U P S #
  allGroups([ data, ])
  groups([ data, ])
  group(id, [ data, ])
  createGroup([ data, ])
  updateGroup(id, [ data, ])
  deleteGroup(id, [ data, ])

  # G R O U P S  &  U S E R S #
  groupUsers(id, [ data, ])
  groupUser(id, user,)
  createGroupUser(id, [ data, ])
  updateGroupUser(id, user, [ data, ])
  deleteGroupUser(id, user,)

  # G R O U P S  &  S E N S O R S #
  groupSensors(id, [ data, ])
  createGroupSensor(id, [ data, ])
  deleteGroupSensor(id, sensor,)

  # S E N S O R S #
  sensors([ data, ])
  sensor(id, [ data, ])
  createSensor([ data, ])
  updateSensor(id, [ data, ])
  deleteSensor(id, [ data, ])
  sensorsFind(namespace, [ data, ])
  findOrCreateSensor(sensor,)

  # S E N S O R S  &  D A T A #
  sensorData(id, [ data, ])
  createSensorData(id, [ data, ])
  createSensorsData([ data, ])
  deleteSensorData(id, data_id, [ data, ])

  # S E N S O R S  &  E N V I R O N M E N T S #
  sensorEnvironments(id, [ data, ])
  # S E N S O R S  &  D E V I C E S #
  sensorDevice(id, [ data, ])
  createSensorDevice(id, [ data, ])
  deleteSensorDevice(id, [ data, ])

  # S E N S O R S  &  S E R V I C E S #
  sensorsAvailableServices([ data, ])
  sensorRunningServices(id, [ data, ])
  sensorAvailableServices(id, [ data, ])
  createSensorService(id, [ data, ])
  deleteSensorService(id, service,)
  sensorServiceMethods(id, service,)
  sensorServiceLearn(id, service, [ data, ])
  sensorServiceMethod(id, service, method,)
  createSensorServiceMethod(id, service, method, [ data, ])

  # M E T A T A G S #
  sensorsMetatags([ data, ])
  sensorMetatags(id, [ data, ])
  createSensorMetatags(id, [ data, ])
  updateSensorMetatags(id, [ data, ])
  deleteSensorMetaTags(id, [ data, ])

  # U S E R S #
  currentUser([ data, ])
  users([ data, ])
  user(id, [ data, ])
  createUser([ data, ])
  updateUser(id, [ data, ])
  deleteUser(id, [ data, ])
```

## Copyright

Freek van Polen, Sense B.V., http://sense-os.nl
Roemer Vlasveld, Almende B.V., http://almende.com
Anne C. van Rossum, DoBots B.V., http://dobots.nl
