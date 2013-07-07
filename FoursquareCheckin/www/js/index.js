var app = {
        // Application constructor
    initialize: function() {
        this.bindEvents();
        console.log("Starting Foursquare Checkin app");
    },
/*
    bind any events that are required on startup to listeners:
*/
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
        writeButton.addEventListener('touchstart', app.makeMessage, false);
    },

/*
    this runs when the device is ready for user interaction:
*/
    onDeviceReady: function() {
        var parentElement = document.getElementById("message");
        parentElement.innerHTML = "Tap a tag to read its id number.";

        nfc.addTagDiscoveredListener(
            app.onNfc,                 // tag successfully scanned
            function (status) {        // listener successfully initialized
                app.display("Listening for NFC tags.");
            },
            function (error) {         // listener fails to initialize
                app.display("NFC reader failed to initialize "
                    + JSON.stringify(error));
            }
        )
    },

/*
    displays tag ID from @nfcEvent in message div:
*/

    onNfc: function(nfcEvent) {
        var tag = nfcEvent.tag;
        app.display("Read tag: " + nfc.bytesToHexString(tag.id));
    },

/*
    appends @message to the message div:
*/
     display: function(message) {
        var display = document.getElementById("message"), // the message div
            lineBreak = document.createElement("br"),     // a line break
            label = document.createTextNode(message);     // create the label

        display.appendChild(lineBreak);          // add a line break
        display.appendChild(label);              // add the message node
    },
/*
    clears the message div:
*/
    clear: function() {
        var display = document.getElementById("message");
        display.innerHTML = "";
    },

    makeMessage: function() {
        // Put together the pieces for the NDEF message:
        var tnf = ndef.TNF_EXTERNAL_TYPE,            // NDEF Type Name Format
            recordType = "android.com:pkg",          // NDEF Record Type
            payload = "com.joelapenna.foursquared",  // content of the record
            record,                                  // NDEF record object
            message = [];               // NDEF Message to pass to writeTag()

        // create the actual NDEF record:
        record = ndef.record(tnf, recordType, [], payload);
        // put the record in the message array:
        message.push(record);
        //write the message:
        app.writeTag(message);
    },

    writeTag: function(message) {
        // write the record to the tag:
        nfc.write(
            message,            // write the record itself to the tag
            function () {       // when complete, run this callback function:
                app.clear();    // clear the message div
                app.display("Wrote data to tag.");   // write to the message div
                navigator.notification.vibrate(100); // vibrate the device
            },
            // this function runs if the write command fails:
            function (reason) {
                navigator.notification.alert(reason, function(){},
                    "There was a problem");
            }
        );
    }
};      // end of app