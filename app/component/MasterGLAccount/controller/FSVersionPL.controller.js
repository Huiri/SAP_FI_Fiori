sap.ui.define([
	"sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/export/Spreadsheet",
    "sap/ui/export/library"
], function(
	Controller,
	JSONModel,
	Spreadsheet,
	library
) {
	"use strict";
   

	return Controller.extend("project2.controller.FSVersionPL", {
        onInit: async function () {

            this.getOwnerComponent().getRouter().getRoute("FSVersionPL").attachPatternMatched(this.onMyRoutePatternMatched, this)


            // tree table
            var oModel = new JSONModel("/app/component/MasterGLAccount/model/FSData.json");
			this.getView().setModel(oModel);
            
        },

        onMyRoutePatternMatched: async function (oEvent) {
            let fsVersionType = this.byId("fsVersionType").getSelectedKey();
            //console.log(fsVersionType);
        },

        onRun: function () {
            let fsVersionType = this.byId("fsVersionType").getSelectedKey();
            if (fsVersionType == "재무상태표") {
                this.getOwnerComponent().getRouter().navTo("FSVersionBS");
                this.byId("fsVersionType").setSelectedItemId("bs");
            }
            else {
                this.getOwnerComponent().getRouter().navTo("FSVersionPL")
                this.byId("fsVersionType").setSelectedItemId("pl");

            }
            this.onCollapseAll();
        },

        onBack: function () {
            this.getOwnerComponent().getRouter().navTo("Home");
            this.onCollapseAll();
        },
       

		onCollapseAll: function() {
			var oTreeTable = this.byId("TreeTableBasic");
			oTreeTable.collapseAll();
		},


		onExpandFirstLevel: function() {
			var oTreeTable = this.byId("TreeTableBasic");
			oTreeTable.expandToLevel(2);
		},
        onDownload: function (oEvent) {
            var jsonData = this.getView().getModel().getData().ProfitLoss;
            this.JSONToCSVConvertor(jsonData);
        },
        JSONToCSVConvertor: function (JSONData) {
            var arrData = JSONData;
            var CSV = '';
            var row = ""; // To add Table column header in excel
            var row1 = "";
            var table = this.getView().byId("TreeTableBasic");
            table.getColumns().forEach(function (column) {
                row1 += '"' + column.getLabel().getText() + '",';
            });
            CSV += row1 + '\r\n'; //Row that will create Header Columns
            var column = {
                "name": "name",
                "gl_account": "gl_account",
                "gl_created": "gl_created",
                "gl_constructor": "gl_constructor",
                "gl_acct_currency": "gl_acct_currency"
            };

            var replaceUndefined = function (oExcel) {
                var newExcel = oExcel.replace(/undefined/g, " ");
                return newExcel;
            };

            var createRow = function (aTree) {
                if (jQuery.isArray(aTree)) {
                    for (var iIndex = 0; iIndex < aTree.length; iIndex++) {
                        row = '"' + aTree[iIndex][column.name] +
                            '","' + aTree[iIndex][column.gl_account] +
                            '","' + aTree[iIndex][column.gl_created] +
                            '","' + aTree[iIndex][column.gl_constructor] +
                            '","' + aTree[iIndex][column.gl_acct_currency] +
                            '",';
                        CSV += row + "\r\n";
                        CSV = replaceUndefined(CSV);
                        if (aTree[iIndex].ProfitLoss) {
                            createRow(aTree[iIndex].ProfitLoss);
                        }
                    }
                }
            };
            //create row
            createRow(arrData);
            if (CSV === '') {
                sap.m.MessageToast.show("Invalid data");
                return;
            }
            // Generate a file name
            var BOM = "\uFEFF";
            var fileName = "Financial Statement PL";
            CSV = BOM + CSV;
            var blob = new Blob([CSV], {
                type: "text/csv;charset=utf-8;"
            });

            if (sap.ui.Device.browser.name === "ie") { // IE 10+
                navigator.msSaveBlob(blob, "csvname.csv");
            } else {
                var uri = 'data:application/csv;charset=utf-8,' + CSV;
                var link = document.createElement("a");
                link.href = uri;
                link.style = "visibility:hidden";
                link.download = fileName + ".csv";
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }
        }

	});
});