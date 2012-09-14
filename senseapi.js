/** JavaScipt CommonSense API Library
 *  Author: Freek van Polen, Sense
 *	Date: 06-09-2012
 *	Dependencies: json2.js --> https://github.com/douglascrockford/JSON-js
 *
**/

/**
 * ERROR CODES:
 * 0 - No Error
 * 1 - No XMLHttpRequest object
 * 2 - Wrong method given
 * 3 - Error in connection/request
 * 4 - Invalid arguments
 */

function SenseApi() {
	this.request = getXMLHttpRequest();
	this.session_id = "";
	this.resp_status = 0;
	this.resp_headers = "";
	this.resp_data = "";
	this.error_code = 0;

	// List of Functions for SenseApi object
	this.SenseApiCall 					= SenseApiCall;
	
	this.AuthenticateSessionId 			= AuthenticateSessionId;
	this.LogoutSessionId 				= LogoutSessionId;
	
	this.SensorsGet 					= SensorsGet;
	this.SensorsPost 					= SensorsPost;
	this.SensorsDelete					= SensorsDelete;
	
	this.SensorDataGet					= SensorDataGet;
	this.SensorDataPost					= SensorDataPost;
	this.SensorsDataPost				= SensorsDataPost;
	
	this.ServicesGet					= ServicesGet;
	this.ServicesPost					= ServicesPost;
	this.ServicesDelete					= ServicesDelete;
	this.ServicesSetExpression			= ServicesSetExpression;
	this.ServicesSetUseDataTimestamp 	= ServicesSetUseDataTimestamp;
	
	this.UsersGetCurrent				= UsersGetCurrent;
}

/**
 * Base API call method
 * @param method 	"GET", "POST", "DELETE", "PUT"
 * @param url 		url in string format
 * @param data 		json object
 * @param headers 	array of json objects {"header_name":"blabla","header_value":"balbalb"}
 */
function SenseApiCall (method, url, data, headers) {
	if (this.request == false) {
		this.error_code = 1;
		return false;
	}
	if (method != "GET" && method != "POST" && method != "DELETE") {
		this.error_code = 2;
		return false;
	}
	
	this.request.open(method, url, false);
	for (var i=0; i<headers.length; i++) {
		this.request.setRequestHeader(headers[i].header_name, headers[i].header_value);
	}
	this.request.setRequestHeader('Content-type', 'application/json');
	this.request.setRequestHeader('Accept', '*');
	if (this.session_id != "") {
		this.request.setRequestHeader('X-SESSION_ID', this.session_id);
	}
	
	this.request.send(JSON.stringify(data));
	
	this.resp_status = this.request.status;
	this.resp_headers = this.request.getResponseHeader("Location");
	console.log("resp_headers: "+this.resp_headers);
	console.log("getResponseHeader: "+this.request.getResponseHeader("Location"));
	
	this.resp_data = this.request.responseText;
	
	if (this.resp_status == 200 || this.resp_status == 201) {
		return true;
	}
	else {
		this.error_code = 3;
		return false; 
	}
}


///////////////////////////////////////////////////////
/// S E S S I O N  I D  A U T H E N T I C A T I O N ///
///////////////////////////////////////////////////////

/**
 * Obtain a session id from CommonSense
 * @param username 	username
 * @param password 	md5hash of password
 */
function AuthenticateSessionId (username, password) {
	data = {"username":username, "password":password};
	if (this.SenseApiCall("POST", "https://api.sense-os.nl/login.json", data, [])) {
		this.session_id = JSON.parse(this.resp_data).session_id;
		return true;
	}
	else {
		return false;
	}
}

/**
 * Logout a session id at CommonSense
 */
function LogoutSessionId () {
	if (this.SenseApiCall("POST", "https://api.sense-os.nl/logout.json", {}, [])) {
		this.session_id = "";
		return true;
	}
	else {
		return false;
	}
}


/////////////////////
/// S E N S O R S ///
/////////////////////

/**
 * Retrieve sensors from CommonSense
 * @param parameters	parameters for the query in object - {'page':0, 'per_page':100, 'shared':0, 'owned':0, 'physical':0, 'details':'full'}
 * @param sensor_id 	sensor id of a specific sensor 
 */
function SensorsGet (parameters, sensor_id) {
	if (!parameters && !sensor_id) {
		this.error_code = 4;
		return false;
	}
	if (parameters) {
		if (this.SenseApiCall("GET", "https://api.sense-os.nl/sensors.json", parameters, []))
			return true;
		else
			return false;
	}
	if (sensor_id) {
		if (this.SenseApiCall("GET", "https://api.sense-os.nl/sensors/"+sensor_id+".json", {}, [])) 
			return true;
		else
			return false;
	}
	
	this.error_code = 4;
	return false;
}

/**
 * Delete a sensor in CommonSense
 * @param sensor_id		sensor_id of sensor to delete
 */
function SensorsDelete (sensor_id) {
	if (this.SenseApiCall("DELETE", "https://api.sense-os.nl/sensors/"+sensor_id+".json", {}, [])) 
		return true;
	else
		return false;
}

/**
 * Create a sensor in CommonSense
 * @param parameters	sensor to create online in object - {'sensor': {'name':'', 'display_name':'', 'device_type':'', 'pager_type':'', 'data_type':'', 'data_structure':''}}
 */
