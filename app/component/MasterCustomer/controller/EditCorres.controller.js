// import data from "../model/Correspondece.js";

sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/ui/richtexteditor/RichTextEditor",
	"sap/ui/richtexteditor/library",
	"sap/m/SearchField",
	"sap/ui/table/Column",
    "sap/m/MessageBox",
	"sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",

], function(
	Controller, 
	JSONModel,
	RichTextEditor, 
	library,
	SearchField,
	UIColumn,
	MessageBox,
	Filter,
	FilterOperator
) {
	"use strict";

	let total = 100000, 
	customer = "희리", 
	cocdName = "일환전자",
	author = "Sumin Lee",
	now = new Date,
	date = now.getFullYear() + "." +(now.getMonth()+1).toString().padStart(2,'0')+"."+now.getDate().toString().padStart(2, '0'),
	dueDate = now.getFullYear() + "." +(now.getMonth()+1).toString().padStart(2,'0')+"."+(now.getDate()+3).toString().padStart(2, '0'),
	sHtmlUpdtaeValue;

	return Controller.extend("project3.controller.EditCorres", {
        onInit: function() {
			// this.initARTextEditor('ARBalanceConfirm');
			this.getOwnerComponent().getRouter().getRoute("EditCorres").attachPatternMatched(this.onDataView,this);

		},

		/**
		 * @override
		 */
		 onSetValue: function(oEvent) {
			let BpCompanyName = this.byId("BpCompanyName").getValue();
			let constructor = this.byId("constructor").getValue();
			let bpName = this.byId("bpName").getValue();
			let createdDate = this.byId("createdDate").getValue();
			let DueDate = this.byId("DueDate").getValue();

			if(DueDate){
				dueDate = DueDate;
			}
			if(BpCompanyName){
				cocdName = BpCompanyName;
			}
			if(constructor){
				author = constructor;
			}
			if(bpName){
				customer = bpName;
			}
			if(createdDate){
				date = createdDate;
			}
			this.handleSelect();
		},

		onAfterRendering: function() {
			let sHtmlValue = 			`<h3 style="text-align: center;">채권잔액조회서</h3>		
			<p style="text-align: justify; background: white; font-size: 10pt; font-family: Calibri, sans-serif;"><strong><span style="font-size: 10.5pt; font-family: sans-serif; color: black;">${customer}</span></strong>
			<span>회계담당 귀하 </span></p>
			<span><p>귀사의 발전을 축언하오며 항상 각별하신 애호와 협조에 감사드립니다. </span></p> 
			<span><p>당사는 정기회계감사를 받고 있는바 이와 관련하여 <strong>${date}</strong>일 현재의 귀사와의 거래잔액과 내용을 확인하고자 하오니 귀사의 장부와 대조, 확인하시고 그 상위 유뮤를 아래 확인 통지란에 기입 서명날인하여 1부를 당사의 감사인인 삼일회계법인 앞으로 직접 우송하여 주시기 바랍니다. </span></p>
			<span><p>감사인: 삼일회계법인 서울 용산구 12길 7층 </span></p>
			<span><p>담당회계사: 조일환 </span></p>
			<span><p>담당자연락처: 010-1111-1111 </span></p> 
			<span><p>본 조회내용은 공인회계사법 제 20조 및 주식회사 외부감사에 관한 법률 제 9조에 의거 그 비밀이 보장되고 회계감사목적으로만 이용될것입니다. </span></p> 
			<br/>
				<span style="float:left">
					<p><span style="font-size: 10.5pt; font-family: sans-serif; color: #0070c0;">당사가 받을 금액 : <strong>${total}</strong></span></p>
					<table style="width:30rem;" border="1">
						<tr align = "center" bgcolor="skybule">
							<td>계정과목</td>
							<td>금액</td>
							<td>비고</td>
						</tr>
						<tr>
							<td>매출채권</td>
							<td>1,000,000</td>
							<td></td>
						</tr>
						<tr>
							<td>미수급금</td>
							<td>1.000.000</td>
							<td></td>
						</tr>
						<tr>
							<td>합계</td>
							<td>2,000,000</td>
							<td></td>
						</tr>
					</table>
				</span>
				<span style="float:right">

					<p><span style="font-size: 10.5pt; font-family: sans-serif; color: #0070c0;">상위점</span></p>
					<table border="1" style="width:30rem">
						<th>테이블</th>
						<tr>
							<td style="height:10rem"></td>
						</tr>
						<tr>
							<td>
								확인자 : <br/>
								담당자 연락처 : <br/>
								확인일자 : 20 &nbsp;&nbsp;  년 &nbsp;&nbsp; 월 &nbsp;&nbsp; 일
							</td>
						</tr>
					</table>
				</span>

			<br/>

			<p style="text-align: end;"><strong>작성부서: ${cocdName}</strong> 경영지원팀</p>
			<p style="text-align: end;"><strong>작성자:  ${author}</strong> </p>
			<p style="text-align: end;"><strong>작성일자 : ${date}</strong></p>
			<p style="text-align: end;">- <strong>${cocdName} </strong>-</p>`;


			

			let EditorType = library.EditorType;
			this._rich = new RichTextEditor('richEdit',{
				visible: true,
				editorType: EditorType.TinyMCE5,
				width: "100%",
				height: "600px",
				customToolbar: true,
				showGroupFont: true,
				showGroupLink: true,
				showGroupInsert: true,
				value: sHtmlValue
			})


			this.getView().byId("RTEBox").addItem(this._rich);
		},

		handleSelect: function () {
			var sSelectedKey = this.byId("idSelect").getSelectedKey();

			let sHtml = '';
			switch (sSelectedKey) {
				case "ARBalanceConfirm":
					sHtml = this._getHTML('ARBalanceConfirm');
					this._rich.setValue(sHtml);
					break;
				case "Dunning":
					sHtml = this._getHTML('Dunning');
					this._rich.setValue(sHtml);
					break;
				default:
					break;
			}
		},

		onValueInit : function(){
			total = 100000, 
			customer = "희리", 
			cocdName = "일환전자",
			author = "Sumin Lee",
			now = new Date,
			date = now.getFullYear() + "." +(now.getMonth()+1).toString().padStart(2,'0')+"."+now.getDate().toString().padStart(2, '0'),
			dueDate = now.getFullYear() + "." +(now.getMonth()+1).toString().padStart(2,'0')+"."+(now.getDate()+3).toString().padStart(2, '0');
			this.handleSelect();
		
		},
		_getHTML: function(sKey) {
			return sKey === 'ARBalanceConfirm' 
			? 
			
			`<h3 style="text-align: center;">채권잔액조회서</h3>		
			<p style="text-align: justify; background: white; font-size: 10pt; font-family: Calibri, sans-serif;"><strong><span style="font-size: 10.5pt; font-family: sans-serif; color: black;">${customer}</span></strong>
			<span>회계담당 귀하 </span></p>
			<span><p>귀사의 발전을 축언하오며 항상 각별하신 애호와 협조에 감사드립니다. </span></p> 
			<span><p>당사는 정기회계감사를 받고 있는바 이와 관련하여 <strong>${dueDate}</strong>일 현재의 귀사와의 거래잔액과 내용을 확인하고자 하오니 귀사의 장부와 대조, 확인하시고 그 상위 유뮤를 아래 확인 통지란에 기입 서명날인하여 1부를 당사의 감사인인 삼일회계법인 앞으로 직접 우송하여 주시기 바랍니다. </span></p>
			<span><p>감사인: 삼일회계법인 서울 용산구 12길 7층 </span></p>
			<span><p>담당회계사: 조일환 </span></p>
			<span><p>담당자연락처: 010-1111-1111 </span></p> 
			<span><p>본 조회내용은 공인회계사법 제 20조 및 주식회사 외부감사에 관한 법률 제 9조에 의거 그 비밀이 보장되고 회계감사목적으로만 이용될것입니다. </span></p> 
			<br/>
				<span style="float:left">
					<p><span style="font-size: 10.5pt; font-family: sans-serif; color: #0070c0;">당사가 받을 금액 : <strong>${total}</strong></span></p>
					<table style="width:30rem;" border="1">
						<tr align = "center" bgcolor="skybule">
							<td>계정과목</td>
							<td>금액</td>
							<td>비고</td>
						</tr>
						<tr>
							<td>매출채권</td>
							<td>1,000,000</td>
							<td></td>
						</tr>
						<tr>
							<td>미수급금</td>
							<td>1.000.000</td>
							<td></td>
						</tr>
						<tr>
							<td>합계</td>
							<td>2,000,000</td>
							<td></td>
						</tr>
					</table>
				</span>
				<span style="float:right">

					<p><span style="font-size: 10.5pt; font-family: sans-serif; color: #0070c0;">상위점</span></p>
					<table border="1" style="width:30rem">
						<th>테이블</th>
						<tr>
							<td style="height:10rem"></td>
						</tr>
						<tr>
							<td>
								확인자 : <br/>
								담당자 연락처 : <br/>
								확인일자 : 20 &nbsp;&nbsp;  년 &nbsp;&nbsp; 월 &nbsp;&nbsp; 일
							</td>
						</tr>
					</table>
					</span>


			<br/>

			<p style="text-align: end;"><strong>작성부서: ${cocdName}</strong> 경영지원팀</p>
			<p style="text-align: end;"><strong>작성자:  ${author}</strong> </p>
			<p style="text-align: end;"><strong>작성일자 : ${date}</strong></p>
			<p style="text-align: end;">- <strong>${cocdName} </strong>-</p>`
			
			: 
			
			`<h3 style="text-align: center;">독촉장</h3>		
			<p style="text-align: justify; background: white; font-size: 10pt; font-family: Calibri, sans-serif;"><strong><span style="font-size: 10.5pt; font-family: sans-serif; color: black;">${customer}</span></strong>
			<span>회계담당 귀하 </span></p>
			<span><p>귀사의 발전을 축언하오며 항상 각별하신 애호와 협조에 감사드립니다. </span></p> 
			<span><p>당사가 귀사로부터 받을 채권 대금의 만기가 <strong>${dueDate}</strong>일자로 경과하였음에도 불구하고 아직 변제가 이루어지지 않은 것으로 확인됩니다. </span></p>
			<span><p>혹시 업무중에 바쁘셔서 잊으신 것이라고는 생각되나, 당사의 장부정리상 어려움이 따르고 있습니다. 조속히 조사하신 후, 만약 아직 송금 전이라면 즉시 송금해 주실 것을 부탁드립니다. </span></p> 
			<span><p>변제되어야할 채권 내역은 아래와 같습니다. </span></p> 
			<br/>

			<p><span style="font-size: 10.5pt; font-family: sans-serif; color: #0070c0;">당사가 받을 금액 : <strong>${total}</strong></span></p>
			<table style="width:30rem"  border="1">
				<tr align = "center" bgcolor="skybule">
					<td>계정과목</td>
					<td>금액</td>
					<td>만기</td>
				</tr>
				<tr>
					<td>매출채권</td>
					<td>1,000,000</td>
					<td>${dueDate}</td>
				</tr>
				<tr>
					<td></td>
					<td></td>
					<td></td>
				</tr>
				<tr>
					<td>합계</td>
					<td>2,000,000</td>
					<td></td>
				</tr>
			</table>
			<br/>

			<p style="text-align: end;"><strong>작성부서: ${cocdName}</strong> 경영지원팀</p>
			<p style="text-align: end;"><strong>작성자:  ${author}</strong> </p>
			<p style="text-align: end;"><strong>작성일자 : ${date}</strong></p>
			<p style="text-align: end;">- <strong>${cocdName} </strong>-</p>`;

		},
		onDataView: async function(){
            const CoCdList = await $.ajax({
                type:"GET",
                url:"/cocd/CoCd"
            });
            let BpCoCdModel = new JSONModel(CoCdList.value);
            this.getView().setModel(BpCoCdModel,"BpCoCdModel");

            let bpCustomerListData = await $.ajax({
                type: "GET",
                url: "/bp/BP"
            });
            let BpCustomerModel = new JSONModel(bpCustomerListData.value);
            this.getView().setModel(BpCustomerModel, "BpCustomerModel");

			let now = new Date();
			total = 100000;
			customer = "희리";
			cocdName = "일환전자";
			author = "Sumin Lee";
			dueDate = now.getFullYear() + "." +(now.getMonth()+1).toString().padStart(2,'0')+"."+(now.getDate()+3).toString().padStart(2, '0');
			date = now.getFullYear() + "." +(now.getMonth()+1).toString().padStart(2,'0')+"."+now.getDate().toString().padStart(2, '0');
			this.byId("createdDate").setValue(date);
			this.byId("DueDate").setValue(dueDate);

        },
				/*
		 * ---------------- BP 프래그먼트 동작--------------------
		*/
		onSelectBP : function(){
            if(!this.pDialog){
				this.pDialog = this.loadFragment({
					name:"project3.view.fragment.CreateInputBP"
				});
			}
			this.pDialog.then(function(oDialog){
				oDialog.open();
			});
        },
		onSearchBPDialog: function() {
			var SearchInputBP = this.byId("SearchInputBP").getValue();
			var aFilter = [];

			if (SearchInputBP) {
				aFilter = new Filter({
					filters: [
						new Filter("bp_number", FilterOperator.Contains, SearchInputBP),
						new Filter("bp_company_code", FilterOperator.Contains, SearchInputBP),
						new Filter("bp_name", FilterOperator.Contains, SearchInputBP),
					],
					and: false
				});
			}

			let oTable = this.byId("BPSelectTable").getBinding("rows");
            oTable.filter(aFilter);

		},
		// BP 선택용 다이어로그 검색창 clear용 함수
		onSearchBPReset: function() {
			this.byId("SearchInputBP").setValue("");
			this.onSearchBPDialog();
		},

		// BP 선택용 다이어로그 특정 row 선택 시 생성 페이지 Input에 값 입력
		getBPContext : function(oEvent){
			// let rowIndex = oEvent.getParameters().rowIndex;
			let rowIndex = oEvent.getParameters().rowBindingContext.sPath.split('/')[2];

			
			this.byId("bpName").setValue(oEvent.getParameters().rowBindingContext.oModel.oData[rowIndex].bp_name); 
			this.onCloseBPDialog();
		},
		// BP 선택용 다이어로그 close 함수
		onCloseBPDialog: function() {
			this.byId("BPDialog").destroy();
			this.pDialog = null;
		},
		
		/*
		 * ---------------- CoCd 프래그먼트 동작--------------------
		*/
		onSelectCoCd : function(){
            if(!this.pDialog){
				this.pDialog = this.loadFragment({
					name:"project3.view.fragment.CreateInputCoCd"
				});
			}
			this.pDialog.then(function(oDialog){
				oDialog.open();
			});
        },
		onSearchCoCdDialog: function() {
			var SearchInputCoCd = this.byId("SearchInputCoCd").getValue();
			var aFilter = [];

			if (SearchInputCoCd) {
				aFilter = new Filter({
					filters: [
						new Filter("com_code", FilterOperator.Contains, SearchInputCoCd),
						new Filter("com_code_name", FilterOperator.Contains, SearchInputCoCd),
					],
					and: false
				});
			}

			let oTable = this.byId("CoCdSelectTable").getBinding("rows");
            oTable.filter(aFilter);

		},

        // 회사코드 선택용 다이어로그 close 함수
		onCloseCoCdDialog: function() {
			this.byId("CoCdDialog").destroy();
			this.pDialog = null;
		},
		// 회사코드 선택용 다이어로그 검색창 clear용 함수
		onSearchCoCdReset: function() {
			this.byId("SearchInputCoCd").setValue("");
			this.onSearchCoCdDialog();
		},

		// 회사코드 선택용 다이어로그 특정 row 선택 시 생성 페이지 Input에 값 입력
		getCoCdContext : function(oEvent){
			// let rowIndex = oEvent.getParameters().rowIndex;
			let rowIndex = oEvent.getParameters().rowBindingContext.sPath.split('/')[1];

			
			this.byId("BpCompanyName").setValue(oEvent.getParameters().rowBindingContext.oModel.oData[rowIndex].com_code_name); 
			this.onCloseCoCdDialog();
		},
	
		
		//초기화
        onClearField: function() {
            this.byId("BpCompanyName").setValue("");
            this.byId("constructor").setValue("");  
            this.byId("bpName").setValue("");
            this.byId("createdDate").setValue(date);
            this.byId("DueDate").setValue("");

            this.onValueInit();

        }, 

        toHome: function(){
			this.onClearField();
			this.onDataView();
            this.getOwnerComponent().getRouter().navTo("Home");
        },
		toEditconfirm : function(){
			MessageBox.confirm("전송되었습니다.");
			this.onDataView();
			this.toHome();
		},



	});
});