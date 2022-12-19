sap.ui.define([
	"sap/ui/core/mvc/Controller",
    'sap/m/MessageToast',
	"sap/ui/model/json/JSONModel",
	
], function(
	Controller, MessageToast,JSONModel
) {
	"use strict";
	
	return Controller.extend("project1.controller.Home", {
		
		onInit: function(){
		},
     
        onCustomer: function(){
            this.getOwnerComponent().getRouter().navTo("Customer")
        },
		onGLAccount: function(){
            this.getOwnerComponent().getRouter().navTo("GLAccount")
        },
		onCompanyCode: function(){
            this.getOwnerComponent().getRouter().navTo("CompanyCode")
        },
		
		
		
		
	});
});