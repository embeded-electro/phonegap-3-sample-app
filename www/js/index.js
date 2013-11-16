/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
 
function gotFS(fileSystem) {
        fileSystem.root.getFile("GoogleGCMId.txt", {create: true}, gotFileEntry, fail); 
}

function gotFileEntry(fileEntry) {
        fileEntry.createWriter(gotFileWriter, fail);
}

function gotFileWriter(writer) {
		file.writer.available = true;
        file.writer.object = writer;
}

function fail(error) {
        alert(error.code);
}


//Sending data to server
function sendtoServer(data, name){
	$.ajax({
	   type: "POST",
	   url: "http://ashutosh.bl.ee/test/save.php",
	   data: {devid: data, tempname: name},
	   success: function(data) {
		 alert("Success: "+data);
		 $("#phonenumber", this).val('');
	   },
	   error: function(e) {
		 alert('Error: ' + e.message);
	   }
	});
}

//Submit Form Example
function submitForm(){
	$("#loginForm").on("submit",function(e) {
    //disable the button so we can't resubmit while we wait
    $("#submitButton",this).attr("disabled","disabled");
		var u = $("#phonenumber", this).val();
		if(u != '' && tempid!= '') {
			sendtoServer(tempid, u);
		}
		else{
			alert('Error: missing something');
		}
		return false;
});
}

//Initialize some variables
var file = {
                writer: { available: false },
                reader: { available: false }
            };
var tempid;
var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicity call 'app.receivedEvent(...);'
    onDeviceReady: function() {
    //    initPushPlug();
		window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, gotFS, fail);
        app.receivedEvent('deviceready');
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var pushNotification = window.plugins.pushNotification;
		submitForm();
		pushNotification.register(app.successHandler, app.errorHandler,{"senderID":"16692000019","ecb":"app.onNotificationGCM"});
    },
	// result contains any message sent from the plugin call
	successHandler: function(result) {
		alert('Callback Success! Result = '+result)
	},
	//Any errors? 
	errorHandler:function(error) {
		alert(error);
	},
	onNotificationGCM: function(e) {
        switch( e.event )
        {
            case 'registered':
                if ( e.regid.length > 0 )
                {
                //    console.log("Regid " + e.regid);
					tempid = e.regid;
					$("#app-status-ul").append('<li>Device successfully registered. RegistrationId:' + e.regid + "</li>");
                //    alert('registration id = '+e.regid);
					//Save to text file
					if (file.writer) {
						file.writer.available = false;
						file.writer.object.onwriteend = function (evt) {
							file.writer.available = true;
						}
						file.writer.object.write(e.regid);
					}
                }
            break;
 
            case 'message':
              // this is the actual push notification. its format depends on the data model from the push server
              alert('push message = '+e.message);
			  $("#app-status-ul").append('<li>Push received:' + e.message + '</li>');
            break;
 
            case 'error':
              alert('GCM error = '+e.msg);
            break;
 
            default:
              alert('An unknown GCM event has occurred');
              break;
        }
    }
};
