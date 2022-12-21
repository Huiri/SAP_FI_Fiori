sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/export/Spreadsheet",
    "sap/ui/export/library"
], function (Controller, JSONModel, Spreadsheet, exportLibrary) {
    "use strict";
    return Controller.extend("project2.controller.FSVersionBS", {
        onInit: async function () {

            this.getOwnerComponent().getRouter().getRoute("FSVersionBS").attachPatternMatched(this.onMyRoutePatternMatched, this)


            // tree table
            var oModel = new JSONModel("/app/component/MasterGLAccount/model/FSData.json");
            let oFSDataModel = this.getView().setModel(oModel, "FSDataModel");
            //console.log(oFSDataModel)
        },

        onMyRoutePatternMatched: async function (oEvent) {
            let fsVersionType = this.byId("fsVersionType").getSelectedKey();
            //console.log(fsVersionType);
        },

        onRun: function () {
            let fsVersionType = this.byId("fsVersionType").getSelectedKey();
            if (fsVersionType == "재무상태표") {
                this.getOwnerComponent().getRouter().navTo("FSVersionBS");
            }
            else {
                this.getOwnerComponent().getRouter().navTo("FSVersionPL")
            }
        },

        onBack: function () {
            this.getOwnerComponent().getRouter().navTo("Home");
        },

        ////////////////////////////////////////////////////////////

        // Tree Table
        onCollapseAll: function () {
            var oTreeTable = this.byId("FSTreeTable");
            oTreeTable.collapseAll();
        },
        onExpandFirstLevel: function () {
            var oTreeTable = this.byId("FSTreeTable");
            oTreeTable.expandToLevel(3);
        },

        /////////////////////////////////////////////////////////////////////////////csv
        onDownload: function (oEvent) {
            var jsonData = this.getView().getModel("FSDataModel").getData().categories;
            this.JSONToCSVConvertor(jsonData);
        },
        JSONToCSVConvertor: function (JSONData) {
            var arrData = JSONData;
            var CSV = '';
            var row = ""; // To add Table column header in excel
            var row1 = "";
            var table = this.getView().byId("FSTreeTable");
            table.getColumns().forEach(function (column) {
                row1 += '"' + column.getLabel().getText() + '",';
            });
            CSV += row1 + '\r\n'; //Row that will create Header Columns
            var column = {
                "gl_account_content": "gl_account_content",
                "gl_acct": "gl_acct",
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
                        row = '"' + aTree[iIndex][column.gl_account_content] +
                            '","' + aTree[iIndex][column.gl_acct] +
                            '","' + aTree[iIndex][column.gl_created] +
                            '","' + aTree[iIndex][column.gl_constructor] +
                            '","' + aTree[iIndex][column.gl_acct_currency] +
                            '",';
                        CSV += row + "\r\n";
                        CSV = replaceUndefined(CSV);
                        if (aTree[iIndex].categories) {
                            createRow(aTree[iIndex].categories);
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
            var fileName = "Financial Statement BS";
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






        /*         onDataExport: function () {
                    let aCols, oRowBinding, oSettings, oSheet, oTable;
                    oTable = this.byId('FSTreeTable');
                    oRowBinding = oTable.getBinding('rows');
                    aCols = this.createColumnConfig();
                    let oList = [];
                    for(let j=0; j<oRowBinding.oList.length; j++){
                        if(oRowBinding.aIndices.indexOf(j)>-1){   //aIndices:
                            oList.push(oRowBinding.oList[j]);
                        }
                    }
                    oSettings = {
                        workbook: {
                            columns: aCols,
                            hierarchyLevel: 'Level'
                        },
                        dataSource: oList,
                        fileName: 'FSTreeTable.xlsx',
                        worker: false
                    };
                    oSheet = new Spreadsheet(oSettings);
                    oSheet.build().finally(function () {
                        oSheet.destroy();
                    });
                },
                createColumnConfig: function() {
                    const aCols=[];
                    aCols.push({
                        label: '계정 과목',
                        property: 'gl_account_content',
                        type: EdmType.String
                    });
                    aCols.push({
                        label: '계정 번호',
                        property: 'gl_acct',
                        type: EdmType.String
                    });
                    aCols.push({
                        label: '생성일',
                        property: 'gl_created',
                        type: EdmType.String
                    });
                    aCols.push({
                        label: '생성자',
                        property: 'gl_constructor',
                        type: EdmType.String
                    });
                    aCols.push({
                        label: '통화',
                        property: 'gl_acct_currency',
                        type: EdmType.String
                    });
        
                    return aCols;
                } */
    });
});
