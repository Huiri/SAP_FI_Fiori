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
], function (
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
	Text ) {
    "use strict";
    let totalNumber;
    let selectedNum;
    const EdmType = exportLibrary.EdmType;
    return Controller.extend("project3.controller.CustomerList", {
        formatter : formatter,

        onInit: async function () {
            this._initModel();

            const myRoute = this.getOwnerComponent().getRouter().getRoute("CustomerList");
            myRoute.attachPatternMatched(this.onMyRoutePatternMatched, this);
        },

        /**
         * 모델 세팅
         */
        _initModel: function() {
            this.getView()
                .setModel(
                    new JSONModel({}), // JSONModel <- Two-Binding view <-> model 
                    'search'
                )
        },

        onMyRoutePatternMatched: async function () {

            this.onDataView();
        },
        onDataView: async function () {
            const customerList = await $.ajax({
                type: "GET",
                url: "/bp/BP"
            });

            let BpCustomerModel = new JSONModel(customerList.value);
            this.getView().setModel(BpCustomerModel, "BpCustomerModel");

            const nationList = await $.ajax({
                type: "GET",
                url: "/bp/BP_Nation_Region"
            });

            let BpNationModel = new JSONModel(nationList.value);
            this.getView().setModel(BpNationModel, "BpNationModel");
			
            
            // console.log(this.getView().getModel("BpCustomerModel"));
            totalNumber = this.getView().getModel("BpCustomerModel").getData().length;
            //console.log(totalNumber);
            totalNumber = "고객 (" + totalNumber + ")"
            this.byId("totalNumber").setText(totalNumber);

        },
        onSearch: function () {
            let BpName = this.byId("BpName").getTokens();
            let BpCompanyCode = this.byId("BpCompanyCode").getTokens();
            let BpCategory = this.byId("BpCategory").getSelectedKey();
            let BpPostalCode = this.byId("BpPostalCode").getValue();
            let BpNation = this.byId("BpNation").getTokens();
            let BpCity = this.byId("BpCity").getValue();
            let BpRoadAddress = this.byId("BpRoadAddress").getValue();

            var aFilter = [];

            if (BpName) { 
                for(let item in BpName){
                    aFilter.push(new Filter("bp_name", FilterOperator.Contains, BpName[item].mProperties.key)) 
            }}
            if (BpCompanyCode) { 
                for(let item in BpCompanyCode){
                    aFilter.push(new Filter("bp_company_code", FilterOperator.Contains, BpCompanyCode[item].mProperties.key)) 
            }}
            if (BpCategory) { aFilter.push(new Filter("bp_category", FilterOperator.Contains, BpCategory)) }
            if (BpPostalCode) { aFilter.push(new Filter("bp_postal_code", FilterOperator.Contains, BpPostalCode)) }
            if (BpNation) { 
                for(let item in BpNation){
                    aFilter.push(new Filter("bp_nation", FilterOperator.Contains, BpNation[item].mProperties.key)) 
            }}
            if (BpCity) { aFilter.push(new Filter("bp_city", FilterOperator.Contains, BpCity)) }
            if (BpRoadAddress) { aFilter.push(new Filter("bp_road_address", FilterOperator.Contains, BpRoadAddress)) }

            let oTable = this.byId("CustomerListTable").getBinding("rows")

            oTable = oTable.filter(aFilter);
            //console.log(oTable);
            totalNumber = oTable.aIndices.length;
            totalNumber = "고객 (" + totalNumber + ")"
            this.byId("totalNumber").setText(totalNumber);

        },
        onClearField: function () {
            this.byId("BpName").removeAllTokens();
            this.byId("BpCompanyCode").removeAllTokens();
            this.byId("BpCategory").setSelectedKey("");
            this.byId("BpPostalCode").setValue("");
            this.byId("BpNation").removeAllTokens();
            this.byId("BpCity").setValue("");
            this.byId("BpRoadAddress").setValue("");

            this.onDataView();
        },
        onBack: function () {
            this.getOwnerComponent().getRouter().navTo("Home")
        },
        toCustomerDetail: function (dEvent) {
            const oView = this.getView();
            const oControl = dEvent.getSource(), // 이벤트를 누른 주체 컨트롤 (> 네비게이션 컨트롤)
                oParent = oControl.getParent(), // 먼진모르지만 위에 하나 감싸져있었음
                oRowControl = oParent.getParent(), // Row 컨트롤
                oBindingContext = oRowControl.getBindingContext('BpCustomerModel'), // row컨트롤에 바인딩되어있는 모델 컨텍스트
                sPath = oBindingContext.getPath(); // 모델컨텍스트에 있는 경로
            //console.log(oBindingContext);
            const oModel = oView.getModel('BpCustomerModel'),
                oData = oModel.getProperty(sPath).bp_number;
            selectedNum = oData;
            // console.log(selectedNum);
            this.getOwnerComponent().getRouter().navTo("CustomerDetail", { num: selectedNum });
        },

        onDataExport: function () {
            let aCols, oRowBinding, tableIndices, oSettings, oSheet, oTable;

            oTable = this.byId('CustomerListTable');    // 테이블 
            oRowBinding = oTable.getBinding('rows');    // 테이블 전체 데이터
            tableIndices = oRowBinding.aIndices;        // 조건에 의해 필터링된 데이터의 테이블 Index
            console.log(oRowBinding);

            let oList = []; // 데이터 담을 배열 생성

            var selectedIndex = this.byId("CustomerListTable").getSelectedIndices();    // 멀티토글에서 체크한 열의 테이블 데이터

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

			for(let i = 0; i < oList.length; i++){
				if(oList[i].bp_nation === 'KR'){
					oList[i].bp_nation2 = "한국";
				}
				if(oList[i].bp_nation === 'CN'){
					oList[i].bp_nation2 = "중국";
				}
				if(oList[i].bp_nation === 'DE'){
					oList[i].bp_nation2 = "독일";
				}
				if(oList[i].bp_nation === 'DK'){
					oList[i].bp_nation2 = "덴마크";
				}
				if(oList[i].bp_nation === 'HK'){
					oList[i].bp_nation2 = "홍콩 특별 행정구";
				}
				if(oList[i].bp_nation === 'JP'){
					oList[i].bp_nation2 = "일본";
				}
				if(oList[i].bp_nation === 'NL'){
					oList[i].bp_nation2 = "네덜란드";
				}
				if(oList[i].bp_nation === 'SG'){
					oList[i].bp_nation2 = "싱가포르";
				}
				if(oList[i].bp_nation === 'TW'){
					oList[i].bp_nation2 = "대만";
				}
				if(oList[i].bp_nation === 'US'){
					oList[i].bp_nation2 = "미국";
				}
				if(oList[i].bp_nation === 'BG'){
					oList[i].bp_nation2 = "벨기에";
				}

			}

            oSettings = {
                workbook: {
                    columns: aCols,
                    hierarchyLevel: 'Level'
                },
                dataSource: oList,
                fileName: 'CustomerListTable.xlsx',
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
                label: 'BP명',
                property: 'bp_name',
                type: EdmType.String
            });
            aCols.push({
                label: '회사 코드',
                property: 'bp_company_code',
                type: EdmType.String
            });
            aCols.push({
                label: 'BP범주',
                property: 'bp_category',
                type: EdmType.String
            });
            aCols.push({
                label: '우편번호',
                property: 'bp_postal_code',
                type: EdmType.String
            });
            aCols.push({
                label: '국가/지역',
                property: 'bp_nation2',
                type: EdmType.String,
				
            });
            aCols.push({
                label: '도시',
                property: 'bp_city',
                type: EdmType.String
            });
            aCols.push({
                label: '도로 주소',
                property: 'bp_road_address',
                type: EdmType.String
            });
            return aCols;
        },

        toCreatePersonCustomer: function () {
            this.getOwnerComponent().getRouter().navTo("CreateCustomer", { bpCategory: "1" });
        },
        toCreateOrganizationCustomer: function () {
            this.getOwnerComponent().getRouter().navTo("CreateCustomer", { bpCategory: "2" });
        },

		onValueHelpBpList: function(oEvent) {
            this.pWhitespaceDialog = null;
			this._oBasicSearchField = null;
			this.oWhitespaceDialog = null;
			var oModel = this.getView().getModel('BpCustomerModel');

			var oBPNumTemplate = new Text({ text: { path: 'BpCustomerModel>bp_number' }, renderWhitespace: true });
			var oCoCdTemplate = new Text({ text: { path: 'BpCustomerModel>bp_company_code' }, renderWhitespace: true });
			var oBPNameTemplate = new Text({ text: { path: 'BpCustomerModel>bp_name' }, renderWhitespace: true });
			this._oBasicSearchField = new SearchField({
				search: function () {
					this.oWhitespaceDialog.getFilterBar().search();
				}.bind(this)
			});

			this.pWhitespaceDialog = this.loadFragment({
				name: "project3.view.fragment.InputBPList"
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
					label: "BP",
					key: "BpCustomerModel>bp_name"
				}]);

				// Set Basic Search for FilterBar
				oFilterBar.setFilterBarExpanded(false);
				oFilterBar.setBasicSearch(this._oBasicSearchField);

				oWhitespaceDialog.getTableAsync().then(function (oTable) {
					oTable.setModel(oModel);

					// For Desktop and tabled the default table is sap.ui.table.Table
					if (oTable.bindRows) {
						oTable.addColumn(new UIColumn({ label: "BP", template: oBPNumTemplate, width : "20%" }));
						oTable.addColumn(new UIColumn({ label: "회사코드", template: oCoCdTemplate, width : "15%" }));
						oTable.addColumn(new UIColumn({ label: "회사명", template: oBPNameTemplate }));
						oTable.bindAggregation("rows", {
							path: "BpCustomerModel>/",
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

		onValueHelpCoCdList: function(oEvent) {
			this.pWhitespaceDialog = null;
			this._oBasicSearchField = null;
			this.oWhitespaceDialog = null;
			var oModel = this.getView().getModel('BpCoCdModel');

			var oCoCdTemplate = new Text({ text: { path: 'BpCustomerModel>bp_company_code' }, renderWhitespace: true });
			var oBPNameTemplate = new Text({ text: { path: 'BpCustomerModel>bp_name' }, renderWhitespace: true });
			this._oBasicSearchField = new SearchField({
				search: function () {
					this.oWhitespaceDialog.getFilterBar().search();
				}.bind(this)
			});

			this.pWhitespaceDialog = this.loadFragment({
				name: "project3.view.fragment.InputCoCdList"
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
					label: "BP",
					key: "BpCustomerModel>bp_company_code"
				}]);

				// Set Basic Search for FilterBar
				oFilterBar.setFilterBarExpanded(false);
				oFilterBar.setBasicSearch(this._oBasicSearchField);

				oWhitespaceDialog.getTableAsync().then(function (oTable) {
					oTable.setModel(oModel);

					// For Desktop and tabled the default table is sap.ui.table.Table
					if (oTable.bindRows) {
						oTable.addColumn(new UIColumn({ label: "회사코드", template: oCoCdTemplate, width : "15%" }));
						oTable.addColumn(new UIColumn({ label: "회사명", template: oBPNameTemplate }));
						oTable.bindAggregation("rows", {
							path: "BpCustomerModel>/",
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

		onValueHelpCountryList: function(oEvent) {
			this.pWhitespaceDialog = null;
			this._oBasicSearchField = null;
			this.oWhitespaceDialog = null;
			var oModel = this.getView().getModel('BpNationModel');

			var oNationCodeTemplate = new Text({ text: { path: 'BpNationModel>bp_nation_code' }, renderWhitespace: true });
			var oNationTemplate = new Text({ text: { path: 'BpNationModel>bp_nation' }, renderWhitespace: true });
			this._oBasicSearchField = new SearchField({
				search: function () {
					this.oWhitespaceDialog.getFilterBar().search();
				}.bind(this)
			});

			this.pWhitespaceDialog = this.loadFragment({
				name: "project3.view.fragment.InputCountryList"
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
					label: "국가코드",
					key: "BpNationModel>bp_nation_code"
				}]);

				// Set Basic Search for FilterBar
				oFilterBar.setFilterBarExpanded(false);
				oFilterBar.setBasicSearch(this._oBasicSearchField);

				oWhitespaceDialog.getTableAsync().then(function (oTable) {
					oTable.setModel(oModel);

					// For Desktop and tabled the default table is sap.ui.table.Table
					if (oTable.bindRows) {
						oTable.addColumn(new UIColumn({ label: "국가코드", template: oNationCodeTemplate, width : "15%" }));
						oTable.addColumn(new UIColumn({ label: "국가/지역 이름", template: oNationTemplate }));
						oTable.bindAggregation("rows", {
							path: "BpNationModel>/",
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

		onBPSelectCancelPress: function() {
            this.oWhitespaceDialog.close();

		},
		onCoCdSelectCancelPress: function() {
            this.oWhitespaceDialog.close();

		},
		onCountrySelectCancelPress: function() {
            this.oWhitespaceDialog.close();

		},

		onBPSelectOkPress: function(oEvent) {
            var aTokens = oEvent.getParameter("tokens");
			var BpName = this.byId("BpName");
			var arr=[];
			aTokens.forEach(function (oToken) {
				// console.log(oToken.getKey());
				oToken.mProperties.text = oToken.getKey().toString()
				arr.push(oToken);
            }.bind(this));
            BpName.setTokens(arr);
            this.oWhitespaceDialog.close();

			this.oWhitespaceDialog.close();

		},
		onCountrySelectOkPress: function(oEvent) {
            var aTokens = oEvent.getParameter("tokens");
			var BpNation = this.byId("BpNation");
			var arr=[];
			aTokens.forEach(function (oToken) {
				// console.log(oToken.getKey());
				oToken.mProperties.text = oToken.getKey().toString()
				arr.push(oToken);
            }.bind(this));
            BpNation.setTokens(arr);
            this.oWhitespaceDialog.close();

		},
		onCoCdSelectOkPress: function(oEvent) {
            var aTokens = oEvent.getParameter("tokens");
			var BpCompanyCode = this.byId("BpCompanyCode");
			var arr=[];
			aTokens.forEach(function (oToken) {
				// console.log(oToken.getKey());
				oToken.mProperties.text = oToken.getKey().toString()
                arr.push(oToken);
            }.bind(this));
            BpCompanyCode.setTokens(arr);
            this.oWhitespaceDialog.close();

		},

		onBPSelectSearch: function() {
            let BPSearchInput = this._oBasicSearchField.getValue();
			var aFilter = [];

			if (BPSearchInput) {
				aFilter = new Filter({
					filters: [
						new Filter("bp_number", FilterOperator.Contains, BPSearchInput),
						new Filter("bp_company_code", FilterOperator.Contains, BPSearchInput),
						new Filter("bp_name", FilterOperator.Contains, BPSearchInput),
					],
					and: false
				});
			}
			this._filterTable(aFilter);

		},

		onCountrySelectSearch: function() {
            let CountrySearchInput = this._oBasicSearchField.getValue();
			var aFilter = [];

			if (CountrySearchInput) {
				aFilter = new Filter({
					filters: [
						new Filter("bp_nation_code", FilterOperator.Contains, CountrySearchInput),
						new Filter("bp_nation", FilterOperator.Contains, CountrySearchInput)
					],
					and: false
				});
			}
			this._filterTable(aFilter);

		},

		onCoCdSelectSearch: function() {
            let CoCdSearchInput = this._oBasicSearchField.getValue();
			var aFilter = [];

			if (CoCdSearchInput) {
				aFilter = new Filter({
					filters: [
						new Filter("bp_company_code", FilterOperator.Contains, CoCdSearchInput),
						new Filter("bp_name", FilterOperator.Contains, CoCdSearchInput)
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

    });
});