import React, { Component } from "react";
import jQuery from "jquery";
import { $ } from "react-jquery-plugin";
const axios = require("axios");
const localStorage = require("local-storage");
class AdminLogin extends Component {
  constructor() {
    super();
    this.state = {
      uname: "",
      pword: "",
    };
  }

  componentDidMount() {
    setTimeout(function () {
      $("#loader").hide();
    }, 2000);
  }

  onChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };
  onSubmit = (e) => {
    e.preventDefault();
    const { uname, pword } = this.state;
    $("#loader").show();
    axios
      .post(process.env.REACT_APP_SERVER_URL + "/api/users/login-admin", {
        username: uname,
        password: pword,
      })
      .then(function (response) {
        $("#loader").hide();
        if (response.status == 200) {
          window.location = "/adminverify";
        }
        try {
          localStorage.set("authtoken", response.data.token);
        } catch (error) {
          console.log(error);
        }
      })
      .catch((err) => {
        console.log(err);
        alert("Invalid credentials")
        $("#loader").hide();
      });
  };
  render() {
    const { uname, pword } = this.state;
    return (
      <div>
        <div id="loader"></div>
        <div>
          <div>
            <div>
              <br />
              <br />
              <center>
                <h3>Admin Login</h3>
              </center>
              <br />
              <br />
            </div>

            <div>
              <div>
                <center>
                  <input
                    type="text"
                    name="uname"
                    value={uname}
                    onChange={this.onChange}
                    autoComplete="off"
                    placeholder="Username"
                    style={{ border: "2px solid gray", borderRadius: '8px', padding: "8px" }}
                  />
                </center>
              </div>
              <br />

              <div>
                <center>
                  <input
                    type="password"
                    id="password"
                    name="pword"
                    autoComplete="off"
                    value={pword}
                    onChange={this.onChange}
                    placeholder="Password"
                    style={{ border: "2px solid gray", borderRadius: '8px', padding: "8px" }}
                  />
                </center>
              </div>
              <br />

              <div>
                <p>
                  <center>
                    <button style={{
                      padding: '8px',
                      borderRadius: '8px',
                      backgroundColor: 'black',
                      color: 'white'
                    }} onClick={this.onSubmit}>Login</button>
                  </center>
                </p>
              </div>
              <br />
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default AdminLogin;
