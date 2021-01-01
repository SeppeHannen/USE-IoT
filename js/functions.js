/**
 * Define our global variables here
 */
var difficulty = 0;                     //The difficulty of the application
var date2 = new Date();                 //Middle date - initialized with today
var date1 = new Date(date2);            //First date - intialized with yesterday
var date0 = new Date(date2);            //Zeroth date - intialized with the day before yesterday
var date3 = new Date(date2);            //Third date - intialized with tomorrow
var date4 = new Date(date2);            //Fourth date - intialized with the day after tomorrow
date1.setDate(date2.getDate() - 1);
date0.setDate(date2.getDate() - 2);
date3.setDate(date2.getDate() + 1);
date4.setDate(date2.getDate() + 2);
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
  document.getElementById("login-container").style.display = "none";
  document.getElementById("application-container").style.display = "block";
  synchronizeApplications();
  updateEventContent();
}

/**
 *  On add_event_button click, open the add event form.
 */
function OpenAddEventForm() {                                       
  //Move the add_event_form in view;
  setTimeout(function() {document.getElementById("EventForm").style.transform = "translateY(-100%)";}, 300);
  //Focus the first text element, name;
  document.getElementById("add_event_name").focus({preventScroll:true});
  //Set the opacity of the application to 0.1;
  document.getElementById("application-container").style.opacity = 0.1;
}

/**
 *  On close_event__form_button click, open the add event form.
 */
function closeAddEventForm() {
  //Empty the form for the next use;
  document.getElementById("add_event_name").innerHTML = null;
  document.getElementById("add_event_description").innerHTML = null;
  document.getElementById("add_event_date").value = null;
  document.getElementById("add_event_startTime").value = null;
  document.getElementById("add_event_endTime").value = null;
  document.getElementById("add_event_error").value = null;
  //Hide the extra settings;
  hideSettings();
  //Set the opacity of the application to 1;
  document.getElementById("application-container").style.opacity = 1;
  document.getElementById("EventForm").style.transform = "translateY(0)";
  //Move the add_event_form in view;
  setTimeout(function() {document.getElementById("EventForm").style.transform = "";}, 300);
}

/**
 *  When the add event button is pressed, gather the data and create the event.
 */
function addEventPressed() {
  document.getElementById("add_event_error").innerHTML = "";
  var name = document.getElementById("add_event_name").innerHTML;
  var dateTimeStart = document.getElementById("add_event_date").value;  //Format: 18-12-2020T12:00:00Z
  var dateTimeEnd;
  var location = document.getElementById("add_event_location").innerHTML;
  var reminder = parseInt(document.getElementById("add_event_reminder").value);
  var recurrence = document.getElementById("add_event_recurrence").value;
  var description = document.getElementById("add_event_description").innerHTML;
  var startTime = document.getElementById("add_event_startTime").value;
  var endTime = document.getElementById("add_event_endTime").value;

  if (name == "" || dateTimeStart == "") {//Check if the input is valid
    document.getElementById("add_event_error").innerHTML = "Please make sure to enter a name and date!";
    throw 'Some parameters in addEvent() were null!';
  }

  if ((startTime == "" && endTime != "") || (startTime != "" && endTime == "")) {//One of the times was not entered
    document.getElementById("add_event_error").innerHTML = "The time was not entered correctly!";
    throw 'The time was not entered!';
  } else if (startTime == "" && endTime == "") {//No times were entered in advanced settings -> Use whole day
    var arrayDates = wholeDayPair(dateTimeStart)
    dateTimeEnd = arrayDates[1];
    dateTimeStart = arrayDates[0];
  } else {//Times were entered in advanced settings -> Use times
    dateTimeEnd = dateTimeStart + "T" + endTime + ":00+01:00";
    dateTimeStart = dateTimeStart + "T" + startTime + ":00+01:00";
  }

  if (description == "") {//If description is null, assign it the empty string.
    description = "This event was not given a description at creation.";
  }

  addEvent(name, location, description, dateTimeStart, dateTimeEnd, reminder, recurrence);
}

/**
 * Updates the event content of a content-member with its events.
 * @param {Array} events The events corresponding to {member}
 * @param {int} member The member which corresponds to the date of {events}
 * @post Creates the events and gives the event container an id which is equal to the id of the event it represents.
 */
