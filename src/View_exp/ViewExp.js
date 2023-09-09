

import React, { Component } from 'react'
import './style.css';
import { CloseSharp } from '@material-ui/icons';
import { MDBListGroup, MDBListGroupItem, MDBIcon, MDBCol, MDBBtn } from 'mdbreact';
// import { HashLink as Link }   from "react-router-hash-link";
// import cseaLogo1 from "../assets/img/csea_black1.png"
import cseaLogo1 from "../assets/img/csea-new-black1.png";
// import { $ } from "react-jquery-plugin";
const localStorage = require('local-storage')

const axios = require('axios')



class ViewExp extends Component {
  constructor() {
    super();
    this.state = {
      dets: [],
      onload: true,
      emptydata: false,
      search_text: '',
      active_company: 'All',
      type: 'All',
      companyList: [],
      pdfResponse: ''
    }
    this.searchRef = React.createRef();
    this.buttonRef = React.createRef();

    this.savestate.bind(this)
    this.searchlist.bind(this)
  }



  onChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  }

  onTypeClick = (e) => {
    this.setState({ type: e.target.textContent });
  }


  savestate(ind) {
    var temp = this.state.dets;
    var self = this;
    if (this.state.type == 'Placement') {
      temp = this.state.dets.filter((elem) => elem.type.toLowerCase() == 'placement')
    }
    if (this.state.type == 'Intern') {
      temp = this.state.dets.filter((elem) => elem.type.toLowerCase() == 'intern')
    }

    localStorage.set('indets', temp[ind])
    const { _id, name, year, company, exptext, linkedinlink, experiencefile } = localStorage.get('indets')

    axios.get(process.env.REACT_APP_SERVER_URL + '/api/experiences/getfile/' + _id).then(function (response) {
      var strj = response.data.message[0].experiencefile
      var base64 = btoa(
        new Uint8Array(strj)
          .reduce((data, byte) => data + String.fromCharCode(byte), '')
      );

      const mql = window.matchMedia('(max-width:600px');
      if (mql.matches) {
        console.log(base64.toString())
        const downloadLink = document.createElement("a");
        const fileName = "Experience" + "_" + name + ".pdf";
        downloadLink.href = strj;
        downloadLink.download = fileName;
        downloadLink.click()  
      } else {
        self.setState({ pdfResponse: strj });
      }
    })
      .catch((e) => {

        alert(e);
      })

  }
  componentDidMount() {
    var self = this
    axios.get(process.env.REACT_APP_SERVER_URL + '/api/experiences/getallexp', { mode: 'cors' }).then(function (response) {
      self.setState({ dets: response.data.message, onload: false })
    })
      .catch((e) => {
        window.alert(e)
      })

    axios.get(process.env.REACT_APP_SERVER_URL + '/api/experiences/companies', { mode: 'cors' }).then(function (response) {
      self.setState({ companyList: response.data.message })
    })
      .catch((e) => {
        window.alert(e)
      })

  }

  displayExp = (dets) => {
    if (!dets || dets.length == 0) {
      return <center style={{ margin: '2rem 0' }}><h3>No experiences available yet!</h3></center>
    }
    return <div class="container-sidebar">
      {dets.map((det, index) =>
      (
        <div key={index} class="card-category-1">

          <div class="basic-card basic-card-aqua">
            <div class="card-content">
              {det.linkedinlink != "-" ? <a style={{ color: "white" }} href={det.linkedinlink} target='_blank'>
                <span class="card-title">{det.name}</span>
              </a> : <span class="card-title">{det.name}</span>}
              <p class="card-text">
                {det.company}<br></br>
                {det.year}
              </p>
            </div>
            <div class="card-link" onClick={() => this.savestate(index)} style={{ color: `white`, cursor: `pointer` }}>
              <span><u>Read Article</u> </span>
            </div>
            <div class="card-type">{det.type}</div>
          </div>
        </div>
      ))}
      {
        this.state.pdfResponse != '' &&
        <div class="pdf-container">
          <div class="close" onClick={() => this.setState({pdfResponse : ''})}> 
          <CloseSharp />
          </div>
          <embed
                  src={this.state.pdfResponse}
                  id="displayFile"
                  alt="pdf"
                  width="100%"
                  height="100%"
                  class="pdf-viewer"
                  type="application/pdf"
          />
        </div>
      }
    </div>
  }


  searchexp = () => {
    var self = this
    console.log(this.state.search_text);
    self.setState({ onload: true, emptydata: false })
    if (this.state.search_text == '') {
      self.searchlist({ company: 'All' })
    }
    else {
      var self = this
      axios.get(process.env.REACT_APP_SERVER_URL + '/api/experiences/getbycompany/' + self.state.search_text).then(function (response) {
        console.log(response);
        self.setState({ dets: response.data.message, search_text: self.state.search_text, onload: false })
        if (response.data.message.length == 0) {
          self.setState({ emptydata: true })
        }



      })
        .catch((e) => {
          alert(e);

        })
    }

  }

  searchlist = (cmpny) => {
    var self = this
    self.setState({ onload: true })
    self.setState({ emptydata: false })
    if (cmpny.company == 'All') {
      axios.get(process.env.REACT_APP_SERVER_URL + '/api/experiences/getallexp').then(function (response) {
        self.setState({ dets: response.data.message, search_text: self.state.search_text, onload: false })

        if (response.data.message.length == 0) {
          self.setState({ emptydata: true, onload: false })
        }


      })
        .catch((e) => {

          alert(e);
        })

    }
    else {
      axios.get(process.env.REACT_APP_SERVER_URL + '/api/experiences/getbycompany/' + cmpny.company).then(function (response) {


        if (response.data.message.length == 0) {
          self.setState({ emptydata: true, onload: false, dets: [] })
        }

        else {
          self.setState({ onload: true })
          self.setState({ dets: response.data.message, search_text: self.state.search_text, onload: false })


        }


      })
        .catch((e) => {

          alert(e);
        })
    }

  }

  render() {
    const search_text = this.state.search_text
    var cmpnylist = ['Accenture', 'Accolite', 'Alstom', 'Amazon', 'Aspire Systems', 'Barclays', 'BNY Mellon', 'Chronus', 'Citicorp', 'Enphase Energy', 'Fidelity', 'Global Analytics', 'Hubstream', 'Khoros', 'LTI', 'Micron Technology', 'Morgan Stanley', 'MU Sigma', 'Quantiphi', 'RBS', 'SAP Labs', 'TCS', 'TCS Digital', 'Tekion', 'Temenos', 'Verizon', 'Visa', 'Vivriti Capital', 'Walmart Labs', 'Wells Fargo', 'Wipro']
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

        <MDBCol className='searchbar' >

          <div style={{ display: `flex`, flexDirection: `row`, justifyContent: 'center' }}>
            <MDBIcon style={{ paddingRight: `10px`, paddingTop: `10px` }} floating icon="search" size="lg" />
            <input className="form-control" name="search_text" id="search_text" onChange={this.onChange} ref={this.searchRef} type="text" placeholder="Enter company name" aria-label="Search" />
            <div className='search-bar-button'>
              {/* <MDBBtn onClick={this.searchexp} color="blue" rounded size="sm" id="search_button" type="submit" className="mrc" ref={this.buttonRef}  >
                Search
              </MDBBtn> */}
              <button onClick={this.searchexp}>
                Search
              </button>
            </div>
            <div className="showAll">

              {/* <MDBBtn onClick={() => this.searchlist({ company: 'All' })} color="blue" rounded size="sm" className="allButton"  >
                All
              </MDBBtn> */}
              <button onClick={() => this.searchlist({ company: 'All' })} >
                All
              </button>
            </div>

          </div>
        </MDBCol>
        <br />
        <div class="tags">
          <button onClick={this.onTypeClick} className={this.state.type == 'All' ? 'active' : ''}>All</button>
          <button onClick={this.onTypeClick} className={this.state.type == 'Placement' ? 'active' : ''}>Placement</button>
          <button onClick={this.onTypeClick} className={this.state.type == 'Intern' ? 'active' : ''}>Intern</button>
        </div>
        <div style={{ float: `left`, paddingTop: `10px`, height: `65vh`, width: `20%`, overflow: `hidden`, overflowY: `scroll` }} className="sidebar-list">
          <MDBListGroup style={{ width: "20rem" }}>
            <span onClick={() => { this.searchlist({ company: 'All' }); this.setState({ active_company: "All" }); }}>
              <MDBListGroupItem style={{ cursor: `pointer` }} className={this.state.active_company == "All" ? 'active-sidebar' : ''}>All</MDBListGroupItem>
            </span>
            {this.state.companyList.map((company) => (

              <span onClick={() => { this.searchlist({ company }); this.setState({ active_company: company }); }}>
                <MDBListGroupItem style={{ cursor: `pointer` }} className={this.state.active_company == company ? 'active-sidebar' : ''}>{company}</MDBListGroupItem>
              </span>

            ))}


          </MDBListGroup>
        </div>
        {
          this.state.onload ?

            <div id="loader"></div> : null

        }
        <div style={{ paddingTop: `30px` }}>
          {this.state.type == 'All' ? this.displayExp(this.state.dets) : ''}
          {this.state.type == 'Placement' ? this.displayExp(this.state.dets.filter((elem) => elem.type.toLowerCase() == 'placement')) : ''}
          {this.state.type == 'Intern' ? this.displayExp(this.state.dets.filter((elem) => elem.type.toLowerCase() == 'intern')) : ''}
        </div>

        {this.state.emptydata ? <center><h3>No experiences available yet!</h3></center> : null}
      </div>
    );

  }
}
export default ViewExp;



