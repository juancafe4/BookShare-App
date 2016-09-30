import React , { Component} from 'react'
import { Link } from 'react-router'
import { connect } from 'react-redux'

import { TextField, RaisedButton } from 'material-ui'
import {yellow600, amber600, lightBlue900} from 'material-ui/styles/colors';

import { updateUser } from '../../actions/UserActions'

import ProfilePicUploader from './ProfilePicUploader.jsx'

class ProfileForm extends Component {
  constructor(props){
    super(props);

    let { username , firstName , lastName , email , phone , picture } = this.props.user;
    this.state = {
      username,
      firstName,
      lastName,
      email,
      phone,
      picture
    }
    this._onInputChange = this._onInputChange.bind(this);
    this._updateProfile = this._updateProfile.bind(this);
  }
  _onInputChange(e){
   let key = e.target.dataset.statekey;
   let value = e.target.value;

   this.setState({
       [key]: value
   });
 }
  _updateProfile(){
    let { _id } = this.props.user;
    this.props.updateUser(_id,this.state);
  }
  render(){
    let { username , firstName , lastName , email , phone , picture } = this.state;

    return (
      <div className="container text-center">
        <div className="col-md-6">
          <ProfilePicUploader />
        </div>
        <div className="col-md-6">
          <form style={editform}>
            <div>
              {/* <TextField
                id="text-field-default"
                onChange={this._onInputChange}
                data-statekey="picture"
                defaultValue={picture}
                floatingLabelText="Image URL"
              /><br /> */}
              <TextField
                id="text-field-default"
                onChange={this._onInputChange}
                data-statekey="username"
                defaultValue={username}
                floatingLabelText="User Name"
              /><br />
              <TextField
                id="text-field-default"
                onChange={this._onInputChange}
                data-statekey="firstName"
                defaultValue={firstName}
                floatingLabelText="First Name"
              /><br />
              <TextField
                id="text-field-default"
                onChange={this._onInputChange}
                data-statekey="lastName"
                defaultValue={lastName}
                floatingLabelText="Last Name"
              /><br />
              <TextField
                id="text-field-default"
                onChange={this._onInputChange}
                data-statekey="email"
                defaultValue={email}
                floatingLabelText="Email"
              /><br />
              <TextField
                id="text-field-default"
                onChange={this._onInputChange}
                data-statekey="phone"
                defaultValue={phone}
                floatingLabelText="Phone"
              />
            </div>
            <RaisedButton backgroundColor={amber600} label="Update" style={style} onClick={this._updateProfile}/>
            <Link to="/"><RaisedButton backgroundColor={yellow600} label="cancel" style={style}/></Link>
          </form>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    state
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    updateUser: (id,state) => {dispatch(updateUser(id,state))}
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProfileForm);

const editform = {
  margin : 'auto'
};

const style = {
  margin: 12,
};
