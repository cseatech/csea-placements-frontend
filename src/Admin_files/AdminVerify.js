import React, { Component } from 'react'
import { server_url } from '../api';
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
        var self = this
        axios.get(server_url + '/api/experiences/get-pending-approvals', { headers: { Authorization: localStorage.get('authtoken') } }).then(function (response) {
            self.setState({ dets: response.data.message })
        })
    }
    render() {
        const { dets } = this.state;
        console.log(this.state)
        if (dets.length == 0) {
            return <div><p>Hold Up!Data is loading</p></div>
        }
        return (

            <div>
                <br /><br />
                <center><h1>Pending Approals</h1></center>
                <br /><br />
                <center>
                    <table border="2">
                        <tbody>
                            <th style={{ padding: `10px` }}>Name</th>
                            <th style={{ padding: `10px` }}>Email</th>
                            <th style={{ padding: `10px` }}>LinkedIn Profile</th>
                            <th style={{ padding: `10px` }}>Company</th>
                            <th style={{ padding: `10px` }}>Experience file</th>
                            <th style={{ padding: `10px` }}>Verify</th>
                            <th style={{ padding: `10px` }}>Delete</th>
                            {this.state.dets.map(function (item, key) {
                                function download() {
                                    var strj = item.experiencefile

                                    const linkSource = strj;
                                    const downloadLink = document.createElement("a");
                                    const fileName = "abc.pdf";
                                    downloadLink.href = linkSource;
                                    downloadLink.download = fileName;
                                    downloadLink.click()
                                }
                                function verifs() {


                                    axios.get(server_url + '/api/experiences/giveapproval/' + item._id, { headers: { Authorization: localStorage.get('authtoken') } }).then(function (response) {

                                        window.alert('Verification Success')
                                        window.location.reload(false);

                                    }).catch((e) => {
                                        console.log(e)
                                    })


                                }
                                function dels() {
                                    console.log(item._id)
                                    axios.get(server_url + '/api/experiences/deletef/' + item._id, { headers: { Authorization: localStorage.get('authtoken') } }).then(function (response) {

                                        window.alert('Deleted Success')
                                        window.location.reload(false);

                                    }).catch((e) => {
                                        console.log(e)
                                    })
                                }

                                return (
                                    <tr key={key} >
                                        <td style={{ padding: `10px` }}>{item.name}</td>
                                        <td style={{ padding: `10px` }}>{item.email}</td>
                                        <td style={{ padding: `10px` }}>{item.linkedinlink}</td>
                                        <td style={{ padding: `10px` }}>{item.company}</td>
                                        <td style={{ padding: `10px` }}><button onClick={download}>Experience File</button></td>
                                        <td style={{ padding: `10px` }}><button onClick={verifs}>Verify</button></td>
                                        <td style={{ padding: `10px` }}><button onClick={dels}>Delete</button></td>
                                    </tr>
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