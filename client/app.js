import React, { Component } from 'react';
import { Navbar, Heart, SpeechBubble, SelectDonke, PartyHat, HealthBar, Login, Playpen, Invitation, NewBuddy, Donke } from './components'
import * as firebase from 'firebase' 
import { connect } from 'react-redux'
const secrets = require('../secrets.js')
require("firebase/firestore")

firebase.initializeApp({
  apiKey: secrets.API_KEY,
  authDomain: secrets.AUTH_DOMAIN,
  databaseURL: secrets.DATABASE_URL,
  projectId: secrets.PROJECT_ID,
  storageBucket: secrets.STORAGE_BUCKET,
  messagingSenderId: secrets.MESSAGING_SENDER_ID
});

export const db = firebase.firestore();
export const auth = firebase.auth()
const settings = {/* your settings... */ timestampsInSnapshots: true };
db.settings(settings);

export class App extends Component {
  constructor(props) {
    super(props)
    this.avatar = db.collection('avatars').doc('RLAstb3EigfEWlhL1I4m')
    this.onUpdate = this.onUpdate.bind(this)
  }

  componentDidMount() {
    //this works (see console for printout). You can update the avatar and you will get 
    //a new snapshot. The doc id is just a sample from our database. 
    this.unsubscribe = this.avatar.onSnapshot(this.onUpdate);
  }
  componentWillUnmount() {
    this.unsubscribe();
  }
  onUpdate(snapshot) {
    console.log('SNAPSHOT', snapshot.data())
  };

  render() {
    return (
      <div>
        <div className="navbar">
          {!this.props.loggedIn 
            ? <div><Login /> <Donke /></div>
            : !this.props.avatar.name 
              ? <div> <NewBuddy /> <Donke /> </div>
              :  <div className="animal">
                <Navbar /> <SelectDonke />
              </div> }
        </div>
        {/*<Invitation/>*/}
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    loggedIn: state.loggedIn,
    avatar: state.avatar
  }
}

export default connect(mapStateToProps)(App)
