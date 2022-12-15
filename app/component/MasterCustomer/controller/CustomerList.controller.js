sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/model/Sorter",
    "sap/ui/model/json/JSONModel",
    "sap/ui/export/Spreadsheet",
    "sap/ui/export/library"
], function (Controller, Filter, FilterOperator, Sorter, JSONModel, Spreadsheet, exportLibrary) {
    "use strict";
    let totalNumber;
    let selectedNum;
    const EdmType = exportLibrary.EdmType;

    return Controller.extend("project3.controller.CustomerList", {
        onInit: async function () {
            const myRoute = this.getOwnerComponent().getRouter().getRoute("CustomerList");
            myRoute.attachPatternMatched(this.onMyRoutePatternMatched, this);
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
            // console.log(this.getView().getModel("BpCustomerModel"));
            totalNumber = this.getView().getModel("BpCustomerModel").getData().length;
            //console.log(totalNumber);
            totalNumber = "고객 (" + totalNumber + ")"
            this.byId("totalNumber").setText(totalNumber);

        },
        onSearch: function () {
            let BpName = this.byId("BpName").getValue();
            let BpCompanyCode = this.byId("BpCompanyCode").getValue();
            let BpCategory = this.byId("BpCategory").getSelectedKey();
            let BpPostalCode = this.byId("BpPostalCode").getValue();
            let BpNation = this.byId("BpNation").getValue();
            let BpCity = this.byId("BpCity").getValue();
            let BpRoadAddress = this.byId("BpRoadAddress").getValue();

            var aFilter = [];

            if (BpName) { aFilter.push(new Filter("bp_name", FilterOperator.Contains, BpName)) }

            if (BpCompanyCode) { aFilter.push(new Filter("bp_company_code", FilterOperator.Contains, BpCompanyCode)) }
            if (BpCategory) { aFilter.push(new Filter("bp_category", FilterOperator.Contains, BpCategory)) }
            if (BpPostalCode) { aFilter.push(new Filter("bp_postal_code", FilterOperator.Contains, BpPostalCode)) }
            if (BpNation) { aFilter.push(new Filter("bp_nation", FilterOperator.Contains, BpNation)) }
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
            this.byId("BpName").setValue("");
            this.byId("BpCompanyCode").setValue("");
            this.byId("BpCategory").setValue("");
            this.byId("BpPostalCode").setValue("");
            this.byId("BpNation").setValue("");
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
                label: '비즈니스 파트너',
                property: 'bp_name',
                type: EdmType.String
            });
            aCols.push({
                label: '회사 코드',
                property: 'bp_company_code',
                type: EdmType.String
            });
            aCols.push({
                label: '비즈니스 파트너 범주',
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
                property: 'bp_nation',
                type: EdmType.String
            });
            aCols.push({
                label: '시',
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

    });
});