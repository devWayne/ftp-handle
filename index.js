'use strict';

var Net = require('net');
var EventEmitter = require('events').EventEmitter;
var es = require('event-stream');
var ResponseParser = require('ftp-response-parser');
var fs = require('fs');

var FTP = function(options) {
    this.commandQueue = [];
    this.host = options.host || '';
    this.port = options.port || '';
    this.user = options.user || '';
    this.pass = options.pass || '';
    this.socket = this.createSocket(this.port, this.host);
}

FTP.prototype.createSocket = function(port, host) {
    if (this.socket && this.socket.destroy) {
        this.socket.destroy();
    }
     this.pipeline = es.pipeline(this.socket, this.resParser);
};

FTP.prototype.put = function(from, to, callback) {

}

FTP.prototype.execute = function(action, callback) {
  if (this.socket && this.socket.writable) {
    return this.runCommand(action, callback || NOOP);
  }

  var self = this;
  this.authenticated = false;
  this.createSocket(this.port, this.host, function() {
    self.runCommand(action, callback || NOOP);
  });
};

Ftp.prototype.runCommand = function(action, callback) {
  var cmd = {
    action: action,
    callback: callback
  };

  if (this.authenticated || /feat|syst|user|pass/.test(action)) {
    this.commandQueue.push(cmd);
    this.nextCmd();
    return;
  }

  var self = this;
  this.getFeatures(function() {
    self.auth(self.user, self.pass, function() {
      self.commandQueue.push(cmd);
      self.nextCmd();
    });
  });
};


Ftp.prototype.nextCmd = function() {
  if (!this.inProgress && this.commandQueue[0]) {
    this.send(this.commandQueue[0].action);
    this.inProgress = true;
  }
};

Ftp.prototype.send = function(command) {
  if (!command) return;
  this.pipeline.write(command + '\r\n');
};

module.exports=FTP;
