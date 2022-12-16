sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageBox",
], function (Controller,JSONModel,MessageBox) {
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
        },
        toCustomerList :function () {
			this.getOwnerComponent().getRouter().navTo("CustomerList");
            this.onClearField();
		},
        onDataView: async function() {
            const customerList = await $.ajax({
                type:"GET",
                url:"/bp/BP"
            });

            let BpCustomerModel = new JSONModel(customerList.value);
            
            this.getView().setModel(BpCustomerModel,"BpCustomerModel");
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
            this.byId("BpPostalCode").setValue(""),
            this.byId("BpNation").setValue(""),
            this.byId("BpReportSubmission").setSelected(false)

            this.onDataView();
        }, 
        onCreate:async function () {
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
        }
    });
});
