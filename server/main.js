import { Meteor } from 'meteor/meteor';
import { save, isValidSubDoc, flatten, isValid, queryJSON2Mongo } from 'meteor/miguelalarcos:quick-search-form';
import { searchSchema, Sale, saleSchema } from '/imports/model.js';

const Client = new Mongo.Collection('clients');

if(Client.find({}).count() == 0){
  Client.insert({value: 'Miguel'});
  Client.insert({value: 'Miguelito'});
  Client.insert({value: 'Miguelon'});
}

Meteor.methods({
  'queryClients'(query){
    let ret = Client.find({value: { $regex: query, $options: 'i'}}).fetch();
    return ret;
  },
  lineSave(doc){
    const _id = doc._id;
    delete doc._id;
    Sale.update(_id, {$push: {lines: doc}});
  },
  lineRemove(_id, doc){
    Sale.update(_id, {$pull: {lines: doc}});
  },
  'saveSale'(doc){    
    return save(doc, Sale, saleSchema);
    /*    
    let _id = doc._id;
    //doc.amount += 100;
    if(!_id){      
      if(!isValid(doc, saleSchema)){
        console.log("saveError", 'sale is not valid.');
        throw new Meteor.Error("saveError", 'sale is not valid.');
      }
      _id = Sale.insert(doc);
    }else{      
      if(!isValidSubDoc(doc, saleSchema)){
        console.log("saveError", 'sale is not valid.(b)');
        throw new Meteor.Error("saveError", 'sale is not valid.(b)');
      }
      doc = flatten(doc, saleSchema);
      delete doc._id;        
      Sale.update(_id, {$set: doc});
    }
    return Sale.findOne(_id);
    */
  }
});

Meteor.publish('sales', function(query){
  if(!isValid(query, searchSchema)){
    this.error(Meteor.Error("salePublishError", 'query is not valid.'));
  }
  query = queryJSON2Mongo(query, searchSchema);
  return Sale.find(query);
});