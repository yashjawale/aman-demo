const express = require("express");
const path = require("path");
const fetch = require("node-fetch");
const exphbs = require("express-handlebars");
const showdown = require("showdown");
const bodyParser = require("body-parser");
const sgMail = require("@sendgrid/mail");
const multer = require("multer");

const app = express();

// Handlebars Middleware
app.engine("handlebars", exphbs());
app.set("view engine", "handlebars");

// BodyParser Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Single Post page
app.get("/posts/:category/:id", (req, res) => {
  const category = req.params.category;
  const id = req.params.id;

  if (category && id) {
    if (
      category === "updates" ||
      category === "events" ||
      category === "circulars"
    ) {
      fetch(`https://aman-back.herokuapp.com/${category}/${id}`)
        .then((response) => response.json())
        .then((data) => {
          let post = data;
          let title = post.title;
          let content = post.content;
          let date = post.createdAt.substring(0, 10);
          let cover = "";

          if (post.hasOwnProperty("cover")) {
            cover = post.cover.url;
          }

          let converter = new showdown.Converter();
          let html = converter.makeHtml(content);

          postValues = {
            title: title,
            context: html,
            date: date,
            publicpath: "../../",
          };

          if (cover !== "") {
            postValues.cover = cover;
          }

          res.render("posttemplate", postValues);
        })
        .catch((err) => {
          res.status(404);
          res.render("alert", {
            title: "404 | Page Not Found",
            text: `Sorry, the page you've requested doesn't seem to exist. Check
								the link or Contact Us`,
            img: "not-found",
            publicpath: "../../",
          });
        });
    } else {
      //Category does not exist
      console.log("failed");
    }
  } else {
    //Things not provided
  }
});

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

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

app.post("/contact-send", (req, res) => {
  console.log("Received Contact req.");
  let name = req.body.name.escape();
  let email = req.body.email.escape();
  let mobile = req.body.mobile.escape();
  let message = req.body.message.escape();
  console.log(message);
  const msg = {
    to: "feedback.amansetu@gmail.com",
    from: "contactrequest@amansetumyschool.com",
    subject: "Contact Request",
    html: `<strong>Name:</strong> ${name}<br><br> 
		<strong>Email:</strong> ${email}<br><br>
		<strong>Mobile:</strong> ${mobile}<br><br> 
		<strong>Message:</strong> ${message}<br> `,
  };
  sgMail.send(msg).then(
    () => {
      // console.log("Sent");
      res.render("alert", {
        title: "Message Sent Successfully",
        text: `We shall contact you shortly...`,
        img: "success",
        publicpath: "../../",
      });
    },
    (err) => {
      res.render("alert", {
        title: "Something went wrong",
        text: `We are sorry. Some mysterious power stopped us from doing our magic...`,
        img: "unsuccess",
        publicpath: "../../",
      });
    }
  );
});

app.post("/admission-send", (req, res) => {
  console.log("Received Admission req.");
  console.log(req.body);
  let parentname = req.body.parentname.escape();
  let childname = req.body.childname.escape();
  let email = req.body.email.escape();
  let mobile = req.body.mobile.escape();
  let formdate = new Date(req.body.dob.escape());
  let dob = `${formdate.getDate()}-${
    formdate.getMonth() + 1
  }-${formdate.getFullYear()}`;
  let grade = req.body.class.escape();
  let year = req.body.year.escape();
  let nowdate = new Date();
  let subdate =
    nowdate.getDate() +
    "-" +
    (nowdate.getMonth() + 1) +
    "-" +
    nowdate.getFullYear();
  const msg = {
    to: "feedback.amansetu@gmail.com",
    from: "admissionrequest@amansetumyschool.com",
    // from: "test@test.com",
    subject: "Admission Request",
    html: `<table cellspacing="0" width="1000px" border="1" cellpadding="6">
		<thead>
			<tr>            
			  <th>Class</th>            
			  <th>Academic Year</th>
			  <th>Child\'s Name</th>
			  <th>Date of Birth</th>
			  <th>Parent Name</th>
			  <th>Contact</th>
			  <th>Date applied</th>
			  <th>Email</th>
			</tr>
		  </thead>
		  <tbody>
			<tr>
			  <td>${grade}</td>
			  <td>${year}</td>
			  <td>${childname}</td>
			  <td>${dob}</td>
			  <td>${parentname}</td>
			  <td>${mobile}</td>
			  <td>${subdate}</td>
			  <td>${email}</td>
			</tr>
		  </tbody>
		</table>`,
    //
  };
  sgMail.send(msg).then(
    () => {
      // console.log("Sent");
      res.render("alert", {
        title: "Request Sent Successfully",
        text: `We shall contact you shortly...`,
        img: "success",
        publicpath: "../../",
      });
    },
    (err) => {
      res.render("alert", {
        title: "Something went wrong",
        text: `We are sorry. Some mysterious power stopped us from doing our magic...`,
        img: "unsuccess",
        publicpath: "../../",
      });
    }
  );
});

