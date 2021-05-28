"use strict";

/* The makeXhrRequest() function is used to retrive data from a server with an AJAX / XHR call.
@param {string} url - URL of the resource endpoint to be accessed.
@param {function} [callback = null] - callback function to be executed if the AJAX request is successful, the raw response data obtained from the AJAX call is passed to the callback function.
@param {string} [method = 'GET'] - the HTTP method of the AJAX call in the form of an HTTP verb
@param {string} [expectedResponseType = ""] - the expected data response type that will be received by a successful AJAX call, such as text or json; text is expected by default. If the AJAX call is set for syncronous operation (see next parameter), the default expected data type of text will be expected.
@param {bool} [asyncMode = true] - set the AJAX call to take place asyncronously or syncronously, set to true for asyncronously and false for syncronously.
@param {string} [username = null] - the username credential for accessing the HTTP resource, if necessary.
@param {string} [password = null] - the password credential for accessing the HTTP resource, if necessary.
*/
function makeXhrRequest(url, callback = null, method = 'GET', expectedResponseType = "", asyncMode = true, username = null, password = null){
    
    const xhr = new XMLHttpRequest();

    xhr.open(method, url, asyncMode, username, password);

    xhr.onerror = function() {
        console.log(`Error Encountered: Status Code (${this.status}) // Ready State (${this.readyState})`);
    };

    xhr.onload = function() {
        if (this.status === 200) {
            
            const response = this.responseText;
            
            if (!callback) {
                console.log(response);
            } else {
                callback(response);                
            }
        }
    };

    if (asyncMode) {
        xhr.responseType = expectedResponseType;        
    };

    xhr.send();

    return xhr.responseText;

};

