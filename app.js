import {inject} from 'aurelia-framework';
import {HttpClient} from 'aurelia-http-client';
import {TaskQueue} from 'aurelia-task-queue';

@inject(HttpClient, TaskQueue)
export class App {
  constructor(http, taskQueue){
    this.http = http;

    this.taskQueue = taskQueue;

    this.withCircuitBreakerOutput = "";
    this.noCircuitBreakerOutput = "";
  }

  requestDataWithCircuitBreaker = function() {
    for (let i = 1; i <= 100; i++){
      this.http.get('http://localhost:9002')
      .then((response) => {
        this.logResponse(i, response, true);
        this.moveOutputTextAreaToBottom(true);
      })
      .catch((err)=> {
        this.logError(i, err, true);
        this.moveOutputTextAreaToBottom(true);
      });
    }
  }

  requestDataNoCircuitBreaker = function() {
    for (let i = 1; i <=100; i++){
      this.http.get('http://localhost:9001')
      .then((response) => {
        this.logResponse(i, response, false);
        this.moveOutputTextAreaToBottom(false);
      })
      .catch((err)=> {
        this.logError(i, err, false);
        this.moveOutputTextAreaToBottom(false);
      });
    }
  }

  logResponse = function(requestNumber, response, circuitBreaker){
    if(circuitBreaker){
      this.withCircuitBreakerOutput += "Response " + requestNumber + ": " + response.response + "\n";
    }
    else {
      this.noCircuitBreakerOutput += "Response " + requestNumber + ": " + response.response + "\n";
    }
  }

  logError = function(requestNumber, error, circuitBreaker){
    if(circuitBreaker){
      this.withCircuitBreakerOutput += "Error " + requestNumber + ": " + error.statusCode + " - " + error.response;
    }
    else {
      this.noCircuitBreakerOutput += "Error " + requestNumber + ": " + error.statusCode + " - " + error.statusText + "\n";
    }
  }

  moveOutputTextAreaToBottom(circuitBreaker){
    var id = "";
    if(circuitBreaker) {
      id = "withCircuitBreakerTextArea";
    } else {
      id = "noCircuitBreakerTextArea";
    }

    this.taskQueue.queueMicroTask(() => {
          if(document.getElementById(id)) {
            document.getElementById(id).scrollTop = document.getElementById(id).scrollHeight;
          }
      });
  }
}
