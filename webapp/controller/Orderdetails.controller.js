sap.ui.define([
  "sap/ui/core/mvc/Controller"
], (BaseController) => {
  "use strict";

  return BaseController.extend("customer.controller.Orderdetails", {
    onInit() {
       this.getOrderTotal()
    }, formatTotal: function (Unitprice, Quantity) {
      if (!Unitprice || !Quantity) {
        return "0.00";
      } else {
        return Unitprice * Quantity
      }

    },
    getOrderTotal: function () {
      
      let total = 0;
      debugger
      let oData = this.getOwnerComponent().getModel("headermodel").getData().Order_Details.results
      oData.forEach(result => {
        total += (result.UnitPrice * result.Quantity);
      });
      this.getOwnerComponent().getModel("headermodel").setProperty("/orderTotal");
      return total;
    },
    onExitPress: function () {
      this.getOwnerComponent().getRouter().navTo("Routecustomer")
    }
  });
});