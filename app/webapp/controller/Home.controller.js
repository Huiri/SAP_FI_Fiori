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
			let oComponent = this.getOwnerComponent(),
                oRootControl = oComponent.getRootControl(),
                oControlMenu = oRootControl.byId('menu');

            oControlMenu.setText('BP');
            this.getOwnerComponent().getRouter().navTo("Customer")
        },
		onGLAccount: function(){
			let oComponent = this.getOwnerComponent(),
			oRootControl = oComponent.getRootControl(),
			oControlMenu = oRootControl.byId('menu');

			oControlMenu.setText('총계정원장');

            this.getOwnerComponent().getRouter().navTo("GLAccount")
        },
		onCompanyCode: function(){
			let oComponent = this.getOwnerComponent(),
			oRootControl = oComponent.getRootControl(),
			oControlMenu = oRootControl.byId('menu');

			oControlMenu.setText('회사코드');

            this.getOwnerComponent().getRouter().navTo("CompanyCode")
        },
		
		
		
		
	});
});