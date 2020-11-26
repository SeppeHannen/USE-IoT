
/**
 * 
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


  