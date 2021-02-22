import React, { Component } from 'react';
import { BrowserRouter as Router, Switch } from 'react-router-dom';

import { Provider } from "react-redux";
import store from "../store.js";
import { connect } from "react-redux";

import { UsersList, UsersUpdate, AllotmentsList, AllotmentsInsert, AllotmentsUpdate, MessagesList, Management, Finanse } from '../pages';
import StatusUpdate from '../pages/admin/StatusUpdate';
import FinanceInsert from '../pages/admin/FinanceInsert';
import AnnouncementUpdate from '../pages/admin/AnnouncementUpdate';
import NoticeBoard from '../pages/admin/NoticeBoard';
import MessagesContent from '../pages/admin/MessagesContent';
import PrivateRoute from '../components/private-route/PrivateRoute';
import AllotmentSelection from '../pages/admin/AllotmentSelection';
import Admin from '../pages/admin/AdminDashboard';
import AdminNavBar from '../components/navigation/AdminNavBar';

import { Button } from 'react-bootstrap';
import styled from 'styled-components';
import 'bootstrap/dist/css/bootstrap.min.css';

const Container = styled.div`
    background-color: #f2f4f5;
    min-height: 100vh;
`;

const ErrContainer = styled.div`
    height: 100vh;
    background-color: #f2f4f5;
    text-align: center;
    padding: 50px;
    font-size: 26px;
`;

class AdminApp extends Component {

  render() {

    const { user } = this.props.auth;
    if (user.position !== "Działkowiec") {
      return (
        <Provider store={store}>
          <Container>
            <Router>
              <AdminNavBar />
              <Switch>
                <PrivateRoute path="/admin" exact component={Admin} />
                <PrivateRoute path="/admin/management" exact component={Management} />
                <PrivateRoute path="/admin/users/list" exact component={UsersList} />
                <PrivateRoute path="/admin/users/update/:id" exact component={UsersUpdate} />

                <PrivateRoute path="/admin/allotments/list" exact component={AllotmentsList} />
                <PrivateRoute path="/admin/allotments/create" exact component={AllotmentsInsert} />
                <PrivateRoute path="/admin/allotments/update/:id" exact component={AllotmentsUpdate} />

                <PrivateRoute path="/admin/messages/list" exact component={MessagesList} />
                <PrivateRoute path="/admin/messages/:id" exact component={MessagesContent}/>

                <PrivateRoute path="/admin/finances/list" exact component={Finanse} />
                <PrivateRoute path="/admin/finances/create" exact component={AllotmentSelection} />
                <PrivateRoute path="/admin/finances/create/:id" exact component={FinanceInsert} />
                <PrivateRoute path="/admin/finances/update/:id" exact component={StatusUpdate} />
                <PrivateRoute path="/admin/table/" exact component={NoticeBoard} />
               
                <PrivateRoute path="/admin/ads/update/:id" exact component={AnnouncementUpdate} />
             
              </Switch>
            </Router>
          </ Container >
        </Provider >
      );
    } else return (
      <ErrContainer >
        <h3>Page not found</h3>
        <Button size="sm"href={'/dashboard'}>Powrót</Button>
      </ErrContainer>
    );
  }
}

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(
  mapStateToProps
)(AdminApp);