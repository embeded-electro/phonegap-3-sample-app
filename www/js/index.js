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
 


//Sending data to server
function sendtoServer(nm, em){
	$.ajax({
	   type: "POST",
	   url: "http://makefbcovers.com/demos/drag/test.php",
	   data: {name: nm, email:em},
	   success: function(data) {
		 alert("Success: "+data);
		 username = data;
		 $.mobile.loading( 'hide' );
		 $.mobile.changePage($('#userpage'));
		 $("#home").trigger("pagecreate");
		 $("#phonenumber").val('');
	   },
	   error: function(xhr, ajaxOptions, thrownError) {
		 alert(xhr.status);
		 alert(thrownError);
	   }
	});
}

//Submit Form Example
function submitForm(){
	$("#loginForm").on("submit",function(e) {
    //disable the button so we can't resubmit while we wait
		var email = $("#email").val();
		var uid = $("#username").val();
		if(uid != '' && email!= '') {
			$("#submitButton",this).attr("disabled","disabled");
			sendtoServer(uid, email);
		}
		else{
			alert('Error: missing something');
		}
		return false;
});
}

//Init Page2
$(document).on('pageinit', '#userpage', function(){
    $('.ui-content').find('h1').text("Welcome "+username);
	appcontent = $('#app-content').html();
	$('.pushm').text("Device Confirmed: Device id-"+tempid);
});

//Initialize some variables
var tempid;
var username,appcontent;

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
					tempid = e.regid;
                }
            break;
 
            case 'message':
              // this is the actual push notification. its format depends on the data model from the push server
              alert('push message = '+e.message);
			  appcontent.find('.pushm').text('Push Message: '+e.message);
			  $('#app-content').append(appcontent).listview('refresh');
			  
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
