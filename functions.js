/**
 * Define our global variables here
 */
var date2 = new Date();                 //Middle date - initialized with today
var date1 = new Date(date2);            //First date - intialized with yesterday
var date3 = new Date(date2);            //Last date - intialized with tomorrow
date1.setDate(date2.getDate() - 1);
date3.setDate(date2.getDate() + 1);

/**
 *  What to do when the page is loaded.
 */
function onPageLoad() {
  
}

/**
 *  What to do when the user has signed in.
 */
function onSignIn() {
  console.log(date1, date2, date3);
  refreshDate();
  console.log(date1, date2, date3);
  updateEventContent();
  document.getElementById("login-container").style.display = "none";
  document.getElementById("application-container").style.display = "block";
}

/**
 *  On add_event_button click, open the add event form.
 */
function OpenAddEventForm() {                                       
  setTimeout(function() {document.getElementById("EventForm").style.transform = "translateY(-100%)";}, 300);
  document.getElementById("add_event_name").focus({preventScroll:true});
}

/**
 *  On close_event__form_button click, open the add event form.
 */
function closeAddEventForm() {
  document.getElementById("EventForm").style.transform = "translateY(0)";
  updateEventContent();
}

/**
 *  When the add event button is pressed, gather the data and create the event.
 */
function addEventPressed() {
  var name = document.getElementById("add_event_name").innerHTML;
  var dateTimeStart = document.getElementById("add_event_date").value;  //Format: 18-12-2020T12:00:00Z
  var dateTimeEnd;
  var location = "unknown";
  var description = document.getElementById("add_event_description").innerHTML;
  var time = document.getElementById("add_event_time").value;
  var endTime = time;
  var reminderMins=document.getElementById("set_reminder").value;
  if (time != null) {//Time was set
    if (time.split(":")[0] == "23") {//If the hour is 23
      endTime = "00:" + time.split(":")[1];
      dateTimeEnd = new Date((new Date(dateTimeStart)).setDate((new Date(dateTimeStart)).getDate() + 1)).toLocaleDateString() + "T" + endTime + ":00Z";;
      dateTimeStart = dateTimeStart + "T" + time +":00Z";
    } else {//If the hour is not 23
      endTime = (parseInt(time.split(":")[0]) + 1).toString() + ":" + time.split(":")[1];
      dateTimeEnd = dateTimeStart + "T" + endTime + ":00Z";
      dateTimeStart = dateTimeStart + "T" + time +":00Z";
    }
  } else {//Time was not set
    arrayDates = wholeDayPair(dateTimeStart);
    dateTimeEnd = arrayDates[1];
    dateTimeStart = arrayDates[0];
  }

  if (name == null || location == null || dateTimeStart == null || dateTimeEnd == null) {//Check if the input is valid
    throw 'Some parameters in addEvent() were null!';
  } else {
    if (description == null) {//If description is null, assign it the empty string.
      description = "";
    }
    console.log(name, location, description, dateTimeStart, dateTimeEnd,reminderMins);
    addEvent(name, location, description, dateTimeStart, dateTimeEnd,reminderMins);
    closeAddEventForm();
  }
}

/**
 * Updates the event content of a content-member with its events.
 * @param {Array} events The events corresponding to {member}
 * @param {int} member The member which corresponds to the date of {events}
 */
function updateContentDate(events, member) {
  removeAllChildNodes(document.getElementById("content-tridaily-member-" + member));
  for (i=0; i < events.length; i++) { // For every event on {date}:
    //Container of the event
    var event_container = document.createElement("div");
    event_container.className = "event-container";

    //Take care of the name section
    var event_title = document.createElement("div");    
    event_title.className = "event-member name";
    event_title.innerHTML += events[i].summary;

    //Take care of the (starting) time section
    var event_time = document.createElement("div");
    event_time.className = "event-member time";
    var dateTime = events[i].start.dateTime;
    event_time.innerHTML += dateTime.split("T")[1].substring(0,5) + " - " + addTimes(dateTime.split("T")[1].substring(0,5), dateTime.split("T")[1].slice(dateTime.split("T")[1].length - 5));
    
    //Take care of the reminder section.
    var event_reminder = document.createElement("div");
    event_reminder.className = "event-member reminder";
    var reminder_img = document.createElement("img");
    reminder_img.src = "img/reminder.png";
    reminder_img.className = "reminder";
    event_reminder.appendChild(reminder_img);    
    var reminder_paragraph = document.createElement("p");
    reminder_paragraph.className = "reminder";
	//Take care of reminder time
	
    if (true) {
      reminder_paragraph.innerHTML += events[i].reminders.overrides[0].minutes + "m";
    } else {
      reminder_paragraph.innerHTML += "5m"
    }
    event_reminder.appendChild(reminder_paragraph);
    
    //Append all the sections to the container
    event_container.appendChild(event_reminder);           
    event_container.appendChild(event_title);
    event_container.appendChild(event_time);
    //Append the container to the right content-tridaily-member div.
    document.getElementById("content-tridaily-member-" + member).appendChild(event_container);
  }
}

/* Date logic starts here */
/**
 *  Refresh the date shown
 */
