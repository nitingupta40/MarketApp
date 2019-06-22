import React from "react";
import { Auth, Hub } from 'aws-amplify';
import { Authenticator, AmplifyTheme } from 'aws-amplify-react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import "./App.css";
import HomePage from './pages/HomePage.js';
import ProfilePage from './pages/ProfilePage';
import MarketPage from './pages/MarketPage';
import NavBar from './components/Navbar.js'
//import { NavBar } from "aws-amplify-react/dist/AmplifyTheme";
export const userContext = React.createContext();

class App extends React.Component {
  state = {
    user: null
  };

  componentDidMount(){
    this.getUserData();
    Hub.listen('auth', this, 'onHubCapsule');
  }

  getUserData = async () => {
    const user = await Auth.currentAuthenticatedUser();
    user ? this.setState({ user }): this.setState({ user: null});
  };

  handleSignout = async () => {
    try {
      await Auth.signOut();
    }
    catch(err){
        console.error('Error singing out user', err);
    }
  }

  onHubCapsule = capsule => {
    switch(capsule.payload.event){
      case "signIn":
        console.log("signed in");
        this.getUserData();
        break;
      case "signup":
        console.log("signed Up");
        break;
      case "signOut":
        console.log("signed out");
        this.setState({user: null});
        break;
      default:
        return;
        

    }
  }

  render() {
    const { user } = this.state;
    return !user ? 
      <Authenticator theme={theme}/> : (
        <userContext.Provider value={{user}}>
        <Router>
          <React.Fragment>
            {/* Navigation */}
            <NavBar user={user} handleSignout={this.handleSignout}> 

            </NavBar>
            {/* Routes */}
            <div className="app-container">
              <Route exact path="/" component={HomePage}></Route>
              <Route path="/profile" component={ProfilePage}></Route>
              <Route path="/markets/:marketId" component={
                ({ match }) => <MarketPage marketId={match.params.marketId}/>
              }></Route>
            </div>
          </React.Fragment>
        </Router>
        </userContext.Provider>
        );
  }
}

 const theme = {
  ...AmplifyTheme,
  navBar: {
    ...AmplifyTheme.navBar,
    backgroundColor: '#ffc0c'
  },
  button: {
    ...AmplifyTheme.button,
    backgroundColor: 'var(--amazonOrange)'
  },
  sectionBody: {
    ...AmplifyTheme.sectionBody,
    padding: "5px"
  },
  sectionHeader:{
      ...AmplifyTheme.sectionHeader,
      backgroundColor: 'var(--squidInk)'
  }
}; 

//export default withAuthenticator(App, true, [], null, theme);
export default App;
