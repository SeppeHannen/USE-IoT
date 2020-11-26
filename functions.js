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
      }