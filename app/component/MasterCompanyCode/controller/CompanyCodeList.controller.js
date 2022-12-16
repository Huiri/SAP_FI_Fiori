sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/model/Sorter",
    "sap/ui/model/json/JSONModel",
    "sap/ui/export/Spreadsheet",
    "sap/ui/export/library"
], function (Controller, Filter, FilterOperator, Sorter, JSONModel, Spreadsheet, exportLibrary) {
    "use strict";
    let totalNumber;
    let selectedNum;

    return Controller.extend("project4.controller.CompanyCodeList",{
        onInit: async function(){
            const myRoute = this.getOwnerComponent().getRouter().getRoute("CompanyCodeList");
            myRoute.attachPatternMatched(this.onMyRoutePatternMatched,this);
        },

        onMyRoutePatternMatched: async function(){

            this.onDataView();
        },
        onDataView: async function(){
            const CompanyCodeList = await $.ajax({
                type:"GET",
                url:"/cocd/CoCd"
            });

            let CompanyCodeListModel = new JSONModel(CompanyCodeList.value);

            this.getView().setModel(CompanyCodeListModel,"CompanyCodeListModel");
            totalNumber= this.getView().getModel("CompanyCodeListModel").getData().length;
            totalNumber= "고객(" + totalNumber + ")"
            this.byId("totalNumber").setText(totalNumber);
        },
        onSearch: function (){
            let CompanyCode = this.byId("CompanyCode").getValue();
            let CompanyCodeName = this.byId("CompanyCodeName").getValue();
            let CompanyCountry = this.byId("CompanyCountry").getValue();
            let CompanyCurrency = this.byId("CompanyCurrency").getValue();
            let CompanyCoa = this.byId("CompanyCoa").getValue();

            var aFilter = [];

            if(CompanyCode) {aFilter.push(new Filter("com_code", FilterOperator.Contains, CompanyCode))}
            if(CompanyCodeName) {aFilter.push(new Filter("com_code_name", FilterOperator.Contains, CompanyCodeName))}
            if(CompanyCountry) {aFilter.push(new Filter("com_country", FilterOperator.Contains, CompanyCountry))}
            if(CompanyCurrency) {aFilter.push(new Filter("com_currency", FilterOperator.Contains, CompanyCurrency))}
            if(CompanyCoa) {aFilter.push(new Filter("com_coa", FilterOperator.Contains, CompanyCoa))}
          
            let oTable = this.byId("CompanyCodeListTable").getBinding("rows")

            oTable.filter(aFilter);   
        },
        onReset : function() {
            this.byId("CompanyCode").setValue("");
            this.byId("CompanyCodeName").setValue("");
            this.byId("CompanyCountry").setValue("");
            this.byId("CompanyCurrency").setValue("");
            this.byId("CompanyCoa").setValue("");
            this.onSearch();
        },
        toBack : function(){
            this.getOwnerComponent().getRouter.navTo("CompanyCode");
        }
    });
});