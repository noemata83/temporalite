import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import classes from './Dashboard.css';
import { loadWorkspace, loadUser } from '../store/actions/';

import MODES from './displayModes';
import Header from './UI/Header/Header';
import SprintWorkspace from './SprintWorkspace/SprintWorkspace';
import ProjectManager from './ProjectManager/ProjectManager';
import Reports from './Reports/Reports';
import SideBar from './Sidebar/SideBar';
import SwitchWorkspaceDialog from './UI/Dialogs/switchWorkspace';
import CategoryManagerDialog from './UI/Dialogs/CategoryManagerDialog';
import JoinWorkSpaceDialog from './UI/Dialogs/joinWorkspace';
// import GettingStartedDialog from './UI/Dialogs/GettingStartedDialog';

class Dashboard extends Component {
  state = {
    loading: true,
    workspace_loaded: false,
    user: null,
    mode: MODES.SPRINT,
    mobileOpen: false,
    anchorEl: null,
    inviteCode: '',
    swDialogOpen: false,
    jwDialogOpen: false,
    catDialogOpen: false,
    gsDialogOpen: false,
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.user && prevState.loading && !prevState.user) {
      const workspace = nextProps.user.account.default_workspace.id;
      nextProps.loadWorkspace(workspace);
    }
    if (prevState.workspace_loaded && nextProps.projects.length === 0) {
      return { ...prevState, user: nextProps.user, gsDialogOpen: true };
    }
    if (!nextProps.loading) {
      return { ...prevState, user: nextProps.user, workspace_loaded: true };
    }
    return { ...prevState, user: nextProps.user };
  }
  componentDidMount() {
    if (this.state.loading) {
      this.props.loadUser();
      // TODO: This is probably an anti-pattern. Refactor.
      // eslint-disable-next-line
      this.setState({
        loading: false,
      });
    }
  }

  setMode = (mode) => {
    this.setState({
      mode,
      mobileOpen: false,
    });
  };

  handleDrawerToggle = () => {
    this.setState({ mobileOpen: !this.state.mobileOpen });
  };

  handleMenu = (event) => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleMenuClose = () => {
    this.setState({ anchorEl: null });
  };

  handleSWDialogOpen = () => {
    this.setState({
      anchorEl: null,
      swDialogOpen: true,
    });
  };

  handleSWDialogClose = () => {
    this.setState({ swDialogOpen: false });
  };

  handleJWDialogOpen = () => this.setState({ jwDialogOpen: true, anchorEl: null });
  handleJWDialogClose = () => this.setState({ jwDialogOpen: false });

  handleInviteCodeInput = event => this.setState({ inviteCode: event.target.value });

  handleGSDialogClose = () => {
    this.setState({ gsDialogOpen: false });
  }

  handleSwitchWorkspace = (id) => {
    this.setState({ swDialogOpen: false });
    this.props.loadWorkspace(id);
  };

  handleJoinWorkspace = () => {
    console.log(`Here is where we would send code: ${this.state.inviteCode} to the server.`);
    this.setState({ jwDialogOpen: false });
  }

  handleCatDialogOpen = () => this.setState({ catDialogOpen: true });

  handleCatDialogClose = () => this.setState({ catDialogOpen: false });

  renderWorkspace = (mode) => {
    switch (mode) {
      case MODES.SPRINT:
        return <SprintWorkspace />;
      case MODES.PROJECT:
        return <ProjectManager />;
      case MODES.REPORT:
        return <Reports />;
      case MODES.TEAM:
        return (
          <div style={{ fontSize: '3rem', padding: '2rem' }}>
            Meet Your Team... Later!
          </div>
        );
      // case MODES.CATEGORIES:
        // return <CategoryManager />;
      default:
        return <SprintWorkspace />;
    }
  };

  render() {
    const { user, loading, mode } = this.state;
    return !user && !loading ? (
      <Redirect to="/" />
    ) : (
      <div className={classes.Dashboard}>
        <Header
          handleDrawerToggle={this.handleDrawerToggle}
          handleMenu={this.handleMenu}
          handleClose={this.handleMenuClose}
          anchorEl={this.state.anchorEl}
          handleSWDialogOpen={this.handleSWDialogOpen}
          handleJWDialogOpen={this.handleJWDialogOpen}
        />
        <main className={classes.Main}>
          <SideBar
            setMode={this.setMode}
            mobileOpen={this.state.mobileOpen}
            handleDrawerToggle={this.handleDrawerToggle}
            handleCatDialogOpen={this.handleCatDialogOpen}
          />
          <div className={classes.Workspace}>{this.renderWorkspace(mode)}</div>
        </main>
        {/* <GettingStartedDialog
          open={this.state.gsDialogOpen}
          handleClose={this.handleGSDialogClose}
        /> */}
        <SwitchWorkspaceDialog
          open={this.state.swDialogOpen}
          handleClose={this.handleSWDialogClose}
          handleSwitchWorkspace={this.handleSwitchWorkspace}
        />
        <JoinWorkSpaceDialog
          open={this.state.jwDialogOpen}
          handleClose={this.handleJWDialogClose}
          handleInviteCodeInput={this.handleInviteCodeInput}
          handleJoinWorkspace={this.handleJoinWorkspace}
          inviteCode={this.state.inviteCode}
        />
        <CategoryManagerDialog
          open={this.state.catDialogOpen}
          handleClose={this.handleCatDialogClose}
        />
      </div>
    );
  }
}

Dashboard.propTypes = {
  loadUser: PropTypes.func.isRequired,
  loadWorkspace: PropTypes.func.isRequired,
};

const mapStateToProps = state =>
  ({
    user: state.auth.user,
    projects: state.workspace.project_set,
    loading: state.workspace.loading,
  });

const mapDispatchToProps = dispatch =>
  ({
    loadWorkspace: workspace => dispatch(loadWorkspace(workspace)),
    loadUser: () => dispatch(loadUser()),
  });

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
