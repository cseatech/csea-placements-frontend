import React, { Component } from 'react'
import './style.css';
import ReactDOM from 'react-dom';
import cseaLogo1 from "../assets/img/csea_black1.png"
import { HashLink as Link } from 'react-router-hash-link';
import {
  BrowserView,
  MobileView,
  isBrowser,
  isMobile
} from "react-device-detect";
import { server_url } from '../api';
const localStorage = require('local-storage')

const axios = require('axios')

var obj

class ViewFullExp extends Component {
  constructor() {
    super();
    this.state = {
      dets: [],
      ondownload: false


    }

  }




  componentDidMount() {

    const { _id, name, year, company, exptext, linkedinlink } = localStorage.get('indets')

    var strj
    axios.get(server_url + '/api/experiences/getfile/' + _id).then(function (response) {

      strj = response.data.message[0].experiencefile
      obj = document.createElement('object');
      obj.style.width = '100%';
      obj.style.height = '500pt';
      obj.type = 'application/pdf';
      obj.data = strj;
      if (!isMobile)
        ReactDOM.render(<center><iframe src={obj.data} type={obj.type} style={{ width: `90%`, height: `800px` }}></iframe></center>, document.getElementById('pdf'))

    })
      .catch((e) => {

        alert(e);
      })




  }

  download = () => {
    this.setState({ ondownload: true })
    const { _id, name, year, company, exptext, linkedinlink, experiencefile } = localStorage.get('indets')

    axios.get(server_url + '/api/experiences/getfile/' + _id).then(function (response) {
      var strj = response.data.message[0].experiencefile
      var base64 = btoa(
        new Uint8Array(strj)
          .reduce((data, byte) => data + String.fromCharCode(byte), '')
      );

      console.log(base64.toString())
      const downloadLink = document.createElement("a");
      const fileName = "Experience" + "_" + name + ".pdf";
      downloadLink.href = strj;
      downloadLink.download = fileName;
      downloadLink.click()

    })
      .catch((e) => {

        alert(e);
      })

  }

  render() {
    const { name, year, company, linkedinlink, experiencefile } = localStorage.get('indets')







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
                <li>
                  <a href="/tips" class="nav-item nav-link">
                    Preparation
                  </a>
                </li>
                <li class="active">
                  <a style={{ cursor: `default` }} class="nav-item nav-link active">
                    Experiences
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
        <br />
        <br />

        <center>
          <h1 style={{ paddingLeft: `20px` }}>{name}</h1>
          <h2 style={{ paddingLeft: `20px` }}>{company} - {year}</h2>
        </center>

        <br />
        <br />
        <p style={{
          fontSize: `20px`,
          fontFamily: `Handlee`,
          color: `#00394f`,
          paddingLeft: `20px`,
          paddingRight: `20px`,
          paddingBottom: `20px`
        }}></p>
        <center> {linkedinlink != '-' ? <span style={{
          fontSize: `20px`,
          fontFamily: `Handlee`,
          color: `#00394f`,
          fontWeight: `bold`,
          paddingLeft: `20px`,
          paddingRight: `2px`,
          paddingBottom: `20px`
        }}>Connect with {name} via </span> : null}
          {linkedinlink != '-' ? <a
            class="btn btn-outline-primary rounded-circle text-center mr-2 px-0"
            style={{ width: `38px`, height: `38px`, marginBottom: `10px` }}
            href={linkedinlink}
            target="_blank"
          >
            <i class="fab fa-linkedin-in"></i>
          </a> : null}
          <br />
          {isMobile ? <center><button class="btn btn-primary py-21 px-4 " type="button" onClick={this.download}>Open Experience</button></center> : null}
          <br />
          <br />
          {isMobile && this.state.ondownload ? <center>< p style={{ color: `green`, fontWeight: `bold` }}>File Downloaded</p></center> : null}

        </center>
      </div>

    );

  }
}
export default ViewFullExp;



