/**
 * Add an event to the calendar.
 * @param {String} name 
 * @param {String} location 
 * @param {String} description 
 * @param {String} dateTimeStart 
 * @param {String} dateTimeEnd 
 */
function addEvent(name, description, dateTimeStart, dateTimeEnd) {
    var event = {
        'summary': name,
        'description': description,
        'start': {
          'dateTime':  dateTimeStart, //2015-05-28T09:00:00-07:00'
          'timeZone': 'Europe/Amsterdam'
        },
        'end': {
          'dateTime': dateTimeEnd,
          'timeZone': 'Europe/Amsterdam'
        },
        'attendees': [
          //{'email': 'sbrin@example.com'}
        ],
      };

      var request = gapi.client.calendar.events.insert({
        'calendarId': 'primary',
        'resource': event
      });

      //In case of a succes, do closeAddEventForm() else display the error message.
      request.then(function(event) {updateEventContent(); closeAddEventForm()}, function(result) {document.getElementById("add_event_error").innerHTML = result.result.error.message});
}

/**
 * Removes an event from the calendar.
 * @param {String} id The id of the event in the google API.
 */
function removeEvent(id) {
  var request = gapi.client.calendar.events.delete({
    'calendarId': 'primary',
    'eventId': id
  });

  request.then(function() {markEventComplete(id)});
}

/**
 *  Pull the events from a certain day.
 *  @param {Date} date The date for which we want the events 
 *  @param {int} member The content-tridaily-member corresponding to {date}
 *  @fails Might fail when the event is scheduled at 23:59, 00:00, 00:01.
 */ 
function getEventDate(date, member) {
    dateClone = wholeDayPair(date)[0];
    dateClonePlusOne = wholeDayPair(date)[1];
    gapi.client.calendar.events.list({
    'calendarId': 'primary',
    'timeMin': (dateClone).toISOString(),
    'timeMax': (dateClonePlusOne).toISOString(),
    'timeZone': 'Europe/Amsterdam',
    'showDeleted': false,
    'singleEvents': true,                     //When set to false the orderBy setting might not work with 'startTime'.
    'maxResults': 10,
    'orderBy': 'startTime'
  }).then(function(response) {
    var events = response.result.items;
    console.log(events);
    updateContentDate(events, member);
  })
}

/**
 * Makes sure that when event data is changed, the content is updated.
 * May not work properly in Safari as 'service workers' are required, I think..
 */
// function synchronizeApplications() {
//   gapi.client.calendar.events.watch({
//     calendarId: 'primary',
//     id: 'application',
//     token: '0000',
//     type: 'web_hook',
//     address: "window.location.href"
//   }).then(function() {
//     updateEventContent();
//   })
// }

/**
 * Updates the event content with the current dates.
 */
function updateEventContent(direction) {
  if (direction == "right") {
    //Move all members 20% to the left.
    document.getElementById("content-tridaily-member-0").style.left = "-20%";
    document.getElementById("content-tridaily-member-1").style.left = "0%";
    document.getElementById("content-tridaily-member-2").style.left = "20%";
    document.getElementById("content-tridaily-member-3").style.left = "40%";
    document.getElementById("content-tridaily-member-4").style.left = "60%";
    //Remove the first one and redo all the id's.
    document.getElementById("content-tridaily-member-0").remove();
    document.getElementById("content-tridaily-member-1").id = "content-tridaily-member-0";
    document.getElementById("content-tridaily-member-2").id = "content-tridaily-member-1";
    document.getElementById("content-tridaily-member-3").id = "content-tridaily-member-2";
    document.getElementById("content-tridaily-member-4").id = "content-tridaily-member-3";
    var new_content_tridaily_member = document.createElement("div");
    new_content_tridaily_member.className = "content-tridaily-member";
    new_content_tridaily_member.id = "content-tridaily-member-4";
    new_content_tridaily_member.style.left = "80%";
    document.getElementById("content-tridaily-event-container").append(new_content_tridaily_member);
    getEventDate(date4, 4);
  } else if (direction == "left") {
    //Move all members 20% to the right.
    document.getElementById("content-tridaily-member-0").style.left = "20%";
    document.getElementById("content-tridaily-member-1").style.left = "40%";
    document.getElementById("content-tridaily-member-2").style.left = "60%";
    document.getElementById("content-tridaily-member-3").style.left = "80%";
    document.getElementById("content-tridaily-member-4").style.left = "100%";
    //Remove the last one and redo all the id's.
    document.getElementById("content-tridaily-member-4").remove();
    document.getElementById("content-tridaily-member-3").id = "content-tridaily-member-4";
    document.getElementById("content-tridaily-member-2").id = "content-tridaily-member-3";
    document.getElementById("content-tridaily-member-1").id = "content-tridaily-member-2";
    document.getElementById("content-tridaily-member-0").id = "content-tridaily-member-1";
    var new_content_tridaily_member = document.createElement("div");
    new_content_tridaily_member.className = "content-tridaily-member";
    new_content_tridaily_member.id = "content-tridaily-member-0";
    new_content_tridaily_member.style.left = "0%";
    document.getElementById("content-tridaily-event-container").prepend(new_content_tridaily_member);
    getEventDate(date0, 0);
  } else if (direction == null) {
    getEventDate(date0, 0);
    getEventDate(date1, 1);
    getEventDate(date2, 2);
    getEventDate(date3, 3);
    getEventDate(date4, 4);
  }
}