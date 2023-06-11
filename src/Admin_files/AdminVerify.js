import React, { Component } from 'react'
import { $ } from "react-jquery-plugin";
const axios = require('axios');
const localStorage = require('local-storage')
class AdminVerify extends Component {
    constructor() {
        super();
        this.state = {
            dets: []
        }
    }

    componentDidMount() {
        $("#loader").show();
        var self = this
        axios.get(process.env.REACT_APP_SERVER_URL + '/api/experiences/get-pending-approvals', { headers: { Authorization: localStorage.get('authtoken') } }).then(function (response) {
            self.setState({ dets: response.data.message })
            $("#loader").hide();
        })
    }

    onSubmit = (e) => {
        e.preventDefault();
        $("#loader").show();
        axios
            .get(process.env.REACT_APP_SERVER_URL + "/api/experiences/approveall", { headers: { Authorization: localStorage.get('authtoken') } })
            .then(function (response) {
                $("#loader").hide();
                window.alert('Verification Success')
                window.location.reload(false);
            })
            .catch((err) => {
                console.log(err);
                $("#loader").hide();
            });
    };

    render() {
        const { dets } = this.state;
        console.log(this.state)
        if (dets.length == 0) {
            return <div>
                <br /><br />
                <center><h1>Pending Approals</h1></center>
                <br /><br />
                <center>
                    <p>No pending experiences</p>
                </center>
            </div>
        }
        return (

            <div>
                <br /><br />
                <center><h1>Pending Approals</h1></center>
                <br /><br />
                <div style={{ margin: '0rem auto 2rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <h5 style={{ margin: '0 1rem 0 0' }}>Verify All pending experiences: </h5>
                    <button onClick={this.onSubmit}>Verify All</button>
                </div>
                <center>
                    <table border="2">
                        <tbody>
                            <th style={{ padding: `10px` }}>Name</th>
                            <th style={{ padding: `10px` }}>Email</th>
                            <th style={{ padding: `10px` }}>LinkedIn Profile</th>
                            <th style={{ padding: `10px` }}>Company</th>
                            <th style={{ padding: `10px` }}>Passing out year</th>
                            <th style={{ padding: `10px` }}>Type</th>
                            <th style={{ padding: `10px` }}>Experience file</th>
                            <th style={{ padding: `10px` }}>Verify</th>
                            <th style={{ padding: `10px` }}>Delete</th>
                            {this.state.dets.map(function (item, key) {
                                function download() {
                                    var strj = item.experiencefile

                                    const linkSource = strj;
                                    const downloadLink = document.createElement("a");
                                    const fileName = "Experience_" + item.name + ".pdf";
                                    downloadLink.href = linkSource;
                                    downloadLink.download = fileName;
                                    downloadLink.click()
                                }
                                function verifs() {

                                    axios.get(process.env.REACT_APP_SERVER_URL + '/api/experiences/giveapproval/' + item._id, { headers: { Authorization: localStorage.get('authtoken') } }).then(function (response) {
                                        window.alert('Verification Success')
                                        window.location.reload(false);

                                    }).catch((e) => {
                                        console.log(e)
                                    })


                                }
                                function dels() {
                                    console.log(item._id)
                                    axios.get(process.env.REACT_APP_SERVER_URL + '/api/experiences/deletef/' + item._id, { headers: { Authorization: localStorage.get('authtoken') } }).then(function (response) {
                                        window.alert('Deleted Success')
                                        window.location.reload(false);

                                    }).catch((e) => {
                                        console.log(e)
                                    })
                                }

                                return (
                                    <>
                                        <tr key={key} >
                                            <td style={{ padding: `10px` }}>{item.name}</td>
                                            <td style={{ padding: `10px` }}>{item.email}</td>
                                            <td style={{ padding: `10px` }}>{item.linkedinlink}</td>
                                            <td style={{ padding: `10px` }}>{item.company}</td>
                                            <td style={{ padding: `10px` }}>{item.year}</td>
                                            <td style={{ padding: `10px` }}>{item.type}</td>
                                            <td style={{ padding: `10px` }}><button onClick={download}>Experience File</button></td>
                                            <td style={{ padding: `10px` }}><button onClick={verifs}>Verify</button></td>
                                            <td style={{ padding: `10px` }}><button onClick={dels}>Delete</button></td>
                                        </tr>
                                    </>
                                )
                            })}
                        </tbody>



                    </table>
                </center>
            </div>
        );

    }

}
export default AdminVerify;