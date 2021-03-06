import React, { Component } from 'react'
import { NewBuddy } from './index';
import { connect } from 'react-redux'
import { db, auth } from '../app'
import store, { setLoggedIn, fetchUser, setAvatar, deleteAvatarFirebase } from '../store'
import { blop } from '../library/audio'

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
    this.checkForAvatar = this.checkForAvatar.bind(this)
  }

  handleChange(event) {
    if(event.target.name === 'displayName') {
      this.setState({ [event.target.name]: (event.target.value).toLowerCase() })
    } else {
      this.setState({ [event.target.name]: event.target.value })
    }
  }


  handleSignIn(event) {
    blop()
    event.preventDefault()
    auth
      .signInWithEmailAndPassword(this.state.email, this.state.password)
      .then(user => {
        if (user.uid.length) {
          this.props.setStoreLoggedIn(false, user.uid)
        }
      })
      .then((res) => {
        this.checkForAvatar()
      })
      .catch(function (error) {
        var errorCode = error.code;
        var errorMessage = error.message;
        console.error(`Unable to log in, ${errorCode} : ${errorMessage}`)
        if (error) {
          alert(`Uh oh! ${errorMessage} Please try again`)
        }
      });
    this.setState({password: ''})
  }

  handleCreateUser(event) {
    blop()
    auth
      .createUserWithEmailAndPassword(this.state.email, this.state.password)
      .then(user => {
        db.collection('users').doc(user.uid).set({ handle: this.state.displayName, email: this.state.email })
        if (user.uid.length) {
          this.props.setStoreLoggedIn(true, user.uid)
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
    this.setState({password: ''})
  }

  checkForAvatar() {
    event.preventDefault
    db.collection('avatars').where('userId', '==', this.props.user).get()
      .then(function (querySnapshot) {
        let foundAvatar;
        querySnapshot.forEach(function (doc) {
          if (doc) {
            foundAvatar = doc.data()
            foundAvatar.id = doc.id
          } else {
            return false
          }
        })
        return foundAvatar
      })
      .then(res => {
        if (res && res.health > 0) {
          this.props.setAvatarInReduxStore(res)
        } else if (res && res.health === 0) {
          deleteAvatarFirebase(res.id)
        } else {
          console.log('NO ASSOCIATED AVATAR')
        }
        this.props.setStoreLoggedIn(true, this.props.user)
      })
      .catch(error => console.log("ERROR: ", error))
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
                <input type="password" name="password" onChange={this.handleChange} value={this.state.password} />
              </div>
            </div>
            <div className="login-button">
              <div className="signIn">
                <button onClick={this.handleSignIn}>Sign In</button>
              </div>
              <div>
                <div ><label id="newDonkeUser">New to Donke?</label></div>
                <button id="nav1" onClick={() => this.setState({ signUp: true, password: '' })}>Create Account</button>
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
                <input name="displayName" type="string" onChange={this.handleChange} value={this.state.displayName} />
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
                <input name="password" type="password" onChange={this.handleChange} value={this.state.password} />
              </div>
            </div>
            <div className="login-button">
              <div className="signUp">
                <button onClick={this.handleCreateUser}>Sign Up</button>
              </div>
            </div>
            <div>
              <button id="nav2" onClick={() => this.setState({ signUp: false, password: '' })}>I have an account</button>
            </div>
          </div>
        </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    loggedIn: state.loggedIn,
    user: state.user
  }
}

const mapDispatchToProps = dispatch => {
  return {
    setStoreLoggedIn(loggedInBool, uid) {
      dispatch(setLoggedIn(loggedInBool))
      dispatch(fetchUser(uid))
    },
    setAvatarInReduxStore(avatar) {
      dispatch(setAvatar(avatar))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Login)



