/**
 * Define our global variables here
 */
var date2 = new Date();                 //Middle date - initialized with today
var date1 = new Date(date2);            //First date - intialized with yesterday
var date3 = new Date(date2);            //Last date - intialized with tomorrow
date1.setDate(date2.getDate() - 1);
date3.setDate(date2.getDate() + 1);
var isEventBeingEdited = false;

/**
 *  What to do when the page is loaded.
 */
function onPageLoad() {

}

/**
 *  What to do when the user has signed in.
 */
function onSignIn() {
  refreshDate();
  updateEventContent();
  document.getElementById("login-container").style.display = "none";
  document.getElementById("application-container").style.display = "block";
  synchronizeApplications();
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
  //Empty the form for the next use.
  document.getElementById("add_event_name").innerHTML = null;
  document.getElementById("add_event_description").innerHTML = null;
  document.getElementById("add_event_date").value = null;
  document.getElementById("add_event_startTime").value = null;
  document.getElementById("add_event_endTime").value = null;
  document.getElementById("EventForm").style.transform = "translateY(0)";
  setTimeout(updateEventContent(), 300);
}

/**
 *  When the add event button is pressed, gather the data and create the event.
 */
function addEventPressed() {
  document.getElementById("add_event_form_error").innerHTML = "";
  var name = document.getElementById("add_event_name").innerHTML;
  var dateTimeStart = document.getElementById("add_event_date").value;  //Format: 18-12-2020T12:00:00Z
  var dateTimeEnd;
  var location = "unknown";
  var description = document.getElementById("add_event_description").innerHTML;
  var startTime = document.getElementById("add_event_startTime").value;
  var endTime = document.getElementById("add_event_endTime").value;
  var allDay = document.getElementById("add_event_all_day").checked;

  if (name == null || location == null || dateTimeStart == null) {//Check if the input is valid
    document.getElementById("add_event_form_error").innerHTML = "Please make sure to enter all required values!";
    throw 'Some parameters in addEvent() were null!';
  }

  if (allDay) {//Event was made for whole day
    var arrayDates = wholeDayPair(dateTimeStart)
    dateTimeEnd = arrayDates[1];
    dateTimeStart = arrayDates[0];
  } else if (startTime == null || endTime == null) {//Event was not made for whole day and times were not entered
    document.getElementById("add_event_form_error").innerHTML = "The time was not entered!";
    throw 'The time was not entered!';
  } else {//Event was made not made for whole day and times were entered
    dateTimeEnd = dateTimeStart + "T" + endTime + ":00+01:00";
    dateTimeStart = dateTimeStart + "T" + startTime + ":00+01:00";
  }

  if (description == null) {//If description is null, assign it the empty string.
    description = "This event was not given a description at creation.";
  }
  addEvent(name, location, description, dateTimeStart, dateTimeEnd);
  closeAddEventForm();
}

/**
 * Updates the event content of a content-member with its events.
 * @param {Array} events The events corresponding to {member}
 * @param {int} member The member which corresponds to the date of {events}
 */
