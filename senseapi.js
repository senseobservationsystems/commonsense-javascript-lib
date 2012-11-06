/* Copyright (©) [2012] Sense Observation Systems B.V.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *  http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */


/**
 * JavaScipt CommonSense API Library
 * Author: Freek van Polen, Sense
 * Date: 19-10-2012
 * Dependencies:
 *          json2.js --> https://github.com/douglascrockford/JSON-js
 *          md5hash --> http://crypto-js.googlecode.com/svn/tags/3.0.2/build/rollups/md5.js
**/

/**
 * ERROR CODES:
 * 0 - No Error
 * 1 - No XMLHttpRequest object
 * 2 - Wrong method given
 * 3 - Error in connection/request
 * 4 - Invalid arguments
 */

var SenseApi = (function () {
// the object to return at the end
	var api = {};

// helper function to obtain an XMLHttpRequest object
    getXMLHttpRequest = function () {
        r = false;
        if (window.XMLHttpRequest) { // Mozilla, Safari,...
            r = new XMLHttpRequest();
        }
        else if (window.ActiveXObject) { // IE
            try {
                r = new ActiveXObject("Msxml2.XMLHTTP");
            }
            catch (e) {
                try {
                    r = new ActiveXObject("Microsoft.XMLHTTP");
                }
                catch (e) {}
            }
        }
        if (!r) {
            alert('Cannot create XMLHTTP instance');
            return false;
        }

        return r;
    };

// private variables
	var request 			= getXMLHttpRequest();
	var session_id 			= "";
	var response_status 	= 0;
	var response_header 	= {};
	var response_data 		= {};
	var error_code			= 0;
	var api_url				= "https://api.sense-os.nl";
	var server              = "live";

// private funtions
	SenseApiCall = function (method, url, data, headers) {
		if (request == false) {
			error_code = 1;
			return false;
		}
		if (method != "GET" && method != "POST" && method != "DELETE" && method != "PUT") {
			error_code = 2;
			return false;
		}
		
		// construct the url
		var full_url = api_url+url;
		if (method == "GET" || method == "DELETE") {
			// supply data as url parameters
			var str = [];
			for(var p in data) {
				str.push(encodeURIComponent(p) + "=" + encodeURIComponent(data[p]));
			}
			full_url = api_url + url + "?"+str.join("&");
		}
		
		request.open(method, full_url, false);
		
		// send headers
		for (var i=0; i<headers.length; i++) {
			request.setRequestHeader(headers[i].header_name, headers[i].header_value);
		}
		request.setRequestHeader('Content-type', 'application/json');
		request.setRequestHeader('Accept', '*');
		if (session_id != "") {
			request.setRequestHeader('X-SESSION_ID', session_id);
		}
		
		// send data
		if (method == "POST" || method == "PUT") {
			if (typeof(data) == 'object')
				request.send(JSON.stringify(data));
			else if (typeof(data) == 'string') 
				request.send(data);
			else 
				request.send('');
		}
		else {
			request.send('');
		}
		
		// obtain status
		response_status = request.status;
		
		// obtain headers
		response_header = {};
		var loc = request.getResponseHeader("Location");
		var sid = request.getResponseHeader("X-SESSION_ID");
		if (loc != null) {
			response_header['Location'] = loc;
		}
		if (sid != null) {
			response_header['X-SESSION_ID'] = sid;
		}
		
		// obtain response data
		response_data = request.responseText;
		
		// decide on return value
		if (response_status == 200 || response_status == 201 || response_status == 302) {
			return true;
		}
		else {
			error_code = 3;
			return false; 
		}
	};


// public access functions
	api.getSessionId = function () {
        return session_id;
    };

    api.getServer = function () {
        return server;
    };

    api.getApiUrl = function () {
        return api_url;
    };

    api.getResponseStatus = function () {
        return response_status;
    };

    api.getResponseHeader = function () {
        return response_header;
    };

    api.getResponseData = function () {
        return response_data;
    };

    api.getErrorCode = function () {
        return error_code;
    };

// public set functions
    api.setSessionId = function (s) {
        session_id = s;
    };

    api.setServer = function (s) {
        if (s == 'live') {
            server = s;
            api_url = "https://api.sense-os.nl";
            return true;
        }
        else if (s == 'dev') {
            server = s;
            // NOTE: cant use https on dev server!
            api_url = "http://api.dev.sense-os.nl";
            return true;
        }

        return false;
    };

// public api call functions

    /// A U T H E N T I C A T I O N ///

    api.AuthenticateSessionId = function (username, password) {
        var data = {"username":username, "password":password};
        if (SenseApiCall("POST", "/login.json", data, [])) {
            session_id = response_header['X-SESSION_ID'];
            return true;
        }
        else {
            return false;
        }
    };

    api.LogoutSessionId = function () {
        if (SenseApiCall("POST", "/logout.json", {}, [])) {
            session_id = "";
            return true;
        }
        else {
            return false;
        }
    };

    
    /// D A T A  P R O C E S S O R S ///
    
    api.DataProcessorPost = function (parameters) {
    	if(SenseApiCall("POST", "/dataprocessors.json", parameters, []))
    		return true;
    	else
    		return false;
    };
    
    api.DataProcessorGet = function (processor_id) {
		if (SenseApiCall("GET", "/dataprocesors/"+processor_id+".json", {}, []))
			return true;
		else 
			return false;
    };
    
    api.DataProcessorsGet = function (parameters) {
   		if (SenseApiCall("GET", "/dataprocessors.json", parameters, []))
   			return true;
   		else 
   			return false;
    };
    
    api.DataProcessorPut = function (parameters, processor_id) {
    	if (SenseApiCall("PUT", "/dataprocessors/"+processor_id+".json", parameters, []))
    		return true;
    	else
    		return false;
    };
    
    api.DataProcessorDelete = function (processor_id) {
    	if (SenseApiCall("DELETE", "/dataprocessors/"+processor_id+".json", {}, []))
    		return true;
    	else 
    		return false;
    };
    
    
    /// D A T A  P R O C E S S O R S  &  F I L E S ///
    
    api.DataProcessorsFileGet = function (filename) {
    	if (SenseApiCall("GET", "/dataprocessors/files/"+filename, {}, []))
    		return true;
    	else 
    		return false;
    };
    
    api.DataProcessorsFilePost = function (filename, filedata) {
    	if (SenseApiCall("POST", "/dataprocessors/files/"+filename, filedata, []))
    		return true;
    	else
    		return false;
    };
    
    api.DataProcessorsFilePut = function (filename, filedata) {
    	if (SenseApiCall("PUT", "/dataprocessors/files/"+filename, filedata, []))
    		return true;
    	else
    		return false;
    };
    
    api.DataProcessorsFileDelete = function (filename) {
    	if (SenseApiCall("DELETE", "/dataprocessors/files/"+filename, {}, []))
    		return true;
    	else
    		return false;
    };
    
    /// D E V I C E S ///

    api.DeviceGet = function(device_id) {
		if (SenseApiCall("GET", "/devices/"+device_id+".json", {}, []))
			return true;
		else
			return false;
    };
    
    api.DevicesGet = function (parameters) {
   		if (SenseApiCall("GET", "/devices.json", parameters, []))
   			return true;
   		else
   			return false;
    };

    api.DeviceSensorsGet = function (device_id, parameters) {
    	if (SenseApiCall("GET", "/devices/"+device_id+"/sensors.json", parameters, []))
    		return true;
    	else
    		return false;
    };
    
    
    /// E N V I R O N M E N T S ///

    api.EnvironmentGet = function (environment_id) {
        if (SenseApiCall("GET", "/environments/"+environment_id+".json", {}, []))
            return true;
        else
            return false;
    };
    
    api.EnvironmentsGet = function () {
        if (SenseApiCall("GET", "/environments.json", {}, []))
            return true;
        else
            return false;
    };

    api.EnvironmentPost = function (parameters) {
        if (SenseApiCall("POST", "/environments.json", parameters, []))
            return true;
        else
            return false;
    };

    api.EnvironmentPut = function (environment_id, parameters) {
    	if (SenseApiCall("PUT", "/environments/"+environment_id+".json", parameters, []))
    		return true;
    	else
    		return false;
    };
    
    api.EnvironmentDelete = function (environment_id) {
        if (SenseApiCall("DELETE", "/environments/"+environment_id+".json", {}, []))
            return true;
        else
            return false;
    };
    
    
    // E N V I R O N M E N T S  &  S E N S O R S ///
    
    api.EnvironmentSensorsGet = function (environment_id, parameters) {
    	if (SenseApiCall("GET", "/environments/"+environment_id+"/sensors.json", parameters, []))
    		return true;
    	else 
    		return false;
    };
    
    api.EnvironmentSensorPost = function (environment_id, parameters) {
    	if (SenseApiCall("POST", "/environments/"+environment_id+"/sensors.json", parameters, []))
    		return true;
    	else
    		return false;
    };
    
    api.EnvironmentSensorDelete = function (environment_id, sensor_id) {
    	if (SenseApiCall("POST", "/environments/"+environment_id+"/sensors/"+sensor_id+".json", {}, []))
    		return true;
    	else 
    		return false;
    };
    
    /// G R O U P S ///
    
    api.GroupGet = function (group_id) {
    	if (SenseApiCall("GET", "/groups/"+group_id+".json", {}, []))
    		return true;
    	else
    		return false;
    };
    
    api.GroupsGet = function (parameters) {
    	if (SenseApiCall("GET", "/groups.json", parameters, []))
    		return true;
    	else
    		return false;
    };
    
    api.GroupsGetAll = function (parameters) {
    	if (SenseApiCall("GET", "/groups/all.json", parameters, []))
    		return true;
    	else
    		return false;
    };
    
    api.GroupPost = function (parameters) {
    	if (SenseApiCall("POST", "/groups.json", parameters, []))
    		return true;
    	else 
    		return false;
    };
    
    api.GroupPut = function (group_id, parameters) {
    	if (SenseApiCall("PUT", "/groups/"+group_id+".json", parameters, []))
    		return true;
    	else
    		return false;
    };
    
    api.GroupDelete = function (group_id) {
    	if (SenseApiCall("DELETE", "/groups/"+group_id+".json", {}, []))
    		return true;
    	else
    		return false;
    };
    
    
    /// G R O U P S  &  U S E R S ///
    
    api.GroupUserGet = function (group_id, user_id) {
    	if (SenseApiCall("GET", "/groups/"+group_id+"/users/"+user_id+".json", {}, []))
    		return true;
    	else
    		return false;
    };
    
    api.GroupUsersGet = function (group_id, parameters) {
    	if (SenseApiCall("GET", "/groups/"+group_id+"/users.json", parameters, []))
    		return true;
    	else
    		return false;
    };
    
    api.GroupUsersPost = function (group_id, parameters) {
    	if (SenseApiCall("POST", "/groups/"+group_id+"/users.json", parameters, []))
    		return true;
    	else
    		return false;
    };
    
    api.GroupUserPut = function (group_id, user_id, parameters) {
    	if (SenseApiCall("PUT", "/groups/"+group_id+"/users/"+user_id+".json", parameters, []))
    		return true;
    	else
    		return false;
    };
    
    api.GroupUserDelete = function (group_id, user_id) {
    	if (SenseApiCall("DELETE", "/groups/"+group_id+"/users/"+user_id+".json", {}, []))
    		return true;
    	else
    		return false;
    };
    
    
    /// G R O U P S  &  S E N S O R S ///
    
    api.GroupSensorsGet = function (group_id, parameters) {
    	if (SenseApiCall("GET", "/groups/"+group_id+"/sensors.json", parameters, []))
    		return true;
    	else
    		return false;
    };
    
    api.GroupSensorsPost = function (group_id, parameters) {
    	if (SenseApiCall("POST", "/groups/"+group_id+"/sensors.json", parameters, []))
    		return true;
    	else
    		return false;
    };
    
    api.GroupSensorDelete = function (group_id, sensor_id) {
    	if (SenseApiCall("DELETE", "/groups/"+group_id+"/sensors/"+sensor_id+".json", {}, []))
    		return true;
    	else
    		return false;
    };
    
    
    /// S E N S O R S ///

    api.SensorGet = function (sensor_id) {
        if (SenseApiCall("GET", "/sensors/"+sensor_id+".json", {}, []))
            return true;
        else
            return false;
    };
    
    api.SensorsGet = function (parameters, sensor_id) {
    	if (SenseApiCall("GET", "/sensors.json", parameters, []))
        	return true;
    	else
        	return false;
    };

    api.SensorDelete = function (sensor_id) {
        if (SenseApiCall("DELETE", "/sensors/"+sensor_id+".json", {}, []))
            return true;
        else
            return false;
    };

    api.SensorPost = function (parameters) {
        if (SenseApiCall("POST", "/sensors.json", parameters, []))
            return true;
        else
            return false;
    };

    api.SensorsFind = function (namespace, parameters) {
        if (SenseApiCall("POST", "/sensors/find.json?namespace="+namespace, parameters, []))
            return true;
        else
            return false;
    };


    /// S E N S O R S  &  D A T A ///

    api.SensorDataGet = function (sensor_id, parameters) {
        if (SenseApiCall("GET", "/sensors/"+sensor_id+"/data.json", parameters, []))
            return true;
        else
            return false;
    };

    api.SensorDataPost = function (sensor_id, data) {
        if (SenseApiCall("POST", "/sensors/"+sensor_id+"/data.json", data, []))
            return true;
        else
            return false;
    };

    api.SensorsDataPost = function (data) {
        if (SenseApiCall("POST", "/sensors/data.json", data, []))
            return true;
        else
            return false;
    };

    api.SensorDataDelete = function (sensor_id, data_id) {
    	if (SenseApiCall("DELETE", "/sensors/"+sensor_id+"/data/"+data_id+".json", {}, []))
    		return true;
    	else
    		return false;
    };
    

    /// S E N S O R S  &  E N V I R O N M E N T S ///
    
    api.SensorEnvironmentGet = function (sensor_id) {
    	if (SenseApiCall("GET", "/sensors/"+sensor_id+"/environment.json", {}, []))
    		return true;
    	else
    		return false;
    };
    
    
    /// S E N S O R S  &  D E V I C E S ///
    
    api.SensorDeviceGet = function (sensor_id) {
    	if (SenseApiCall("GET", "/sensors/"+sensor_id+"/device.json", {}, [])) 
    		return true;
    	else
    		return false;
    };
    
    api.SensorDevicePost = function (sensor_id, parameters) {
    	if (SenseApiCall("POST", "/sensors/"+sensor_id+"/device.json", parameters, []))
    		return true;
    	else
    		return false;
    };
    
    api.SensorDeviceDelete = function (sensor_id) {
    	if (SenseApiCall("DELETE", "/sensors/"+sensor_id+"/device.json", {}, []))
    		return true;
    	else
    		return false;
    };
    

    /// S E N S O R S  &  S E R V I C E S ///

    api.SensorsServicesAvailableGet = function () {
    	if (SenseApiCall("GET", "/sensors/services/available.json", {}, []))
    		return true;
    	else
    		return false;
    };
    
    api.SensorServicesRunningGet = function (sensor_id) {
        if (SenseApiCall("GET", "/sensors/"+sensor_id+"/services.json", {}, []))
            return true;
        else
            return false;
    };

    api.SensorServicesAvailableGet = function (sensor_id) {
    	if (SenseApiCall("GET", "/sensors/"+sensor_id+"/services/available.json", {}, []))
    		return true;
    	else
    		return false;
    };
    
    api.SensorServicePost = function (sensor_id, parameters) {
        if (SenseApiCall("POST", "/sensors/"+sensor_id+"/services.json", parameters, []))
            return true;
        else
            return false;
    };

    api.SensorServiceDelete = function (sensor_id, service_id) {
        if (SenseApiCall("DELETE", "/sensors/"+sensor_id+"/services/"+service_id+".json", {}, []))
            return true;
        else
            return false;
    };

    api.SensorServiceMethodsGet = function (sensor_id, service_id) {
    	if (SenseApiCall("GET", "/sensors/"+sensor_id+"/services/"+service_id+"/methods.json", {}, []))
    		return true;
    	else
    		return false;
    };

    api.SensorServiceLearn = function (sensor_id, service_id, parameters) {
    	if (SenseApiCall("POST", "/sensors/"+sensor_id+"/services/"+service_id+"/manualLearn.json", parameters, []))
    		return true;
    	else
    		return false;
    };
    
    api. SensorServiceMethodGet = function (sensor_id, service_id, method_name, parameters) {
    	if (SenseApiCall("GET", "/sensors/"+sensor_id+"/services/"+service_id+"/"+method_name+".json", parameters, []))
    		return true;
    	else
    		return false;
    };

    api. SensorServiceMethodPost = function (sensor_id, service_id, method_name, parameters) {
    	if (SenseApiCall("POST", "/sensors/"+sensor_id+"/services/"+service_id+"/"+method_name+".json", parameters, []))
    		return true;
    	else
    		return false;
    };

    
    /// M E T A T A G S ///

    api.SensorsMetatagsGet = function (namespace, parameters) {
    	var ns = (namespace != null) ? namespace : "default";
    	parameters.namespace = ns
        if (SenseApiCall("GET", "/sensors/metatags.json", parameters, []))
            return true;
        else
            return false;
    };

    api.SensorMetatagsGet = function (sensor_id, namespace) {
    	var ns = (namespace != null) ? namespace : "default";
    	if (SenseApiCall("GET", "/sensors/"+sensor_id+"/metatags.json", {'namespace':ns}, []))
            return true;
        else
            return false;
    };

    api.SensorMetatagsPost = function (sensor_id, namespace, metatags) {
    	var ns = (namespace != null) ? namespace : "default";
        if (SenseApiCall("POST", "/sensors/"+sensor_id+"/metatags.json?namespace="+ns, metatags, []))
            return true;
        else
            return false;
    };
    
    api.SensorMetatagsPut = function (sensor_id, namespace, metatags) {
    	var ns = (namespace != null) ? namespace : "default";
    	if (SenseApiCall("PUT", "/sensors/"+sensor_id+"/metatags.json?namespace="+ns, metatags, []))
    		return true;
    	else
    		return false;
    };
    
    api.SensorMetatagsDelete = function (sensor_id, namespace) {
    	var ns = (namespace != null) ? namespace : "default";
        if (SenseApiCall("DELETE", "/sensors/"+sensor_id+"/metatags.json", {'namespace':ns}, []))
            return true;
        else
            return false;
    };
   
    
    /// U S E R S ///

    api.UserCurrentGet = function () {
        if (SenseApiCall("GET", "/users/current.json", {}, []))
            return true;
        else
            return false;
    };

    api.UsersGet = function (parameters) {
    	if (SenseApiCall("GET", "/users.json", parameters, []))
    		return true;
    	else
    		return false;
    };
    
    api.UserGet = function (user_id) {
    	if (SenseApiCall("GET", "/users/"+user_id+".json", {}, []))
    		return true;
    	else 
    		return false;
    };
    
    api.UserPost = function (parameters) {
    	if (SenseApiCall("POST", "/users/"+user_id+".json", parameters, []))
    		return true;
    	else
    		return false;
    };
    
    api.UserPut = function (user_id, parameters) {
    	if (SenseApiCall("PUT", "/users/"+user_id+".json", parameters, []))
    		return true;
    	else
    		return false;
    };
    
    api.UserDelete = function (user_id) {
    	if (SenseApiCall("DELETE", "/users/"+user_id+".json", {}, []))
    		return true;
    	else
    		return false;
    };
    
    
// return the api object
	return api;

}());

