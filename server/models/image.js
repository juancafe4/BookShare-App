const BUCKET_NAME = 'bookshare456'
const AWS_URL_BASE = 'https://s3-us-west-2.amazonaws.com/'
const mongoose = require('mongoose');
const AWS = require('aws-sdk');
const s3 = new AWS.S3();
const uuid = require('uuid');
const ImageSchema = new mongoose.Schema({
  url: {type: String, required: true},
  date: {type: Date, default: Date.now}
});
const path = require('path');


AWS.config.loadFromPath('./credential.json');
ImageSchema.statics.upload = function(fileObj, name, cb) {
  //1.Upload the data to s3
  //2. To determine the url of the image on S3
  //3. We can save an image document, with the url (and fileName)
  //4 Callback with saved image doc.
  let {originalname, buffer} = fileObj;


  let Key = uuid() + path.extname(originalname)
  
  let params = {
    Bucket: BUCKET_NAME,
    Key,
    Body: buffer,
    ACL: 'public-read'
  }

  
  s3.putObject(params, (err, result) => {
    if (err) return cb(err);
    let url = `${AWS_URL_BASE}/${BUCKET_NAME}/${Key}`    
    this.create( {name: name, url}, cb)
  });
};

ImageSchema.statics.deleteLink = function(url, cb) {
  let Key = url.split('/')[5];
  let params = {
    Bucket: BUCKET_NAME,
    Key
  }

  s3.deleteObject(params, (err, data) => {
    if (err) cb(err)  // error
    else  cb(null, data)// deleted
  });
}

const Image = mongoose.model('Image', ImageSchema);


module.exports = Image;