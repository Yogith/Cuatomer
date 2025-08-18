sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
], (Controller, Filter, FilterOperator) => {
    "use strict";

    return Controller.extend("customer.controller.customer", {
        onInit() {
        },
        
        formatDate: function (value) {
            if (!value) return "";
            const date = new Date(value);
            return date.toLocaleDateString("en-GB"); // dd/mm/yyyy
        },
        progress: function (RequiredDate, ShippedDate) {
            let oObjectStatus=this.byId("shippingstatus");
            if (!ShippedDate) {
                oObjectStatus.setState("Warning");
                return "Pending Shipment";
            }
        
            const reqDate = new Date(RequiredDate);
            const shipDate = new Date(ShippedDate);
        
            if (shipDate <= reqDate) {
                oObjectStatus.setState("Success");
                return "In Time";
            } else {
                oObjectStatus.setState("Errorw");
                return " Too Late";
            }
        },
        // progresstate: function(RequiredDate, ShippedDate)
        // {
        //     if (!ShippedDate) {
        //         return "Warning";
        //     }
        
        //     const reqDate = new Date(RequiredDate);
        //     const shipDate = new Date(ShippedDate);
        
        //     if (shipDate <= reqDate) {
        //         return "Success";
        //     } else {
        //         return "Error";
        //     }

        // },

        onSearch: function (oEvent) {
            debugger
            let sValue = oEvent.getParameter("newValue");
            let aFilter=[];
            if (sValue) {
                aFilter.push(
                    new Filter({
                        filters: [
                            //  new Filter("CustomerID", FilterOperator.contains, sValue),
                             new Filter("ShipCountry", FilterOperator.contains, sValue)
                            //  new Filter("OrderID", FilterOperator.contains, sValue)
                        ],
                        and: false // OR condition
                    })
                );
            }

            const oList = this.byId("Order");
            const oBinding = oList.getBinding("items");
            oBinding.filter(aFilter);
        },
        async onOpenDialog() {
            this.oDialog ??= await this.loadFragment({
                name: "customer.view.filterDialog"
            });
        
            this.oDialog.open();
        },
        onCloseDialog() {
			this.byId("helloDialog").close();
		}
    });
});
