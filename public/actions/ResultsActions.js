import axios from 'axios';
import {browserHistory} from 'react-router';
//GOOGLE_BOOK url
const GOOGLE_BOOKS = 'https://www.googleapis.com/books/v1/volumes?q=';
//API_KEY for Google Book API
const API_KEY = '&key=AIzaSyAL7QIn3DNBGLz8NjPQVkTNnU7Fp_CtsGo&country=DK';


export function getResults(query) { 
	let url = GOOGLE_BOOKS + query;
	//get the results from google books
	return dispatch => 
		axios.get(url)
	      .then(res => res.data)
	      .then(data => {
	        if (data.items) {
	        	let {items} = data;
	        	let books = []
	        	items.forEach(val => {
	        		let title = val.volumeInfo.title;
	        		let authors = val.volumeInfo.authors.reduce((prev, curr) => prev + ' ' + curr)
	        		let isbn = val.volumeInfo.industryIdentifiers[0].identifier

	        		let picture = val.volumeInfo.imageLinks.smallThumbnail

	        		let book = {title, authors, isbn, picture}
	        		books.push(book);
	        	});

	        	dispatch(showResults(books))
	        }
	        else {
	        	dispatch(showResults([]))
	        }
	       
	      })
	      .catch(error => console.error);
}

export function showResults(results) {
	browserHistory.push(`/results`)
	return {
		type:'GET_RESULTS',
    payload: {
      results
    }
	}
}