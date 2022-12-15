sap.ui.define([
	"sap/ui/core/mvc/Controller", 
    "sap/ui/model/json/JSONModel",
	'sap/ui/model/type/String',
	'sap/m/ColumnListItem',
	'sap/m/Label',
	'sap/m/SearchField',
	'sap/m/Token',
	'sap/ui/model/Filter',
	'sap/ui/model/FilterOperator',
	'sap/ui/table/Column',
	'sap/m/Column',
	'sap/m/Text'

], function(
	Controller, JSONModel, TypeString, ColumnListItem, Label, SearchField, 
    Token, Filter, FilterOperator, UIColumn, MColumn, Text
) {
	"use strict";
    let SelectedItem;
	return Controller.extend("project2.controller.GLAccountDetail", {
        onInit(){
            let editModel = new JSONModel({editable : false});
            this.getView().setModel(editModel, "editModel");
            // 나중에 지울 데이터 
            this.getView().setModel(new JSONModel([
                {
                    com_address: "중구",
                    com_city: "서울",
                    com_co_area: "CN01",
                    com_coa: "CAKR",
                    com_code: "2022",
                    com_code_name: "희리삼성전자",
                    com_country: "대한민국",
                    com_currency: "KRW",
                    com_fiscal_year: "2022",
                    com_language: "KR",
                    com_vat_registration : "446-87-00478",
                },
                {
                    com_address: "중구",
                    com_city: "서울",
                    com_co_area: "CN01",
                    com_coa: "CAKR",
                    com_code: "2023",
                    com_code_name: "희리LG전자",
                    com_country: "대한민국",
                    com_currency: "KRW",
                    com_fiscal_year: "2022",
                    com_language: "KR",
                    com_vat_registration : "446-87-00478",
                },
                {
                    com_address: "중구",
                    com_city: "서울",
                    com_co_area: "CN01",
                    com_coa: "CAKR",
                    com_code: "2024",
                    com_code_name: "희리SK전자",
                    com_country: "대한민국",
                    com_currency: "KRW",
                    com_fiscal_year: "2022",
                    com_language: "KR",
                    com_vat_registration : "446-87-00478",
                }
            ]), 'copyCoCdDataModel');

            this.getOwnerComponent().getRouter().getRoute("GLAccountDetail").attachPatternMatched(this.onMyRoutePatternMatched, this);
        },
        onMyRoutePatternMatched : async function(oEvent){
            SelectedItem = oEvent.getParameter("arguments").num;

            let url = "/gl/GL/" + SelectedItem;
            const GLData = await $.ajax({
                type : "get",
                url : url
            })
            let GLDataModel = new JSONModel(GLData);
            this.getView().setModel(GLDataModel, "GLDataModel");

            let cocdUrl = `/cocd/CoCd`;
            const CoCdData = await $.ajax({
                type : "get",
                url : cocdUrl
            })
            console.log(CoCdData);
            let CoCdDataModel = new JSONModel(CoCdData.value);
            this.getView().setModel(CoCdDataModel, "CoCdDataModel");

        },
        toBack : function(){
            this.getView().getModel("editModel").setProperty("/editable", false);
            this.getOwnerComponent().getRouter().navTo("GLAccountList");

        },

		onEdit: function() {
			this.getView().getModel("editModel").setProperty("/editable", true);

            let TextGLAccType = this.byId("TextGLAccType").getText();
            this.byId("InputGLAccType").setValue(TextGLAccType);

            let TextGLGroup = this.byId("TextGLGroup").getText();
            this.byId("InputGLGroup").setValue(TextGLGroup);

            let TextFuncArea = this.byId("TextFuncArea").getText();
            this.byId("InputFuncArea").setValue(TextFuncArea);

            let TextCoAContent = this.byId("TextCoAContent").getText();
            this.byId("InputCoAContent").setValue(TextCoAContent);
            
            let TextGLAccDesc = this.byId("TextGLAccDesc").getText();
            this.byId("InputGLAccDesc").setValue(TextGLAccDesc);
		},

		onExpandCoCd: function(oEvent) {
            this.pWhitespaceDialog = null;
            this._oBasicSearchField = null;
            this.oWhitespaceDialog = null;
            var oModel = this.getView().getModel('CoCdDataModel');

			var oCodeTemplate = new Text({text: {path: 'CoCdDataModel>com_code'}, renderWhitespace: true});
            var oCoCdNameTemplate = new Text({text: {path: 'CoCdDataModel>com_code_name'}, renderWhitespace: true});
			this._oBasicSearchField = new SearchField({
				search: function() {
					this.oWhitespaceDialog.getFilterBar().search();
				}.bind(this)
			});
			
				this.pWhitespaceDialog = this.loadFragment({
					name: "project2.view.fragment.ExpandCoCdInGLAcct"
				});
			
			this.pWhitespaceDialog.then(function(oWhitespaceDialog) {
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
					label: "회사코드",
					key: "CoCdDataModel>com_code"
				}]);

				// Set Basic Search for FilterBar
				oFilterBar.setFilterBarExpanded(false);
				oFilterBar.setBasicSearch(this._oBasicSearchField);

				oWhitespaceDialog.getTableAsync().then(function (oTable) {
					oTable.setModel(oModel);

					// For Desktop and tabled the default table is sap.ui.table.Table
					if (oTable.bindRows) {
						oTable.addColumn(new UIColumn({label: "회사코드", template: oCodeTemplate}));
						oTable.addColumn(new UIColumn({label: "회사이름", template: oCoCdNameTemplate}));
						oTable.bindAggregation("rows", {
							path: "CoCdDataModel>/",
							events: {
								dataReceived: function() {
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

        /**
         * valueHelpDialog 확인 버튼 클릭 이벤트
         */
        onWhitespaceOkPress: function(oEvent) {
            var oView = this.getView(),
                oModel = oView.getModel('copyCoCdDataModel'),
                oValueRequestModel = oView.getModel('CoCdDataModel'),
                oData = oModel.getProperty('/'),
                oValueRequestData = oValueRequestModel.getProperty('/');
            
            var aTokens = oEvent.getParameter("tokens");
            console.log(aTokens);
            if(aTokens.length > 5) {
                return sap.m.MessageBox.warning('5개만 선택하세요!');
            }

			aTokens.forEach(function (oToken) {
				var aFilter = oData.filter(
                    (oFilter) => { 
                        return oFilter.com_code === oToken.getKey(); }
                );

                if(!aFilter.length) {
                    var aFindFilter = oValueRequestData.filter((filter) => {
                        return filter.com_code === oToken.getKey();
                    });

                    oData.push(aFindFilter[0]);

                    oModel.setProperty('/', oData);
                }
                
			}.bind(this));
			this.oWhitespaceDialog.close();

        },

        /**
         * valueHelpDialog 취소 버튼 클릭 이벤트
         */
        onWhitespaceCancelPress: function() {
            this.oWhitespaceDialog.close();

        },

		onCoCdSelectSearch: function() {
			let CoCdSearchInput = this._oBasicSearchField.getValue();
            console.log(CoCdSearchInput);
            var aFilter = [];

            if(CoCdSearchInput) {
                aFilter = new Filter({
                    filters: [
                        new Filter("com_code", FilterOperator.Contains, CoCdSearchInput),
                        new Filter("com_code_name", FilterOperator.Contains, CoCdSearchInput)
                    ],
                    and: false
                });
            }
            this._filterTable(aFilter); 
x
		},
 
        /**
         * Dialog 사용할때 그안에있는 테이블 필터용 함수
         * @param {object}
         */
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

		// onRowSelectionChange: function(oEvent) {
        //     const oRowContext = oEvent.getParameter('rowContext'),
        //           oModel = oRowContext.getModel(),
        //           sPath = oRowContext.getPath(),
        //           oData = oModel.getProperty(sPath);

        //     const oMultiInput = this.byId('SelectedCoCdInput');
        //     let aGetToken = oMultiInput.getTokens();

        //     if(aGetToken.length) {
        //         aGetToken.forEach((oToken) => {
        //             if(oToken.getKey() === oData.com_code){
        //                 // 삭제
        //                 oMultiInput.removeToken(1);
        //             } else {
        //                 // 추가    
        //                 let oToken = new Token(
        //                     {
        //                         key: oData.com_code,
        //                         text: oData.com_code
        //                     }
        //                 );
    
        //                 oMultiInput.addToken(oToken);
                        
        //             }
        //         });
        //     } else {
        //         // 추가    
        //         let oToken = new Token(
        //             {
        //                 key: oData.com_code,
        //                 text: oData.com_code
        //             }
        //         );

        //         oMultiInput.addToken(oToken);                
        //     }
		// },

		// onFilterBarSearch: function(oEvent) {
        //     var sSearchQuery = this._oBasicSearchField.getValue(),
        //     aSelectionSet = oEvent.getParameter("selectionSet");

        //     var aFilters = aSelectionSet.reduce(function (aResult, oControl) {
        //         if (oControl.getValue()) {
        //             aResult.push(new Filter({
        //                 path: oControl.getName(),
        //                 operator: FilterOperator.Contains,
        //                 value1: oControl.getValue()
        //             }));
        //         }

        //         return aResult;
        //     }, []);

        //     aFilters.push(new Filter({
        //         filters: [
        //             new Filter({ path: "ProductCode", operator: FilterOperator.Contains, value1: sSearchQuery }),
        //             new Filter({ path: "ProductName", operator: FilterOperator.Contains, value1: sSearchQuery })
        //         ],
        //         and: false
        //     }));

        //     this._filterTable(new Filter({
        //         filters: aFilters,
        //         and: true
        //     }));
		// }
	});
});