import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom'
import Project from './project/project';
import Task from './task/task';
import DashboardHome from './dashboard-home/dashboard-home';
import CreateOrganization from './organization/create-organization';
import OrganizationDetails from './organization/organization-details';
import EditOrganization from './organization/edit-organization';
import listOrganization from './organization/list-organization';
import memberList from './member/member';
import EditProejct from './project/edit-project';
import CreatProject from './project/create-project';
import stmConfig from "../../stmConfiguration";
import ProjectTasks from "./project/project-tasks";
import TaskCreate from "./task/create-task";
import TaskDetails from "./task/task-details";
import TasksAll from "../dashboard/task/task-all";


class Main extends Component {
  render() {
      return <React.Fragment>
        <Switch>
          <Route exact path="/dashboard" component={DashboardHome} />
          <Route exact path="/dashboard/projects" component={Project} />
          <Route path="/dashboard/tasks" component={Task} />
          <Route path="/dashboard/create-organizations" component={CreateOrganization} />
          <Route path={stmConfig.route.listOrganization} component={listOrganization} />
          <Route path={stmConfig.route.detailsOrganization + "/:id"} component={OrganizationDetails} />
          <Route path={stmConfig.route.editOrganization + "/:id"} component={EditOrganization} />
          <Route path={stmConfig.route.members} component={memberList} />
          <Route path={stmConfig.route.createProject} component={CreatProject} />
          <Route path={stmConfig.route.editProject + "/:slug" + "/:id"} component={EditProejct} />
          <Route exact path={stmConfig.route.projectTasks + "/:slug" + "/:id"} component={ProjectTasks} />


          <Route path={stmConfig.route.createTask} component={TaskCreate} />
          <Route path={stmConfig.route.tasklist} component={TasksAll} />
          <Route exact path={stmConfig.route.taskDetails + "/:slug" + "/:projectid" + "/:id"} component={TaskDetails} />
        </Switch>
    </React.Fragment>;
  }
}
export default Main;