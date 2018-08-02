import React from "react";
import { connect } from "react-redux";
import { Route, withRouter } from "react-router-dom";

import HeaderBar from "./header-bar";
import LandingPage from "./landing-page";
import Dashboard from "./dashboard";
import RegistrationPage from "./registration-page";
import { refreshAuthToken, clearAuth } from "../actions/auth";

export class App extends React.Component {
  timeoutHandle = null;

  componentDidUpdate(prevProps) {
    if (!prevProps.loggedIn && this.props.loggedIn) {
      // When we are logged in, refresh the auth token periodically
      this.startPeriodicRefresh();
    } else if (prevProps.loggedIn && !this.props.loggedIn) {
      // Stop refreshing when we log out
      this.stopPeriodicRefresh();
    }
  }

  componentWillUnmount() {
    this.stopPeriodicRefresh();
  }

  startPeriodicRefresh() {
    this.refreshInterval = setInterval(
      () => this.props.dispatch(refreshAuthToken()),
      10 * 60 * 1000 // Ten Minutes
    );
  }

  stopPeriodicRefresh() {
    if (!this.refreshInterval) {
      return;
    }

    clearInterval(this.refreshInterval);
  }

  setActive() {
    if (this.props.loggedIn) {
      clearTimeout(this.timeoutHandle);
      this.timeoutHandle = setTimeout(() => {
        this.props.dispatch(clearAuth());
      }, 60 * 5 * 1000);
      this.timeoutHandle = setTimeout(() => {
        alert("You will be logged out in 1 minute...");
      }, 60 * 4 * 1000);
    }
  }

  render() {
    return (
      <div
        className="app"
        onClick={() => {
          this.setActive();
        }}
      >
        <HeaderBar />
        <Route exact path="/" component={LandingPage} />
        <Route exact path="/dashboard" component={Dashboard} />
        <Route exact path="/register" component={RegistrationPage} />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  hasAuthToken: state.auth.authToken !== null,
  loggedIn: state.auth.currentUser !== null
});

// Deal with update blocking - https://reacttraining.com/react-router/web/guides/dealing-with-update-blocking
export default withRouter(connect(mapStateToProps)(App));
