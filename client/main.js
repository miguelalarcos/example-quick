import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';
import { setDateFormat, qConnect, qList, qForm, integer, float, date, qBase, queryJSON2Mongo, isValid } from 'meteor/miguelalarcos:quick-search-form';
import moment from 'moment';
import { searchSchema, Sale, saleSchema, lineSchema } from '/imports/model.js';
import './main.html';

setDateFormat('DD/MM/YYYY');

const saveCallback = (doc, input, dirty) => {
  //delete doc.lines;
  Meteor.call('saveSale', dirty, (err, result)=>{
    if(err){
      console.log(err);
    }
    else{
      Session.set(input, result);
    }
  });
}

const dateOptions = {
    format: "dd/mm/yyyy",
    autoclose: true
};

qForm(Template.search, {schema: searchSchema, date: date(dateOptions), resetAfterSubmit: false});
qForm(Template.sale, {schema: saleSchema, date: date(dateOptions), float, callback: saveCallback});
qList(Template.sales, {name: 'sales', schema: searchSchema, collection: Sale});

Template.main.helpers({
  initial() {
    const today = moment().startOf('day').toDate();  
    return {sale_date$gte: today, sale_date$lte: today};
  },
  lineVisible(){
    return Session.get('sale');
  }
});

qConnect('sale', 'line', (v)=>{ return {_id: v._id} })

const lineSave = (doc, input) => {
  Meteor.call('lineSave', doc)
  Session.set(input, {['_id']: doc._id});
}

qForm(Template.line, {schema: lineSchema, integer, float, callback: lineSave});

Template.lines.events({
  'click .remove'(evt, tmpl){
    Meteor.call('lineRemove', Session.get('sale')._id, this);
  }
});

Template.lines.helpers({
  lines(){
    let sale = Session.get(Template.instance().data.input);
    if(sale){
      sale = Sale.findOne(sale._id);
      if(sale){
        return sale.lines;
      }
      else{
        return [];
      }
    }
    else{
      return [];
    }
  }
});
