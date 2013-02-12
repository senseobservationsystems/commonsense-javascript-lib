$(document).ready(function(){

  SenseApi.setServer('rc');

 
 /*
  * Update list of sensors
  */
 var updateSensors = function(){
    console.log('updateSensors'); 
    SenseApi.callSensorsGet({'page':0, 'per_page':100, 'owned':1});
  
    var obj = $.parseJSON(SenseApi.getResponseData());
    $('#sensors option').remove();
    $(obj.sensors).each(function(i,val){
      $('#sensors').append(new Option(val.name,val.id));
    });
  };
  
  /*
   * Update tags
   */
  var updateTags = function(){
    
    SenseApi.callSensorsMetatagsGet("js_test", {"details":"full"});
    
    var obj = $.parseJSON(SenseApi.getResponseData());
    var out = $('#output');
    out.html('');
    
    $(obj.sensors).each(function(i,val){
      var el = $('<h2>Sensor: '+val.name+'</h2>').appendTo(out);
      if(val.metatags){
        var ul = $('<ul />').appendTo(out);
        for( var key in val.metatags){
          ul.append('<li><b>'+key+':</b> '+val.metatags[key].join(', ')+'</li>');          
        }
      }else{
        el.after('has no metatags');
      }
    });
  }; 
  


  /*
   * Login
   */
  var sid = getParameterByName("session_id");
  $('#sessionId').html(sid); 
  if(sid!=""){
    SenseApi.setSessionId(sid);
    updateSensors();
    updateTags();
    $('#showTags').click();
  }else{
    $('#stuff').hide();
  }
  
  $('#login').click(function(){
    SenseApi.authenticateSessionId($('#user').val(),CryptoJS.MD5($('#pass').val()).toString());
    window.location += "?session_id="+SenseApi.getSessionId();
    updateSensors();
    updateTags();
    $('#stuff').show();
  });
 
 
  /*
   * Add sensor
   */
  $('#addSensor').click(function(){
    SenseApi.callSensorPost({
      "sensor":{
        "name":$('#newSensorName').val(), 
        "display_name":$('#newSensorName').val(), 
        "device_type":"Sumptin", 
        "data_type":"string"}});
    updateSensors();
  });


   
  /*
   * Add tags
   */
  $('#addTag').click(function(){
    var sensorId = $('#sensors').val();
    var tagName = $('#newTagName').val();
    var tagVal = $('#newTagValue').val();
    var tagObj = {};
    tagObj[tagName] = [tagVal];
    SenseApi.callSensorMetatagsPost(sensorId,"js_test", {"metatags":tagObj });
    updateTags();
  });
 
   
});
