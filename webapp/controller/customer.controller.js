sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/model/Sorter"
], (Controller, Filter, FilterOperator, Sorter) => {
    "use strict";

    return Controller.extend("customer.controller.customer", {
        onInit() { },

        formatDate(value) {
            debugger
            if (!value) return "";
            const date = new Date(value);
            return date.toLocaleDateString("en-GB"); // dd/mm/yyyy
        },

        progress(RequiredDate, ShippedDate) {
            if (!ShippedDate) {
                return "Pending Shipment";
            }

            const reqDate = new Date(RequiredDate);
            const shipDate = new Date(ShippedDate);

            return shipDate <= reqDate ? "In Time" : "Too Late";
        },

        progresstate(RequiredDate, ShippedDate) {
            if (!ShippedDate) {
                return "Warning";
            }

            const reqDate = new Date(RequiredDate);
            const shipDate = new Date(ShippedDate);

            return shipDate <= reqDate ? "Success" : "Error";
        },

        onUpdateFinished(oEvent) {
            const iTotalItems = oEvent.getParameter("total");
            const oPage = this.byId("orderPage");
            if (iTotalItems && oPage) {
                oPage.setTitle("Orders (" + iTotalItems + ")");
            }
        },

        onSearch(oEvent) {
            let sValue = oEvent.getParameter("newValue");
            let aFilter = [];
            if (sValue) {
                aFilter.push(
                    new Filter({
                        filters: [
                            new Filter("ShipCity", FilterOperator.Contains, sValue),
                            new Filter("ShipCountry", FilterOperator.Contains, sValue),
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
            this.byId("filterDialog").close();
        },

        // -------------------- Navigation --------------------
        onOrdersPress() {
            this.byId("filterNav").to(this.byId("pageOrders"));
        },

        onGroupPress() {
            this.byId("filterNav").to(this.byId("pageGroup"));
        },

        onNavBack() {
            this.byId("filterNav").back();
        },

        // -------------------- Orders --------------------
        onSearchOrders(oEvent) {
            const sQuery = oEvent.getParameter("newValue");
            const oList = this.byId("ordersList");
            const oBinding = oList.getBinding("items");

            if (oBinding) {
                oBinding.filter(new Filter("title", FilterOperator.Contains, sQuery));
            }
        },

        onResetOrders() {
            const oList = this.byId("ordersList");
            oList.removeSelections();

            const oResetBtn = this.byId("resetBtnOrders");
            if (oList.getSelectedItems().length === 0) {
                oResetBtn.removeStyleClass("resetBtnActive");
            } else {
                oResetBtn.addStyleClass("resetBtnActive");
            }

            this.byId("filterNav").back();
        },

        // -------------------- Group --------------------
        onResetGroup() {
            this.byId("groupOrder").setSelectedIndex(0); // Ascending
            this.byId("groupBy").setSelectedIndex(3);    // Not Grouped
        },

        onConfirmSettings() {
            // ---- Get values from Group Page ----
            const iOrderIndex = this.byId("groupOrder").getSelectedIndex();
            const sOrder = iOrderIndex === 0 ? false : true; // false=asc, true=desc

            const iGroupIndex = this.byId("groupBy").getSelectedIndex();
            let sGroupKey = null;

            switch (iGroupIndex) {
                case 0: sGroupKey = "ShipCity"; break;
                case 1: sGroupKey = "ShipCountry"; break;
                case 2: sGroupKey = "ShippedDate"; break;
                default: sGroupKey = null;
            }

            // ---- Apply sorting/grouping to the Order list ----
            const oList = this.byId("Order"); // your table/list id
            const oBinding = oList.getBinding("items");

            if (sGroupKey) {
                oBinding.sort([new Sorter(sGroupKey, sOrder, true)]);
            } else {
                oBinding.sort([new Sorter("OrderID", sOrder)]);
            }

            // Close the dialog
            this.byId("filterDialog").close();
        },

        // -------------------- Reset All --------------------
        onResetAll() {
            // Reset Orders
            this.onResetOrders();

            // Reset Group
            this.onResetGroup();
        },
        onItemPress(oEvent) {
            debugger
            var that=this;
            let oorderdetails = oEvent.getSource().getBindingContext().getObject()
            console.log(oorderdetails)
            let selectedOrderID = oorderdetails.OrderID;
            let sPath = "/Orders(" + selectedOrderID + ")"
            let sCustomer = "/Orders(" + selectedOrderID + ")/Customer"
            var oModel = this.getView().getModel(); // V2 ODataModel

            oModel.read(sPath, {
                urlParameters: {
                    "$expand": "Customer,Order_Details/Product,Employee,Shipper"
                },
                success: function (oData) {
                    console.log("Order + Customer:", oData);
                    debugger
                    that.getOwnerComponent().getModel("headermodel").setData(oData)
                },
                error: function (oError) {
                    console.error("Error:", oError);
                }
            });

            // oModel.read(sPath, {
            //     success: function (oData) {
            //         console.log("Order_Details:", oData.results);
            //     },
            //     error: function (oError) {
            //         console.error("Error fetching Products", oError);
            //     }
            // })
            oModel.read(sCustomer, {
                success: function (oData) {
                    console.log("Customer_Details:", oData.results);
                },
                error: function (oError) {
                    console.error("Error fetching Products", oError);
                }
            })
            this.getOwnerComponent().getRouter().navTo("orderdetails")

        }
        // formatTotal:function(Unitprice,Quantity){
        //     if(!Unitprice||!Quantity){
        //         return "0.00";
        //     }else{
        //         return Unitprice*Quantity

        //     }

        // }

    });
});
