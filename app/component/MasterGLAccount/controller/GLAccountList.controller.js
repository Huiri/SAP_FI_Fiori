sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/model/Sorter",
    "sap/ui/model/json/JSONModel",
    "sap/ui/export/Spreadsheet",
    "sap/ui/export/library",
    "../model/formatter",
	'sap/m/SearchField',
	'sap/ui/table/Column',
	'sap/m/Text',
], function(
	Controller, 
	Filter, 
	FilterOperator, 
	Sorter, 
	JSONModel, 
	Spreadsheet, 
	exportLibrary, 
	formatter,
    SearchField,
	UIColumn,
	Text 
) {
	"use strict";
	const EdmType = exportLibrary.EdmType;
	let totalNumber;
	return Controller.extend("project2.controller.GLAccountList", {
		formatter : formatter,
		onInit() {
			this.getOwnerComponent().getRouter().getRoute("GLAccountList").attachPatternMatched(this.onMyRoutePatternMatched, this);
			// this.getOwnerComponent().getRouter().getRoute("GLAccountDetail").attachPatternMatched(this.onMyRoutePatternMatched, this);
		},
		onMyRoutePatternMatched: async function () {
			this.onDataView();
			this.onReset();

		},
		onDataView: async function () {
			this.getView().byId("GlAccountTable").setBusy(true);
			const Gl = await $.ajax({
				type: "get",
				url: "/gl/GL"
			});
			this.getView().byId("GlAccountTable").setBusy(false);

			const GlSelectCoA = await $.ajax({
				type: "get",
				url: "/gl/SelectCoA"
			});
			const GlSelectGL = await $.ajax({
				type: "get",
				url: "/gl/SelectGL"
			});
			const GlSelectAcctGrp = await $.ajax({
				type: "get",
				url: "/gl/SelectGLAcctGrp"
			});
			// var fragmentgl = Gl.value;
			// //fragment용 데이터 저장
			// const fragmentglfinal = fragmentgl.filter((item, i) => {
			// 	return (
			// 		fragmentgl.findIndex((item2, j) => {
			// 		return item.gl_coa === item2.gl_coa;
			// 	  }) === i
			// 	);
			//   });
			// //gl_coa 중복값 제거(js 객체 배열 중복값 제거 구글링)  
			// let fragmentglModel = new JSONModel(fragmentglfinal);
			// this.getView().setModel(fragmentglModel, "GLDatafragmentModel");
			// //fragment용 모델 생성 GLDatafragmentModel

			this.getView().byId("GlAccountTable").setBusy(false);

			let GLDataModel = new JSONModel(Gl.value);
			this.getView().setModel(GLDataModel, "GLDataModel");

			let SelectCoAModel = new JSONModel(GlSelectCoA.value);
			this.getView().setModel(SelectCoAModel, "SelectCoAModel");

			let SelectGLModel = new JSONModel(GlSelectGL.value);
			this.getView().setModel(SelectGLModel, "SelectGLModel");
			
			let SelectAcctGrpModel = new JSONModel(GlSelectAcctGrp.value);
			this.getView().setModel(SelectAcctGrpModel, "SelectAcctGrpModel");

			totalNumber = this.getView().getModel("GLDataModel").oData.length;

			let TableIndex = `G/L 계정 (${totalNumber})`;
			this.getView().byId("TableName").setText(TableIndex); 

		},

		onCreateAccount: function() {
			this.getOwnerComponent().getRouter().navTo("CreateGLAccount");
		},

		toGLAcctDetail: function (oEvent) {
			let SelectedNum = oEvent.getParameters().row.mAggregations.cells[0].mProperties.text;
			console.log(SelectedNum);
			this.getOwnerComponent().getRouter().navTo("GLAccountDetail", { num: SelectedNum });
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

		onRequestHome: function (oEvent) {
			this.getOwnerComponent().getRouter().navTo("Home");
		},

		onSearch: function () {
			// var selectedItems = oEvent.getParameter("selectedItems");

			// let GlCoa = this.byId("GLCoa").getTokens();
			// let GlAcct = this.byId("GLAcct").getTokens();
			// let GlAcctType = this.byId("GLAcctType").getSelectedKeys();
			// let GlAcctGroup = this.byId("GLAcctGroup").getSelectedKeys();

			// var aFilter = [];

			// if (GlCoa) { 
			// 	for(let item in GlCoa){
			// 		aFilter.push(new Filter("gl_coa", FilterOperator.Contains, GlCoa[item].mProperties.key)) 

			// }}
			// if (GlAcct) { 				
			// 	for(let item in GlAcct){
			// 		aFilter.push(new Filter("gl_acct", FilterOperator.Contains, GlAcct[item].mProperties.key)) 
			// }}

			// if (GlAcctType) { 
			// 	for(let item in GlAcctType){
			// 		aFilter.push(new Filter("gl_acct_type", FilterOperator.Contains, GlAcctType[item])) 
			// }}
			// if (GlAcctGroup) { 
			// 	for(let item in GlAcctGroup){
			// 		aFilter.push(new Filter("gl_acct_group", FilterOperator.Contains, GlAcctGroup[item])) 
			// }}
			// let oTable = this.byId("GlAccountTable").getBinding("rows");
			// oTable = oTable.filter(aFilter);
			// this.byId("TableName").setText(`G/L 계정(${oTable.iLength})`);
		},

		
		onReset: function () {
			this.byId("GLCoa").removeAllTokens();
			this.byId("GLAcct").removeAllTokens();
			this.byId("GLAcctType").removeAllSelectedItems();
			this.byId("GLAcctGroup").removeAllSelectedItems();
			this.onSearch();
		},

		onValueHelpCoA: function (oEvent) {
			this.pWhitespaceDialog = null;
			this._oBasicSearchField = null;
			this.oWhitespaceDialog = null;
			var oModel = this.getView().getModel('SelectCoAModel');

			var oCoATemplate = new Text({ text: { path: 'SelectCoAModel>gl_coa' }, renderWhitespace: true });
			var oCoAContentTemplate = new Text({ text: { path: 'SelectCoAModel>gl_coa_content' }, renderWhitespace: true });
			this._oBasicSearchField = new SearchField({
				search: function () {
					this.oWhitespaceDialog.getFilterBar().search();
				}.bind(this)
			});

			this.pWhitespaceDialog = this.loadFragment({
				name: "project2.view.fragment.InputCoAList"
			});

			this.pWhitespaceDialog.then(function (oWhitespaceDialog) {
				var oFilterBar = oWhitespaceDialog.getFilterBar();
				this.oWhitespaceDialog = oWhitespaceDialog;
				if (this._bWhitespaceDialogInitialized) {
					oWhitespaceDialog.setTokens([]);
					oWhitespaceDialog.update();

					oWhitespaceDialog.open();
				}
				this.getView().addDependent(oWhitespaceDialog);

				// if(!this.oWhitespaceDialog._getTokenizer().getTokenes().length){
				// 	oWhitespaceDialog.setTokens(this._oBasicSearchField.getTokens());
				// }
				// Set key fields for filtering in the Define Conditions Tab
				oWhitespaceDialog.setRangeKeyFields([{
					label: "계정과목표",
					key: "SelectCoAModel>gl_coa"
				}]);

				// Set Basic Search for FilterBar
				oFilterBar.setFilterBarExpanded(false);
				oFilterBar.setBasicSearch(this._oBasicSearchField);

				oWhitespaceDialog.getTableAsync().then(function (oTable) {
					oTable.setModel(oModel);

					// For Desktop and tabled the default table is sap.ui.table.Table
					if (oTable.bindRows) {
						oTable.addColumn(new UIColumn({ label: "계정과목표", template: oCoATemplate }));
						oTable.addColumn(new UIColumn({ label: "내역", template: oCoAContentTemplate }));
						oTable.bindAggregation("rows", {
							path: "SelectCoAModel>/",
							events: {
								dataReceived: function () {
									oWhitespaceDialog.update();
								}
							}
						});
					}

					oWhitespaceDialog.update();
				}.bind(this));

				this._bWhitespaceDialogInitialized = true;
				oWhitespaceDialog.open();
			}.bind(this));


		},

		onValueHelpGLAcc: function (oEvent) {
			this.pWhitespaceDialog = null;
			this._oBasicSearchField = null;
			this.oWhitespaceDialog = null;
			var oModel = this.getView().getModel('SelectGLModel');

			var oGLAcctTemplate = new Text({ text: { path: 'SelectGLModel>gl_acct' }, renderWhitespace: true });
			var oCoATemplate = new Text({ text: { path: 'SelectGLModel>gl_coa' }, renderWhitespace: true });
			var oGLAcctContentTemplate = new Text({ text: { path: 'SelectGLModel>gl_acct_content' }, renderWhitespace: true });
			this._oBasicSearchField = new SearchField({
				search: function () {
					this.oWhitespaceDialog.getFilterBar().search();
				}.bind(this)
			});

			this.pWhitespaceDialog = this.loadFragment({
				name: "project2.view.fragment.InputGLAcctList"
			});

			this.pWhitespaceDialog.then(function (oWhitespaceDialog) {
				var oFilterBar = oWhitespaceDialog.getFilterBar();
				this.oWhitespaceDialog = oWhitespaceDialog;
				if (this._bWhitespaceDialogInitialized) {
					// Re-set the tokens from the input and update the table
					oWhitespaceDialog.setTokens([]);
					oWhitespaceDialog.update();

					oWhitespaceDialog.open();
					// return;
				}
				this.getView().addDependent(oWhitespaceDialog);

				// Set key fields for filtering in the Define Conditions Tab
				oWhitespaceDialog.setRangeKeyFields([{
					label: "G/L 계정",
					key: "SelectGLModel>gl_acct"
				}]);

				// Set Basic Search for FilterBar
				oFilterBar.setFilterBarExpanded(false);
				oFilterBar.setBasicSearch(this._oBasicSearchField);

				oWhitespaceDialog.getTableAsync().then(function (oTable) {
					oTable.setModel(oModel);

					// For Desktop and tabled the default table is sap.ui.table.Table
					if (oTable.bindRows) {
						oTable.addColumn(new UIColumn({ label: "G/L 계정", template: oGLAcctTemplate }));
						oTable.addColumn(new UIColumn({ label: "계정과목표", template: oCoATemplate }));
						oTable.addColumn(new UIColumn({ label: "의미", template: oGLAcctContentTemplate }));
						oTable.bindAggregation("rows", {
							path: "SelectGLModel>/",
							events: {
								dataReceived: function () {
									oWhitespaceDialog.update();
								}
							}
						});
					}

					oWhitespaceDialog.update();
				}.bind(this));

				this._bWhitespaceDialogInitialized = true;
				oWhitespaceDialog.open();
			}.bind(this));


		},
		onGLAcctSelectCancelPress : function(){
			this.oWhitespaceDialog.close();
		},
		onCoASelectOkPress: function (oEvent) {
			var aTokens = oEvent.getParameter("tokens");
			var GlCoa = this.byId("GLCoa");

			aTokens.forEach(function (oToken) {
				// console.log(oToken.getKey());
				oToken.mProperties.text = oToken.getKey().toString()
				GlCoa.addToken(oToken);
			}.bind(this));

			this.oWhitespaceDialog.close();

		},

		onCoASelectCancelPress: function (oEvent) {
			this.oWhitespaceDialog.close();

		},

		onCoASelectSearch: function (oEvent) {
			let CoASearchInput = this._oBasicSearchField.getValue();
			console.log(CoASearchInput);
			var aFilter = [];

			if (CoASearchInput) {
				aFilter = new Filter({
					filters: [
						new Filter("gl_coa", FilterOperator.Contains, CoASearchInput),
						new Filter("gl_acct_content", FilterOperator.Contains, CoASearchInput)
					],
					and: false
				});
			}
			this._filterTable(aFilter);
		},
		
		_filterTable: function (oFilter) {
			var oValueHelpDialog = this.oWhitespaceDialog;
			oValueHelpDialog.getTableAsync().then(function (oTable) {
				if (oTable.bindRows) {
					oTable.getBinding("rows").filter(oFilter);
				}
				if (oTable.bindItems) {
					oTable.getBinding("items").filter(oFilter);
				}
				oValueHelpDialog.update();
			});
		},


		onGLAcctSelectOkPress: function(oEvent) {
			var aTokens = oEvent.getParameter("tokens");
			var GlAcct = this.byId("GLAcct");

			aTokens.forEach(function (oToken) {
				oToken.mProperties.text = oToken.getKey().toString()
				GlAcct.addToken(oToken);
			}.bind(this));

			this.oWhitespaceDialog.close();


		},

	});
});