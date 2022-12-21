sap.ui.define([
	"sap/ui/core/mvc/Controller", 
	"sap/ui/model/json/JSONModel", 
	"sap/m/MessageBox",
	"sap/ui/model/Filter",
    "sap/ui/model/FilterOperator", 
	"sap/ui/model/Sorter", 
	"sap/ui/core/Fragment",
	'sap/m/SearchField',
	'sap/ui/table/Column',
	'sap/m/Text'


], function(
	Controller, JSONModel, MessageBox, Filter, FilterOperator, Sorter, Fragment, SearchField, UIColumn, Text
) {
	"use strict";
	let temp = [];
	let Today;

	return Controller.extend("project2.controller.CreateGLAccount", {
		onInit: function () {

			this._initModel();

			const myRoute = this.getOwnerComponent().getRouter().getRoute("CreateGLAccount");
			myRoute.attachPatternMatched(this.onMyRoutePatternMatched, this);
		},

		_initModel: function() {
			// JSONModel - two-way binding model <-> view 
			this.getView().setModel(new JSONModel(
				{
					table: []
				}
			), 'copyCoCdDataModel');
			
			// this.oCopyDataModel = this.getView().getModel('copyCoCdDataModel');
		},

		onMyRoutePatternMatched : function(oEvent) {
			this.onDataView();
			this.onReset();

			let now = new Date();
			Today = now.getFullYear() + "." +(now.getMonth()+1).toString().padStart(2,'0')+"."+now.getDate().toString().padStart(2, '0');
			
		},
		onDataView: async function () {
			const GLSelectCoA = await $.ajax({
				type: "get",
				url: "/gl/SelectCoA"
			});


			let cocdUrl = `/cocd/CoCd`;
            const CoCdData = await $.ajax({
                type : "get",
                url : cocdUrl
            })
            //console.log(CoCdData);

            let CoCdDataModel = new JSONModel(CoCdData.value);
            this.getView().setModel(CoCdDataModel, "CoCdDataModel");

			let SelectCoAModel = new JSONModel(GLSelectCoA.value);
			this.getView().setModel(SelectCoAModel, "SelectCoAModel");
			


		},
		toBack: function() {
			this.onReset();
			this.getOwnerComponent().getRouter().navTo("GLAccountList");
		},
		
		onCreate : async function(){
			var check = await this.validate("operating");
			var check2 = await this.validate("content");
			if(check===true||check2===true){
				return;
			}
			
			else {
				let temp = new JSONModel(this.temp).oData;
				// temp.gl_acct = this.byId("GLAcct").getText();
				temp.gl_coa = this.byId("CoA").getValue();
				temp.gl_acct_type = this.byId("GLAcctType").getSelectedKey();
				temp.gl_acct_group = this.byId("GLGroup").getValue();
				temp.gl_ps_acct_type = this.byId("GLPLAcctType").getSelectedKey();
				temp.gl_func_area = this.byId("FuncArea").getSelectedKey();
				temp.gl_acct_content = this.byId("GLAcctContent").getValue();
				temp.gl_acct_descript = this.byId("GLAccDesc").getValue();
				temp.gl_created = Today;
				
				// 그룹별 +1 코드 시작 
				const acctGroup = await $.ajax({
					type:"GET",
					url: "/gl/GL?$filter=gl_acct_group eq '" + temp.gl_acct_group + "'&$orderby=gl_acct desc&$top=1" 
				}); 

				let acctGrpModel = new JSONModel(acctGroup.value);
				this.getView().setModel(acctGrpModel,"acctGrpModel");
				let oModel = this.getView().getModel("acctGrpModel");
				let oData = oModel.oData;
				let oGlAcct = parseInt(oData[0].gl_acct);
				// console.log(oData);
				// console.log(oGlAcct);

				temp.gl_acct = String(oGlAcct + 1); 
				// console.log(temp.gl_acct);
				
				await $.ajax({
					type:"POST",
					url:"/gl/GL",
					contentType:"application/json;IEEE754Compatible=true",
					data:JSON.stringify(temp)
				})
			}

            let isError = this.onErrorMessageBoxPress();
            if(isError === false){
                return;
            } else {
                temp = new JSONModel(this.temp).oData;
                temp.gl_acct = this.byId("GLAcct").getText();
                temp.gl_coa = this.byId("CoA").getValue();
                temp.gl_acct_type = this.byId("GLAcctType").getSelectedKey();
                temp.gl_acct_group = this.byId("GLGroup").getValue();
                temp.gl_ps_acct_type = this.byId("GLPLAcctType").getSelectedKey();
                temp.gl_func_area = this.byId("FuncArea").getSelectedKey();
                temp.gl_acct_content = this.byId("GLAcctContent").getValue();
                temp.gl_acct_descript = this.byId("GLAccDesc").getValue();
                temp.gl_created = Today;

                await $.ajax({
                    type:"POST",
                    url:"/gl/GL",
                    contentType:"application/json;IEEE754Compatible=true",
                    data:JSON.stringify(temp)
                })
            }

		},
		validate:function(formid){
			var check=false;
			var content = this.byId(formid).getContent()
            for (var i = 0; i < content.length; i++) {
                var item = content[i].mAggregations.items
                for (var j = 0; j < item.length; j++) {
                    var element_type = item[j].getMetadata().getName().split('.')[2];
                    if (element_type == 'Input'|| element_type=='DatePicker'||element_type == 'ComboBox') {
                        item[j].setValueState("None");
                        item[j].setValueStateText(null);
                        if (item[j].mProperties.required == true) {
                            var element_value = item[j].mProperties.value;
                            if(element_value ==''||element_value==null||element_value==undefined){
								check=true;
                                item[j].setValueState("Error");
                                item[j].setValueStateText("필수 값을 입력해주세요.");
                            }
                        }
                    }
                }
            }
			if(check===true){
				MessageBox.error("필수항목을 입력해주세요.");
			}
			return check;
		
            this.onReset();
            this.toBack();

        },

		onReset : function(){
			this.byId("CoA").setValue("");
			this.byId("GLAcctType").setSelectedKey("");
			this.byId("GLGroup").setValue("");
			this.byId("GLPLAcctType").setSelectedKey("");
			this.byId("FuncArea").setSelectedKey("");
			this.byId("GLAcctContent").setValue("");
			this.byId("GLAccDesc").setValue("");

		},

		onSelectCoA: function() {
			if(!this.pDialog){
				this.pDialog = this.loadFragment({
					name:"project2.view.fragment.CreateInputCoA"
				});
			}
			this.pDialog.then(function(oDialog){
				oDialog.open();
			});      
		},

		onSelectGLGrp: function() {
			if(!this.pDialog){
				this.pDialog = this.loadFragment({
					name:"project2.view.fragment.CreateInputGLGrp"
				});
			}
			this.pDialog.then(function(oDialog){
				oDialog.open();
			});
		},

		onSearchCoADialog: function() {
			var SearchInputCoA = this.byId("SearchInputCoA").getValue();
			var aFilter = [];

			if (SearchInputCoA) {
				aFilter = new Filter({
					filters: [
						new Filter("gl_coa", FilterOperator.Contains, SearchInputCoA),
						new Filter("gl_coa_content", FilterOperator.Contains, SearchInputCoA)
					],
					and: false
				});
			}

			let oTable = this.byId("CoASelectTable").getBinding("rows"); 
            oTable.filter(aFilter);
		},

		onSearchCoAReset: function() {
			this.byId("SearchInputCoA").setValue("");
			this.onSearchCoADialog();
		},

		onCloseCoADialog: function() {
			this.byId("CoADialog").destroy();
			this.pDialog = null;
		},
		onCloseGLGrpDialog: function() {
			this.byId("GLGrpDialog").destroy();
			this.pDialog = null;
		},

		onSearchGrpDialog: function() {
			var SearchInputGLGrp = this.byId("SearchInputGLGrp").getValue();
			var aFilter = [];

			if (SearchInputGLGrp) {
				aFilter = new Filter({
					filters: [
						new Filter("GLAcctGrp", FilterOperator.Contains, SearchInputGLGrp),
						new Filter("GLAcctGrpContent", FilterOperator.Contains, SearchInputGLGrp),
					],
					and: false
				});
			}

			let oTable = this.byId("GLGrpSelectTable").getBinding("rows");
            oTable.filter(aFilter);

		},

		onSearchGrpReset: function() {
			this.byId("SearchInputGLGrp").setValue("");
			this.onSearchGrpDialog();

		},

		getGLGrpContext: async function(oEvent) {
			let rowIndex = oEvent.getParameters().rowIndex;
			this.byId("GLGroup").setValue(oEvent.getParameters().rowBindingContext.oModel.oData.GLAcctGroupList[rowIndex].GLAcctGrp); 
			
			temp.gl_acct = this.byId("GLGroup").setValue(oEvent.getParameters().rowBindingContext.oModel.oData.GLAcctGroupList[rowIndex].GLAcctGrp)._lastValue; 

            // 그룹별 +1 코드 시작 
            const acctGroup = await $.ajax({
                type:"GET",
                url: "/gl/GL?$filter=gl_acct_group eq '" + temp.gl_acct + "'&$orderby=gl_acct desc&$top=1" 
            }); 

            let acctGrpModel = new JSONModel(acctGroup.value);
            this.getView().setModel(acctGrpModel,"acctGrpModel");
            let oModel = this.getView().getModel("acctGrpModel");
            let oData = oModel.oData;
            let oGlAcct = parseInt(oData[0].gl_acct);
            //console.log(oData);
            //console.log(oGlAcct);

            temp.gl_acct = String(oGlAcct + 1); 
            console.log(temp.gl_acct);

            this.byId("GLAcct").setText(temp.gl_acct);
			
			this.onCloseGLGrpDialog();

		},

		getCoAContext: function(oEvent) {
			let rowIndex = oEvent.getParameters().rowIndex;
			this.byId("CoA").setValue(oEvent.getParameters().rowBindingContext.oModel.oData[rowIndex].gl_coa); 
			this.onCloseCoADialog();
		},

		onExpandCoCd: function(oEvent) {
			this.pWhitespaceDialog = null;
            this._oBasicSearchField = null;
            this.oWhitespaceDialog = null;
            var oModel = this.getView().getModel('CoCdDataModel');
			//console.log(oModel);

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
                oData = oModel.getProperty('/table'),
                oValueRequestData = oValueRequestModel.getProperty('/');
            
            var aTokens = oEvent.getParameter("tokens");
            //console.log(aTokens);
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

                    oModel.setProperty('/table', oData);
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
            //console.log(CoCdSearchInput);
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

		changeSelectGLType: function(oEvent) {
			let oPLSelect = this.byId("GLPLAcctType");
			let selectedGLType = this.byId("GLAcctType").getSelectedKey();
			if(selectedGLType === 'X' || selectedGLType === 'C'){
				oPLSelect.setSelectedKey("");
				oPLSelect.setEditable(false);

			} else {
				oPLSelect.setEditable(true);

			}
		},

	});
});