function refreshDate() {
  var today = new Date();
  var todayMinTwo = new Date(today);
  var todayMinOne = new Date(today);
  var todayPlusOne = new Date(today);
  var todayPlusTwo = new Date(today);
  todayMinTwo.setDate(today.getDate() - 2);
  todayMinOne.setDate(today.getDate() - 1);
  todayPlusOne.setDate(today.getDate() + 1);
  todayPlusTwo.setDate(today.getDate() + 2);
  if (date2.toLocaleDateString() == today.toLocaleDateString()) { //The middle date is today.
    document.getElementById("content-tridaily-date-1").textContent = "Yesterday";
    document.getElementById("content-tridaily-date-2").textContent = "Today";
    document.getElementById("content-tridaily-date-3").textContent = "Tomorrow";
  } else if (date2.toLocaleDateString() == todayMinTwo.toLocaleDateString()) {//The middle date is the day before yesterday
    document.getElementById("content-tridaily-date-1").textContent = date1.toLocaleDateString();
    document.getElementById("content-tridaily-date-2").textContent = date2.toLocaleDateString();
    document.getElementById("content-tridaily-date-3").textContent = "Yesterday";
  } else if (date2.toLocaleDateString() == todayMinOne.toLocaleDateString()) {//The middle date is yesterday
    document.getElementById("content-tridaily-date-1").textContent = date1.toLocaleDateString();
    document.getElementById("content-tridaily-date-2").textContent = "Yesterday"
    document.getElementById("content-tridaily-date-3").textContent = "Today";
  } else if (date2.toLocaleDateString() == todayPlusOne.toLocaleDateString()) {//The middle date is tomorrow
    document.getElementById("content-tridaily-date-1").textContent = "Today";
    document.getElementById("content-tridaily-date-2").textContent = "Tomorrow"
    document.getElementById("content-tridaily-date-3").textContent = date3.toLocaleDateString();
  } else if (date2.toLocaleDateString() == todayPlusTwo.toLocaleDateString()) {//The middle date is the day after tomorrow
    document.getElementById("content-tridaily-date-1").textContent = "Tomorrow";
    document.getElementById("content-tridaily-date-2").textContent = date2.toLocaleDateString();
    document.getElementById("content-tridaily-date-3").textContent = date3.toLocaleDateString();
  } else {//We are not close enough to the current day
    document.getElementById("content-tridaily-date-1").textContent = date1.toLocaleDateString();
    document.getElementById("content-tridaily-date-2").textContent = date2.toLocaleDateString();
    document.getElementById("content-tridaily-date-3").textContent = date3.toLocaleDateString();
  }
  //Set the names of the days.
  document.getElementById("content-tridaily-day-1").textContent = getDayOfWeek(date1);
  document.getElementById("content-tridaily-day-2").textContent = getDayOfWeek(date2);
  document.getElementById("content-tridaily-day-3").textContent = getDayOfWeek(date3);
}

/**
 *  Update the global date variables to go back one day and then refresh the content.
 */
function dateSelectionLeft() {
  date1.setDate(date1.getDate() - 1);
  date2.setDate(date2.getDate() - 1);
  date3.setDate(date3.getDate() - 1);
  refreshDate();
  updateEventContent();
}

/**
 *  Update the global date variables to go forward one day and then refresh the content.
 */
function dateSelectionRight() {
  date1.setDate(date1.getDate() + 1);
  date2.setDate(date2.getDate() + 1);
  date3.setDate(date3.getDate() + 1);
  refreshDate();
  updateEventContent();
}
/* Date logic ends here */


/**
 * Returns date at 00:00 and the day after date at 00:00.
 * @param {Date} date 
 */
function wholeDayPair(date) {
  dateClone = new Date(date);
  dateClone.setHours(0);
  dateClone.setMinutes(0);
  dateClone.setSeconds(0);
  dateClone.setMilliseconds(0);
  dateClonePlusOne = new Date(dateClone)
  dateClonePlusOne.setDate(dateClone.getDate() + 1)
  return [dateClone, dateClonePlusOne];
}

/**
 * Returns the day of the week corresponding to date.
 * @param {Date} date 
 */
function getDayOfWeek(date) {
  var int = date.getDay();
  switch(int) {
    case 0: 
      return "sunday";
    case 1: 
      return "monday";
    case 2:
      return "tuesday";
    case 3:
      return "wednesday";
    case 4:
      return "thursday";
    case 5:
      return "friday";
    case 6: 
      return "saturday";  
  }
}

/**
 * Removes all children of a parent
 * @param {HTML element} parent The element to be emptied.
 */
function removeAllChildNodes(parent) {
  while (parent.firstChild) {
    parent.removeChild(parent.firstChild);
  }
}


/**
 * Takes a 24h time and adds hour amount of hours.
 * @param {string} time   "ab:cd"
 * @param {int} hour       x
 * @return {newTime}      time + hour
 */
function addHourToTime(time, hour) {
  var newTime = ((parseInt(time.split(":")[0]) + hour) % 24).toString();
  newTime = newTime + ":" + time.split(":")[1];
  return newTime;
}

// Convert a time in hh:mm format to minutes
function timeToMins(time) {
  var b = time.split(':');
  return b[0]*60 + +b[1];
}

// Convert minutes to a time in format hh:mm
// Returned value is in range 00  to 24 hrs
function timeFromMins(mins) {
  function z(n){return (n<10? '0':'') + n;}
  var h = (mins/60 |0) % 24;
  var m = mins % 60;
  return z(h) + ':' + z(m);
}

// Add two times in hh:mm format
function addTimes(t0, t1) {
  return timeFromMins(timeToMins(t0) + timeToMins(t1));
}

  
