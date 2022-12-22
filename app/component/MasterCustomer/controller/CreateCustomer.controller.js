sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageBox",
	"sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
], function (Controller,JSONModel,MessageBox, Filter,FilterOperator) {
    "use strict";
    let selectedBpCategory, Today;
    return Controller.extend("project3.controller.CreateCustomer", {
        onInit: async function () {
            var bpCategorymode={
                category:false
            }
            let bpCategoryModel = new JSONModel(bpCategorymode);
            this.getView().setModel(bpCategoryModel,"bpCategoryModel");

            this.getOwnerComponent().getRouter().getRoute("CreateCustomer").attachPatternMatched(this.onMyRoutePatternMatched,this)

        },

        onMyRoutePatternMatched : async function (oEvent) {
            this.onClearField();
            selectedBpCategory = oEvent.getParameter("arguments").bpCategory;
            //console.log(selectedBpCategory);
            
            if (selectedBpCategory == 1){
                this.getView().getModel("bpCategoryModel").setProperty("/category",false);
                this.byId("BpCategory").setText("개인");
            }else{
                this.getView().getModel("bpCategoryModel").setProperty("/category",true);
                this.byId("BpCategory").setText("조직");
            }

            let now = new Date();
            Today = now.getFullYear() + "." +(now.getMonth() + 1).toString().padStart(2,'0') + "." +now.getDate().toString().padStart(2,'0');

            const bpNum = await $.ajax({
                type:"GET",
                url: "/bp/BP" 
            }); 
            let bpNumModel = new JSONModel(bpNum);
            this.getView().setModel(bpNumModel,"bpNumModel");
            let oModel = this.getView().getModel("bpNumModel");
            let oData = oModel.oData;
            let totalNumber = parseInt(oModel.oData.value.length) -1 
            let bpNumber = parseInt(oData.value[totalNumber].bp_number) + 1 
            
            // console.log(oData);
            console.log(totalNumber);
            console.log(bpNumber);

            this.getView().byId("BpCreatedDate").setText(Today);
            this.getView().byId("BpNumber").setText(bpNumber);
            this.getView().byId("BpNumbertoo").setText(bpNumber);
        },
        toCustomerList :function () {
			this.getOwnerComponent().getRouter().navTo("CustomerList");
            
            this.validateForVboxClear("generalData");
			this.validateForVboxClear("personalData");
			this.validateForVboxClear("addressData");

            this.onClearField();
		},
        validateForVbox:function(sParam){
            var check=false;
			var item =this.byId(sParam).mAggregations.items;
			for(var i=0;i<item.length;i++){
				// console.log(item[i].mAggregations);
				var vboxitem = item[i].mAggregations.items;
				for(var j=0;j<vboxitem.length;j++){
					var element_type = vboxitem[j].getMetadata().getName().split('.')[2];
					if (element_type == 'Input'|| element_type=='DatePicker'||element_type == 'ComboBox') {
                        vboxitem[j].setValueState("None");
                        vboxitem[j].setValueStateText(null);
                        if (vboxitem[j].mProperties.required == true) {
                            var element_value = vboxitem[j].mProperties.value;
                            if(element_value ==''||element_value==null||element_value==undefined){
								check=true;
                                vboxitem[j].setValueState("Error");
                                vboxitem[j].setValueStateText("필수 값을 입력해주세요.");
                            }
                        }
                    }
					else if (element_type == 'Select') {
                        vboxitem[j].setValueState("None");
                        vboxitem[j].setValueStateText(null);
                        if (vboxitem[j].mProperties.required == true) {
                            var element_value = vboxitem[j].mProperties.selectedKey;
                            if(element_value ==''||element_value==null||element_value==undefined){
								check=true;
                                vboxitem[j].setValueState("Error");
                                vboxitem[j].setValueStateText("필수 값을 입력해주세요.");
                            }
                        }
                    }
				}
			}
			return check;

		},
		validateForVboxClear:function(sParam){
			var item =this.byId(sParam).mAggregations.items;
			for(var i=0;i<item.length;i++){
				console.log(item[i].mAggregations);
				var vboxitem = item[i].mAggregations.items;
				for(var j=0;j<vboxitem.length;j++){
					var element_type = vboxitem[j].getMetadata().getName().split('.')[2];
					if (element_type == 'Input'|| element_type=='DatePicker'||element_type == 'ComboBox' || element_type == 'Select') {
                        vboxitem[j].setValueState("None");
                        vboxitem[j].setValueStateText(null);
                    }
				}
			}
		},

        onDataView: async function() {
            const customerList = await $.ajax({
                type:"GET",
                url:"/bp/BP"
            });

            let BpCustomerModel = new JSONModel(customerList.value);
            this.getView().setModel(BpCustomerModel,"BpCustomerModel");

            //국가 지역 데이터 불러오기
            const CountryList = await $.ajax({
                type:"GET",
                url:"/bp/BP_Nation_Region"
            });
            let BpCountryModel = new JSONModel(CountryList.value);
            this.getView().setModel(BpCountryModel,"BpCountryModel");

            //회사코드 데이터 불러오기
            const CoCdList = await $.ajax({
                type:"GET",
                url:"/cocd/CoCd"
            });

            let BpCoCdModel = new JSONModel(CoCdList.value);
            this.getView().setModel(BpCoCdModel,"BpCoCdModel");
        },
        onClearField: function() {
            this.byId("BpName").setValue(""),
            this.byId("BpCategory").setText(""),        
            this.byId("BpCompanyCode").setValue(""),
            this.byId("BpPersonTitle").setSelectedKey(""),
            this.byId("BpOrganizationTitle").setValue(""),
            this.byId("BpFirstName").setValue(""),
            this.byId("BpLastName").setValue(""),
            this.byId("BpCorpName1").setValue(""),
            this.byId("BpCorpName2").setValue(""),
            this.byId("BpRoadAddress").setValue(""),
            this.byId("BpStreetAddress").setValue(""),
            this.byId("BpCity").setValue(""),
            this.byId("BpPostalCode").setValue(""),
            this.byId("BpNation").setValue(""),
            this.byId("BpReportSubmission").setSelected(false)

            this.onDataView();
        }, 
        onCreate:async function () {
			var check = await this.validateForVbox("generalData");
			var check2 = await this.validateForVbox("personalData");
			var check2 = await this.validateForVbox("addressData");
			if(check===true||check2===true){
				return;
			} 
           var temp={
                bp_name : this.byId("BpName").getValue(),
                bp_created_date : Today,
                bp_number : this.byId("BpNumber").getText(),
                bp_category : this.byId("BpCategory").getText(),        
                bp_company_code : this.byId("BpCompanyCode").getValue(),
                bp_person_title : this.byId("BpPersonTitle").getSelectedKey(),
                bp_organization_title : this.byId("BpOrganizationTitle").getValue(),
                bp_first_name : this.byId("BpFirstName").getValue(),
                bp_last_name : this.byId("BpLastName").getValue(),
                bp_corp_name1 : this.byId("BpCorpName1").getValue(),
                bp_corp_name2 : this.byId("BpCorpName2").getValue(),
                bp_road_address : this.byId("BpRoadAddress").getValue(),
                bp_city : this.byId("BpCity").getValue(),
                bp_street_address : this.byId("BpStreetAddress").getValue(),
                bp_postal_code : this.byId("BpPostalCode").getValue(),
                bp_nation : this.byId("BpNation").getValue(),
                bp_report_submission : this.byId("BpReportSubmission").getSelected()
            }

            if( selectedBpCategory == 1) {
                if( temp.bp_name === "" || 
                    temp.bp_number === "" || 
                    temp.bp_first_name === "" || 
                    temp.bp_last_name === "")
                    {
                    MessageBox.error("필수 항목을 입력해주세요");}
                else{
                    await $.ajax({
                        type:"POST",
                        url:"/bp/BP",
                        contentType:"application/json;IEEE754Compatible=true",
                        data:JSON.stringify(temp)
                    })
                    this.onClearField();
                    this.toCustomerList();
                }
            }    
            else if(selectedBpCategory == 2){
                if( temp.bp_name === "" || 
                    temp.bp_number === "" || 
                    temp.bp_organization_title === "")
                    {
                    MessageBox.error("필수 항목을 입력해주세요");}
                else{
                    await $.ajax({
                        type:"POST",
                        url:"/bp/BP",
                        contentType:"application/json;IEEE754Compatible=true",
                        data:JSON.stringify(temp)
                    });
                    this.onClearField();
                    this.toCustomerList();
                }   
            }
        },

        //국가 선택용 다이어로그 열기
        onSelectCountry : function(){
            if(!this.pDialog){
				this.pDialog = this.loadFragment({
					name:"project3.view.fragment.InputSingleCountry"
				});
			}
			this.pDialog.then(function(oDialog){
				oDialog.open();
			});
        },
        
        //국가 선택용 다이어로그 close 함수
		onCloseCountryDialog: function() {
			this.byId("CountryDialog").destroy();
			this.pDialog = null;
		},

        // 국가 선택용 다이어로그 search 함수
        onSearchCountryDialog: function() {
			var SearchInputCountry = this.byId("SearchInputCountry").getValue();
			var aFilter = [];

			if (SearchInputCountry) {
				aFilter = new Filter({
					filters: [
						new Filter("bp_nation", FilterOperator.Contains, SearchInputCountry),
						new Filter("bp_nation_code", FilterOperator.Contains, SearchInputCountry),
					],
					and: false
				});
			}

			let oTable = this.byId("CountrySelectTable").getBinding("rows");
            oTable.filter(aFilter);

		},

        // 국가 선택용 다이어로그 검색창 clear용 함수
		onSearchCountryReset: function() {
			this.byId("SearchInputCountry").setValue("");
            this.onSearchCountryDialog();
		},

        // 국가 선택용 다이어로그 특정 row 선택 시 생성 페이지 Input에 값 입력
        getCountryContext : function(oEvent){
            // let rowIndex = oEvent.getParameters().rowIndex;
			let rowIndex = oEvent.getParameters().rowBindingContext.sPath.split('/')[1];

            this.byId("BpNation").setValue(oEvent.getParameters().rowBindingContext.oModel.oData[rowIndex].bp_nation_code); 
			this.onCloseCountryDialog();

        },

        // 회사코드 선택용 다이어로그 열기
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

        // 회사코드 선택용 다이어로그 close 함수
		onCloseCoCdDialog: function() {
			this.byId("CoCdDialog").destroy();
			this.pDialog = null;
		},

        // 회사코드 선택용 다이어로그 search 함수
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

        // 회사코드 선택용 다이어로그 검색창 clear용 함수
		onSearchCoCdReset: function() {
			this.byId("SearchInputCoCd").setValue("");
            this.onSearchCoCdDialog();
		},

        // 회사코드 선택용 다이어로그 특정 row 선택 시 생성 페이지 Input에 값 입력
        getCoCdContext : function(oEvent){
            // let rowIndex = oEvent.getParameters().rowIndex;
            let rowIndex = oEvent.getParameters().rowBindingContext.sPath.split('/')[1];

            this.byId("BpCompanyCode").setValue(oEvent.getParameters().rowBindingContext.oModel.oData[rowIndex].com_code); 
			this.onCloseCoCdDialog();

        }

    });
});
