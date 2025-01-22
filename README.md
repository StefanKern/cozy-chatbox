# Maiers Electronic -- Quickbook AI agent

## Project info

**URL**: https://lovable.dev/projects/fa33826d-7209-4ba9-a81d-99b6a008138d

Maiers electronic is a [https://n8n.io/](n8n) AI agent connected to the [live stuido agent](https://studio.ottomator.ai/) with a [loveable](https://lovable.dev/) UI. It allowes the user to book appointments for small electrical problems, like faulty or non-working outlets, tripped circuit breaker or light fixture installation or repair.

It is written for the [live studio hackaton](https://studio.ottomator.ai/hackathon/agreement).

## AI agent functionallity

The user can talk to the AI agent in natural language. It has access to a shared calendar and can book appointments with the following time slots
Morning Timeslots:
  - 8:00 AM - 9:00 AM
  - 9:00 AM - 10:00 AM
  - 10:00 AM - 11:00 AM
  - 11:00 AM - 12:00 PM
Afternoon Timeslots:
  - 1:00 PM - 2:00 PM
  - 2:00 PM - 3:00 PM
  - 3:00 PM - 4:00 PM
  - 4:00 PM - 5:00 PM
If a timeslot is already booked, it prevents a double booking.

After a suitable timeslot is booked, it collects required user information such as
  - name
	- issue description
  - location
  - phone numbe

When all date is collected it summarizes the information and after a user confirmation, sends books the appointment.

The complete workflow is defined in n8n, it's code can be found under [n8n-agent/Electrician_booking_agent.json](n8n-agent/Electrician_booking_agent.json).

Appointments are saved in a public [https://calendar.google.com/calendar/embed?src=1029d713e6818b51493bdf87e16768777012903fb80e10d77b94df7b9c160cc3%40group.calendar.google.com&ctz=Europe%2FVienna](google calendar).

## live studio

![image](https://github.com/user-attachments/assets/4f609874-fe83-4bb8-90c4-167d3424a231)

the n8n project is connected to [https://studio.ottomator.ai/agent/0](live studios agent 0)

## loveable UI

![image](https://github.com/user-attachments/assets/56a89725-ee23-4c8f-9e30-c1809f46ed62)

The UI was made in loveable. All code was generated by promting the loveable AI, not customizations where made by a humane.

### loveable promt

The sgtarting point was [https://www.youtube.com/@ColeMedin](Cole Medin) video [INSANE New Strategy for Building AI Agent Apps](https://youtu.be/yRIEpNlacd0), and the loveable promt he provided under the video.

After the project was running, custimizations where made, like the addition of a header section, the removal of the chat history menu and the chat functionallity was changed, to not disable and loose focus.

### Images

All displayed (e.g. icon and images left and right) where generated with chatgpt.
