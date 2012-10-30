
//var chai = require("assert")

var should = chai.should();
var username = "";
var password = "";

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
        	var hash = CryptoJS.MD5(password).toString();
        	console.log(hash);
        	console.log(password + "  " + hash);
        	SenseApi.AuthenticateSessionId(username, hash).should.equal(true);
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
    	it('should allow us to get the sensor_id from the "location" response header', function(){
    		SenseApi.getResponseHeader().should.have.property('Location');
    	});
    });
    
    // retrieving sensor
    describe('SensorsGet', function(){
    	it('should return true, indicating we received a list of sensors', function(){
    		SenseApi.SensorsGet({}, null).should.be.true;
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

