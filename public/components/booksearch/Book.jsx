/* eslint-disable import/extensions */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react/no-children-prop */
/* eslint-disable react/prop-types */
/* eslint-disable arrow-body-style */
/* eslint-disable no-underscore-dangle */
/* eslint-disable react/jsx-no-bind */
/* eslint-disable class-methods-use-this */
/* eslint-disable react/jsx-boolean-value */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Snackbar, FloatingActionButton, AppBar, FontIcon, RaisedButton, List, ListItem } from 'material-ui';
import { yellow600, amber600, lightBlue900 } from 'material-ui/styles/colors';

import { addToCart, removeFromCart, addFavorite, getUser, receiveUser } from '../../actions/UserActions';
import { addBook, searchBooks, getBook } from '../../actions/BookActions';

const styles = {
  bookCover: {
    width: '100%'
  },
  userBook: {
    backgroundColor: 'lightgray',
    margin: '10px 10px 10px 10px',
    width: '100%'
  },
  userBookText: {
    paddingTop: '20px'
  },
  gridTile: {
    maxWidth: '50%',
    borderRadius: '20px',
    padding: '10px'
  }
};

class Book extends Component {
  constructor(props) {
    super(props);

    this.state = {
      searchedBooks: null,
      openAddCart: false,
      openRemoveCart: false
    };

    this.addBook = this.addBook.bind(this);
    this.addToCart = this.addToCart.bind(this);
    this.addFavorite = this.addFavorite.bind(this);
    this.updateCart = this.updateCart.bind(this);
    this.removeFromCart = this.removeFromCart.bind(this);
    this.showAddMessage = this.showAddMessage.bind(this);
    this.showRemoveMessage = this.showRemoveMessage.bind(this);
    this.hideAddMessage = this.hideAddMessage.bind(this);
    this.hideRemoveMessage = this.hideRemoveMessage.bind(this);
  }

  componentDidMount() {
    const user = JSON.parse(localStorage.user);
    const book = JSON.parse(localStorage.book);
    this.props.receiveUser(user);
    this.props.searchBooks(this.props.params.isbn);
    this.props.getBook(book);
  }

  componentWillReceiveProps(props) {
    const cartIds = props.user.cart.map((cartItem) => {
      return cartItem._id;
    });

    if (props.search) {
      const searchBooks = props.search.map((book) => {
        if (cartIds.includes(book._id)) {
          book.addToCart = true;
        } else {
          book.addToCart = false;
        }
        return book;
      });
      this.setState({
        searchedBooks: searchBooks
      });
    }
  }

  showAddMessage() {
    this.setState({ openAddCart: true });
  }

  showRemoveMessage() {
    this.setState({ openRemoveCart: true });
  }

  hideAddMessage() {
    this.setState({ openAddCart: false });
  }

  hideRemoveMessage() {
    this.setState({ openRemoveCart: false });
  }

  addBook() {
    this.props.addBook(this.props.book, this.props.user._id);
  }

  updateCart(book) {
    const id = this.props.user._id;
    if (!book.addToCart) {
      this.addToCart(id, book._id);
      this.showAddMessage();
    } else {
      this.removeFromCart(id, book._id);
      this.showRemoveMessage();
    }

    book.addToCart = !book.addToCart;

    const books = this.state.searchedBooks.map((bk) => {
      if (bk._id === book._id) {
        return book;
      }
      return bk;
    });

    this.setState({
      searchedBooks: books
    });
  }
  addToCart(id, bookId) {
    this.props.addToCart(id, bookId);
  }

  removeFromCart(id, bookId) {
    this.props.removeFromCart(id, bookId);
  }

  addFavorite(e) {
    this.props.addFavorite(this.props.user._id, e.target.dataset.bookid);
  }