function updateContentDate(events, member) {
  //Remove all existing event containers
  removeAllChildNodes(document.getElementById("content-tridaily-member-" + member));

  for (let i=0; i < events.length; i++) {// For every event on {date}:
    //Create the container of the event
    var event_container = document.createElement("div");
    event_container.className = "event-container";
    event_container.addEventListener("click", function(e) {e.stopPropagation(); onEventClick(events[i]);});
    event_container.id = events[i].id;

    //Take care of the name section
    var event_title = document.createElement("div");    
    event_title.className = "event-member name";
    if (events[i].description != "") {//If description is not empty
      event_title.innerHTML += events[i].summary + ": " + events[i].description;
    } else {//If description is empty
      event_title.innerHTML += events[i].summary;
    }

    //Take care of the time section
    var event_time = document.createElement("div");
    event_time.className = "event-member time";
    var dateTimeStart = events[i].start.dateTime;
    var dateTimeEnd = events[i].end.dateTime;
    var timeString = dateTimeStart.split("T")[1].substring(0,5) + " - " + dateTimeEnd.split("T")[1].substring(0,5);
    if (timeString == "00:00 - 23:59") {
      event_time.innerHTML = "";
    } else {
      event_time.innerHTML += dateTimeStart.split("T")[1].substring(0,5) + " - " + dateTimeEnd.split("T")[1].substring(0,5) 
    }
    
    //Take care of the checkbox section.
    var event_checkbox_container = document.createElement("div");
    event_checkbox_container.className = "event-member";  
    event_checkbox_holder = document.createElement("div");
    event_checkbox_holder.className = "checkbox"
    event_checkbox_holder.onclick = function(e) {e.stopPropagation(); markEventComplete(events[i].id)};
    event_checkbox = document.createElement("input");
    event_checkbox.type = "checkbox";
    event_checkbox_holder.appendChild(event_checkbox);
    event_checkbox_container.appendChild(event_checkbox_holder);


    //Append all the sections to the container
    event_container.appendChild(event_checkbox_container);           
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
function refreshDate(date, member) {
  if (date == null || member == null) {
    refreshDate(date0, 0);
    refreshDate(date1, 1);
    refreshDate(date2, 2);
    refreshDate(date3, 3);
    refreshDate(date4, 4);
  } else {
    var today = new Date();
    var tomorrow = new Date(today);
    var yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    tomorrow.setDate(today.getDate() + 1);
    if (date.toLocaleDateString() == yesterday.toLocaleDateString()) {
      document.getElementById("content-tridaily-date-" + member).textContent = "Yesterday";
    } else if (date.toLocaleDateString() == today.toLocaleDateString()) {
      document.getElementById("content-tridaily-date-" + member).textContent = "Today";
    } else if (date.toLocaleDateString() == tomorrow.toLocaleDateString()) {
      document.getElementById("content-tridaily-date-" + member).textContent = "Tomorrow";
    } else {
      document.getElementById("content-tridaily-date-" + member).textContent = date.toLocaleDateString();
    }
    document.getElementById("content-tridaily-day-" + member).textContent = getDayOfWeek(date);
  }
}

/**
 *  Update the global date variables to go back one day and then refresh the content.
 */
function dateSelectionLeft() {
  date0.setDate(date0.getDate() - 1);
  date1.setDate(date1.getDate() - 1);
  date2.setDate(date2.getDate() - 1);
  date3.setDate(date3.getDate() - 1);
  date4.setDate(date4.getDate() - 1);
  //Move all the members 20% to the right.
  document.getElementById("content-tridaily-selection-member-0").style.left = "20%";
  document.getElementById("content-tridaily-selection-member-1").style.left = "40%";
  document.getElementById("content-tridaily-selection-member-2").style.left = "60%";
  document.getElementById("content-tridaily-selection-member-3").style.left = "80%";
  document.getElementById("content-tridaily-selection-member-4").style.left = "100%";
  //Remove the last one and redo the id's.
  document.getElementById("content-tridaily-selection-member-4").remove();
  document.getElementById("content-tridaily-selection-member-3").id = "content-tridaily-selection-member-4";
  document.getElementById("content-tridaily-day-3").id = "content-tridaily-day-4";
  document.getElementById("content-tridaily-date-3").id = "content-tridaily-date-4";
  document.getElementById("content-tridaily-selection-member-2").id = "content-tridaily-selection-member-3";
  document.getElementById("content-tridaily-day-2").id = "content-tridaily-day-3";
  document.getElementById("content-tridaily-date-2").id = "content-tridaily-date-3";
  document.getElementById("content-tridaily-selection-member-1").id = "content-tridaily-selection-member-2";
  document.getElementById("content-tridaily-day-1").id = "content-tridaily-day-2";
  document.getElementById("content-tridaily-date-1").id = "content-tridaily-date-2";
  document.getElementById("content-tridaily-selection-member-0").id = "content-tridaily-selection-member-1";
  document.getElementById("content-tridaily-day-0").id = "content-tridaily-day-1";
  document.getElementById("content-tridaily-date-0").id = "content-tridaily-date-1";
  var new_content_tridaily_selection_member = document.createElement("div");
  new_content_tridaily_selection_member.className = "content-tridaily-selection-member";
  new_content_tridaily_selection_member.id = "content-tridaily-selection-member-0";
  new_content_tridaily_selection_member.style.left = "0%";
  //Create the new first element.
  var new_content_tridaily_selection_member_day = document.createElement("p");
  new_content_tridaily_selection_member_day.id = "content-tridaily-day-0";
  var new_content_tridaily_selection_member_date = document.createElement("p");
  new_content_tridaily_selection_member_date.id = "content-tridaily-date-0";
  new_content_tridaily_selection_member.append(new_content_tridaily_selection_member_day);
  new_content_tridaily_selection_member.append(new_content_tridaily_selection_member_date);
  document.getElementById("content-tridaily-selection-container").prepend(new_content_tridaily_selection_member);
  refreshDate(date0, 0);
  updateEventContent("left");
}

/**
 *  Update the global date variables to go forward one day and then refresh the content.
 */
function dateSelectionRight() {
  date0.setDate(date0.getDate() + 1);
  date1.setDate(date1.getDate() + 1);
  date2.setDate(date2.getDate() + 1);
  date3.setDate(date3.getDate() + 1);
  date4.setDate(date4.getDate() + 1);
  //Move all the members 20% to the left.
  document.getElementById("content-tridaily-selection-member-0").style.left = "-20%";
  document.getElementById("content-tridaily-selection-member-1").style.left = "0%";
  document.getElementById("content-tridaily-selection-member-2").style.left = "20%";
  document.getElementById("content-tridaily-selection-member-3").style.left = "40%";
  document.getElementById("content-tridaily-selection-member-4").style.left = "60%";
  //Remove the first one and redo the id's.
  document.getElementById("content-tridaily-selection-member-0").remove();
  document.getElementById("content-tridaily-selection-member-1").id = "content-tridaily-selection-member-0";
  document.getElementById("content-tridaily-day-1").id = "content-tridaily-day-0";
  document.getElementById("content-tridaily-date-1").id = "content-tridaily-date-0";
  document.getElementById("content-tridaily-selection-member-2").id = "content-tridaily-selection-member-1";
  document.getElementById("content-tridaily-day-2").id = "content-tridaily-day-1";
  document.getElementById("content-tridaily-date-2").id = "content-tridaily-date-1";
  document.getElementById("content-tridaily-selection-member-3").id = "content-tridaily-selection-member-2";
  document.getElementById("content-tridaily-day-3").id = "content-tridaily-day-2";
  document.getElementById("content-tridaily-date-3").id = "content-tridaily-date-2";
  document.getElementById("content-tridaily-selection-member-4").id = "content-tridaily-selection-member-3";
  document.getElementById("content-tridaily-day-4").id = "content-tridaily-day-3";
  document.getElementById("content-tridaily-date-4").id = "content-tridaily-date-3";
  var new_content_tridaily_selection_member = document.createElement("div");
  new_content_tridaily_selection_member.className = "content-tridaily-selection-member";
  new_content_tridaily_selection_member.id = "content-tridaily-selection-member-4";
  new_content_tridaily_selection_member.style.left = "80%";
  //Create the new last element.
  var new_content_tridaily_selection_member_day = document.createElement("p");
  new_content_tridaily_selection_member_day.id = "content-tridaily-day-4";
  var new_content_tridaily_selection_member_date = document.createElement("p");
  new_content_tridaily_selection_member_date.id = "content-tridaily-date-4";
  new_content_tridaily_selection_member.append(new_content_tridaily_selection_member_day);
  new_content_tridaily_selection_member.append(new_content_tridaily_selection_member_date);
  document.getElementById("content-tridaily-selection-container").append(new_content_tridaily_selection_member);
  refreshDate(date4, 4);
  updateEventContent("right");
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
      console.log(event);

      //Create the container of the elaboration.
      var elaborate_event_container = document.createElement("div");
      elaborate_event_container.className = "elaborate-event-container";

      //Create the variables.
      var startTime = event.start.dateTime.split("T")[1].substring(0,5);
      var endTime = event.end.dateTime.split("T")[1].substring(0,5);
      var date = event.start.dateTime.split("T")[0];

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

      //Create the title of the date.
      var elaborate_event_date_title = document.createElement("h1");
      elaborate_event_date_title.innerText = "Date:";

      //Create the date of the event.
      var elaborate_event_date = document.createElement("input");
      elaborate_event_date.type = "date";
      elaborate_event_date.value = date;

      //Create the title of the time.
      var elaborate_event_time_title = document.createElement("h1");
      elaborate_event_time_title.innerText = "Starting time / Ending time:"

      //Create the starting time of the event.
      var elaborate_event_startTime = document.createElement("input");
      elaborate_event_startTime.className = "elaborate-event-time";
      elaborate_event_startTime.type = "time";
      elaborate_event_startTime.name = "startTime";
      elaborate_event_startTime.id = "elaborate-event-startTime";
      elaborate_event_startTime.value = startTime;

      //Create the ending time of the event.
      var elaborate_event_endTime = document.createElement("input");
      elaborate_event_endTime.className = "elaborate-event-time";
      elaborate_event_endTime.type = "time";
      elaborate_event_endTime.name = "endTime";
      elaborate_event_endTime.id = "elaborate-event-endTime";
      elaborate_event_endTime.value = endTime;

      //Create the title of the reminder.
      var elaborate_event_reminder_title = document.createElement("h1");
      elaborate_event_reminder_title.innerText = "Reminder:"

      //Create the reminder of the event.
      var elaborate_event_reminder = document.createElement("select");
      var option1 = document.createElement("option");
      var option2 = document.createElement("option");
      var option3 = document.createElement("option");
      var option4 = document.createElement("option");
      var option5 = document.createElement("option");
      var option6 = document.createElement("option");
      option1.setAttribute("0", "At time of event");
      option2.setAttribute("1", "5 minutes before");
      option3.setAttribute("2", "10 minutes before");
      
      elaborate_event_reminder.appendChild(option1)

      //Create the closing button.
      var elaborate_event_closing_button = document.createElement("img");
      elaborate_event_closing_button.src = "img/close.png";
      elaborate_event_closing_button.addEventListener("click", function() {removeAllByClassName("elaborate-event-container");isEventBeingEdited = false;});
      elaborate_event_closing_button.className = "elaborate-event-closing-button";

      //Append everything to the container if appropriate.
      elaborate_event_container.appendChild(elaborate_event_name_title);
      elaborate_event_container.appendChild(elaborate_event_name);
      //Append the description
      if (event.description != "") {
        elaborate_event_container.appendChild(elaborate_event_description_title);
        elaborate_event_container.appendChild(elaborate_event_description);
      }
      //Append the date
      elaborate_event_container.appendChild(elaborate_event_date_title);
      elaborate_event_container.appendChild(elaborate_event_date);
      //Append the time
      if (!(startTime == "00:00" && endTime == "23:59")) {
        elaborate_event_container.appendChild(elaborate_event_time_title);
        elaborate_event_container.appendChild(elaborate_event_startTime);
        elaborate_event_container.appendChild(elaborate_event_endTime);
      }
      //Append the closing button
      elaborate_event_container.appendChild(elaborate_event_closing_button);

      //Append to body
      document.body.appendChild(elaborate_event_container);
    }
}

/**
 * Remove all HTML elements with a certain classname.
 * @param {string} name 
 */
function removeAllByClassName(name) {
  var toRemove = document.getElementsByClassName(name);
  for (i = 0; i < toRemove.length; i++) {
    toRemove[i].remove();
  }
}


/**
 * Mark an event with a certain id as complete.
 * @param {string} id 
 */
function markEventComplete(id) {
  //Remove the event from the calendar.
  removeEvent(id);

  //Show some nice effects.
  document.getElementById(id).style.opacity = 0;

  //After showing some nice effects, hide the event.
  setTimeout(function() {
  document.getElementById(id).remove();
  }, 1000);
}


/**
 * Show the settings of some type in the add-event-form
 * @param {string} type The type of settings to show
 */
function showSettings(type) {
  hideSettings();
  document.getElementById("add_event_form_" + type + "_settings").style.display = "block";
  document.getElementById("show_" + type + "_settings_button").style.onclick = "";
  document.getElementById("show_" + type + "_settings_button").style.filter = "invert()";
}

/**
 * Hide the extra settings in the add-event-form
 */
function hideSettings() {
  types = ["reminder", "recurrence", "time", "location"];
  for (i = 0; i < types.length; i++) {
    console.log("add_event_form_" + types[i] + "_settings");
    document.getElementById("add_event_form_" + types[i] + "_settings").style.display = "none";
    document.getElementById("show_" + types[i] + "_settings_button").style.display = "inline";
    document.getElementById("show_" + types[i] + "_settings_button").style.filter = "";
    document.getElementById("show_" + types[i] + "_settings_button").style.onclick = "showSettings(" + types[i] + ")";
  }
}





  