sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function(
	Controller
) {
	"use strict";

	return Controller.extend("project4.controller.Home", {

		toCompanyCodeList :function (){
			this.getOwnerComponent().getRouter().navTo("CompanyCodeList");
		}
	});
});