sap.ui.define(
    [
        "sap/ui/core/mvc/Controller"
    ],
    function(BaseController) {
      "use strict";
  
      return BaseController.extend("project1.controller.App", {
        onInit() {
        },
        toCustomer : function (){
          this.getOwnerComponent().getRouter().navTo("Customer");
        },
        toGLAccount : function (){
          this.getOwnerComponent().getRouter().navTo("GLAccount");
        },
        toCompanyCode: function(){
          this.getOwnerComponent().getRouter().navTo("CompanyCode");
        },
        toHome : function(){
          this.byId('menu').setText('메뉴');
          this.getOwnerComponent().getRouter().navTo("Home");
        }
      });
    }
  );
  