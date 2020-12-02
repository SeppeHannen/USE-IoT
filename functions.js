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
}

/**
 *  On add_event_button click, open the add event form.
 */
function OpenAddEventForm() {
  document.getElementById("EventForm").style.display = "block";
  document.getElementById("openEventFormButton").style.display = "none";
}

/**
 *  On close_event__form_button click, open the add event form.
 */
function closeAddEventForm() {
  document.getElementById("EventForm").style.display = "none";
  document.getElementById("openEventFormButton").style.display = "inline";
  updateEventContent();
}

/**
 *  When the add event button is pressed, gather the data and create the event.
 */
function addEventPressed() {
  var name = document.getElementById("add_event_name").value;
  var dateTimeStart = document.getElementById("add_event_date").value + "T12:00:00Z";
  var dateTimeEnd = document.getElementById("add_event_date").value + "T13:00:00Z";
  var location = "unknown";
  var description = document.getElementById("add_event_description").value;
  addEvent(name, location, description, dateTimeStart, dateTimeEnd);
  closeAddEventForm();
}

/**
 * Updates the event content of a content-member with its events.
 * @param {Array} events The events corresponding to {member}
 * @param {int} member The member which corresponds to the date of {events}
 */
function updateContentDate(events, member) {
  removeAllChildNodes(document.getElementById("content-tridaily-member-" + member));
  for (i=0; i < events.length; i++) { // For every event on {date}:
    var event_container = document.createElement("div");    //Container of the event
    event_container.className = "event-container";
    var event_reminder = document.createElement("div");     //Reminder section of the event
    event_reminder.className = "event-member";
    var event_title = document.createElement("div");        //Title section of the event
    event_title.className = "event-member";
    var event_time = document.createElement("div");         //Time section of the event
    event_time.className = "event-member";
    event_time.style.textOverflow = "ellipsis";
    event_reminder.innerHTML += "5m";
    event_title.innerHTML += events[i].summary;             //Add the title from the event
    event_time.innerHTML += events[i].start.dateTime;
    event_container.appendChild(event_reminder);            //Append all the inner divs to the container
    event_container.appendChild(event_title);
    event_container.appendChild(event_time);
    document.getElementById("content-tridaily-member-" + member).appendChild(event_container); //Append the container to the right content-tridaily-member div.
  }
  console.log("The event content for member " + member + " was reloaded!")
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
  } else {
    document.getElementById("content-tridaily-date-1").textContent = date1.toLocaleDateString();
    document.getElementById("content-tridaily-date-2").textContent = date2.toLocaleDateString();
    document.getElementById("content-tridaily-date-3").textContent = date3.toLocaleDateString();
  }
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
 * Removes all children of a parent
 * @param {HTML element} parent The element to be emptied.
 */
function removeAllChildNodes(parent) {
  while (parent.firstChild) {
    parent.removeChild(parent.firstChild);
  }
}


  