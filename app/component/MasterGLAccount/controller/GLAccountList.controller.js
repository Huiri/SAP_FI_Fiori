sap.ui.define([
	"sap/ui/core/mvc/Controller", "sap/ui/model/Filter", "sap/ui/model/FilterOperator", "sap/ui/model/json/JSONModel", "sap/ui/export/Spreadsheet", "sap/ui/export/library"
], function(
	Controller,
	Filter,
	FilterOperator,
	JSONModel,
	Spreadsheet,
	exportLibrary
) {
	"use strict";
	const EdmType = exportLibrary.EdmType;
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
			//console.log(Gl);
			this.getView().byId("GlAccountTable").setBusy(false);

			let GlDataModel = new JSONModel(Gl.value);
			this.getView().setModel(GlDataModel, "GlDataModel");

			totalNumber = this.getView().getModel("GlDataModel").oData.length;

			let TableIndex = `G/L 계정 (${totalNumber})`;
			this.getView().byId("TableName").setText(TableIndex); 

		},
		onCreateAccount: function() {
			this.getOwnerComponent().getRouter().navTo("CreateGLAccount");
		},
		onCloseCoADialog : function() {
			this.byId("InputCoADialog").destroy();

			this.pDialog = null;
		},
		onCloseGLAccDialog : function() {
			this.byId("InputGLAcctDialog").destroy();

			this.pDialog = null;
		},
        onDataExport: function () {
            let aCols, oRowBinding, tableIndices, oSettings, oSheet, oTable;

            oTable = this.byId('GlAccountTable');    // 테이블 
            oRowBinding = oTable.getBinding('rows');    // 테이블 전체 데이터
            tableIndices = oRowBinding.aIndices;        // 조건에 의해 필터링된 데이터의 테이블 Index
            console.log(oRowBinding);

            let oList = []; // 데이터 담을 배열 생성

            var selectedIndex = this.byId("GlAccountTable").getSelectedIndices();    // 멀티토글에서 체크한 열의 테이블 데이터

            if (selectedIndex.length == 0) {    // 선택한 열이 없을 때
                for (let j = 0; j < oRowBinding.oList.length; j++) {    // 전체 데이터 만큼 for문 돌림
                    if (oRowBinding.aIndices.indexOf(j) > -1) {         // 데이터가 있을 때
                        oList.push(oRowBinding.oList[j]);               // 전체 데이터를 oList에 Push
                    }
                }
            }
            else {                              // 선택한 열이 있을 때
                for (let j = 0; j < selectedIndex.length; j++) {        // 선택한 열의 수만큼 for문 돌림
                    oList.push(oRowBinding.oList[tableIndices[selectedIndex[j]]]);      // [전체 데이터의 [필터링된 데이터의 [선택한 데이터[j]]]]
                    // console.log(oRowBinding.oList[tableIndices[selectedIndex[j]]]);
                }
            }

            aCols = this.createColumnConfig();

            oSettings = {
                workbook: {
                    columns: aCols,
                    hierarchyLevel: 'Level'
                },
                dataSource: oList,
                fileName: 'GlAccountTable.xlsx',
                worker: false
            };
            oSheet = new Spreadsheet(oSettings);
            oSheet.build().finally(function () {
                oSheet.destroy();
            });
        },
		createColumnConfig: function () {
            const aCols = [];
            aCols.push({
                label: 'G/L 계정',
                property: 'gl_acct',
                type: EdmType.String
            });
            aCols.push({
                label: 'G/L 계정 내역',
                property: 'gl_acct_content',
                type: EdmType.String
            });
            aCols.push({
                label: '계정과목표',
                property: 'gl_coa',
                type: EdmType.String
            });
            aCols.push({
                label: 'G/L 계정 유형',
                property: 'gl_acct_type',
                type: EdmType.String
            });
            aCols.push({
                label: '계정 그룹',
                property: 'gl_acct_group',
                type: EdmType.String
            });

            return aCols;
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