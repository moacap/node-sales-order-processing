'use strict';

var mongoose = require('mongoose'),
	Customer = mongoose.model('Customer'),
	Product = mongoose.model('Product'),
	SalesOrder = mongoose.model('SalesOrder'),
	log = require('../../log'),
	Q = require('q');



var createCustomers = function() {
	var deferred = Q.defer();

	Customer.find({}).remove(function() {
		Customer.create(
			{
				name: 'Jose Luis Monteagudo',
				address: 'C/Cabo de Machichaco, 3',
				state: 'Castellon',
				country: 'Spain'
			},
			function(err, customer) {
				if (err) {
					log.error('Error loading dummy customers: ' + err);
					deferred.reject(err);
				}
				else {
					log.info('Finished populating dummy customers');
					deferred.resolve(customer);
				}
			}
		);
	});

	return deferred.promise;

};

var createProducts = function() {
	var deferred = Q.defer();

	Product.find({}).remove(function() {
		Product.create(
			{
				description: 'Parachoques Delantero Ford Focus',
				address: 95
			},
			{
				description: 'Parachoques Trasero Ford Focus',
				address: 105
			},
			{
				description: 'Optica Derecha Ford Focus',
				address: 56
			},
			{
				description: 'Optica Izquierda Ford Focus',
				address: 56
			},
			{
				description: 'Parachoques Delantero Citroen C4',
				address: 95
			},
			{
				description: 'Parachoques Trasero Citroen C4',
				address: 105
			},
			{
				description: 'Optica Derecha Citroen C4',
				address: 56
			},
			{
				description: 'Optica Izquierda Citroen C4',
				address: 56
			},
			{
				description: 'Parachoques Delantero Citroen C3',
				address: 95
			},
			{
				description: 'Parachoques Trasero Citroen C3',
				address: 105
			},
			{
				description: 'Optica Derecha Citroen C3',
				address: 56
			},
			{
				description: 'Optica Izquierda Citroen C3',
				address: 56
			},
			{
				description: 'Parachoques Delantero Citroen C2',
				address: 95
			},
			{
				description: 'Parachoques Trasero Citroen C2',
				address: 105
			},
			{
				description: 'Optica Derecha Citroen C2',
				address: 56
			},
			{
				description: 'Optica Izquierda Citroen C2',
				address: 56
			},
			function(err, product) {
				if (err) {
					log.error('Error loading dummy products: ' + err);
					deferred.reject(err);
				}
				else {
					log.info('Finished populating dummy products');
					deferred.resolve(product);
				}
			}
		);
	});

	return deferred.promise;

};


var createSalesOrders = function(params) {

	var customer = params[0],
		product = params[1],
		deferred = Q.defer();

	SalesOrder.find({}).remove(function() {

		var salesOrder = new SalesOrder( {
			customer: customer,
			lines: [
				{
					product: product,
					quantity: 1,
					price: 13
				}
			]
		} );

		salesOrder.save(function(err, createdSalesOrder) {
			if (err) { deferred.reject(err); }
			
			log.info('Finished populating dummy sales orders');
			deferred.resolve(createdSalesOrder);
		});

	});

	return deferred.promise;

};


var findSalesOrder = function() {

	SalesOrder
		.findOne({})
		.populate('customer lines.product')
		.exec(function(err, salesOrder) {

			if (err) { log.error(err); }
			log.info('SalesOrder created: ' + salesOrder);
			//log.info('customer: ' + salesOrder.customer.name);
			//log.info('product: ' + salesOrder.lines[0].product.description);

		});

};



Q.all([createCustomers(), createProducts()])
	.then(createSalesOrders)
	.then(findSalesOrder)
	.done();



