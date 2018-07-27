sap.ui.define([
    'jquery.sap.global',
    'sap/m/MessageToast',
    'sap/ui/core/Fragment',
    'sap/ui/core/mvc/Controller',
    'sap/ui/model/Filter',
    'sap/ui/model/json/JSONModel'
  ], function(jQuery, MessageToast, Fragment, Controller, Filter, JSONModel) {
	"use strict";

	sap.ui.core.mvc.Controller.extend("opportunity.app.view.Master", {

		onInit: function() {
			this.oInitialLoadFinishedDeferred = jQuery.Deferred();
			var oEventBus = this.getEventBus();
			oEventBus.subscribe("Detail", "TabChanged", this.onDetailTabChanged, this);

			var oList = this.getView().byId("list");
			oList.attachEvent("updateFinished", function() {
				this.oInitialLoadFinishedDeferred.resolve();
				oEventBus.publish("Master", "InitialLoadFinished");
			}, this);

			//On phone devices, there is nothing to select from the list. There is no need to attach events.
			if (sap.ui.Device.system.phone) {
				return;
			}
			//debugger;
			this.getRouter().attachRoutePatternMatched(this.onRouteMatched, this);

			oEventBus.subscribe("Detail", "Changed", this.onDetailChanged, this);
			oEventBus.subscribe("Detail", "NotFound", this.onNotFound, this);
		},

		onRouteMatched: function(oEvent) {
			var sName = oEvent.getParameter("name");
			var oParameters = oEvent.getParameters();
			if (sName !== "main") {
				return;
			}

			//Load the detail view in desktop
			this.loadDetailView();

			//Wait for the list to be loaded once
			this.waitForInitialListLoading(function() {

				//On the empty hash select the first item
				this.selectFirstItem();

			});
			var sTabKey = oParameters.arguments.tab;
			this.getEventBus().publish("CreateOpportunity", "TabChanged", {
				sTabKey: sTabKey
			});

		},

		onDetailChanged: function(sChanel, sEvent, oData) {
			var sEntityPath = oData.sEntityPath;
			//Wait for the list to be loaded once
			this.waitForInitialListLoading(function() {
				var oList = this.getView().byId("list");

				var oSelectedItem = oList.getSelectedItem();
				// The correct item is already selected
				if (oSelectedItem && oSelectedItem.getBindingContext().getPath() === sEntityPath) {
					return;
				}

				var aItems = oList.getItems();

				for (var i = 0; i < aItems.length; i++) {
					if (aItems[i].getBindingContext().getPath() === sEntityPath) {
						oList.setSelectedItem(aItems[i], true);
						break;
					}
				}
			});
		},

		onDetailTabChanged: function(sChanel, sEvent, oData) {
			this.sTab = oData.sTabKey;
		},

		loadDetailView: function() {
			this.getRouter().myNavToWithoutHash({
				currentView: this.getView(),
				targetViewName: "opportunity.app.view.Detail",
				targetViewType: "XML"
			});
		},

		waitForInitialListLoading: function(fnToExecute) {
			jQuery.when(this.oInitialLoadFinishedDeferred).then(jQuery.proxy(fnToExecute, this));
		},

		onNotFound: function() {
			this.getView().byId("list").removeSelections();
		},

		selectFirstItem: function() {
			var oList = this.getView().byId("list");
			var aItems = oList.getItems();
			if (aItems.length) {
				oList.setSelectedItem(aItems[0], true);
				//Load the detail view in desktop
				this.loadDetailView();
				oList.fireSelect({
					"listItem": aItems[0]
				});
			} else {
				this.getRouter().myNavToWithoutHash({
					currentView: this.getView(),
					targetViewName: "opportunity.app.view.NotFound",
					targetViewType: "XML"
				});
			}
		},

		onSearch: function() {
			this.oInitialLoadFinishedDeferred = jQuery.Deferred();
			// Add search filter
			var filters = [];
			var searchString = this.getView().byId("searchField").getValue();
			if (searchString && searchString.length > 0) {
				filters = [new sap.ui.model.Filter("ID", "EQ", searchString)];
			}
			// Update list binding
			this.getView().byId("list").getBinding("items").filter(filters);

			//On phone devices, there is nothing to select from the list
			if (sap.ui.Device.system.phone) {
				return;
			}

			//Wait for the list to be reloaded
			this.waitForInitialListLoading(function() {
				//On the empty hash select the first item
				this.selectFirstItem();
			});
		},

		add: function(oEvent) {
			if (!this._oDialog) {
				this._oDialog = sap.ui.xmlfragment("opportunity.app.view.add_dialog", this);
				this._oDialog.setModel(this.getView().getModel());
			}

			// Multi-select if required
			var bMultiSelect = !!oEvent.getSource().data("multi");
			this._oDialog.setMultiSelect(bMultiSelect);

			// Remember selections if required
			var bRemember = !!oEvent.getSource().data("remember");
			this._oDialog.setRememberSelections(bRemember);

			// clear the old search filter
			this._oDialog.getBinding("items").filter([]);

			// toggle compact style
			jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(), this._oDialog);
			this._oDialog.open();
		},
		handleTrTypeSearch: function(oEvent) {
			var sValue = oEvent.getParameter("value");
			// 	var searchString = this.getView().byId("searchField").getValue();
			var oFilter = new Filter("ProcessTypeCode", "EQ", sValue); //new Filter("ProjectName", "EQ", searchString);
			var oBinding = oEvent.getSource().getBinding("items");
			oBinding.filter([oFilter]);
		},

		onSelect: function(oEvent) {
			// Get the list item either from the listItem parameter or from the event's
			// source itself (will depend on the device-dependent mode)
			this.showDetail(oEvent.getParameter("listItem") || oEvent.getSource());
		},

		showDetail: function(oItem) {
			// If we're on a phone device, include nav in history
			var bReplace = sap.ui.device.system.phone ? false : true;
			// Replace the deprecated API - Sharath
			//var xReplace = sap.ui.Device.system.phone ? false : true;
			
			this.getRouter().navTo("detail", {
				from: "master",
				entity: oItem.getBindingContext().getPath().substr(1),
				tab: this.sTab
			}, bReplace);
		},

		getEventBus: function() {
			return sap.ui.getCore().getEventBus();
		},
		onTypeSelect: function(oEvent) {
			// var bReplace = jQuery.device.is.phone ? false : true;
			var selectedItem = oEvent.getParameter("selectedContexts")[0];
			var processTypeCode = selectedItem.getProperty("Description");

		/*	this.getRouter().myNavToWithoutHash({

				currentView: this.getView(),
				targetViewName: "opportunity.app.view.CreateOpportunity",
				targetViewType: "XML",
				transition: "slide"
			} 
			)*/
		//	var sPath = selectedItem.getBindingContextPath().substr(1);
		this.getRouter().navTo("create", {
			from: "detail",
			entity: "CreateOpportunity",
			item: processTypeCode
		}, false);
			
		},

		getRouter: function() {
			return sap.ui.core.UIComponent.getRouterFor(this);
		},

		onExit: function(oEvent) {
			var oEventBus = this.getEventBus();
			oEventBus.unsubscribe("Detail", "TabChanged", this.onDetailTabChanged, this);
			oEventBus.unsubscribe("Detail", "Changed", this.onDetailChanged, this);
			oEventBus.unsubscribe("Detail", "NotFound", this.onNotFound, this);
		}
	});
});