sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function(
	Controller
) {
	"use strict";

	return Controller.extend("project2.controller.Home", {
		toGLMasterList : function(){
			this.getOwnerComponent().getRouter().navTo("GLAccountList");
		},
		toSelectFS : function() {
			this.getOwnerComponent().getRouter().navTo("SelectFS")
		}
	});
});