function updateContentDate(events, member) {
  //Remove all existing event containers
  removeAllChildNodes(document.getElementById("content-tridaily-member-" + member));

  for (i=0; i < events.length; i++) {// For every event on {date}:
    //Create the container of the event
    var event_container = document.createElement("div");
    event_container.className = "event-container";
    var event = events[i];
    event_container.addEventListener("click", function() {onEventClick(event)});

    //Take care of the name section
    var event_title = document.createElement("div");    
    event_title.className = "event-member name";
    event_title.innerHTML += events[i].summary;

    //Add a description section with data, but keep it invisible
    //var event_description = d

    //Take care of the (starting) time section
    var event_time = document.createElement("div");
    event_time.className = "event-member time";
    var dateTimeStart = events[i].start.dateTime;
    var dateTimeEnd = events[i].end.dateTime;
    event_time.innerHTML += dateTimeStart.split("T")[1].substring(0,5) + " - " + dateTimeEnd.split("T")[1].substring(0,5) 
    
    //Take care of the reminder section.
    var event_reminder = document.createElement("div");
    event_reminder.className = "event-member reminder";
    var reminder_img = document.createElement("img");
    reminder_img.src = "img/reminder.png";
    reminder_img.className = "reminder";
    event_reminder.appendChild(reminder_img);    
    var reminder_paragraph = document.createElement("p");
    reminder_paragraph.className = "reminder";
    if (true) {
      reminder_paragraph.innerHTML += "5m"
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

  //Make all the events fade in at the same time by setting their opacity to 1.
  setTimeout(function() {
    var elements = document.getElementsByClassName("event-container");
    for (i = 0; i < elements.length; i++) {
      elements[i].style.opacity = "1";
    }
  }, 50);
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
  dateClonePlusOne.setDate(dateClone.getDate())
  dateClonePlusOne.setHours(23);
  dateClonePlusOne.setMinutes(59);
  dateClonePlusOne.setSeconds(0);
  dateClonePlusOne.setMilliseconds(0);
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

/**
 * Opens a popup which displays the event data and allows the user to edit or remove the event.
 * @param {event} event
 */
function onEventClick(event) {
    if (isEventBeingEdited) {//The user clicked another event while editing so close the popup.
      removeAllByClassName("elaborate-event-container");
      isEventBeingEdited = false;
    } else {//No other event is being edited so create a new popup.
      isEventBeingEdited = true;

      //Create the container of the elaboration.
      var elaborate_event_container = document.createElement("div");
      elaborate_event_container.className = "elaborate-event-container";

      //Create the name of the event container.
      var elaborate_event_name = document.createElement("div");
      elaborate_event_name.className = "elaborate-event-title";
      elaborate_event_name.contentEditable = true;
      elaborate_event_name.type = "textarea";
      elaborate_event_name.innerHTML = event.summary;

      //Create the title of the name.
      var elaborate_event_name_title = document.createElement("h1");
      elaborate_event_name_title.innerText = "Name:";

      //Create the description of the event container.
      var elaborate_event_description = document.createElement("div");
      elaborate_event_description.className = "elaborate-event-description";
      elaborate_event_description.contentEditable = true;
      elaborate_event_description.type = "textarea";
      elaborate_event_description.innerHTML = event.description;

      //Create the title of the description.
      var elaborate_event_description_title = document.createElement("h1");
      elaborate_event_description_title.innerText = "Description:";

      //Create the starting time of the event container.
      var elaborate_event_startTime = document.createElement("input");
      elaborate_event_startTime.className = "elaborate-event-time";
      elaborate_event_startTime.type = "date";
      elaborate_event_startTime.name = "startTime"

      //Create the ending time of the event container.
      var elaborate_event_endTime = document.createElement("input");
      elaborate_event_endTime.className = "elaborate-event-time";
      elaborate_event_endTime.type = "date";
      elaborate_event_endTime.name = "endTime"

      //Create the closing button.
      var elaborate_event_closing_button = document.createElement("img");
      elaborate_event_closing_button.src = "img/close.png";
      elaborate_event_closing_button.addEventListener("click", function() {removeAllByClassName("elaborate-event-container");isEventBeingEdited = false;});
      elaborate_event_closing_button.className = "elaborate-event-closing-button";

      //Append everything to the container.
      elaborate_event_container.appendChild(elaborate_event_name_title);
      elaborate_event_container.appendChild(elaborate_event_name);
      elaborate_event_container.appendChild(elaborate_event_description_title);
      elaborate_event_container.appendChild(elaborate_event_description);
      elaborate_event_container.appendChild(elaborate_event_startTime);
      elaborate_event_container.appendChild(elaborate_event_endTime);
      elaborate_event_container.appendChild(elaborate_event_closing_button);

      //Append to body
      document.body.appendChild(elaborate_event_container);
    }
}

function removeAllByClassName(name) {
  var toRemove = document.getElementsByClassName(name);
  for (i = 0; i < toRemove.length; i++) {
    toRemove[i].remove();
  }
}

  