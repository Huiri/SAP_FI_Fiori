sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/export/Spreadsheet",
    "sap/ui/export/library",
    "../model/formatter"
], function (
	Controller, 
	JSONModel, 
	Spreadsheet, 
	exportLibrary, 
	formatter,
) {
    "use strict";
    let totalNumber;
    let selectedNum;
    let selectedSubmitState;
    let state;
    const EdmType = exportLibrary.EdmType;
    const SOURCE_CHART_STICK = "stick";
    return Controller.extend("project3.controller.CustomerSubmitChartDetail", {
        formatter : formatter,

        onInit: async function () {

            const myRoute = this.getOwnerComponent().getRouter().getRoute("CustomerSubmitChartDetail");
            myRoute.attachPatternMatched(this.onMyRoutePatternMatched, this);
        },


        onMyRoutePatternMatched: async function (oEvent) {

            selectedSubmitState = oEvent.getParameter("arguments").submitState;
            //console.log(selectedSubmitState);  

            if (selectedSubmitState === "1"){
                selectedSubmitState = true;
                //console.log(selectedSubmitState);
                this.byId("submitStateId").setText("제출 완료");
                state = 1;
                
            }else if(selectedSubmitState === "2"){
                selectedSubmitState = false;
                //console.log(selectedSubmitState);
                this.byId("submitStateId").setText("미제출");
                state =2;
            }

            const customerList = await $.ajax({
                type: "GET",
                url: "/bp/BP?$filter=bp_report_submission eq " + selectedSubmitState
            });
            //console.log(customerList);
            let BpCustomerModel = new JSONModel(customerList.value);
            this.getView().setModel(BpCustomerModel, "BpCustomerModel");


            totalNumber = this.getView().getModel("BpCustomerModel").getData().length;
            //console.log(totalNumber);
            totalNumber = " (" + totalNumber + ")"
            this.byId("totalNumber").setText(totalNumber); 
           
        },


        onBack: function () {
            this.getOwnerComponent().getRouter().navTo("CustomerChart")
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
            let selectedtype = "3";
            selectedtype =  selectedSubmitState;

            console.log(selectedSubmitState)
            this.getOwnerComponent().getRouter().navTo("CustomerDetail", { num: selectedNum, "?query": {source : SOURCE_CHART_STICK, stickType:state} });
        },




    });
});