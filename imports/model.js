import moment from 'moment';
export const Sale = new Mongo.Collection('sales');

export const searchSchema = {
      sale_date$gte: {type: 'date', validate: (v) => v && moment(v).isValid()},
      sale_date$lte: {type: 'date', validate: (v) => v && moment(v).isValid()}
}

export const saleSchema = {
      _id: {type: 'string'},
      sale_date: {type: 'date', message: 'must be valid date', validate: (v) => v && moment(v).isValid()},
      amount: {type: 'float', message: 'must be greater than 0', validate: (v) => v > 0},
      'client.value': {type: 'string'},
      'client._id': {type: 'string'},
      lines: {type: 'array'}
}

export const lineSchema = {
      _id: {type: 'string'},
      item: {type: 'string'},
      quantity: {type: 'integer'},
      amount: {type: 'float'}
}