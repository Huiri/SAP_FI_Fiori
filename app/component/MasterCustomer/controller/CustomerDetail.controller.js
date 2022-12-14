sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel"
], function(
	Controller,JSONModel
) {
	"use strict";
	let selectedNum;

	return Controller.extend("project3.controller.CustomerDetail", {
		onInit: async function(){
			await this.getOwnerComponent().getRouter().getRoute("CustomerDetail").attachPatternMatched(this.initBpDetailData,this);
		},
		initBpDetailData: async function(e){
			selectedNum = e.getParameter("arguments").num;
			let bpData = await this.getBpModelData();
			let rpData = this.replaceNullData(bpData);
			this.setBpModel(rpData,"bpModel");
			this.setBpAddress("bpModel");
		},
		getBpModelData: async function (){
			let url="/bp/BP/"+selectedNum;
			let bpData= await $.ajax({
				type:'get',
				url:url
			})
			return bpData;
		},
		setBpModel: async function(data,modelName){
			let bpModel = new JSONModel(data);
			this.getView().setModel(bpModel, modelName);
		},
		replaceNullData: function(model){
			console.log(model);
			for (var data in model) {
				var prop = model[data];
				if(prop===null){
					console.log(data);
					model[data]='-';
				}
			}
			console.log(model);
			return model;
		},
		revertModelData: function(model){
			for (var data in model) {
				var prop = model[data];
				if(prop==='-'){
					console.log(data);
					model[data]=null;
				}
			}
			return model;
		},
		setBpAddress: function(modelName){
			let bpAddress = "";
			let bp_postal_code = this.getView().getModel(modelName).getProperty(`/bp_postal_code`);
			let bp_region = this.getView().getModel(modelName).getProperty(`/bp_region`);
			let bp_city = this.getView().getModel(modelName).getProperty(`/bp_city`);
			let bp_road_address = this.getView().getModel(modelName).getProperty(`/bp_road_address`);
			let bp_street_address = this.getView().getModel(modelName).getProperty(`/bp_street_address`);
			bpAddress = `${bp_postal_code} ${bp_region} ${bp_city} ${bp_road_address} ${bp_street_address}`;

			this.getView().byId('bpAddress').setText(bpAddress);
		},
        editBtnPress : function(){
			
		}
	});
});