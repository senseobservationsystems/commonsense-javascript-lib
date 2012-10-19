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
            if (r.overrideMimeType) {
                r.overrideMimeType('application/json');
            }
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
			full_url += "?"+str.join("&");
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
		request.send(JSON.stringify(data));
		
		// obtain status
		response_status = request.status;
		
		// obtain headers
		resp_h = request.getAllResponseHeaders();
		resp_h = resp_h.split(/\r\n|\r|\n/);
		response_header = {};
		for (var i=0; i<resp_h.length; i++) {
			h = resp_h[i].split(": ");
			if(h[0] != "") 
				response_header[h[0]] = h[1];
		}
		console.log(response_header);
		
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
        data = {"username":username, "password":password};
        if (SenseApiCall("POST", "/login.json", data, [])) {
            session_id = JSON.parse(response_data).session_id;
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


    /// S E N S O R S ///

    api.SensorsGet = function (parameters, sensor_id) {
        if (!parameters && !sensor_id) {
            error_code = 4;
            return false;
        }
        if (parameters) {
            if (SenseApiCall("GET", "/sensors.json", parameters, []))
                return true;
            else
                return false;
        }
        if (sensor_id) {
            if (SenseApiCall("GET", "/sensors/"+sensor_id+".json", {}, []))
                return true;
            else
                return false;
        }

        error_code = 4;
        return false;

    };

    api.SensorsDelete = function (sensor_id) {
        if (SenseApiCall("DELETE", "/sensors/"+sensor_id+".json", {}, []))
            return true;
        else
            return false;
    };

    api.SensorsPost = function (parameters) {
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


    /// S E N S O R  D A T A ///

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


    /// M E T A T A G S ///

    api.SensorsMetatagsGet = function (parameters) {
        if (SenseApiCall("GET", "/sensors/metatags.json", parameters, []))
            return true;
        else
            return false;
    };

    api.SensorMetatagsGet = function (sensor_id, parameters) {
        if (SenseApiCall("GET", "/sensors/"+sensor_id+"/metatags.json", parameters, []))
            return true;
        else
            return false;
    };

    api.SensorMetatagsPost = function (sensor_id, namespace, parameters) {
        if (SenseApiCall("POST", "/sensors/"+sensor_id+"/metatags.json?namespace="+namespace, parameters, []))
            return true;
        else
            return false;
    };

    api.SensorMetatagsDelete = function (sensor_id) {
        if (SenseApiCall("DELETE", "/sensors/"+sensor_id+"/metatags.json", {}, []))
            return true;
        else
            return false;
    };


    /// E N V I R O N M E N T S ///

    api.EnvironmentsGet = function () {
        if (SenseApiCall("GET", "/environments.json", {}, []))
            return true;
        else
            return false;
    };

    api.EnvironmentGet = function (environment_id) {
        if (SenseApiCall("GET", "/environments/"+environment_id+".json", {}, []))
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

    api.EnvironmentDelete = function (environment_id) {
        if (SenseApiCall("DELETE", "/environments/"+environment_id+".json", {}, []))
            return true;
        else
            return false;
    };


    /// S E R V I C E S ///

    api.ServicesGet = function (sensor_id) {
        if (SenseApiCall("GET", "/sensors/"+sensor_id+"/services.json", {}, []))
            return true;
        else
            return false;
    };

    api.ServicesPost = function (sensor_id, parameters) {
        if (SenseApiCall("POST", "/sensors/"+sensor_id+"/services.json", parameters, []))
            return true;
        else
            return false;
    };

    api.ServicesDelete = function (sensor_id, service_id) {
        if (SenseApiCall("DELETE", "/sensors/"+sensor_id+"/services/"+service_id+".json", {}, []))
            return true;
        else
            return false;
    };

    api.ServicesSetExpression = function (sensor_id, service_id, parameters) {
        if (SenseApiCall("POST", "/sensors/"+sensor_id+"/services/"+service_id+"/SetExpression.json", parameters, []))
            return true;
        else
            return false;
    };

    api.ServicesSetUseDataTimestamp = function (sensor_id, service_id, parameters) {
        if (SenseApiCall("POST", "/sensors/"+sensor_id+"/services/"+service_id+"/SetUseDataTimestamp.json", parameters, []))
            return true;
        else
            return false;
    };


    /// U S E R S ///

    api.UsersGetCurrent = function () {
        if (SenseApiCall("GET", "/users/current.json", {}, []))
            return true;
        else
            return false;
    };


// return the api object
	return api;

}());