function SensorsPost (parameters) {
	if (this.SenseApiCall("POST", "https://api.sense-os.nl/sensors.json", parameters, [])) 
		return true;
	else
		return false;
}


////////////////////////////
/// S E N S O R  D A T A ///
////////////////////////////

/**
 * Retrieve sensor data from CommonSense
 * @param sensor_id 	the id of the sensor to retrieve data from
 * @param parameters	specifics of the query - {'page':0, 'per_page':100, 'start_date':0, 'end_date':4294967296, 'date':0, 'next':0, 'last':0, 'sort':'ASC', 'total':1}
 */
function SensorDataGet (sensor_id, parameters) {
	if (this.SenseApiCall("GET", "https://api.sense-os.nl/sensors/"+sensor_id+"/data.json", parameters, []))
		return true;
	else
		return false;
}

/**
 * Insert sensor-specific data in CommonSense
 * @param sensor_id 	the id of the sensor to insert data for
 * @param data			the data to insert - {'data': [{'value':0, 'date':0}]}
 */
function SensorDataPost (sensor_id, data) {
	if (this.SenseApiCall("POST", "https://api.sense-os.nl/sensors/"+sensor_id+"/data.json", data, []))
		return true;
	else
		return false;
}

/**
 * Insert data for multiple sensors at once in CommonSense
 * @param data		the data to insert - {'sensors':[{'sensor_id':1, 'data':[{'value':0, 'date':0}]}]}
 */
function SensorsDataPost (data) {
	if (this.SenseApiCall("POST", "https://api.sense-os.nl/sensors/data.json", data, []))
		return true;
	else
		return false;
}


///////////////////////
/// S E R V I C E S ///
///////////////////////

/**
 * Retrieve all services attached to a sensor from CommonSense
 * @param sensor_id		the sensor_id to retrieve the services from
 */
function ServicesGet (sensor_id) {
	if (this.SenseApiCall("GET", "https://api.sense-os.nl/sensors/"+sensor_id+"/services.json"), {}, [])
		return true;
	else
		return false;
}

/**
 * Create a service in CommonSense
 * @param sensor_id		the sensor to connect the service to
 * @parma parameters	details of the service to create - {'service':{'name':'math_service', 'data_fields':['sensor']}, 'sensor':{'name':'', 'device_type':''}}
 */
function ServicesPost (sensor_id, parameters) {
	if (this.SenseApiCall("POST", "https://api.sense-os.nl/sensors/"+sensor_id+"/services.json", parameters, []))
		return true;
	else
		return false;
}

/**
 * Delete a service in CommonSense
 * @param sensor_id		sensor_id from which to delete a service
 * @param service_id	service_id to delete
 */
function ServicesDelete (sensor_id, service_id) {
	if (this.SenseApiCall("DELETE", "https://api.sense-os.nl/sensors/"+sensor_id+"/services/"+service_id+".json", {}, []))
		return true;
	else
		return false;
}

/**
 * Set Expression for a service
 * @param sensor_id		sensor_id to which the target service is connected
 * @param service_id	service_id of the service of which to set the expression
 * @param parameters	expression to set for the service - {'parameters':['_sensorname_datafield']}
 */
function ServicesSetExpression (sensor_id, service_id, parameters) {
	if (this.SenseApiCall("POST", "https://api.sense-os.nl/sensors/"+sensor_id+"/services/"+service_id+"/SetExpression.json", parameters, []))
		return true;
	else
		return false;
}

/**
 * Set a service to use the timestamp of incoming data for the generated data
 * @param sensor_id		sensor_id to which the target service is connected
 * @param service_id	service_id that should use the data timestamp
 * @param parameters	the desired setting (basically 0 or 1) - {'parameters':[1]}
 */
function ServicesSetUseDataTimestamp (sensor_id, service_id, parameters) {
	if (this.SenseApiCall("POST", "https://api.sense-os.nl/sensors/"+sensor_id+"/services/"+service_id+"/SetUseDataTimestamp.json", parameters, []))
		return true;
	else
		return false;
}

/////////////////
/// U S E R S ///
/////////////////

/**
 * Gets information of current user, based on session_id.
 */
function UsersGetCurrent () {
	if (this.SenseApiCall("GET", "https://api.sense-os.nl/users/current.json", {}, []))
		return true;
	else 
		return false;
}


////////////////////////////////////////////
/// N O N - C L A S S  F U N C T I O N S ///
////////////////////////////////////////////

function getXMLHttpRequest() {
	request = false;
	if (window.XMLHttpRequest) { // Mozilla, Safari,...
       	request = new XMLHttpRequest();
    	if (request.overrideMimeType) {
       	    request.overrideMimeType('application/json');
       	}
    } 
    else if (window.ActiveXObject) { // IE
       	try {
           	request = new ActiveXObject("Msxml2.XMLHTTP");
       	} 
       	catch (e) {
           	try {
           		request = new ActiveXObject("Microsoft.XMLHTTP");
           	} 	
           	catch (e) {}
        }
    }
    if (!request) {
    	alert('Cannot create XMLHTTP instance');
        return false;
    }	

	return request
}
