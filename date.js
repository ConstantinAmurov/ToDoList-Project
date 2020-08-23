exports.getDate = function() {
  let day = "";

  let options = {
    weekday: 'long',
    day: 'numeric',
    month: 'long'
  };
  let today = new Date();
  //OLD VARIANT
  // var currentDayNr = today.getDay();
  // var weekDays= ['Sunday', 'Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
  // day= weekDays[currentDayNr];
  // 6 is saturday, 0 is sunday ( if it is weekend then =>)
  // To send multiple pieces of html we use res.write(); because there can be only one res.send();

  //NEW VARIANT
  day = today.toLocaleString("en-US", options); //
  return day;
};
exports.getDay = function() {
  let day = "";

  let options = {
    weekday: 'long',
  };
  let today = new Date();
  //OLD VARIANT
  // var currentDayNr = today.getDay();
  // var weekDays= ['Sunday', 'Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
  // day= weekDays[currentDayNr];
  // 6 is saturday, 0 is sunday ( if it is weekend then =>)
  // To send multiple pieces of html we use res.write(); because there can be only one res.send();

  //NEW VARIANT
  day = today.toLocaleString("en-US", options); //
  return day;
};
