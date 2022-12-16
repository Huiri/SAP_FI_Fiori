sap.ui.define([
	"sap/ui/core/mvc/Controller", 
	"sap/ui/model/json/JSONModel", 
	"sap/m/MessageBox"
], function(
	Controller, JSONModel, MessageBox
) {
	"use strict";
	let CreateNum, Today;
	return Controller.extend("project2.controller.CreateGLAccount", {
		onInit: function () {
			const myRoute = this.getOwnerComponent().getRouter().getRoute("CreateGLAccount");
			myRoute.attachPatternMatched(this.onMyRoutePatternMatched, this);
		},
		onMyRoutePatternMatched : function(oEvent) {

			this.onReset();
			// CreateNum = parseInt(oEvent.getParameter("arguments").num) + 1;

			let now = new Date();
			Today = now.getFullYear() + "." +(now.getMonth()+1).toString().padStart(2,'0')+"."+now.getDate().toString().padStart(2, '0');

			this.getView().byId("GLAcct").setText(CreateNum);
			this.getView().byId("CreateDate").setText(Today);
		},
		toBack: function() {
			this.onReset();
			this.getOwnerComponent().getRouter().navTo("GLAccountList");
		},
		onErrorMessageBoxPress: function () {
			let CoA = this.byId("CoA").getValue();
			let GLAccType = this.byId("GLAccType").getValue();
			let GLGroup = this.byId("GLGroup").getValue();
			let GLAcctContent = this.byId("GLAcctContent").getValue();
			let FuncArea = this.byId("FuncArea").getValue();
			let msg;
			if(CoA === null || CoA === "") {
				msg = "계정과목표를 선택해주세요.";
			} else if(GLAccType === null || GLAccType === "") {
				msg = "계정 유형을 선택해주세요.";
			} else if(GLGroup === null || GLGroup === "") {
				msg = "계정 그룹을 선택해주세요.";
			} else if(FuncArea === null || FuncArea === "") {
				msg = "기능 영역을 입력해주세요.";
			} else if(GLAcctContent === null || GLAcctContent === "") {
				msg = "계정 내역을 입력해주세요.";
			} else{
				return;
			}
			MessageBox.error(msg);
			return false;
		},
		onCreate : async function(){
			let isError = this.onErrorMessageBoxPress();
			if(isError === false){
				return;
			} else {
				let temp = new JSONModel(this.temp).oData;
				// temp.gl_acct = this.byId("GLAcct").getText();
				temp.gl_acct = "100";
				temp.gl_coa = this.byId("CoA").getValue();
				temp.gl_acct_type = this.byId("GLAccType").getValue();
				temp.gl_acct_group = this.byId("GLGroup").getValue();
				temp.gl_ps_acct_type = this.byId("PLAccType").getValue();
				temp.gl_func_area = this.byId("FuncArea").getValue();
				temp.gl_acct_content = this.byId("GLAcctContent").getValue();
				temp.gl_acct_descript = this.byId("GLAccDesc").getValue();
				temp.gl_created = Today;

				await fetch("/gl/GL", {
					method : "POST",
					body : JSON.stringify(temp),
					headers : {
						"Content-Type" : "application/json;IEEE754Compatible=true"
					}
				})

			}

			this.onReset();
			this.toBack();

		},
		onReset : function(){
			this.byId("CoA").setValue("");
			this.byId("GLAccType").setValue("");
			this.byId("GLGroup").setValue("");
			this.byId("PLAccType").setValue("");
			this.byId("FuncArea").setValue("");
			this.byId("GLAcctContent").setValue("");
			this.byId("GLAccDesc").setValue("");

		}
	});
});