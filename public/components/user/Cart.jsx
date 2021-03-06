/* eslint-disable import/extensions */
/* eslint-disable react/prop-types */
/* eslint-disable arrow-body-style */
/* eslint-disable react/jsx-no-bind */
/* eslint-disable no-underscore-dangle */

import React, { Component } from 'react';
import { connect } from 'react-redux';

import { Checkbox, FloatingActionButton, FontIcon, Snackbar } from 'material-ui';
import { yellow600, amber600 } from 'material-ui/styles/colors';

import { addFavorite, removeFromCart, receiveUser } from '../../actions/UserActions';
import Checkout from '../Checkout.jsx';


class Cart extends Component {
  constructor(props) {
    super(props);

    this.state = {
      open: false,
      purchasePrice: 0,
      numItems: 0,
      bookIds: [],
      checkoutStatus: true
    };

    this._addFavorite = this._addFavorite.bind(this);
    this.showMessage = this.showMessage.bind(this);
    this.hideMessage = this.hideMessage.bind(this);
    this._addPurchase = this._addPurchase.bind(this);
  }
  componentDidMount() {
    const user = JSON.parse(localStorage.user);
    this.props.receiveUser(user);
  }

  _addFavorite(bookId) {
    this.props.addFavorite(this.props.user._id, bookId);
    this.showMessage();
  }

  showMessage() {
    this.setState({
      open: true
    });
  }

  hideMessage() {
    this.setState({
      open: false
    });
  }

  _removeFromCart(bookId) {
    this.props.removeFromCart(this.props.user._id, bookId);
  }

  _addPurchase(e) {
    if (this.state.numItems) {
      this.setState({ checkoutStatus: true });
    } else {
      this.setState({ checkoutStatus: false });
    }

    const itemPrice = parseInt(e.target.dataset.bookprice);
    let finalPrice = parseInt(this.state.purchasePrice);

    let countItems = this.state.numItems;

    const itemId = e.target.dataset.bookid;
    const checkoutIds = this.state.bookIds;

    if (e.target.checked) {
      if (itemPrice) {
        finalPrice += itemPrice;
        countItems += 1;
      }
      if (!checkoutIds.includes(itemId)) {
        checkoutIds.push(itemId);
        this.setState({ bookIds: checkoutIds });
      }
    } else {
      if (itemPrice) {
        finalPrice -= itemPrice;
        countItems -= 1;
      }
      if (checkoutIds.includes(itemId)) {
        const index = checkoutIds.indexOf(itemId);
        checkoutIds.splice(index, 1);
        this.setState({ bookIds: checkoutIds });
      }
    }

    this.setState({
      purchasePrice: finalPrice,
      numItems: countItems
    });
  }

  render() {
    const { cart } = this.props.user;
    let CartItems;
    if (cart.length > 0) {
      CartItems = cart.map((item, index) => {
        let price;
        let url;
        if (item.price) {
          price = <h3>${parseFloat(item.price).toFixed(2)}</h3>;
        } else {
          price = <h3>$0.00</h3>;
        }

        if (item.picture) {
          url = item.picture;
        } else {
          url = item.cover;
        }

        return (
          <tr key={index}>
            <td>
              <div className="row">
                <div className="col-xs-4">
                  <img src={url} className="img-responsive" role="presentation" />
                </div>
                <div className="col-xs-8">
                  <h2>Title: {item.title}</h2>
                  <h3>Author(s): {item.author}</h3>
                  <h3>ISBN: {item.isbn}</h3>
                  <div className="row">
                    <div className="col-xs-1">
                      <FontIcon style={{ color: amber600 }} className="material-icons">shopping_cart</FontIcon>
                    </div>
                    <div className="col-xs-1">
                      <Checkbox
                        data-bookPrice={item.price}
                        data-bookId={item._id}
                        onCheck={this._addPurchase}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </td>
            <td>
              {price}
            </td>
            <td>
              <FloatingActionButton onTouchTap={this._addFavorite.bind(this, item._id)} style={{ marginTop: '65px' }}iconStyle={{ color: yellow600 }}>
                <FontIcon className="material-icons">favorite</FontIcon>
              </FloatingActionButton>
            </td>
            <td>
              <FloatingActionButton onTouchTap={this._removeFromCart.bind(this, item._id)} style={{ marginTop: '65px' }} iconStyle={{ color: yellow600 }}>
                <FontIcon className="material-icons">delete</FontIcon>
              </FloatingActionButton>
            </td>
          </tr>
        );
      });
    } else {
      CartItems = <tr />;
    }

    return (
      <div>
        <table className="table table-striped">
          <thead>
            <tr>
              <th><h3>Shopping Cart</h3></th>
              <th>Price</th>
              <th />
              <th />
            </tr>
          </thead>
          <tbody>
            {CartItems}
          </tbody>
        </table>
        <Checkout
          checkoutStatus={this.state.checkoutStatus}
          amount={this.state.purchasePrice * 100}
          email={this.props.user.email}
          userId={this.props.user._id}
          bookIds={this.state.bookIds}
        />
        <h4 style={{ float: 'right', marginRight: '15px' }} ><b>Subtotal {this.state.numItems} item(s): ${parseFloat(this.state.purchasePrice).toFixed(2)} </b></h4>

        <Snackbar
          open={this.state.open}
          message="Book added to favorite."
          autoHideDuration={3000}
          onRequestClose={this.hideMessage}
        />
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    receiveUser: (state) => { dispatch(receiveUser(state)); },
    addFavorite: (userId, bookId) => { dispatch(addFavorite(userId, bookId)); },
    removeFromCart: (userId, bookId) => { dispatch(removeFromCart(userId, bookId)); }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Cart);
