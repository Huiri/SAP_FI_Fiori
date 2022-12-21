sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/export/library",
	"sap/ui/core/ValueState"
], function (
	Controller, 
	JSONModel, 
	exportLibrary, 
	ValueState
	) {
    "use strict";

    let totalNumber;
    let selectedNum;
	let type=null;
	let sType=null;
    let source=null;

    const EdmType = exportLibrary.EdmType;
    const SOURCE_CHART ="chart";

    return Controller.extend("project3.controller.CustomerList", {
        onInit: async function () {
            this._initModel();
            const myRoute = this.getOwnerComponent().getRouter().getRoute("CustomerChartDetail");
            myRoute.attachPatternMatched(this.onMyRoutePatternMatched, this);
        },

		_initModel: function() {
            this.getView()
                .setModel(
                    new JSONModel({}),
                    'search'
                )
        },

        onMyRoutePatternMatched: async function (e) {
            type = e.getParameter("arguments").type;
            source = e.getParameter("arguments").source;

			this.onInitView();
        },
		onInitView: async function(){
			if(type=="trust") sType="신뢰";
			else if(type=="wait") sType="보류";
			else if(type=="caution") sType="주의";

			this.getView().byId('titleState').setText(` ${sType}`);
			this.getView().byId('titleState').setState(`${sType=='신뢰'?ValueState.Success:sType=='보류'?ValueState.None:ValueState.Error}`);
		
			let query="?$filter=bp_credit_status eq '"+sType+"'";
            const customerList = await $.ajax({
                type: "GET",
                url: "/bp/BP"+query
            });

            let BpCustomerModel = new JSONModel(customerList.value);
            this.getView().setModel(BpCustomerModel, "BpCustomerModel");

            totalNumber = this.getView().getModel("BpCustomerModel").getData().length;
            totalNumber = " (" + totalNumber + ")"
			let titleState = `${type} ${totalNumber}`;

            this.byId("titleState").setText(titleState);
        },
        onClearField: function () {

			this.getView().setModel(new JSONModel({}),"BpCustomerModel");
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
            this.getOwnerComponent().getRouter().navTo("CustomerDetail", { num: selectedNum , "?query": {source : SOURCE_CHART, donut:type}});
        },

		onBack: function () {
            this.getOwnerComponent().getRouter().navTo(("CustomerChart"));
			this.onClearField();
        }
    });
});