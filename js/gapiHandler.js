/**
 * Add an event to the calendar.
 * @param {String} name 
 * @param {String} location 
 * @param {String} description 
 * @param {String} dateTimeStart 
 * @param {String} dateTimeEnd 
 */
function addEvent(name, location, description, dateTimeStart, dateTimeEnd, reminder, recurrence) {
    var event = {
        'summary': name,
        'location': location,
        'description': description,
        'start': {
          'dateTime':  dateTimeStart, //2015-05-28T09:00:00-07:00'
          'timeZone': 'Europe/Amsterdam'
        },
        'end': {
          'dateTime': dateTimeEnd,
          'timeZone': 'Europe/Amsterdam'
        },
        //'recurrence': [
        //  'RRULE:FREQ=DAILY;COUNT=2'
        //],
        'attendees': [
          //{'email': 'sbrin@example.com'}
        ],
        'reminders': {
          'useDefault': false,
          'overrides': [
            {'method': 'email', 'minutes': reminder},
            {'method': 'popup', 'minutes': reminder}
          ]
        }
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

  request.then(function() {markEventComplete()});
}

/**
 * Updates an event with the new information from the elaborate event screen.
 * @param {String} id The id of the event in the google API.
 */
function updateEvent(id) {
  console.log("Not working yet, almost.");

  // date = document.getElementById("elaborate-event-date").value;
  // startTime = document.getElementById("elaborate-event-startTime");
  // endTime = document.getElementById("elaborate-event-endTime");
  // date = null;

  // var request = gapi.client.calendar.events.update({
  //   'calendarId': 'primary',
  //   'eventId':  id,
  //   'summary': document.getElementById("elaborate-event-title"),
  //   'description': document.getElementById("elaborate-event-description")
  // });


  // request.execute();
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
function synchronizeApplications() {
  gapi.client.calendar.events.watch({
    calendarId: 'primary',
    id: 'application',
    token: '0000',
    type: 'web_hook',
    address: "window.location.href"
  }).then(function() {
    updateEventContent();
  })
}
