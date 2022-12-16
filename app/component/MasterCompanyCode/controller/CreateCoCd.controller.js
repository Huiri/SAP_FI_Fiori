sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "sap/ui/model/json/JSONModel",
  "sap/m/MessageBox"
  
], function (Controller,
	JSONModel,
	MessageBox) {
  "use strict";


  return Controller.extend("project4.controller.CreateCoCd", {
    onInit: async function () {},

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
        com_vat_registration: this.byId("CoCdVat").getSelectedKey()
      }
      if (temp.com_code === "" ||
        temp.com_code_name === "" ||
        temp.com_country === "" ||
        temp.com_language === "" ||
        temp.com_coa === "" ||
        temp.com_co_area === "" ||
        temp.com_fiscal_year === "" ||
        temp.com_currency === ""
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
        this.byId("CoCdVat").setSelectedKey("")
    },
    onCancel: function () {
      this.clearField()
      this.getOwnerComponent().getRouter().navTo("CompanyCodeList");
    },




  });
});