let upload = multer({ storage: multer.memoryStorage({}) });

app.post("/job-send", upload.single("file-1[]"), (req, res, next) => {
  console.log("Received Job req.");
  let name = req.body.name.escape();
  let email = req.body.email.escape();
  let mobile = req.body.mobile.escape();
  let post = req.body.post.escape();

  let fileInfo = req.file;
  if (fileInfo === undefined || null || "") {
    res.status(200);
    res.render("alert", {
      title: "Something went wrong",
      text: `It seems that you have not submitted your resume`,
      img: "unsuccess",
      publicpath: "../../",
    });
    return;
  }
  let fileatname = fileInfo.originalname;
  let filetype = fileInfo.mimetype;
  const maxSize = 2097152;
  if (fileInfo.buffer.byteLength > maxSize) {
    res.status(200);
    res.render("alert", {
      title: "Something went wrong",
      text: `Probably the uploaded file size is too large`,
      img: "unsuccess",
      publicpath: "../../",
    });
    return;
  }
  if (
    filetype !== "image/png" &&
    filetype !== "application/pdf" &&
    filetype !== "image/jpeg"
  ) {
    console.log("FAILED!");
    res.status(200);
    res.render("alert", {
      title: "Something went wrong",
      text: `The uploaded file type is not supported`,
      img: "unsuccess",
      publicpath: "../../",
    });
    return;
  }
  let filecontent = fileInfo.buffer.toString("base64");
  const msg = {
    to: "feedback.amansetu@gmail.com",
    from: "jobrequest@amansetumyschool.com",
    subject: "Job Request",
    html: `<strong>Name:</strong> ${name}<br><br> 
		<strong>Email:</strong> ${email}<br><br>
		<strong>Post:</strong> ${post}<br><br>
		<strong>Mobile:</strong> ${mobile}<br> `,
    attachments: [
      {
        content: filecontent,
        filename: fileatname,
        type: filetype,
        disposition: "attachment",
      },
    ],
  };
  sgMail.send(msg).then(
    () => {
      // console.log("Sent");
      res.render("alert", {
        title: "Message Sent Successfully",
        text: `We shall contact you shortly...`,
        img: "success",
        publicpath: "../../",
      });
    },
    (err) => {
      res.render("alert", {
        title: "Something went wrong",
        text: `We are sorry. Some mysterious power stopped us from doing our magic...`,
        img: "unsuccess",
        publicpath: "../../",
      });
    }
  );
});

