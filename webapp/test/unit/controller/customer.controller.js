/*global QUnit*/

sap.ui.define([
	"customer/controller/customer.controller"
], function (Controller) {
	"use strict";

	QUnit.module("customer Controller");

	QUnit.test("I should test the customer controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});
