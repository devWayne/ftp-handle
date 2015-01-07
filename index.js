'use strict';

var Net = require('net');
var EventEmitter = require('events').EventEmitter;
var es = require('event-stream');

var fs = require('fs');

var FTP=function(options){
	this.socket=this.createSocket(this.port,this.host);
}

FTP.prototype.createSocket=function(port,host){
 if (this.socket && this.socket.destroy) {
    this.socket.destroy();
  }
};

FTP.prototype.get=function(remotePath, localPath, callback) {
}
