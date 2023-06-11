import React, { Component } from 'react';
import logo from "../assets/img/logo2.png";
import { $ } from 'react-jquery-plugin'
import axios from 'axios';
import FileBase64 from 'react-file-base64';
import cseaLogo1 from "../assets/img/csea_black1.png";
const validator = require('validator')

var result = ''
class Experience_post extends Component {

  componentDidMount() {

  }
  constructor() {
    super();
    this.state = {
      uname: '',
      email: '',
      year: '',
      company: '',
      linkedIn: '',
      selectedFile: '',
      type: 'Placement',
      post: false,
      unpost: false,
      validname: false,
      validemail: false,
      validyear: false,
      validcompany: false,
      validlinkedin: false,
      validfile: false,
    };
  }


  onChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  }

  onSubmit = (e) => {
    const { uname, email, year, company, linkedIn, selectedFile, type } = this.state;
    this.setState({ validname: false, validyear: false, validcompany: false, validemail: false, validlinkedin: false, validfile: false })
    let formData = new FormData();
    if (this.state.uname !== "" && this.state.email !== "" &&
      this.state.year !== "" && this.state.company !== "" && this.state.linkedIn !== "" && this.state.selectedFile !== "") {
      formData.append('uname', uname);
      formData.append('email', email);
      formData.append('year', year);
      formData.append('company', company);
      formData.append('linkedIn', linkedIn);
      formData.append('selectedFile', result);
      formData.append('type', type);

      const headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }

      axios.post(process.env.REACT_APP_SERVER_URL + '/api/experiences/add-exp', { uname: uname, email: email, type: type, year: year, company: company, linkedIn: linkedIn, selectedFile: selectedFile }, { headers: headers }).then(res => {
        this.setState({ post: true });
      }).catch(err => console.error(err));

    }
    else {
      if (!validator.isEmail(this.state.email)) {
        this.setState({ validemail: true })
      }
      if (this.state.uname == '') {
        this.setState({ validname: true })
      }
      if (this.state.email == '') {
        this.setState({ validemail: true })
      }
      if (this.state.year == '') {
        this.setState({ validyear: true })
      }
      if (this.state.company == '') {
        this.setState({ validcompany: true })
      }
      if (this.state.linkedIn == '') {
        this.setState({ validlinkedin: true })
      }
      if (this.state.selectedFile == '') {
        this.setState({ validfile: true })
      }


    }

  }

  handleChange = (event) => {


    this.setState({
      [event.target.name]:
        event.target.value
    });

  }



  readFile = (event) => {
    var file = event.target.files[0]
    let reader = new FileReader();
    var self = this
    reader.readAsDataURL(file);

    reader.onload = function () {
      result = reader.result
      self.setState({ selectedFile: result })
    };

    reader.onerror = function () {
      console.log(reader.error);
    };



  }
  render() {
    const { uname, email, year, company, linkedIn, selectedFile, type } = this.state;

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

                <li>
                  <a href="/" class="nav-item nav-link ">
                    Home
                  </a>
                </li>

                <li>
                  <a href="/tips" class="nav-item nav-link">
                    Preparation
                  </a>
                </li>
                <li>
                  <a href="/exp_view" class="nav-item nav-link">
                    Experiences
                  </a>
                </li>

                <li class="active">
                  <a style={{ cursor: `default` }} class="nav-item nav-link active">
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




        {!this.state.post ? <div class="container-fluid pt-5">
          <div class="container">
            <div class="text-center pb-2">
              <p class="section-title px-5"><span class="px-2">Connect with Us</span></p>
              <h1 class="mb-4">Share your experience</h1>
            </div>
            <div class="row" >
              <div class="col-lg-7 mb-5 spacing">
                <div class="contact-form">
                  <div id="success"></div>
                  <form name="sentMessage" style={{ alignItems: `center` }} onSubmit={this.onSubmit}

                  >
                    <div class="control-group" >
                      <input type="text" class="form-control-post" id="name" placeholder="Your Name" required="required" data-validation-required-message="Please enter your name" name="uname" value={uname} onChange={this.onChange} />
                      {this.state.validname ? <center><p class="help-block text-danger">Please enter your name</p></center> : null}
                      <br />
                    </div>
                    <div class="control-group">
                      <input type="email" class="form-control-post" id="email" placeholder="Your Email" required="required" data-validation-required-message="Please enter your email" name="email" value={email} onChange={this.onChange} />
                      <br />
                      {this.state.validemail ? <center><p class="help-block text-danger">Please enter valid email</p></center> : null}
                    </div>
                    <div class="control-group">
                      <select name='type' value={type} onChange={this.onChange}>
                        <option>Placement</option>
                        <option>Intern</option>
                      </select>
                    </div>
                    <div class="control-group">
                      <input type="text" class="form-control-post" id="subject" placeholder="Year of Passing Out" required="required" data-validation-required-message="Please enter the year of interview" name="year" value={year} onChange={this.onChange} />
                      <br />
                      {this.state.validyear ? <center><p class="help-block text-danger">Please enter year</p></center> : null}
                    </div>
                    <div class="control-group">
                      <input type="text" class="form-control-post" id="subject1" placeholder="Company" required="required" data-validation-required-message="Please enter your company" name="company" value={company} onChange={this.onChange} />
                      <br />
                      {this.state.validyear ? <center><p class="help-block text-danger">Please enter company</p></center> : null}
                    </div>
                    <div class="control-group">
                      <input class="form-control-post" rows="6" id="linkedIn" placeholder="LinkedIn URL" data-validation-required-message="Please enter your linkedIn Link" name="linkedIn" value={linkedIn} onChange={this.onChange}></input>
                      <br />
                      {this.state.validlinkedin ? <center><p class="help-block text-danger">Please enter your linkedin url</p></center> : null}
                      <center><p class="help-block text-danger" >* Fill with '-' if you don't have a LinkedIn profile</p></center>
                    </div>
                    <div>
                      <input type="file" accept=".pdf" class="form-control-post" id="subject2" style={{ height: `50px` }} placeholder="Experience File" required="required" data-validation-required-message="Please give a PDF as input" onChange={this.readFile} />
                      <br />
                      {this.state.validfile ? <center><p class="help-block text-danger">Upload your experience file</p></center> : null}

                      <center><p class="help-block text-danger">* Please upload PDF only</p></center>
                    </div>
                    <div>
                      <center><button class="btn btn-primary py-21 px-4" type="button" onClick={this.onSubmit} id="sendMessageButton" >Submit for review</button></center>
                    </div>
                  </form>

                </div>
              </div>

            </div>
          </div>
        </div> : null}

        {this.state.post && <center><br /><br /><br /><h1>Thank You for sharing your experience!!</h1></center>}
        {this.state.unpost && <center><h1>Please try again later!!</h1></center>}

      </div>
    );
  }
}

export default Experience_post;