  render() {
    if (this.state.searchedBooks) {
      const { book } = this.props;

      const userBooks = this.state.searchedBooks.map((existingBook, index) => {
        if (!existingBook.forSale || existingBook.owner._id === this.props.user._id) {
          return (
            <div key={index}></div>
          );
        }

        let bookPicture;
        if (existingBook.picture) {
          bookPicture = (
            <img
              src={existingBook.picture}
              className="img-responsive"
              style={styles.gridTile}
              role="presentation"
            />
          );
        } else {
          bookPicture = (
            <img
              src={book.pictureNormal}
              className="img-responsive"
              style={styles.gridTile}
              role="presentation"
            />
          );
        }


        // addToCart -> false call add cart
        // addToCart -> true call remove cart
        let btnAction = 'remove_shopping_cart';
        if (!existingBook.addToCart) {
          btnAction = 'add_shopping_cart';
        }

        return (
          <ListItem key={index}>
            <div className="row">
              <div className="col-xs-4 col-sm-4 col-md-4 col-lg-4">
                {bookPicture}
              </div>
              <div className="col-xs-4 col-sm-4 col-md-4 col-lg-4">
                <h3>Owned by: {existingBook.owner.username}</h3>
                <h3>Email: {existingBook.owner.email}</h3>
              </div>
              <div className="col-xs-4 col-sm-4 col-md-4 col-lg-4 text-right">
                <FloatingActionButton iconStyle={{ color: '#FBC02D' }}>
                  <FontIcon className="material-icons" onClick={this.updateCart.bind(null, existingBook)} data-bookid={existingBook._id}>{btnAction}</FontIcon>
                </FloatingActionButton>
                <FloatingActionButton iconStyle={{ color: '#FBC02D' }}>
                  <FontIcon className="material-icons" onClick={this.addFavorite} data-bookid={existingBook._id}>favorite</FontIcon>
                </FloatingActionButton>
              </div>
            </div>
          </ListItem>
        );
      });

      return (
        <div>
          <div className="container">
            <div className="row" style={{ borderStyle: 'solid', borderColor: amber600 }}>
              <div style={{ paddingTop: '20px' }} className="col-sm-2 col-md-2 col-md-offset-1 col-xs-offset-4">
                <img src={book.pictureNormal} className="img-responsive" role="presentation" />
                <br />
                <br />
                <RaisedButton
                  onClick={this.addBook}
                  label="Add Book"
                  primary={false}
                  style={{ float: 'right' }}
                  labelColor={yellow600}
                  backgroundColor={lightBlue900}
                  icon={<FontIcon className="material-icons">add</FontIcon>}
                />
              </div>
              <div className="col-md-9 col-sm-6">
                <div>
                  <h1 className="text-center"><b>{book.title}</b></h1>
                  <br />
                  <h4> <i>{book.description}</i></h4>
                  <br />
                  <h4>Author(s): {book.authors}</h4>
                  <h4>ISBN: {book.isbn}</h4>
                </div>
              </div>
            </div>
          </div>
          <div>
            <br />
            <AppBar showMenuIconButton={false} title="Sale by Other Students" />
            <List>
              {userBooks}
            </List>
          </div>
          <Snackbar
            open={this.state.openAddCart}
            message={'Item has been added from your cart.'}
            autoHideDuration={1500}
            onRequestClose={this.hideAddMessage}
          />
          <Snackbar
            open={this.state.openRemoveCart}
            message={'Item has been removed to your cart.'}
            autoHideDuration={1500}
            onRequestClose={this.hideRemoveMessage}
          />
        </div>
      );
    }
    return <div />;
  }
}

export default connect(state => ({
  book: state.books.book,
  user: state.user,
  search: state.searchedBooks
}),
  (dispatch) => {
    return {
      addToCart: (userId, bookId) => { dispatch(addToCart(userId, bookId)); },
      removeFromCart: (userId, bookId) => { dispatch(removeFromCart(userId, bookId)); },
      addFavorite: (userId, bookId) => { dispatch(addFavorite(userId, bookId)); },
      addBook: (book, userId) => { dispatch(addBook(book, userId)); },
      getUser: (id) => { dispatch(getUser(id)); },
      receiveUser: (user) => { dispatch(receiveUser(user)); },
      searchBooks: (book) => { dispatch(searchBooks(book)); },
      getBook: (book) => { dispatch(getBook(book)); }
    };
  })(Book);
