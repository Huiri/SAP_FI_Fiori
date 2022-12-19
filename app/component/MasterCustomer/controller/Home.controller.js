sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function(
	Controller
) {
	"use strict";

	return Controller.extend("project3.controller.Home", {

		toCustomerList :function () {
			this.getOwnerComponent().getRouter().navTo("CustomerList");
		},
		toCustomerChart: function(){
			this.getOwnerComponent().getRouter().navTo("CustomerChart");

		}
	
	});
});