import React , { Component } from 'react';
import { connect } from 'react-redux';
import { RaisedButton } from 'material-ui';

import RouteActions from '../../actions/RouteActions'

import { deleteBook } from '../../actions/BookActions';

class Book extends Component{
  constructor(props) {
    super(props);

    this._delete = this._delete.bind(this);
  }

  _delete(bookId, userId) {
    this.props.deleteBook(bookId, userId);
  }

  _editBook(id){
    RouteActions.route(`/edit/${id}`);
  }

  render(){

    let { title, cover, author, forSale, _id } = this.props.book
    let picUrl = (cover === undefined) ? 'http://1615.info/images/red-book.jpg' : cover;
    let status = forSale ? "sellBook" : ""

    return(
    <div className="col-sm-4 col-md-4 col-lg-4 bookbox">
      <div className={status}>
        <img width="150px" className="img-rounded fixedBookHeight center-block" src={picUrl} alt="NO_IMG"/>
        <RaisedButton onClick={this._editBook.bind(null, _id)}>Edit</RaisedButton>
        <RaisedButton onClick={this._delete.bind(null, _id, this.props.userId)}>Delete</RaisedButton>
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
    deleteBook: (bookId, userId) => {dispatch(deleteBook(bookId, userId))}
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Book);
