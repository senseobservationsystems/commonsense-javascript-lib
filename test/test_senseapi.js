
//var chai = require("assert")

var should = chai.should();
var username = "";
var password = "";
var sensor_id = 0; 

describe('SenseApi.', function(){
	
	// setting server
	describe('setServer', function(){
		it('should return true if set to "live"', function(){
			SenseApi.setServer('live').should.equal(true);
		});
		it('should result in server set to "live"', function(){
			SenseApi.getServer().should.equal('live');
		});
		it('should return true if set to "dev"', function(){
			SenseApi.setServer('dev').should.equal(true);
		});
		it('should result in server set to "dev"', function(){
			SenseApi.getServer().should.equal('dev');
		});
	});
	
	
	// authentication
	describe('AuthenticateSessionId', function(){
        it('should return true if credentials are correct', function(){
        	SenseApi.AuthenticateSessionId(username, CryptoJS.MD5(password).toString()).should.equal(true);
        });
        it('should result in a session id being set', function() {
            SenseApi.getSessionId().should.not.equal('');
        });
        it('should return false if credentials are wrong', function(){
            SenseApi.AuthenticateSessionId("blaat", "herp").should.equal(false);
        });
    });

    // creating sensor
    describe('SensorsPost', function(){
    	it('should return true, indicating the sensor was created', function(){
    		SenseApi.SensorsPost({"sensor":{"name":"thermometer", "display_name":"Thermometer", "device_type":"TX-1000", "data_type":"float"}}).should.equal(true);
    	});
    	it('should allow us to retrieve 201 as status', function(){
    		SenseApi.getResponseStatus().should.equal(201);
    	});
    	it('should allow us to get the sensor_id from the "Location" response header', function(){
    		SenseApi.getResponseHeader().should.have.property('Location');
    	});
    	it('the sensor_id should be an integer', function(){
    		sensor_id = parseInt(SenseApi.getResponseHeader().Location.match(/\d+/)[0]);
    		sensor_id.should.be.a('number');
    	});
    });
    
    // retrieving one sensor
    describe('SensorsGet(null, sensor_id)', function(){
    	it('should return true, indicating we received details of one sensor', function(){
    		SenseApi.SensorsGet(null, sensor_id).should.be.true;
    	});
    });
    
    // retrieving a list of sensors
    describe('SensorsGet({options}, null)', function(){
    	it('should return true, indicating we have received a list of sensors', function(){
    		SenseApi.SensorsGet({'page':0, 'per_page':100, 'owned':1}, null).should.be.true;
    	})
    })
    
    // do some metatag magic
    describe('SensorsMetatagsPost', function(){
    	it('should return true, indicating we successfully uploaded a metatag', function(){
    		SenseApi.SensorMetatagsPost(sensor_id, "js_test", {"metatags": {"sensor_type":["test_sensor"]}}).should.be.true;
    	});
    });
    describe('SensorsMetatagsGet', function(){
    	it('should return true, indicating we have a list of all sensors and their metatags', function(){
    		SenseApi.SensorsMetatagsGet("js_test", {"details":"no"}).should.be.true;
    	});
    });
    describe('SensorMetatagsPut', function(){
    	it('should return true, indicating we successfully overwrote the list of metatags for the sensor', function(){
    		SenseApi.SensorMetatagsPut(sensor_id, "js_test", {"metatags": {"magic_color":["black"]}}).should.be.true;
    	});
    });
    describe('SensorMetatagsGet', function(){
    	it('should return true, indicating we have a list of metatags for this sensor', function(){
    		SenseApi.SensorMetatagsGet(sensor_id, "js_test").should.be.true;
    	});
    });
    describe('SensorMetatagsDelete', function(){
    	it('should return true, indicating we successfully deleted all metatags for the sensor', function(){
    		SenseApi.SensorMetatagsDelete(sensor_id, "js_test").should.be.true;
    	});
    	it('should cause the list of metatags for the sensor to be empty', function(){
    		SenseApi.SensorMetatagsGet(sensor_id, "js_test");
    		JSON.parse(SenseApi.getResponseData()).metatags.should.have.length(0);
    	});
    });
    
    // upload data to the sensor
    describe('SensorDataPost', function(){
    	it('should return true, indicating we successfully uploaded data for the sensor', function(){
    		SenseApi.SensorDataPost(sensor_id, {'data':[{'value':10, 'date':1351771200}, {'value':20, 'date':1351771260}, {'value':30, 'date':1351771320}]}).should.be.true;
    	});
    });
    // retrieve the data
    describe('SensorDataGet', function(){
    	it('should return true, indicating we successfully retrieved data for the sensor', function(){
    		SenseApi.SensorDataGet(sensor_id, {'start_date': 1351771199, 'end_date': 1351771321});
    	});
    	it('we should have retrieved three data points', function(){
    		JSON.parse(SenseApi.getResponseData()).data.should.have.length(3);
    	});
    });
    
    // delete the sensor we created earlier
    describe('SensorsDelete', function(){
    	it('should return true, indicating the sensor was deleted', function(){
    		SenseApi.SensorsDelete(sensor_id).should.be.true;
    	});
    });
    
    // logout
    describe('LougoutSessionId', function(){
    	it('should return true since we are logged in', function(){
    		SenseApi.LogoutSessionId().should.equal(true);
    	});
    	it('should result in session_id being an empty string', function(){
    		SenseApi.getSessionId().should.equal('');
    	});
    });


});

