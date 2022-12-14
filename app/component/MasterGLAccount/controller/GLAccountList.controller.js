sap.ui.define([
	"sap/ui/core/mvc/Controller", "sap/ui/model/Filter", "sap/ui/model/FilterOperator", "sap/ui/model/json/JSONModel"
], function(
	Controller,
	Filter,
	FilterOperator,
	JSONModel
) {
	"use strict";

	let totalNumber;
	return Controller.extend("project2.controller.GLAccountList", {
		onInit(){
			this.getOwnerComponent().getRouter().getRoute("GLAccountList").attachPatternMatched(this.onMyRoutePatternMatched, this);
			// this.getOwnerComponent().getRouter().getRoute("GLAccountDetail").attachPatternMatched(this.onMyRoutePatternMatched, this);
		},
		onMyRoutePatternMatched :async function(){
			this.onDataView();
			// this.onReset();
		},
		onDataView : async function(){
			this.getView().byId("GlAccountTable").setBusy(true);
			const Gl =  await $.ajax({
				type : "get",
				url : "/gl/GL"
			});
			console.log(Gl);
			this.getView().byId("GlAccountTable").setBusy(false);

			let GlDataModel = new JSONModel(Gl.value);
			this.getView().setModel(GlDataModel, "GlDataModel");

			totalNumber = this.getView().getModel("GlDataModel").oData.length;

			let TableIndex = `G/L 계정 (${totalNumber})`;
			this.getView().byId("TableName").setText(TableIndex); 

		},
		onCreateAccount: function() {
			this.getOwnerComponent().getRouter().navTo("GLAccountCreate");
		},
		onCloseCoADialog : function() {
			this.byId("InputCoADialog").destroy();

			this.pDialog = null;
		},
		onCloseGLAccDialog : function() {
			this.byId("InputGLAcctDialog").destroy();

			this.pDialog = null;
		},
		onDataExport: function(oEvent) {
			
		},

		toGLAcctDetail: function(oEvent) {
			let SelectedNum = oEvent.getParameters().row.mAggregations.cells[0].mProperties.text;
            console.log(SelectedNum);
            this.getOwnerComponent().getRouter().navTo("GLAccountDetail", {num : SelectedNum});
		},

		onCheckExecute: function(oEvent) {
			
		},

		onRequestHome: function(oEvent) {
			this.getOwnerComponent().getRouter().navTo("Home");
		},

		onSearch: function() {
			let GlCoa = this.byId("GlCoa").getValue(); 
            let GlAcct = this.byId("GlAcct").getValue(); 
            let GlAcctType = this.byId("GlAcctType").getSelectedKey();
            let GlAcctGroup = this.byId("GlAcctGroup").getValue();

			var aFilter = []; 

            if(GlCoa) {aFilter.push(new Filter("gl_coa", FilterOperator.Contains, GlCoa))} 
            if(GlAcct) {aFilter.push(new Filter("gl_acct", FilterOperator.Contains, GlAcct))} 
            if(GlAcctType) {aFilter.push(new Filter("gl_acct_type", FilterOperator.Contains, GlAcctType))}
            if(GlAcctGroup) {aFilter.push(new Filter("gl_acct_group", FilterOperator.Contains, GlAcctGroup))} 

			let oTable = this.byId("GlAccountTable").getBinding("rows"); 
            oTable.filter(aFilter); 

		},

		onCoCdDataView : async function(){
			const Gl =  await $.ajax({
				type : "get",
				url : "/gl/GL"
			});
			console.log(Gl);

			let GlDataModel = new JSONModel(Gl.value);
			this.getView().setModel(GlDataModel, "GlDataModel");

			let totalCoA = this.getView().getModel("GlDataModel").oData.length;

			let TableIndex = `항목 (${totalCoA})`;
			this.getView().byId("CoASelectTableTitle").setText(TableIndex); 

			// this.getView().byId("CoCdTable").setBusy(true);
			// const coCd =  await $.ajax({
			// 	type : "get",
			// 	url : "/cocd/CoCd"
			// });
			// // this.getView().byId("CoCdTable").setBusy(false);

			// let CoCdDataModel = new JSONModel(coCd.value);
			// this.getView().setModel(CoCdDataModel, "CoCdDataModel");

			// totalNumber = this.getView().getModel("CoCdDataModel").oData.length;

			// let TableIndex = `계정과목표 (${totalNumber})`;
			// this.getView().byId("CoCdTabletitle").setText(TableIndex); 

		},
		onReset: function() {
			this.byId("GlCoa").setValue("");
			this.byId("GlAcct").setValue("");
			this.byId("GlAcctType").setSelectedKey("");
			this.byId("GlAcctGroup").setValue("");
			this.onSearch();
		},

		onValueHelpCoA: function(oEvent) {
			this.onCoCdDataView();
			if(!this.pDialog){
				this.pDialog = this.loadFragment({
					name:"project2.view.fragment.InputCoAList"
				});
			}
			this.pDialog.then(function(oDialog){
				oDialog.open();
			});

		},

		onValueHelpGLAcc: function(oEvent) {
			// this.onCoCdDataView();
			if(!this.pDialog){
				this.pDialog = this.loadFragment({
					name:"project2.view.fragment.InputGLAcctList"
				});
			}
			this.pDialog.then(function(oDialog){
				oDialog.open();
			});
		},

		onCreateAcct: function(oEvent) {
			this.onCloseDialog();
		},

		onCoASearch: function() {
			let CoASearchInput = this.byId("CoASearchInput").getValue(); 
			var aFilter = []; 

            if(CoASearchInput) {aFilter.push(new Filter("gl_coa", FilterOperator.Contains, CoASearchInput))} 
			
			let oTable = this.byId("CoASelectTable").getBinding("rows"); 
            oTable.filter(aFilter);

		},
		onCoAReset : function(){
			this.byId("CoASearchInput").setValue("");
			this.onCoASearch();
		},
		onGLAccSearch : function(){
			let GLAccSearchInput = this.byId("GLAccSearchInput").getValue(); 
			var aFilter = []; 

            if(GLAccSearchInput) {aFilter.push(new Filter("gl_acct_group", FilterOperator.Contains, GLAccSearchInput))} 
			
			let oTable = this.byId("GLAccSelectTable").getBinding("rows"); 
            oTable.filter(aFilter);


		},
		onGLAccReset : function(){
			this.byId("GLAccSearchInput").setValue("");
			this.onGLAccSearch();

		}
	});
});