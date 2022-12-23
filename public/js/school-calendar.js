document.addEventListener("DOMContentLoaded", function () {
	var calendarEl = document.getElementById("calendar");
	var calendar = new FullCalendar.Calendar(calendarEl, {
		// initialView: "dayGridMonth",
		initialView: window.innerWidth < 1024 ? "listMonth" : "dayGridMonth",
		googleCalendarApiKey: "AIzaSyC43NoXBDjzn_IKzqrlmxlgDBwbq25p2vU",
		events: {
			googleCalendarId: "q1a8g3hk24lad6f81lvlpjpqcs@group.calendar.google.com",
		},
		eventClick: function (info) {
			info.jsEvent.preventDefault();
		},
		// eventColor: getComputedStyle(document.documentElement).getPropertyValue(
		// 	"--primary"
		// )
	});
	calendar.render();

	// if (screen.width < 1024) {
	// 	calendar.changeView("listMonth");
	// }
});
