import React, { Component } from 'react';
import { connect } from "react-redux";
import ReactTable from "react-table";
import stmConfig from "../../../stmConfiguration";
import 'react-table/react-table.css'

class listOrganization extends Component {
    state = {}
    getDetailOrg = (org) =>{
        this.props.history.push({
            pathname: stmConfig.route.detailsOrganization + '/' + org.id 
        })
    }
    render() {
        let organization = this.props.organization.organization
        let data = []
        organization.map(function (item, k) {
            data.push(item);
        })


        const columns = [
            {
                id: 'Model', // Required because our accessor is not a string
                Header: 'Name',
                accessor: d => d.name,// Custom value accessors!
                Cell: props => <span className='cell_des'>{props.value}</span>, // Custom cell components!
                headerStyle: {
                    background: "#32304a",
                    color: "#fff"
                }
            },
            {
                id: 'admin', // Required because our accessor is not a string
                Header: 'Admin',
                accessor: d => d.admin_json.first_name,// Custom value accessors!
                Cell: props => <span className='cell_des'>{props.value}</span>, // Custom cell components!
                headerStyle: {
                    background: "#32304a",
                    color: "#fff"
                }
            },
            {
                id: 'members', // Required because our accessor is not a string
                Header: 'Total Members',
                accessor: d => d.member_ids.length,// Custom value accessors!
                Cell: props => <span className='cell_des'>{props.value}</span>, // Custom cell components!
                headerStyle: {
                    background: "#32304a",
                    color: "#fff"
                }
            },
            {
                id: 'created_at', // Required because our accessor is not a string
                Header: 'Created At',
                accessor: d => d.created_at,// Custom value accessors!
                Cell: props => <span className='cell_des'>{props.value}</span>, // Custom cell components!
                headerStyle: {
                    background: "#32304a",
                    color: "#fff"
                }
            },
            {
                id: 'updated_at', // Required because our accessor is not a string
                Header: 'Updated At',
                accessor: d => d.updated_at,// Custom value accessors!
                Cell: props => <span className='cell_des'>{props.value}</span>, // Custom cell components!
                headerStyle: {
                    background: "#32304a",
                    color: "#fff"
                }
            },
            {
                id: 'status', // Required because our accessor is not a string
                Header: 'Status',
                accessor: d => d.status,// Custom value accessors!
                Cell: props => <span className='cell_des'>{props.value}</span>, // Custom cell components!
                headerStyle: {
                    background: "#32304a",
                    color: "#fff"
                }
            }
        ]

        return (
            <div>
                <div className="pd">
                    <div className="content-inner">
                        <div className="row">
                            <div className="col">
                                <h1 className="subheader semibold grey fs-28">Organization List</h1>

                                <hr />
                                <div className="table-responsive">
                                    <ReactTable
                                        data={data}
                                        columns={columns}
                                        defaultPageSize={10}
                                        getTrProps={(state, rowInfo, column) => {
                                            return {
                                                onClick : (e) =>{
                                                    this.getDetailOrg(rowInfo.row._original)
                                                }
                                            }
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return state;
};
const mapDispatchToProps = (dispatch) => {
    return {
        memberToStore(member) {
            const action = { type: "member", member: member }
            dispatch(action);
        }
    }
}


const MappedComponent = connect(mapStateToProps, mapDispatchToProps)(listOrganization);
export default MappedComponent;