import React, { Component } from 'react'
import { NewBuddy } from './index';
import { connect } from 'react-redux'
import {db, auth} from '../app'
import store, { setLoggedIn, fetchUser } from '../store'

export class Login extends Component {
  constructor(props) {
    super(props)
    this.state = {
      loggedInLocal: false,
      email: '',
      password: '',
      displayName: '',
      signUp: false
    }
    this.handleChange = this.handleChange.bind(this)
    this.handleSignIn = this.handleSignIn.bind(this)
    this.handleCreateUser = this.handleCreateUser.bind(this)
  }

  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value })
  }


  handleSignIn(event) {
    event.preventDefault()
    auth
      .signInWithEmailAndPassword(this.state.email, this.state.password)
      .then(res => {
        res.uid.length ? this.props.setStoreLoggedIn(true, res.uid) : null
      })
      .catch(function (error) {
        var errorCode = error.code;
        var errorMessage = error.message;
        console.error(`Unable to log in, ${errorCode} : ${errorMessage}`)
        if (error) {
          alert(`Uh oh! ${errorMessage} Please try again`)
        }
      });
  }

handleCreateUser(event) {
    auth
      .createUserWithEmailAndPassword(this.state.email, this.state.password)
      .then(user => {
        db.collection('users').doc(user.uid).set({ handle: this.state.displayName, email: this.state.email })
        if(user.uid.length) {
          this.setState({ loggedInLocal: true })
          this.props.setUserId(user.uid)
        } 
      })    
      .catch(function (error) {
        var errorCode = error.code;
        var errorMessage = error.message;
        console.error(`Unable to create Email, ${errorCode} : ${errorMessage}`)
        if (error) {
          alert(`Uh oh! ${errorMessage} Please try again`)
        }
      });
  }


  render() {
    return (
       !this.state.signUp ?
          <div className="login">
            <div className="login-container">
              <div>
                {!this.state.signUp ? <label>Login</label> : <label>Sign Up</label>}
              </div>
              <div className="email-password">
                <div className="email">
                  <div className="email-label">
                    <label>Email</label>
                  </div>
                  <input name="email" type="string" onChange={this.handleChange} value={this.state.email} />
                </div>
                <div className="password">
                  <div className="password-label">
                    <label>Password</label>
                  </div>
                  <input name="password" type="string" onChange={this.handleChange} value={this.state.password} />
                </div>
              </div>
              <div className="login-button">
                <div className="signIn">
                  <button onClick={this.handleSignIn}>Sign In</button>
                </div>
                <div>
                  <button id="nav1" onClick={() => this.setState({signUp: true})}>Sign Up</button>
                </div>
              </div>
            </div>
          </div> 
          : 
          <div className="login">
            <div className="login-container">
              <div>
                <label>Signup</label>
              </div>
              <div className="email-password">
                <div className="displayName">
                  <div className="displayName-label">
                    <label>Display Name</label>
                  </div>
                  <input name="displayName" type="string" onChange={this.handleChange} value={this.state.displayName}/>
                </div> 
                <div className="email">
                  <div className="email-label">
                    <label>Email</label>
                  </div>
                  <input name="email" type="string" onChange={this.handleChange} value={this.state.email} />
                </div>
                <div className="password">
                  <div className="password-label">
                    <label>Password</label>
                  </div>
                  <input name="password" type="string" onChange={this.handleChange} value={this.state.password} />
                </div>
              </div>
              <div className="login-button">
                <div className="signUp">
                  <button onClick={this.handleCreateUser}>Sign Up</button>
                </div>
              </div>
              <div>
                <button id="nav2" onClick={() => this.setState({signUp: false})}>Log In</button>
              </div>
            </div>
          </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    loggedIn: state.loggedIn
  }
}

const mapDispatchToProps = dispatch => {
  return {
    setStoreLoggedIn(loggedInBool, uid) {
      dispatch(setLoggedIn(loggedInBool))
      dispatch(fetchUser(uid))
    },
    setUserID(id){
      dispatch(fetchUser(uid))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Login)





