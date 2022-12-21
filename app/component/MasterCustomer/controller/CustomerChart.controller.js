sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel"
], function (
    Controller, JSONModel
) {
    "use strict";
    

    return Controller.extend("project3.controller.CustomerChart", {

        onInit: async function () {

            var oData = {
                trust: 0,
                trustpercent: '',
                wait: 0,
                waitpercent: '',
                caution: 0,
                cautionpercent: '',
            };

            var oModel = new JSONModel(oData);
            this.getView().setModel(oModel, "CreditStatus");
            await this.getOwnerComponent().getRouter().getRoute("CustomerChart").attachPatternMatched(this.donutChartDataView, this);
            this.getOwnerComponent().getRouter().getRoute("CustomerChart").attachPatternMatched(this.columnChartDataView, this);
            this.getOwnerComponent().getRouter().getRoute("CustomerChart").attachPatternMatched(this.columnChartDataView, this);
            this.getOwnerComponent().getRouter().getRoute("CustomerChart").attachPatternMatched(this.reportSubmitDataView, this);



        },

        donutChartDataView: async function () {
            const BpCreditstatus = await $.ajax({
                type: "get",
                url: "/bp/BP"
            });
            let statusModel = new JSONModel(BpCreditstatus.value);
            this.getView().setModel(statusModel, "statusModel");


            let data = this.getView().getModel("statusModel");
            let a = 0.00,
                b = 0.00,
                c = 0.00;
            for (let i = 0; i < data.oData.length; i++) {
                let state = '/' + i + '/bp_credit_status'
                if (data.getProperty(state) === '신뢰') {
                    a++;
                }
                if (data.getProperty(state) === '보류') {
                    b++;
                }
                if (data.getProperty(state) === '주의') {
                    c++;
                }
            }
            this.getView().getModel("CreditStatus").setProperty("/trust", a / data.oData.length * 100);
            this.getView().getModel("CreditStatus").setProperty("/wait", b / data.oData.length * 100);
            this.getView().getModel("CreditStatus").setProperty("/caution", c / data.oData.length * 100);
            this.getView().getModel("CreditStatus").setProperty("/trustpercent", (a / data.oData.length * 100).toFixed(2) + '%');
            this.getView().getModel("CreditStatus").setProperty("/waitpercent", (b / data.oData.length * 100).toFixed(2) + '%');
            this.getView().getModel("CreditStatus").setProperty("/cautionpercent", (c / data.oData.length * 100).toFixed(2) + '%');

        },
        columnChartDataView: async function () {
            const BpReportSubmit = await $.ajax({
                type: "get",
                url: "/bp/BP"
            });
            let bpReportSubmitModel = new JSONModel(BpReportSubmit.value);
            this.getView().setModel(bpReportSubmitModel, "bpReportSubmitModel");


            let data = this.getView().getModel("bpReportSubmitModel");
            let a = 0.00,
                b = 0.00
            for (let i = 0; i < data.oData.length; i++) {
                let state = '/' + i + '/bp_report_submission'
                if (data.getProperty(state) === true) {
                    a++;
                }
                if (data.getProperty(state) === false) {
                    b++;
                }
            }

            //console.log(this.getView().getModel("bpReportSubmitModel"));

            this.getView().getModel("bpReportSubmitModel").setProperty("/submit", a / data.oData.length * 100);
            this.getView().getModel("bpReportSubmitModel").setProperty("/notsubmit", b / data.oData.length * 100);
            this.getView().getModel("bpReportSubmitModel").setProperty("/submitpercent", (a / data.oData.length * 100).toFixed(2) + '%');
            this.getView().getModel("bpReportSubmitModel").setProperty("/notsubmitpercent", (b / data.oData.length * 100).toFixed(2) + '%');

            //console.log(this.getView().getModel("bpReportSubmitModel"));


        },
        reportSubmitDataView: async function (oEvent) {

            let url = "/bp/BP?$filter=bp_report_submission%20eq%20false&$orderby=bp_changed_date%20desc&$top=3"

            //console.log(url);
            
            const SubmitWait = await $.ajax({
                type: "get",
                url: url
            });
            let submitWaitModel = new JSONModel(SubmitWait.value); //RequestWait.value 값을 JSONModel의 odata에 담는다.
            this.getView().setModel(submitWaitModel, "submitWaitModel");

            //console.log(submitWaitModel)

        },

        onSelectionChanged:function(e){
            let type=e.getParameter("segment").sId;
            type= type.split('-').reverse()[0];

            this.getOwnerComponent().getRouter().navTo('CustomerChartDetail', {type:type});
        },
        
        onNavToBpDetail: function (oEvent) {
            var sPath = oEvent.getSource().oBindingContexts.submitWaitModel.sPath;
            var SelectedNum = this.getView().getModel("submitWaitModel").getProperty(sPath).bp_number;
            
            this.getOwnerComponent().getRouter().navTo("CustomerDetail", {num: SelectedNum});
        },
        
        toCustomerHome: function () {
            this.getOwnerComponent().getRouter().navTo("Home");

        },

        onSubmitChartDetail1: function (oEvent) {
            //var oSubmitState = oEvent.getSource().mProperties.label;    // 제출 완료
            //console.log(osubmitState);
            this.getOwnerComponent().getRouter().navTo("CustomerSubmitChartDetail",{submitState: "1"}); 
        },
        onSubmitChartDetail2: function (oEvent) {
            //var oSubmitState = oEvent.getSource().mProperties.label;    // 미제출
            this.getOwnerComponent().getRouter().navTo("CustomerSubmitChartDetail",{submitState: "2"});
        },

    });
});