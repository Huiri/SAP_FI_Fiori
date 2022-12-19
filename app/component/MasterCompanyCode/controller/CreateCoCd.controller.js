sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "sap/ui/model/json/JSONModel",
  "sap/m/MessageBox",
  "sap/ui/model/Filter",
  "sap/ui/model/FilterOperator",


], function (Controller,
	JSONModel,
	MessageBox,
	Filter,
	FilterOperator
) {
  "use strict";


  return Controller.extend("project4.controller.CreateCoCd", {
    onInit: async function () {
      this.getOwnerComponent().getRouter().attachRoutePatternMatched(this.onMyRoutePatternMatched, this);


    },

    onMyRoutePatternMatched: async function () {
      //국가 지역 데이터 불러오기
      const CountryList = await $.ajax({
        type: "GET",
        url: "/bp/BP_Nation_Region"
      });
      let CoCdCountryModel = new JSONModel(CountryList.value);
      this.getView().setModel(CoCdCountryModel, "CoCdCountryModel");
    },
    onCreate: async function () {
      var temp = {
        com_code: this.byId("CoCdCod").getValue(),
        com_code_name: this.byId("CoCdName").getValue(),
        com_city: this.byId("CoCdCity").getValue(),
        com_country: this.byId("CoCdCountry").getValue(),
        com_currency: this.byId("CoCdCurrency").getSelectedKey(),
        com_language: this.byId("CoCdLanguage").getSelectedKey(),
        com_coa: this.byId("CoCdCoa").getValue(),
        com_co_area: this.byId("CoCdCoArea").getValue(),
        com_address: this.byId("CoCdAddress").getValue(),
        com_fiscal_year: this.byId("CoCdFiscalYear").getValue(),
        com_cocd_tax_code: this.byId("CoCdTaxCode").getSelectedKey(),
        com_cocd_constructor: this.byId("CoCdConstructor").getValue(),
        com_cocd_date: this.byId("CoCdDate").getValue()
      }
      if (temp.com_code === "" ||
        temp.com_code_name === "" ||
        temp.com_country === "" ||
        temp.com_language === "" ||
        temp.com_coa === "" ||
        temp.com_co_area === "" ||
        temp.com_fiscal_year === "" ||
        temp.com_currency === "" ||
        com_cocd_create_person === "" ||
        com_cocd_create_date === ""
      ) {
        MessageBox.error("필수 항목을 입력해주세요")
      } else {

        await $.ajax({
          type: "POST",
          url: "/cocd/CoCd",
          contentType: "application/json;IEEE754Compatible=true",
          data: JSON.stringify(temp)
        });
        this.onCancel();
      }
    },
    clearField: function () {
      this.byId("CoCdCod").setValue(""),
        this.byId("CoCdName").setValue(""),
        this.byId("CoCdCity").setValue(""),
        this.byId("CoCdCountry").setValue(""),
        this.byId("CoCdCurrency").setSelectedKey(""),
        this.byId("CoCdLanguage").setSelectedKey(""),
        this.byId("CoCdCoa").setValue(""),
        this.byId("CoCdCoArea").setValue(""),
        this.byId("CoCdAddress").setValue(""),
        this.byId("CoCdFiscalYear").setValue(""),
        this.byId("CoCdTaxCode").setSelectedKey(""),
        this.byId("CoCdCreatePeson").getValue(),
        this.byId("CoCdCreateDate").getValue()
    },

    //국가 선택용 다이어로그 열기
    onSelectCountry: function () {
      if (!this.pDialog) {
        this.pDialog = this.loadFragment({
          name: "project4.view.fragment.InputSingleCountry"
        });
      }
      this.pDialog.then(function (oDialog) {
        oDialog.open();
      });
    },

    //국가 선택용 다이어로그 close 함수
    onCloseCountryDialog: function () {
      this.byId("CountryDialog").destroy();
      this.pDialog = null;
    },
    // 국가 선택용 다이어로그 search 함수
    onSearchCountryDialog: function () {
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
    onSearchCountryReset: function () {
      this.byId("SearchInputCountry").setValue("");
      this.onSearchCountryDialog();
    },

    // 국가 선택용 다이어로그 특정 row 선택 시 생성 페이지 Input에 값 입력
    getCountryContext: function (oEvent) {
      console.log(oEvent.getParameters());
      this.byId("CoCdCountry").setValue(oEvent.getParameters().cellControl.mProperties.text);
      console.log(this.byId("CoCdCountry").getValue());
      this.onCloseCountryDialog();

    },
    onCancel: function () {
      this.clearField()
      this.onBack();
    },

    onBack: function () {
      this.getOwnerComponent().getRouter().navTo("CompanyCodeList");
    },




  });
});