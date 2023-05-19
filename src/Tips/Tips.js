
import React, { Component } from "react";
import jQuery from "jquery";
import "./style.css";
import cseaLogo1 from "../assets/img/csea_black1.png";
class Tips extends Component {
  
  
componentDidMount() {

jQuery(document).ready(function ($) {
  var timelines = $(".cd-horizontal-timeline"),
    eventsMinDistance = 120;

  timelines.length > 0 && initTimeline(timelines);

  function initTimeline(timelines) {
    timelines.each(function () {
      var timeline = $(this),
        timelineComponents = {};
      //cache timeline components
      timelineComponents["timelineWrapper"] = timeline.find(
        ".events-wrapper"
      );
      timelineComponents["eventsWrapper"] = timelineComponents[
        "timelineWrapper"
      ].children(".events");
      timelineComponents["fillingLine"] = timelineComponents[
        "eventsWrapper"
      ].children(".filling-line");
      timelineComponents["timelineEvents"] = timelineComponents[
        "eventsWrapper"
      ].find("a");
      timelineComponents["timelineDates"] = parseDate(
        timelineComponents["timelineEvents"]
      );
      timelineComponents["eventsMinLapse"] = minLapse(
        timelineComponents["timelineDates"]
      );
      timelineComponents["timelineNavigation"] = timeline.find(
        ".cd-timeline-navigation"
      );
      timelineComponents["eventsContent"] = timeline.children(
        ".events-content"
      );

      //assign a left postion to the single events along the timeline
      setDatePosition(timelineComponents, eventsMinDistance);
      //assign a width to the timeline
      var timelineTotWidth = setTimelineWidth(
        timelineComponents,
        eventsMinDistance
      );
      //the timeline has been initialize - show it
      timeline.addClass("loaded");

      //detect click on the next arrow
      timelineComponents["timelineNavigation"].on(
        "click",
        ".next",
        function (event) {
          event.preventDefault();
          updateSlide(timelineComponents, timelineTotWidth, "next");
        }
      );
      //detect click on the prev arrow
      timelineComponents["timelineNavigation"].on(
        "click",
        ".prev",
        function (event) {
          event.preventDefault();
          updateSlide(timelineComponents, timelineTotWidth, "prev");
        }
      );
      //detect click on the a single event - show new event content
      timelineComponents["eventsWrapper"].on(
        "click",
        "a",
        function (event) {
          event.preventDefault();
          timelineComponents["timelineEvents"].removeClass("selected");
          $(this).addClass("selected");
          updateOlderEvents($(this));
          updateFilling(
            $(this),
            timelineComponents["fillingLine"],
            timelineTotWidth
          );
          updateVisibleContent(
            $(this),
            timelineComponents["eventsContent"]
          );
        }
      );
      
      //on swipe, show next/prev event content
      timelineComponents["eventsContent"].on("swipeleft", function () {
        var mq = checkMQ();
        mq == "mobile" &&
          showNewContent(timelineComponents, timelineTotWidth, "next");
      });
      timelineComponents["eventsContent"].on("swiperight", function () {
        var mq = checkMQ();
        mq == "mobile" &&
          showNewContent(timelineComponents, timelineTotWidth, "prev");
      });

      //keyboard navigation
      $(document).keyup(function (event) {
        if (event.which == "37" && elementInViewport(timeline.get(0))) {
          showNewContent(timelineComponents, timelineTotWidth, "prev");
        } else if (
          event.which == "39" &&
          elementInViewport(timeline.get(0))
        ) {
          showNewContent(timelineComponents, timelineTotWidth, "next");
        }
      });
    });
  }

  function updateSlide(timelineComponents, timelineTotWidth, string) {
    //retrieve translateX value of timelineComponents['eventsWrapper']
    var translateValue = getTranslateValue(
        timelineComponents["eventsWrapper"]
      ),
      wrapperWidth = Number(
        timelineComponents["timelineWrapper"].css("width").replace("px", "")
      );
    //translate the timeline to the left('next')/right('prev')
    string == "next"
      ? translateTimeline(
          timelineComponents,
          translateValue - wrapperWidth + eventsMinDistance,
          wrapperWidth - timelineTotWidth
        )
      : translateTimeline(
          timelineComponents,
          translateValue + wrapperWidth - eventsMinDistance
        );
  }

  function showNewContent(timelineComponents, timelineTotWidth, string) {
    //go from one event to the next/previous one
    var visibleContent = timelineComponents["eventsContent"].find(
        ".selected"
      ),
      newContent =
        string == "next" ? visibleContent.next() : visibleContent.prev();

    if (newContent.length > 0) {
      //if there's a next/prev event - show it
      var selectedDate = timelineComponents["eventsWrapper"].find(
          ".selected"
        ),
        newEvent =
          string == "next"
            ? selectedDate.parent("li").next("li").children("a")
            : selectedDate.parent("li").prev("li").children("a");

      updateFilling(
        newEvent,
        timelineComponents["fillingLine"],
        timelineTotWidth
      );
      updateVisibleContent(newEvent, timelineComponents["eventsContent"]);
      newEvent.addClass("selected");
      selectedDate.removeClass("selected");
      updateOlderEvents(newEvent);
      updateTimelinePosition(
        string,
        newEvent,
        timelineComponents,
        timelineTotWidth
      );
    }
  }

  function updateTimelinePosition(
    string,
    event,
    timelineComponents,
    timelineTotWidth
  ) {
    //translate timeline to the left/right according to the position of the selected event
    var eventStyle = window.getComputedStyle(event.get(0), null),
      eventLeft = Number(
        eventStyle.getPropertyValue("left").replace("px", "")
      ),
      timelineWidth = Number(
        timelineComponents["timelineWrapper"].css("width").replace("px", "")
      ),
      timelineTotWidth = Number(
        timelineComponents["eventsWrapper"].css("width").replace("px", "")
      );
    var timelineTranslate = getTranslateValue(
      timelineComponents["eventsWrapper"]
    );

    if (
      (string == "next" && eventLeft > timelineWidth - timelineTranslate) ||
      (string == "prev" && eventLeft < -timelineTranslate)
    ) {
      translateTimeline(
        timelineComponents,
        -eventLeft + timelineWidth / 2,
        timelineWidth - timelineTotWidth
      );
    }
  }

  function translateTimeline(timelineComponents, value, totWidth) {
    var eventsWrapper = timelineComponents["eventsWrapper"].get(0);
    value = value > 0 ? 0 : value; //only negative translate value
    value =
      !(typeof totWidth === "undefined") && value < totWidth
        ? totWidth
        : value; //do not translate more than timeline width
    setTransformValue(eventsWrapper, "translateX", value + "px");
    //update navigation arrows visibility
    value == 0
      ? timelineComponents["timelineNavigation"]
          .find(".prev")
          .addClass("inactive")
      : timelineComponents["timelineNavigation"]
          .find(".prev")
          .removeClass("inactive");
    value == totWidth
      ? timelineComponents["timelineNavigation"]
          .find(".next")
          .addClass("inactive")
      : timelineComponents["timelineNavigation"]
          .find(".next")
          .removeClass("inactive");
  }

  function updateFilling(selectedEvent, filling, totWidth) {
    //change .filling-line length according to the selected event
    var eventStyle = window.getComputedStyle(selectedEvent.get(0), null),
      eventLeft = eventStyle.getPropertyValue("left"),
      eventWidth = eventStyle.getPropertyValue("width");
    eventLeft =
      Number(eventLeft.replace("px", "")) +
      Number(eventWidth.replace("px", "")) / 2;
    var scaleValue = eventLeft / totWidth;
    setTransformValue(filling.get(0), "scaleX", scaleValue);
  }

  function setDatePosition(timelineComponents, min) {
    for (var i = 0; i < timelineComponents["timelineDates"].length; i++) {
      var distance = daydiff(
          timelineComponents["timelineDates"][0],
          timelineComponents["timelineDates"][i]
        ),
        distanceNorm =
          Math.round(distance / timelineComponents["eventsMinLapse"]) + 2;
      timelineComponents["timelineEvents"]
        .eq(i)
        .css("left", distanceNorm * min + "px");
    }
  }

  function setTimelineWidth(timelineComponents, width) {
    var timeSpan = daydiff(
        timelineComponents["timelineDates"][0],
        timelineComponents["timelineDates"][
          timelineComponents["timelineDates"].length - 1
        ]
      ),
      timeSpanNorm = timeSpan / timelineComponents["eventsMinLapse"],
      timeSpanNorm = Math.round(timeSpanNorm) + 4,
      totalWidth = timeSpanNorm * width;
    timelineComponents["eventsWrapper"].css("width", totalWidth + "px");
    updateFilling(
      timelineComponents["timelineEvents"].eq(0),
      timelineComponents["fillingLine"],
      totalWidth
    );

    return totalWidth;
  }

  function updateVisibleContent(event, eventsContent) {
    var eventDate = event.data("date"),
      visibleContent = eventsContent.find(".selected"),
      selectedContent = eventsContent.find(
        '[data-date="' + eventDate + '"]'
      ),
      selectedContentHeight = selectedContent.height();

    if (selectedContent.index() > visibleContent.index()) {
      var classEnetering = "selected enter-right",
        classLeaving = "leave-left";
    } else {
      var classEnetering = "selected enter-left",
        classLeaving = "leave-right";
    }

    selectedContent.attr("class", classEnetering);
    visibleContent
      .attr("class", classLeaving)
      .one(
        "webkitAnimationEnd oanimationend msAnimationEnd animationend",
        function () {
          visibleContent.removeClass("leave-right leave-left");
          selectedContent.removeClass("enter-left enter-right");
        }
      );
    eventsContent.css("height", selectedContentHeight + "px");
  }

  function updateOlderEvents(event) {
    event
      .parent("li")
      .prevAll("li")
      .children("a")
      .addClass("older-event")
      .end()
      .end()
      .nextAll("li")
      .children("a")
      .removeClass("older-event");
  }

  function getTranslateValue(timeline) {
    var timelineStyle = window.getComputedStyle(timeline.get(0), null),
      timelineTranslate =
        timelineStyle.getPropertyValue("-webkit-transform") ||
        timelineStyle.getPropertyValue("-moz-transform") ||
        timelineStyle.getPropertyValue("-ms-transform") ||
        timelineStyle.getPropertyValue("-o-transform") ||
        timelineStyle.getPropertyValue("transform");

    if (timelineTranslate.indexOf("(") >= 0) {
      var timelineTranslate = timelineTranslate.split("(")[1];
      timelineTranslate = timelineTranslate.split(")")[0];
      timelineTranslate = timelineTranslate.split(",");
      var translateValue = timelineTranslate[4];
    } else {
      var translateValue = 0;
    }

    return Number(translateValue);
  }

  function setTransformValue(element, property, value) {
    element.style["-webkit-transform"] = property + "(" + value + ")";
    element.style["-moz-transform"] = property + "(" + value + ")";
    element.style["-ms-transform"] = property + "(" + value + ")";
    element.style["-o-transform"] = property + "(" + value + ")";
    element.style["transform"] = property + "(" + value + ")";
  }

  //based on http://stackoverflow.com/questions/542938/how-do-i-get-the-number-of-days-between-two-dates-in-javascript
  function parseDate(events) {
    var dateArrays = [];
    events.each(function () {
      var dateComp = $(this).data("date").split("/"),
        newDate = new Date(dateComp[2], dateComp[1] - 1, dateComp[0]);
      dateArrays.push(newDate);
    });
    return dateArrays;
  }

  function parseDate2(events) {
    var dateArrays = [];
    events.each(function () {
      var singleDate = $(this),
        dateComp = singleDate.data("date").split("T");
      if (dateComp.length > 1) {
        //both DD/MM/YEAR and time are provided
        var dayComp = dateComp[0].split("/"),
          timeComp = dateComp[1].split(":");
      } else if (dateComp[0].indexOf(":") >= 0) {
        //only time is provide
        var dayComp = ["2000", "0", "0"],
          timeComp = dateComp[0].split(":");
      } else {
        //only DD/MM/YEAR
        var dayComp = dateComp[0].split("/"),
          timeComp = ["0", "0"];
      }
      var newDate = new Date(
        dayComp[2],
        dayComp[1] - 1,
        dayComp[0],
        timeComp[0],
        timeComp[1]
      );
      dateArrays.push(newDate);
    });
    return dateArrays;
  }

  function daydiff(first, second) {
    return Math.round(second - first);
  }

  function minLapse(dates) {
    //determine the minimum distance among events
    var dateDistances = [];
    for (var i = 1; i < dates.length; i++) {
      var distance = daydiff(dates[i - 1], dates[i]);
      dateDistances.push(distance);
    }
    return Math.min.apply(null, dateDistances);
  }

  /*
    How to tell if a DOM element is visible in the current viewport?
    http://stackoverflow.com/questions/123999/how-to-tell-if-a-dom-element-is-visible-in-the-current-viewport
  */
  function elementInViewport(el) {
    var top = el.offsetTop;
    var left = el.offsetLeft;
    var width = el.offsetWidth;
    var height = el.offsetHeight;

    while (el.offsetParent) {
      el = el.offsetParent;
      top += el.offsetTop;
      left += el.offsetLeft;
    }

    return (
      top < window.pageYOffset + window.innerHeight &&
      left < window.pageXOffset + window.innerWidth &&
      top + height > window.pageYOffset &&
      left + width > window.pageXOffset
    );
  }

  function checkMQ() {
    //check if mobile or desktop device
    return window
      .getComputedStyle(
        document.querySelector(".cd-horizontal-timeline"),
        "::before"
      )
      .getPropertyValue("content")
      .replace(/'/g, "")
      .replace(/"/g, "");
  }
});
}

render() {
return (
  <div>
    <div class="container-fluid bg-light position-relative shadow">
      <nav class="navbar navbar-expand-lg bg-light navbar-light py-3 py-lg-0 px-0 px-lg-5">
        <a
          class="navbar-brand font-weight-bold text-secondary"
          style={{ fontSize: `35px` }}
        >
      
      <img
            src={cseaLogo1}
            style={{ height: `80px`, width: `80px`, paddingBottom: `5px` }}
          ></img>
        </a>
        <button
          type="button"
          class="navbar-toggler"
          data-toggle="collapse"
          data-target="#navbarCollapse"
        >
          <span class="navbar-toggler-icon"></span>
        </button>
        <div
          class="collapse navbar-collapse justify-content-between"
          id="navbarCollapse"
        >
          <div class="navbar-nav font-weight-bold mx-auto py-0 ">
            

            <li >
              <a href="/" class="nav-item nav-link">
                Home
              </a>
            </li>
            
            <li class="active">
              <a  style={{cursor:`default`}} class="nav-item nav-link active">
                Preparation
              </a>
            </li>
            <li>
              <a href="/exp_view" class="nav-item nav-link">
                Experience
              </a>
            </li>
            
            <li>
              <a href="/exp_post" class="nav-item nav-link">
                Post
              </a>
            </li>
            <li>
              <a href="/#contact" class="nav-item nav-link">
                Contact
              </a>
            </li>

            
          </div>
        </div>
      </nav>
    </div>
    

    <section class="cd-horizontal-timeline">
      <div class="timeline-tips">
        <div class="events-wrapper">
          <div class="events">
            <ol>
              <li>
                <a
                  href="#0"
                  data-date="16/01/2014"
                  class="selected"
                  style={{ fontSize: `13px`, textDecoration: `None` }}
                >
                  Build your resume
                </a>
              </li>
              <li>
                <a
                  href="#0"
                  data-date="20/02/2014"
                  style={{ fontSize: `13px`, textDecoration: `None` }}
                >
                  Practise coding
                </a>
              </li>
              <li>
                <a
                  href="#0"
                  data-date="20/03/2014"
                  style={{ fontSize: `13px`, textDecoration: `None` }}
                >
                  Brush up CS subjects
                </a>
              </li>
              <li>
                <a
                  href="#0"
                  data-date="20/04/2014"
                  style={{ fontSize: `13px`, textDecoration: `None` }}
                >
                  Learn Aptitude
                </a>
              </li>
              <li>
                <a
                  href="#0"
                  data-date="20/05/2014"
                  style={{ fontSize: `13px`, textDecoration: `None` }}
                >
                  Prepare specifically
                </a>
              </li>
              <li>
                <a
                  href="#0"
                  data-date="25/06/2014"
                  style={{ fontSize: `13px`, textDecoration: `None` }}
                >
                  Getting ready for interview
                </a>
              </li>
              <li style={{ color: `white` }}>
                <a href="#0" data-date="10/07/2014"></a>
              </li>
              
            </ol>

            <span class="filling-line" aria-hidden="true"></span>
          </div>
        </div>

        <ul class="cd-timeline-navigation">
          {/* <li> */}
          <a href="#0" class="prev inactive">
            Prev
          </a>
          <a href="#0" class="next">
            Next
          </a>
        </ul>
      </div>

      <div class="events-content">
        <ol>
          <li class="selected" data-date="16/01/2014">
            <h2 style={{ fontSize: `40px`, fontFamily: `Handlee` }}>
              Resume building
            </h2>
            {/* <em >January 16th, 2014</em> */}
            <p
              style={{
                fontSize: `20px`,
                fontFamily: `"Nunito",sans-serif`,
                color: `#00394f`,
              }}
            >
             ❏ Make sure you can answer any questions raised from
              your resume.
              <br />
              ❏ Things to include:
              <br /> ❏ Full name, Email ID, phone number
              <br /> ❏ Professional social sites link(optional) like
              LinkedIn, codechef..
              <br /> ❏ Education (reverse order)
              <br /> ❏ Internship (if any) <br />❏ Projects, Extra curricular
              activities, Skills (programming languages or technologies
              known) <br />❏ Hobbies
              <br />
              ❏ Resume should be free from mistakes.
              <br />❏ Try not to exceed a page(max of 2 pages).
            </p>
          </li>

          <li data-date="20/02/2014">
            <h2 style={{ fontSize: `40px`, fontFamily: `Handlee` }}>
              Practice Coding
            </h2>
            {/* <em>February 28th, 2014</em> */}
            <p
              style={{
                fontSize: `20px`,
                fontFamily: `"Nunito",sans-serif`,
                color: `#00394f`,
              }}
            >
              ❏ Most of the time the key focus in a placement process is
              Data structures and Algorithms. <br />❏ So practise as much as
              you can.
              <br />
              ❏ Prepare from GeeksforGeeks.
              <br />❏ Practise in LeetCode.
            </p>
          </li>

          <li data-date="20/03/2014">
            <h2 style={{ fontSize: `40px`, fontFamily: `Handlee` }}>
              CS subjects
            </h2>
            {/* <em>March 20th, 2014</em> */}
            <p
              style={{
                fontSize: `20px`,
                fontFamily: `"Nunito",sans-serif`,
                color: `#00394f`,
              }}
            >
              ❏ Database Management System
              <br />
              ❏ Operating Systems
              <br />
              ❏ Object Oriented Programming Concepts.
              <br />
              ❏ Computer Networks
              <br />
              ❏ Computer Architecture, Digital principles (low priority)
              <br />❏ Java (depends on role)
              <br />❏ Learn these concepts from any of your preferred sites.
            </p>
          </li>

          <li data-date="20/04/2014">
            <h2 style={{ fontSize: `40px`, fontFamily: `Handlee` }}>
              Aptitude
            </h2>
            {/* <em>May 20th, 2014</em> */}
            <p
              style={{
                fontSize: `20px`,
                fontFamily: `"Nunito",sans-serif`,
                color: `#00394f`,
              }}
            >
              ❏ You can refer “Quantitative Aptitude By R S Aggarwal” for aptitude
              preparation and <span  ><a  style={{
                fontSize: `20px`,
                fontFamily: `"Nunito",sans-serif`,
                color: `#00394f`,
                fontWeight:`normal`
              }} href="https://www.indiabix.com/" target="_blank">www.indiabix.com</a> </span>
              
            </p>
          </li>

          <li data-date="20/05/2014">
            <h2 style={{ fontSize: `40px`, fontFamily: `Handlee` }}>
              Company specific preparation
            </h2>
            {/* <em>July 9th, 2014</em> */}
            <p
              style={{
                fontSize: `20px`,
                fontFamily: `"Nunito",sans-serif`,
                color: `#00394f`,
              }}
            >
              ❏ Know about the company you are attending.
              <br />
              ❏ Make sure you are aware of the role you are interviewed for.
              <br />
              ❏ Try questions asked previously in the company. Company wise
              coding questions are available in GeeksForGeeks, InterviewBit,
              Leetcode etc.
              <br />
              ❏ Have a look at the interview experiences of the company.
              <br />
            </p>
          </li>

          <li data-date="25/06/2014">
            <h2 style={{ fontSize: `40px`, fontFamily: `Handlee` }}>
              Face to Face Interview
            </h2>
            <br />

            {/* <em>August 30th, 2014</em> */}
            <p
              style={{
                fontSize: `20px`,
                fontFamily: `"Nunito",sans-serif`,
                color: `#00394f`,
              }}
            >
              <h2 style={{ fontSize: `20px`, fontFamily: `Handlee` }}>
                ● Face to Face Interviews (Tech/Managerial):
              </h2>
              ❏ Mostly you will get questions from the topics in your
              resume.
              <br />
              ❏ Questions about your projects and internship
              <br />
              ❏ CS subjects mentioned before
              <br />
              ❏ Coding questions
              <br />
              ❏ Some logical and puzzle questions will also be asked to know
              about your thinking process.
              <br />
              <h2 style={{ fontSize: `20px`, fontFamily: `Handlee` }}>
                ● HR Interviews:
              </h2>
              ❏ 90% of the process is done.
              <br />
              ❏ Communicate with confidence.
              <br />
              ❏ Extend the conversations. Be prepared and have unique
              answers for the same old HR questions.
              <br />
              ❏ Know about the company and Job Description because they
              might discuss them during HR interviews.
              <br />
              <h2 style={{ fontSize: `20px`, fontFamily: `Handlee` }}>
                ● Others:
              </h2>
              ❏ Be confident and honest while answering in the face-to-face
              interviews. Your confidence will be a X-factor in these
              interviews.
              <br />
              ❏ In case the interviewer asks, “Any Questions for me?”, ask
              them some general questions about the company.
              <br />
              ❏ Follow dress code
              <br />
              ❏ You must drive your interview
              <br />
            </p>
          </li>

          <li  data-date="10/07/2014">
                <h2 style={{ fontSize: `40px`, fontFamily: `Handlee` }}>
                  All the Best!!!
                </h2>
                </li>
          
        </ol>
      </div>
    </section>
  </div>
);
}
}

export default Tips;
