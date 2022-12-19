sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageBox",
], function (Controller,JSONModel,MessageBox) {
    "use strict";
    return Controller.extend("project2.controller.SelectFS", {
        onInit: async function () {

            this.getOwnerComponent().getRouter().getRoute("SelectFS").attachPatternMatched(this.onMyRoutePatternMatched,this)
        },

        onMyRoutePatternMatched : async function (oEvent) {
        
        }


    });
});
