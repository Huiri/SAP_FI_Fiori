sap.ui.define([
	"sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
	"sap/m/SearchField",
	"sap/ui/table/Column",
    "sap/m/MessageBox",
], function(
	Controller,
	JSONModel,
	SearchField,
	UIColumn,
	MessageBox
) {
	"use strict";

	return Controller.extend("project3.controller.CustomerCorres", {
        onInit: function(){
            this.getOwnerComponent().getRouter().getRoute("CustomerCorres").attachPatternMatched(this.onDataView,this);
        },
        onDataView: async function(){

            const CoCdList = await $.ajax({
                type:"GET",
                url:"/cocd/CoCd"
            });
            let BpCoCdModel = new JSONModel(CoCdList.value);
            this.getView().setModel(BpCoCdModel,"BpCoCdModel");

            let bpCustomerListData = await $.ajax({
                type: "GET",
                url: "/bp/BP"
            });
            let BpCustomerModel = new JSONModel(bpCustomerListData.value);
            this.getView().setModel(BpCustomerModel, "BpCustomerModel");
        },
				/*
		 * ---------------- BP 프래그먼트 동작--------------------
		*/
		onSelectBP : function(){
            if(!this.pDialog){
				this.pDialog = this.loadFragment({
					name:"project3.view.fragment.CreateInputBP"
				});
			}
			this.pDialog.then(function(oDialog){
				oDialog.open();
			});
        },
		onSearchBPDialog: function() {
			var SearchInputBP = this.byId("SearchInputBP").getValue();
			var aFilter = [];

			if (SearchInputBP) {
				aFilter = new Filter({
					filters: [
						new Filter("bp_number", FilterOperator.Contains, SearchInputBP),
						new Filter("bp_company_code", FilterOperator.Contains, SearchInputBP),
						new Filter("bp_name", FilterOperator.Contains, SearchInputBP),
					],
					and: false
				});
			}

			let oTable = this.byId("BPSelectTable").getBinding("rows");
            oTable.filter(aFilter);

		},
		// BP 선택용 다이어로그 검색창 clear용 함수
		onSearchBPReset: function() {
			this.byId("SearchInputBP").setValue("");
			this.onSearchBPDialog();
		},

		// BP 선택용 다이어로그 특정 row 선택 시 생성 페이지 Input에 값 입력
		getBPContext : function(oEvent){
			let rowIndex = oEvent.getParameters().rowIndex;
			
			this.byId("bpNumber").setValue(oEvent.getParameters().rowBindingContext.oModel.oData[rowIndex].bp_number); 
			this.onCloseBPDialog();
		},
		// BP 선택용 다이어로그 close 함수
		onCloseBPDialog: function() {
			this.byId("BPDialog").destroy();
			this.pDialog = null;
		},
		
		/*
		 * ---------------- CoCd 프래그먼트 동작--------------------
		*/
		onSelectCoCd : function(){
            if(!this.pDialog){
				this.pDialog = this.loadFragment({
					name:"project3.view.fragment.CreateInputCoCd"
				});
			}
			this.pDialog.then(function(oDialog){
				oDialog.open();
			});
        },
		onSearchCoCdDialog: function() {
			var SearchInputCoCd = this.byId("SearchInputCoCd").getValue();
			var aFilter = [];

			if (SearchInputCoCd) {
				aFilter = new Filter({
					filters: [
						new Filter("com_code", FilterOperator.Contains, SearchInputCoCd),
						new Filter("com_code_name", FilterOperator.Contains, SearchInputCoCd),
					],
					and: false
				});
			}

			let oTable = this.byId("CoCdSelectTable").getBinding("rows");
            oTable.filter(aFilter);

		},

        // 회사코드 선택용 다이어로그 close 함수
		onCloseCoCdDialog: function() {
			this.byId("CoCdDialog").destroy();
			this.pDialog = null;
		},
		// 회사코드 선택용 다이어로그 검색창 clear용 함수
		onSearchCoCdReset: function() {
			this.byId("SearchInputCoCd").setValue("");
			this.onSearchCoCdDialog();
		},

		// 회사코드 선택용 다이어로그 특정 row 선택 시 생성 페이지 Input에 값 입력
		getCoCdContext : function(oEvent){
			let rowIndex = oEvent.getParameters().rowIndex;
			
			this.byId("BpCompanyCode").setValue(oEvent.getParameters().rowBindingContext.oModel.oData[rowIndex].com_code); 
			this.onCloseCoCdDialog();
		},
	

        toEditCorres: function(){
			//값 넘김 구현 필요
			console.log(this.byId("bpNumber").getValue())
			if(this.byId("bpNumber").getValue()===null){
				MessageBox.error("필수 항목을 입력해주세요");
				return;
			}else{
				let temp = {
					cocd: this.byId("BpCompanyCode").getValue(),
					constructor:this.byId("constructor").getValue(),
					bpNumber:this.byId("bpNumber").getValue(),
					createdDate:this.byId("createdDate").getValue(),
					dueDate:this.byId("dueDate").getValue()
				}
				console.log(temp);
				
				this.onClearField();
				this.getOwnerComponent().getRouter().navTo("EditCorres",{obj:JSON.stringify(temp)});
			}
        },
		
		//초기화
        onClearField: function() {
            this.byId("BpCompanyCode").setValue(""),
            this.byId("constructor").setValue(""),        
            this.byId("bpNumber").setValue(""),
            this.byId("createdDate").setValue(""),
            this.byId("dueDate").setValue(""),

            this.onDataView();
        }, 

        toHome: function(){
			this.onClearField();
            this.getOwnerComponent().getRouter().navTo("Home");
        }


	});
});