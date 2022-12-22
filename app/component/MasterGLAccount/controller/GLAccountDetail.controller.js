sap.ui.define([
	"sap/ui/core/mvc/Controller", 
    "../model/formatter",
    "sap/ui/model/json/JSONModel",
	'sap/ui/model/type/String',
	'sap/m/ColumnListItem',
	'sap/m/Label',
	'sap/m/SearchField',
	'sap/m/Token',
	'sap/ui/model/Filter',
	'sap/ui/model/FilterOperator',
	'sap/ui/table/Column',
	'sap/m/Text',
    'sap/ui/core/Icon',
    'sap/ui/model/BindingMode'

], function(
	Controller,
    formatter,
	JSONModel,
	String,
	ColumnListItem,
	Label,
	SearchField,
	Token,
	Filter,
	FilterOperator,
	UIColumn,
	Text,
	Icon,
    BindingMode
) {
	"use strict";
    let SelectedItem;
    let TextGLAccDesc=null;
	return Controller.extend("project2.controller.GLAccountDetail", {
        formatter:formatter,
        onInit: function(){
            console.log()
            let editModel = new JSONModel({editable : false});
            this.getView().setModel(editModel, "editModel");
            this.getView().setModel(new JSONModel({}), 'historyModel');

            let blockModel = new JSONModel({isBlock:false});
            //blockModel.setDefaultBindingMode(BindingMode.OneWay);
            this.getView().setModel(blockModel, "blockModel");

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
            console.log("onMyRoutePatternMatched");
            SelectedItem = oEvent.getParameter("arguments").num;

            let url = "/gl/GL/" + SelectedItem;
            const GLData = await $.ajax({
                type : "get",
                url : url
            })
            let GLDataModel = new JSONModel(GLData);
            GLDataModel.setDefaultBindingMode(BindingMode.OneWay);
            this.getView().setModel(GLDataModel, "GLDataModel");

            // this.setGlBlockedL(GLDataModel);
            this.onReconAcctFilter(GLDataModel);

            let cocdUrl = `/cocd/CoCd`;
            const CoCdData = await $.ajax({
                type : "get",
                url : cocdUrl
            })
            let CoCdDataModel = new JSONModel(CoCdData.value);
            CoCdDataModel.setDefaultBindingMode(BindingMode.OneWay);
            this.getView().setModel(CoCdDataModel, "CoCdDataModel");


        },
        /**
         * G/L 차단 제어
         * @param {JSONModel}
         */
        // setGlBlockedL: function(oData){

        //     if(!oData.getData().gl_blocked){//락->보통 경우 : true->false
        //         this.byId("glBlocked").setIcon(new sap.ui.core.Icon({src:"sap-icon://locked"}).getSrc());
        //         this.byId("glBlocked").getCustomData()[0].setProperty('value',"false");
        //         this.byId("pageSection1").setVisible(true);
        //         this.byId("pageSection2").setVisible(true);
        //         //this.getView().getModel("blockModel").oData.isBlock=false;
        //         //this.getView().setModel(new JSONModel({isBlock:false}),"blockModel");
                
        //     }else{//보통->락 건 경우 false->true
        //         this.byId("glBlocked").setIcon(new sap.ui.core.Icon({src:"sap-icon://unlocked"}).getSrc());
        //         this.byId("glBlocked").getCustomData()[0].setProperty('value',"true");
        //         this.byId("pageSection1").setVisible(false);
        //         this.byId("pageSection2").setVisible(false);
        //         //this.getView().getModel("blockModel").oData.isBlock=true;
        //         this.getView().setModel(new JSONModel({isBlock:true}),"blockModel");
        //     }
        //     console.log("setGlBlockedL");
        //     console.log(this.getView().byId("glBlocked").getCustomData()[0].getProperty('value'));
        //     console.log(this.getView().getModel("blockModel"));

        // },
        onReconAcctFilter: function(oData){
            let reconAcct = oData.getData().gl_recon_account 

            if(reconAcct===null || reconAcct.length==0){
                this.byId("colGlReconAccount").setVisible(false);
            }else{
                this.byId("colGlReconAccount").setVisible(true);
            }
        },
        toBack : function(){
            this.getView().getModel("editModel").setProperty("/editable", false);
            this.getOwnerComponent().getRouter().navTo("GLAccountList");

        },
        //
        onLocked: function(){
            var state = JSON.parse(this.getView().byId("glBlocked").getCustomData()[0].getProperty('value'));
            console.log(state);
            var icon;

            this.getView().getModel('historyModel').setProperty('/icon', this.byId("glBlocked").getIcon());

            if(state){
                icon = "sap-icon://locked";
                //console.log("true 면 false로 바꿔주기 . : src 는 unlock->lock")
                this.byId("glBlocked").setIcon(new sap.ui.core.Icon({src: icon}).getSrc());
                this.byId("glBlocked").setText("잠금 해제");
                this.byId("glBlocked").setTooltip("잠금 해제");
            }else{
                icon = "sap-icon://unlocked";
                //console.log("false 면 true 바꿔주기 . : src 는 lock->unlock")
                this.byId("glBlocked").setIcon(new sap.ui.core.Icon({src: icon}).getSrc());
                this.byId("glBlocked").setText("잠금");
                this.byId("glBlocked").setTooltip("잠금");
            }
            this.byId("glBlocked").getCustomData()[0].setProperty('value',!state);
        },

		onEdit: function() {
            this.getView().getModel("editModel").setProperty("/editable", true);

            let TextGLAccType = this.getView().getModel("GLDataModel").getProperty("/gl_acct_type");
            this.getView().byId("InputGLAccType");
            this.getView().byId("InputGLAccType").setSelectedKey(TextGLAccType);

            let TextGLGroup = this.byId("TextGLGroup").getCustomData()[0].getProperty('value');
            this.byId("InputGLGroup").setSelectedKey(`${TextGLGroup}`);

            let TextPLAccType = this.byId("TextPLAccType").getCustomData()[0].getProperty('value');
            this.byId("InputPLAccType").setSelectedKey(`${TextPLAccType}`);           

            let TextFuncArea = this.byId("TextFuncArea").getCustomData()[0].getProperty('value');

            this.byId("InputFuncArea").setSelectedKey(TextFuncArea);
            
            let TextCoAContent = this.byId("TextCoAContent").getText();
            //this.byId("InputCoAContent").setSelectedKey(TextCoAContent);
            
            TextGLAccDesc = this.byId("TextGLAccDesc").getText();
            if(TextGLAccDesc === "-"){
                this.byId("InputGLAccDesc").setValue("");
            } else{
                this.byId("InputGLAccDesc").setValue(TextGLAccDesc);
            }
		},

		onExpandCoCd: function(oEvent) {
            var oModel = this.getView().getModel('CoCdDataModel');

			var oCodeTemplate = new Text({text: '{CoCdDataModel>com_code}', renderWhitespace: true});
            var oCoCdNameTemplate = new Text({text: '{CoCdDataModel>com_code_name}', renderWhitespace: true});
			this._oBasicSearchField = new SearchField({
				search: function() {
					this.oExpandDialog.getFilterBar().search();
				}.bind(this)
			});
			
				this.pExpandDialog = this.loadFragment({
					name: "project2.view.fragment.ExpandCoCdInGLAcct"
				});
			
			this.pExpandDialog.then(function(oExpandDialog) {
				var oFilterBar = oExpandDialog.getFilterBar();
				this.oExpandDialog = oExpandDialog;
				if (this._bExpandDialogInitialized) {
					// Re-set the tokens from the input and update the table
					oExpandDialog.setTokens([]);
					oExpandDialog.update();

					oExpandDialog.open();
					// return;
				}
				this.getView().addDependent(oExpandDialog);

				// Set key fields for filtering in the Define Conditions Tab
				oExpandDialog.setRangeKeyFields([{
					label: "회사코드",
					key: "CoCdDataModel>com_code"
				}]);

				// Set Basic Search for FilterBar
				oFilterBar.setFilterBarExpanded(false);
				oFilterBar.setBasicSearch(this._oBasicSearchField);

				oExpandDialog.getTableAsync().then(function (oTable) {
					oTable.setModel(oModel);

					// For Desktop and tabled the default table is sap.ui.table.Table
					if (oTable.bindRows) {
						oTable.addColumn(new UIColumn({label: "회사코드", template: oCodeTemplate}));
						oTable.addColumn(new UIColumn({label: "회사이름", template: oCoCdNameTemplate}));
						oTable.bindAggregation("rows", {
							path: "CoCdDataModel>/",
							events: {
								dataReceived: function() {
									oExpandDialog.update();
								}
							}
						});
					}

					oExpandDialog.update();
				}.bind(this));

				this._bExpandDialogInitialized = true;
				oExpandDialog.open();
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
			this.oExpandDialog.close();

        },

        /**
         * valueHelpDialog 취소 버튼 클릭 이벤트
         */
        onWhitespaceCancelPress: function() {
            this.oExpandDialog.close();

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
		},


		changeSelectGLType: function(oEvent) {
            let oPLSelect = this.byId("InputPLAccType");
			let selectedGLType = this.byId("InputGLAccType").getSelectedKey();
			if(selectedGLType === 'X' || selectedGLType === 'C'){
				oPLSelect.setSelectedKey("");
				oPLSelect.setEditable(false);

			} else {
				oPLSelect.setEditable(true);

			}

		},
 
        /**
         * Dialog 사용할때 그안에있는 테이블 필터용 함수
         * @param {object}
         */
        _filterTable: function (oFilter) {
			var oValueHelpDialog = this.oExpandDialog;
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
        onAccept: async function(){
            let isBlock = this.byId("glBlocked").getCustomData()[0].getProperty('value');

            await(this.setPatchData(isBlock));
            
            //this.getView().getModel("blockModel").setProperty("/isBlock",isBlock);

            // this.byId("pageSection1").setVisible(!isBlock);
            // this.byId("pageSection2").setVisible(!isBlock);
            this.getView().getModel("editModel").setProperty("/editable", false);
            
            //console.log(this.getView().getModel("blockModel").getProperty("/isBlock"));
        },
        onCancel: function(){
            const oView = this.getView();
            oView.byId("TextGLAccDesc").setText(TextGLAccDesc);
            console.log(oView.byId("TextGLAccDesc").getText());
            let vis =  oView.getModel("GLDataModel").getProperty("/gl_blocked");
            var state = JSON.parse(this.getView().byId("glBlocked").getCustomData()[0].getProperty('value'));

            const oHistoryModel = oView.getModel('historyModel');
            let sSrc = oHistoryModel.getProperty('/icon'); 
            let oGlBlocked = this.byId("glBlocked");
            if(oGlBlocked.getIcon() !== sSrc) oGlBlocked.setIcon(new sap.ui.core.Icon({src: sSrc}).getSrc());

            // this.byId("pageSection1").setVisible(!vis);
            // this.byId("pageSection2").setVisible(!vis)

            /**
             * 취소 버튼을 누를 경우 lock true로 설정
             * 현재 정상적인 실행 X
             * @todo 취소 버튼 누를 시 lock 초기값으로 설정 필요
            */
            
            this.byId("glBlocked").getCustomData()[0].setProperty('value', true);

            if(vis === false){
                this.byId("glBlocked").getCustomData()[0].setProperty('value',true);
                // this.getView().getModel("GLDataModel").setProperty("/gl_blocked", true);
            }
            //this.getView().getModel("blockModel").setProperty("/isBlock", this.getView().getModel("GLDataModel").getProperty("/gl_blocked"));
			this.getView().getModel("editModel").setProperty("/editable", false);


        },
        //recon null인경우 에러 확인
        setPatchData: async function(isBlock){
            let temp = {
                "gl_acct_type" :this.getView().byId("InputGLAccType").getSelectedKey(),
                "gl_acct_group" : this.getView().byId("InputGLGroup").getSelectedKey(),
                "gl_func_area" : this.byId("InputFuncArea").getSelectedKey(),
                "gl_acct_descript" : this.byId("InputGLAccDesc").getValue(),
                "gl_ps_acct_type" : this.byId("InputPLAccType").getSelectedKey(),

                "gl_co_area":this.byId("glCoArea").getText(),
                "gl_company_code" :this.byId("glCompanyCode").getText(),
                "gl_corp_name":this.byId("glCorpName").getText(),
                "gl_acct_currency":this.byId("glAcctCurrency").getText(),
                "gl_recon_account":this.byId("glReconAccount").getText(),

                "gl_blocked" : JSON.parse(isBlock)
            }

            let url = "/gl/GL/" + SelectedItem;
            let glData = await $.ajax({
                type:'patch',
                url:url,
                contentType: "application/json;IEEE745Compatible=true",
                data: JSON.stringify(temp)
           });
           glData = new JSONModel(glData);
           this.getView().setModel(glData,"GLDataModel");
        }

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