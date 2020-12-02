/**
 * Add an event to the calendar.
 * @param {String} name 
 * @param {String} location 
 * @param {String} description 
 * @param {String} dateTimeStart 
 * @param {String} dateTimeEnd 
 */
function addEvent(name, location, description, dateTimeStart, dateTimeEnd) {
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
          {'email': 'force2finish@gmail.com'},
          //{'email': 'sbrin@example.com'}
        ],
        'reminders': {
          'useDefault': false,
          //'overrides': [
          //  {'method': 'email', 'minutes': 24 * 60},
          //  {'method': 'popup', 'minutes': 10}
          //]
        }
      };

      var request = gapi.client.calendar.events.insert({
        'calendarId': 'primary',
        'resource': event
      });

      request.execute(function(event) {
        appendPre('Event created: ' + event.htmlLink);
      });

      setTimeout(
      function() {
      var iframe = document.getElementById('calendarFrame');
      iframe.src = iframe.src;
      }, 1000);
}

/**
 *  Pull the events from a certain day.
 *  @param {Date} date The date for which we want the events 
 *  @param {int} member The content-tridaily-member corresponding to {date}
 *  @fails Might fail when the event is scheduled at 23:59, 00:00, 00:01.
 */ 
function getEventDate(date, member) {
    dateClone = new Date(date);
    dateClone.setHours(0);
    dateClone.setMinutes(0);
    dateClone.setSeconds(0);
    dateClone.setMilliseconds(0);
    dateClonePlusOne = new Date(dateClone)
    dateClonePlusOne.setDate(dateClone.getDate() + 1)

    //datePlusOne = new Date(date);
    //datePlusOne.setDate(date.getDate() + 1);
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
    updateContentDate(events, member);
  })
}
  
/**
 * Updates the event content with the current dates.
 */
function updateEventContent() {
  getEventDate(date1, 1);
  getEventDate(date2, 2);
  getEventDate(date3, 3);
}