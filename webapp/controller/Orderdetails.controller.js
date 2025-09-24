sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "sap/f/library"
], (BaseController, fioriLibrary) => {
  "use strict";

  return BaseController.extend("customer.controller.Orderdetails", {
    onInit: function () {
      let oModel = this.getOwnerComponent().getModel("headermodel");
      if (oModel) {
        oModel.attachRequestCompleted(() => {
          this.getOrderTotal();
        });
      }
    },
    formatTotal: function (Unitprice, Quantity) {
      if (!Unitprice || !Quantity) {
        return "0.00";
      } else {
        return Unitprice * Quantity
      }

    },
    getOrderTotal: function () {
      let total = 0;
      const oModel = this.getOwnerComponent().getModel("headermodel");

      if (oModel) {
        const oData = oModel.getData();
        if (oData?.Order_Details?.results) {
          oData.Order_Details.results.forEach(result => {
            total += (result.UnitPrice * result.Quantity);
          });
        }
        oModel.setProperty("/orderTotal", total);
      }
      return total;
    },
    onExitPress: function () {
      this.getOwnerComponent().getRouter().navTo("Routecustomer")
      var oFCL = this.oView.getParent().getParent();
      oFCL.setLayout(fioriLibrary.LayoutType.OneColumnExpanded);
    },
    onOpenDialog: function () {
      var oHCL = this.oView.getParent().getParent();
      oHCL.setLayout(fioriLibrary.LayoutType.MidColumnFullScreen);
    }


  });
});