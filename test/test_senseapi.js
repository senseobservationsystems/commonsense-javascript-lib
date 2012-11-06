
//var chai = require("assert")

var should = chai.should();
var username = "";
var password = "";
var sensor_id = 0;
var environment_id = 0;
var device_id = 0;
var server = "";

describe('CommonSense Javascript API Library', function(){
	
	// setting server
	describe('Selecting Server', function(){
		it('SenseApi.setServer() sets server to "live" or "dev"', function(){
			SenseApi.setServer(server).should.equal(true);
		});
		it('SenseApi.getServer() gets currently selected server', function(){
			SenseApi.getServer().should.equal(server);
		});
	});
	
	// authentication
	describe('Authentication by Session Id', function(){
        it('SenseApi.AuthenticateSessionId() logs you in to CommonSense', function(){
        	SenseApi.AuthenticateSessionId(username, CryptoJS.MD5(password).toString()).should.equal(true);
        });
        it('SenseApi.getSessionId() gets the obtained session_id', function() {
            SenseApi.getSessionId().should.not.equal('');
        });
    });

    // creating sensor
    describe('Creating a Sensor', function(){
    	it('SenseApi.SensorPost() creates a sensor', function(){
    		SenseApi.SensorPost({"sensor":{"name":"thermometer", "display_name":"Thermometer", "device_type":"TX-1000", "data_type":"float"}}).should.equal(true);
    	});
    	it('SenseApi.getResponseStatus() gets the response status', function(){
    		SenseApi.getResponseStatus().should.equal(201);
    	});
    	it('SenseApi.getResponseHeader() get the response headers', function(){
    		SenseApi.getResponseHeader().should.have.property('Location');
    	});
    	it('The Location header can be parsed for the sensor_id of the created sensor', function(){
    		sensor_id = parseInt(SenseApi.getResponseHeader().Location.match(/\d+/)[0]);
    		sensor_id.should.be.a('number');
    		sensor_id.should.not.equal(0);
    	});
    });
    
    // retrieving sensors
    describe('Retrieving Sensors', function(){
    	it('SenseApi.SensorGet() retrieves details of a single sensor', function(){
    		SenseApi.SensorGet(sensor_id).should.be.true;
    	});
    	it('SenseApi.SensorsGet() retrieves details of a list of sensors', function(){
    		SenseApi.SensorsGet({'page':0, 'per_page':100, 'owned':1}).should.be.true;
    	})
    });
    
    // environments
    describe('Environments', function() {
    	it('SenseApi.EnvironmentPost() creates a new environment', function(){
    		SenseApi.EnvironmentPost({"environment":{"name":"Sense","floors":"3","gps_outline":"50.1 4.1, 50.2 4.1, 50.2 4.2, 50.1 4.2, 50.1 4.1","position":"51.15 4.15"}}).should.be.true;
    	});
    	it('The Location header can be parsed for the environment_id of the created environment', function(){
    		environment_id = parseInt(SenseApi.getResponseHeader().Location.match(/\d+/)[0]);
    		environment_id.should.be.a('number');
    		environment_id.should.not.equal(0);
    	});
    	it('SenseApi.EnvironmentGet() retrieves the details of an environment', function(){ 
    		SenseApi.EnvironmentGet(environment_id).should.be.true;
    	});
    	it('SenseApi.EnvironmentSensorPost() adds a sensors to the environment', function() {
    		SenseApi.EnvironmentSensorPost(environment_id, {'sensors':[{'id':sensor_id}]}).should.be.true;
    	});
    	it('SenseApi.EnvironmentSensorsGet() retrieves the sensors in an environment', function() {
    		SenseApi.EnvironmentSensorsGet(environment_id).should.be.true;
    	});
    	it('SenseApi.EnvironmentDelete() deletes an environment', function (){
    		SenseApi.EnvironmentDelete(environment_id).should.be.true;
    	});
    });
    
    // devices
    describe('Devices', function(){
    	it('SenseApi.SensorDevicePost() attaches a sensor to a device', function (){ 
    		SenseApi.SensorDevicePost(sensor_id, {'device':{'type':'gizmo', 'uuid':'1234567890abcde'}}).should.be.true;
    	});
    	it('SenseApi.DevicesGet() retrieves a list of devices', function (){ 
    		SenseApi.DevicesGet({'page':0, 'per_page':100}).should.be.true;
    	});
    	it('SenseApi.SensorDeviceGet() retrieves the device a sensor is attached to', function() {
    		SenseApi.SensorDeviceGet(sensor_id).should.be.true;
    	});
    	it('SenseApi.SensorDeviceDelete() detaches a sensor from its device', function() {
    		SenseApi.SensorDeviceDelete(sensor_id).should.be.true;
    	});
    });
    
    // do some metatag magic
    describe('Metatags', function(){
    	it('SenseApi.SensorMetatagsPost() creates metatags for a sensor', function(){
    		SenseApi.SensorMetatagsPost(sensor_id, "js_test", {"metatags": {"sensor_type":["test_sensor"]}}).should.be.true;
    	});
    	it('SenseApi.SensorsMetatagsGet() retrieves sensors and their metatags', function(){
    		SenseApi.SensorsMetatagsGet("js_test", {"details":"no"}).should.be.true;
    	});
    	it('SenseApi.SensorMetatagsPut() overwrites the list of metatags of a sensor', function(){
    		SenseApi.SensorMetatagsPut(sensor_id, "js_test", {"metatags": {"magic_color":["black"]}}).should.be.true;
    	});
    	it('SenseApi.SensorMetatagsGet() retrieves the metatags of a single sensor', function(){
    		SenseApi.SensorMetatagsGet(sensor_id, "js_test").should.be.true;
    	});
    	it('SenseApi.SensorMetatagsDelete() deletes metatags of a sensor', function(){
    		SenseApi.SensorMetatagsDelete(sensor_id, "js_test").should.be.true;
    	});
    	it('SenseApi.SensorMetatagsGet() now returns an empty list of metatags', function(){
    		SenseApi.SensorMetatagsGet(sensor_id, "js_test");
    		JSON.parse(SenseApi.getResponseData()).metatags.should.have.length(0);
    	});
    });
    
    // sensor data 
    describe('Sensor Data', function(){
    	it('SenseApi.SensorDataPost() uploads data to a single sensor', function(){
    		SenseApi.SensorDataPost(sensor_id, {'data':[{'value':10, 'date':1351771200}, {'value':20, 'date':1351771260}, {'value':30, 'date':1351771320}]}).should.be.true;
    	});
    	it('SenseApi.SensorDataGet() retrieves data for a single sensor', function(){
    		SenseApi.SensorDataGet(sensor_id, {'start_date': 1351771199, 'end_date': 1351771321});
    	});
    	it('The response data can be parsed for the retrieved data', function(){
    		JSON.parse(SenseApi.getResponseData()).data.should.have.length(3);
    	});

    });
    
    // delete the sensor we created earlier
    describe('Deleting a Sensor', function(){
    	it('SenseApi.SensorDelete() deletes a single sensor', function(){
    		SenseApi.SensorDelete(sensor_id).should.be.true;
    	});
    });
    
    // logout
    describe('Logging out a Session Id', function(){
    	it('SenseApi.LogoutSessionId() logs out the current session_id', function(){
    		SenseApi.LogoutSessionId().should.equal(true);
    	});
    	it('SenseApi.getSessionId() returns an empty string now', function(){
    		SenseApi.getSessionId().should.equal('');
    	});
    });


});

