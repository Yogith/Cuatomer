sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
], (Controller, Filter, FilterOperator) => {
    "use strict";

    return Controller.extend("customer.controller.customer", {
        onInit() {
        },
        
        // formatDate: function (value) {
        //     if (!value) return "";
        //     const date = new Date(value);
        //     return date.toLocaleDateString("en-GB"); // dd/mm/yyyy
        // },

        onSearch: function (oEvent) {
            let sValue = oEvent.getParameter("newValue");
            let aFilter=[];
            if (sValue) {
                aFilter.push(new Filter("OrderID", FilterOperator.Contains, sValue));
                // aFilter.push(
                //     new Filter({
                //         filters: [
                //             new Filter("OrderID", FilterOperator.Contains, sValue),
                //             // new Filter("ProductID", FilterOperator.Contains, sValue),
                //             // new Filter("Discount", FilterOperator.Contains, sValue)
                //         ],
                //         and: false // OR condition
                //     })
                // );
            }

            const oList = this.byId("Order_DetailsList");
            const oBinding = oList.getBinding("items");
            oBinding.filter(aFilter);
        }
    });
});