app.post("/volunteer-send", upload.single("file-2[]"), (req, res, next) => {
  console.log("Received Volunteer req.");
  let name = req.body.name.escape();
  let email = req.body.email.escape();
  let mobile = req.body.mobile.escape();
  let post = req.body.post.escape();

  let fileInfo = req.file;
  if (fileInfo === undefined || null || "") {
    res.status(200);
    res.render("alert", {
      title: "Something went wrong",
      text: `It seems that you have not submitted your resume`,
      img: "unsuccess",
      publicpath: "../../",
    });
    return;
  }
  let fileatname = fileInfo.originalname;
  let filetype = fileInfo.mimetype;
  const maxSize = 2097152;
  if (fileInfo.buffer.byteLength > maxSize) {
    res.status(200);
    res.render("alert", {
      title: "Something went wrong",
      text: `Probably the uploaded file size is too large`,
      img: "unsuccess",
      publicpath: "../../",
    });
    return;
  }
  if (
    filetype !== "image/png" &&
    filetype !== "application/pdf" &&
    filetype !== "image/jpeg"
  ) {
    console.log("FAILED!");
    res.status(200);
    res.render("alert", {
      title: "Something went wrong",
      text: `The uploaded file type is not supported`,
      img: "unsuccess",
      publicpath: "../../",
    });
    return;
  }
  let filecontent = fileInfo.buffer.toString("base64");
  const msg = {
    to: "feedback.amansetu@gmail.com",
    from: "volunteerrequest@amansetumyschool.com",
    subject: "Volunteer Request",
    html: `<strong>Name:</strong> ${name}<br><br> 
		<strong>Email:</strong> ${email}<br><br>
		<strong>Post:</strong> ${post}<br><br>
		<strong>Mobile:</strong> ${mobile}<br> `,
    attachments: [
      {
        content: filecontent,
        filename: fileatname,
        type: filetype,
        disposition: "attachment",
      },
    ],
  };
  sgMail.send(msg).then(
    () => {
      // console.log("Sent");
      res.render("alert", {
        title: "Message Sent Successfully",
        text: `We shall contact you shortly...`,
        img: "success",
        publicpath: "../../",
      });
    },
    (err) => {
      res.render("alert", {
        title: "Something went wrong",
        text: `We are sorry. Some mysterious power stopped us from doing our magic...`,
        img: "unsuccess",
        publicpath: "../../",
      });
    }
  );
});

// app.post("/volunteer-send", (req, res) => {
// 	console.log("Received Volunteer req.");
// 	// console.log(req.body);
// 	// res.end();
// 	let name = req.body.name.escape();
// 	let email = req.body.email.escape();
// 	let mobile = req.body.mobile.escape();
// 	let post = req.body.post.escape();
// 	const msg = {
// 		to: "feedback.amansetu@gmail.com",
// 		from: "volunteerrequest@amansetumyschool.com",
// 		subject: "Volunteer Request",
// 		html: `<strong>Name:</strong> ${name}<br><br>
// 		<strong>Email:</strong> ${email}<br><br>
// 		<strong>Post:</strong> ${post}<br><br>
// 		<strong>Mobile:</strong> ${mobile}<br> `,
// 	};
// 	sgMail.send(msg).then(
// 		() => {
// 			// console.log("Sent");
// 			res.render("alert", {
// 				title: "Message Sent Successfully",
// 				text: `We shall contact you shortly...`,
// 				img: "success",
// 				publicpath: "../../",
// 			});
// 		},
// 		(err) => {
// 			res.render("alert", {
// 				title: "Something went wrong",
// 				text: `We are sorry. Some mysterious power stopped us from doing our magic...`,
// 				img: "unsuccess",
// 				publicpath: "../../",
// 			});
// 		}
// 	);
// });

// Set Static Folder
app.use(express.static(path.join(__dirname, "public")));

// 404 error
app.use(function (req, res, next) {
  res.status(404);

  // respond with html page
  if (req.accepts("html")) {
    res.render("alert", {
      title: "404 | Page Not Found",
      text: `Sorry, the page you've requested doesn't seem to exist. Check
			the link or Contact Us`,
      img: "not-found",
      publicpath: "../../",
    });
    return;
  }

  // respond with json
  if (req.accepts("json")) {
    res.send({ error: "Not found" });
    return;
  }

  // default to plain-text. send()
  res.type("txt").send("Not found");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started at port ${PORT}`));
