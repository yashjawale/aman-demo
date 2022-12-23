const updateButton = document.querySelector("#update-button");
const eventButton = document.querySelector("#event-button");
const circularButton = document.querySelector("#circular-button");

const postSpinner = document.querySelector(".spinner-post");

function hideSpinner() {
	if (!postSpinner.classList.contains("post-loaded")) {
		postSpinner.classList.add("post-loaded");
	}
}

function showSpinner() {
	if (postSpinner.classList.contains("post-loaded")) {
		postSpinner.classList.remove("post-loaded");
	}
}

updateButton.addEventListener("click", updateButtonHandler);
eventButton.addEventListener("click", eventButtonHandler);
circularButton.addEventListener("click", circularButtonHandler);

String.prototype.escape = function () {
	var tagsToReplace = {
		"&": "&amp;",
		"<": "&lt;",
		">": "&gt;",
	};
	return this.replace(/[&<>]/g, function (tag) {
		return tagsToReplace[tag] || tag;
	});
};

const Blog = async (inputLink) => {
	showSpinner();

	try {
		// const url = inputLink;
		const url = `${inputLink}?_sort=createdAt:DESC`;
		const ftch = await fetch(url);
		const data = await ftch.json();
		const result = data;

		const container = document.querySelector("#update-cont");
		container.innerHTML = "";

		for (let i in result) {
			const dv = document.createElement("div");
			dv.classList = "update";

			const heading = document.createElement("h2");
			heading.textContent = `${result[i].title.escape()}`;

			let thumbimage = null;

			if (result[i].hasOwnProperty("cover")) {
				thumbimage = document.createElement("div");
				thumbimage.style.backgroundImage = `url(${result[i].cover.url})`;
			}

			const desc = document.createElement("p");

			if (result[i].hasOwnProperty("desc")) {
				desc.textContent = `${result[i].desc.escape()}`;
			} else {
				desc.textContent = `${result[i].content.escape()}`;
			}

			const date = document.createElement("time");
			dateString = result[i].createdAt.substring(0, 10);
			dateform = new Date(dateString);
			formday = dateform.getDate();
			formmonth = dateform.getMonth();
			formyear = dateform.getFullYear();

			const dateformat = `${formday}-${formmonth}-${formyear}`;
			date.dateTime = dateString;
			date.innerText = dateformat.escape();

			let path = inputLink.substring(31);
			// console.log(path);
			const id = result[i]._id;

			link = `/posts${path}/${id}`;

			let hrf = null;

			if (path !== "/updates") {
				hrf = document.createElement("a");
				hrf.href = link;
				hrf.textContent = "Read More";
			}

			dv.appendChild(date);
			dv.appendChild(heading);
			dv.appendChild(desc);
			if (hrf !== null) {
				dv.appendChild(hrf);
			}
			if (thumbimage !== null) {
				dv.appendChild(thumbimage);
			}

			container.appendChild(dv);

			hideSpinner();
		}
	} catch (error) {
		console.log("failed", error);
	}
};

function updateButtonHandler() {
	if (eventButton.classList.contains("active-category")) {
		eventButton.classList.remove("active-category");
	}
	if (circularButton.classList.contains("active-category")) {
		circularButton.classList.remove("active-category");
	}
	updateButton.classList.add("active-category");

	Blog("https://aman-back.herokuapp.com/updates");
}

function eventButtonHandler() {
	if (updateButton.classList.contains("active-category")) {
		updateButton.classList.remove("active-category");
	}
	if (circularButton.classList.contains("active-category")) {
		circularButton.classList.remove("active-category");
	}
	eventButton.classList.add("active-category");

	Blog("https://aman-back.herokuapp.com/events");
}

function circularButtonHandler() {
	if (updateButton.classList.contains("active-category")) {
		updateButton.classList.remove("active-category");
	}
	if (eventButton.classList.contains("active-category")) {
		eventButton.classList.remove("active-category");
	}
	circularButton.classList.add("active-category");

	Blog("https://aman-back.herokuapp.com/circulars");
	// console.log("You pushed circular button");
}

window.onload = (e) => {
	updateButtonHandler();
};
