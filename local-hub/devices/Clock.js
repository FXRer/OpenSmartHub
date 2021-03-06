/* 
  // Device Type
  "Clock":{ 
      "params":["null"],
      "data":{
        "year":"int",
        "month":"int",
        "day":"int",
        "hour":"int",
        "minute":"int",
        "second":"int",
      },
      "triggers":{
        "specificDateTrigger":["year","month","day","hour","minutes","seconds","milliseconds"],
        "yearlyTrigger":["month","day","hour","minutes","seconds"],
        "monthlyTrigger":["day","hour","minutes","seconds"],
        "dailyTrigger":["hour","minutes","seconds"],
        "intervalTrigger":["hour","minutes","seconds","milliseconds"],
        },
      "actions":{
      }
    }

  // "daysOfTheWeekTrigger":["dates","hour","minutes","seconds","milliseconds"],
*/

var util = require('util');
var EventEmitter = require('events').EventEmitter;

function Clock() {
  /*
  Possible Uses:
    Calendar Timing
      At ... date/time
    Interval Timing
      Every year at ... month/day/hour/minute
      Every month at ... day/hour/minute
      Every day at ... hour/minute
      Every ... hours/minutes/seconds/ms
  */
  EventEmitter.call(this); // This allows for events to be emitted

  this.data = {};
  this.data.year = new Date().getFullYear();
  this.data.month = new Date().getMonth()+1;
  this.data.day = new Date().getDate();
  this.data.hour = new Date().getHours();
  this.data.minute = new Date().getMinutes();
  this.data.second = new Date().getSeconds();

  this.dispose = function(){
  };
};

util.inherits(Clock, EventEmitter);

var continualDataUpdate = function(milliseconds){
  setInterval(getWeatherUndergroundData(), milliseconds);
};

Clock.prototype.specificDateTrigger = function(customName, params){
  var year = params["year"];
  var month = params["month"];
  var day = params["day"];
  var hour = params["hour"];
  var minutes = params["minutes"];
  var seconds = params["seconds"];
  var milliseconds = params["milliseconds"];

  if(
    (year) &&
    (month) &&
    (day) &&
    (hour) &&
    (minutes) &&
    (seconds) &&
    (milliseconds)
  ){ 
    // gets the four digit year (yyyy)
    // Specific date was given to trigger on

    // Find the ms till that date
    var dateObject = new Date(year, month, day, hour, minutes, seconds, milliseconds);
    var msConversionOfTriggerDate = dateObject.getTime();

    // gets current time for use in the "every * at *" trigger
    var currentDateObject = new Date();
    var msConversionOfCurrent = currentDateObject.getTime();
  
    var timeoutMs = msConversionOfTriggerDate - msConversionOfCurrent
    if(timeoutMs > 0)
    {
      setTimeout(function(){
        self.emit(customName);
      }, timeoutMs);
    }
  }
};

Clock.prototype.yearlyTrigger = function(customName, params){
  var month = params["month"];
  var day = params["day"];
  var hour = params["hour"];
  var minutes = params["minutes"];
  var seconds = params["seconds"];

  if(
    (month) &&
    (day) &&
    (hour) &&
    (minutes) &&
    (seconds)
    ){
    // Find the ms till the month
    // Continual interval trigger every year at this month and day
    
    var timeoutMs = 0;
    var recalcuatedTimeoutMs;
    // Gets the difference between today and the next occurance of the month/day combination
    var yearlyInterval = function(customName, params){
      // gets current date
      var currentDateObject = new Date();
      var msConversionOfCurrent = currentDateObject.getTime();

      var dateObject = new Date(
        currentDateObject.getFullYear(),
        month,
        day,
        hour,
        minutes,
        seconds
      );

      dateObject.setFullYear(dateObject.getFullYear()+1);

      var msConversionOfTriggerDate = dateObject.getTime();
      var timeoutMs = msConversionOfTriggerDate - msConversionOfCurrent;
      if(timeoutMs > 0)
      {
        setTimeout(function(){
          self.emit(customName);
          yearlyInterval(customName, params); // calls it again the next year
        }, timeoutMs);
      }
    };
    yearlyInterval(customName, params);
  }
};


