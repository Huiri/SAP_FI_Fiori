sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"project3/model/formatter"
	
], function(
	Controller,
	JSONModel,
	formatter
) {
	"use strict";
	let selectedNum;
	//변경필요
	

	return Controller.extend("project4.controller.CoCdDetail", {
		formatter:formatter,
	//-----------초기화----------//
		onInit: async function(){
			
			await this.getOwnerComponent().getRouter().getRoute("CoCdDetail").attachPatternMatched(this.initView, this);
			
		},
		/**
		 * @override
		 */
		// onAfterRendering: function() {
		// 	// Controller.prototype.onAfterRendering.apply(this, arguments);

		// 	this.getView().byId('myTEST2').getDomRef().childNodes[0].childNodes[0].class = "sapUxAPObjectPageSectionTitle";
		//},
		initView: async function(e){
			selectedNum = e.getParameter("arguments").num;			
			let url="/cocd/CoCd/"+selectedNum;			
			const COCDDATA= await $.ajax({
				type:'get',
				url:url
			});
			var cocdModel = new JSONModel(COCDDATA);
			console.log(cocdModel)
			this.getView().setModel(cocdModel, "cocdModel")
			console.log(this.getView().getModel("cocdModel"))
		},


		
		toBack: function(){
			this.getOwnerComponent().getRouter().navTo("CompanyCodeList");
		}
		
		
			
	});
});