Clock.prototype.monthlyTrigger = function(customName, params){
  var day = params["day"];
  var hour = params["hour"];
  var minutes = params["minutes"];
  var seconds = params["seconds"];

  if(
    (day) &&
    (hour) &&
    (minutes) &&
    (seconds)
    ){
    var monthlyInterval = function(customName, params){
      var currentDateObject = new Date();
      var msConversionOfCurrent = currentDateObject.getTime();
      var dateObject = new Date(
        currentDateObject.getFullYear(),
        currentDateObject.getMonth(),
        day,
        hour,
        minutes,
        seconds
      );

      dateObject.setMonth(dateObject.getMonth()+1);

      var msConversionOfTriggerDate = dateObject.getTime();
      var timeoutMs = msConversionOfTriggerDate - msConversionOfCurrent;

      if(timeoutMs > 0)
      {
        setTimeout(function(){
          self.emit(customName);
          monthlyInterval(customName, params); // calls it again the next month
        }, timeoutMs);
      }
    }
    monthlyInterval(customName, params);
  }
}

Clock.prototype.dailyTrigger = function(customName, params){
  var self = this;
  var hour = params["hour"];
  var minutes = params["minutes"];
  var seconds = params["seconds"];
  console.log(hour);
  console.log(minutes);
  console.log(seconds);
  if(
    (hour) &&
    (minutes) &&
    (seconds)
    ){

    // Find the ms till the day
    // Continual interval trigger every month at this day

    // Gets the difference between today and the next occurance of the day/hour combination

    var dailyInterval = function(customName, params){
      var currentDateObject = new Date();
      var msConversionOfCurrent = currentDateObject.getTime();

      var dateObject = new Date(
        currentDateObject.getFullYear(),
        currentDateObject.getMonth(),
        currentDateObject.getDate(),
        hour,
        minutes,
        seconds
      );

      //dateObject.setDate(dateObject.getDate()+1);

      var msConversionOfTriggerDate = dateObject.getTime();
      var timeoutMs = msConversionOfTriggerDate - msConversionOfCurrent;
      console.log(timeoutMs);
      if(timeoutMs > 0)
      {
        setTimeout(function(){
          self.emit(customName);
          dailyInterval(customName, params); // calls it again the next month
        }, timeoutMs);
      }
    };
    dailyInterval(customName, params);
  }
}

/*
Clock.prototype.daysOfTheWeekTrigger = function(customName, params){
  var dates = params["dates"]; // this should be an array of the days of the week to repeat [0,1,2,3,4,5,6] 6 being Sunday and 0 being Monday
  var hour = params["hour"];
  var minutes = params["minutes"];
  var seconds = params["seconds"];
  var milliseconds = params["milliseconds"];

  if(
    (dates) &&
    (hour) &&
    (minutes) &&
    (seconds) &&
    ){
    var dayOfTheWeekInterval = function(customName, params){
      var currentDateObject = new Date();
      var msConversionOfCurrent = currentDateObject.getTime();
      
      // gets weekday as a number (0-6)
      // Find the ms till the specific day of the week
      // Continual interval trigger every _ day of the week 

      // TODO: find closest day after the current date
      var dateObject = new Date(
        currentDateObject.getFullYear(),
        currentDateObject.getMonth(),
        currentDateObject.getDate(),
        hour,
        minutes,
        seconds,
        milliseconds
      );

      // Gets the difference between today and the next occurance defined
      dateObject.setDate(dateObject.getDate()+1);
    }
  }
}
*/

Clock.prototype.intervalTrigger = function(customName, params){
  var self = this;
  // emits the event when the interval occurs
  // gets the interval timing and parses from most significant to least

  var intervalMs = 0;
  var hours = params["hours"];
  var minutes = params["minutes"];
  var seconds = params["seconds"];
  var milliseconds = params["milliseconds"];

  // any smaller than a day means that it i
  if(hours){
    intervalMs += 60*60*1000*hours;
  }
  if(minutes){
    intervalMs += 60*1000*minutes;
  }
  if(seconds){
    intervalMs += 1000*seconds;
  }

  console.log(intervalMs);

  if(intervalMs > 0)
  {
    setInterval(function(){
      self.emit(customName);
    }, intervalMs);
  }
};

module.exports = Clock;

// Example Usage
/*
var clockInstance = new Clock();

// Checks to make sure it inherits EventEmitter
console.log(clockinstance instanceof eventemitter); // true
console.log(clock.super_ === eventemitter); // true

clockInstance["intervalTrigger"](5,"every5seconds");
clockInstance["intervalTrigger"](5,"every5seconds2");
clockInstance.on('every5seconds', function() {
  console.log('on every5seconds was thrown');
});
clockInstance.on('every5seconds2', function() {
  console.log('on every5seconds2 was thrown');
});
*/