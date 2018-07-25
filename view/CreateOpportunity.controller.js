sap.ui.controller("opportunity.app.view.CreateOpportunity", {

	/**
	 * Called when a controller is instantiated and its View controls (if available) are already created.
	 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
	 * @memberOf view.CreateOpportunity
	 */
	onInit: function() {
		var view = this.getView();

		this.getRouter().attachRouteMatched(function(oEvent) {
			var sContextPath = new sap.ui.model.Context(view.getModel(), "/" + oEvent.getParameter("arguments").item);
			view.setBindingContext(sContextPath);
			//	var data = oEvent.getParameter("arguments").item;
			var oModel = new sap.ui.model.json.JSONModel({
				data: oEvent.getParameter("arguments").item
			});
			this.getView().setModel(oModel, "vm");
		}, this);

		//this.oInitialLoadFinishedDeferred = jQuery.Deferred();
		this.getRouter().attachRouteMatched(this.onRouteMatched, this);
		//	var oEventBus = this.getEventBus();
		//	oEventBus.subscribe("Master", "TabChanged", this.onDetailTabChanged, this);

	},
	getEventBus: function() {
		return sap.ui.getCore().getEventBus();
	},
	onNavBack: function() {
		this.getRouter().myNavBack("detail");
	},
	getRouter: function() {
		return sap.ui.core.UIComponent.getRouterFor(this);
	},
	onRouteMatched: function(oEvent) {
	/*	var s;
		s = {
			SalesStages: [],
			Priorities: [],
			UserStatuses: []
		};
		this.fill_dropDowns(s);
		var j = new sap.ui.model.json.JSONModel();
		this.byId('statusdropdown').setModel(j, "json");
*/
		/*		var oParameters = oEvent.getParameters();
		var oView = this.getView();
		this.copied = false;

		// When navigating in the Detail page, update the binding context 
		if (oParameters.name !== "create") {
			return;
		}
		this.ProcessTypeDescription = oParameters.arguments.ProcessTypeDescription;
		var vmModel = oView.getModel("vm");
		oView.byId("title").setValue("sContextPath.sPath");
		vmModel.setProperty("/Opportunity", sContextPath.sPath);*/
	},
	showAccountF4: function(oEvent) {

		if (!this._oDialog) {
			this._oDialog = sap.ui.xmlfragment("opportunity.app.view.AccountSelectDialog", this);
			this._oDialog.setModel(this.getView().getModel());
		}

		// TODO:  // Multi-select if required
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
	showSalesStages: function(oEvent) {

		if (!this._oDialog) {
			this._oDialog = sap.ui.xmlfragment("opportunity.app.view.SalesStage", this);
			this._oDialog.setModel(this.getView().getModel());
		}

		// TODO:  // Multi-select if required
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
	setAccount: function(e) {
		//	var s = e.getParameter("selectedItem");
		var s = e.getParameter("selectedContexts")[0];
		var a = s.getProperty("AccountId");
		//	var b = s.data("ID");
		if (a !== "") {
			this.byId('customer').setValue(a);
			this.accountName = a;
		}
		/*else {
			this.byId('customer').setValue(b);
			this.accountName = b;
		}*/
		this.accountId = a;
		this.byId('customer').setValueState(sap.ui.core.ValueState.None);
	},
	handleAccSelSearch: function(oEvent) {
		var sValue = oEvent.getParameter("value");
		// 	var searchString = this.getView().byId("searchField").getValue();
		var oFilter = new sap.ui.model.Filter("AccountId", "EQ", sValue); //new Filter("ProjectName", "EQ", searchString);
		var oBinding = oEvent.getSource().getBinding("items");
		oBinding.filter([oFilter]);
	},
	showCurrencyF4: function(oEvent) {
		if (!this._oDialog) {
			this._oDialog = sap.ui.xmlfragment("opportunity.app.view.CurrencyDialog", this);
			this._oDialog.setModel(this.getView().getModel());
		}

		// TODO:  // Multi-select if required
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
	setCurrency: function(e) {
		var sel = e.getParameter("selectedContexts")[0];
		var curr = sel.getProperty("CurrencyCode");
		this.byId('currency').setValue(curr);
		this.CurrencyCode = curr;
		this.byId('currency').setValueState(sap.ui.core.ValueState.None);
	},
	searchCurrency: function(oEvent) {
		var sValue = oEvent.getParameter("value");
		// 	var searchString = this.getView().byId("searchField").getValue();
		var oFilter = new sap.ui.model.Filter("CurrencyCode", "EQ", sValue); //new Filter("ProjectName", "EQ", searchString);
		var oBinding = oEvent.getSource().getBinding("items");
		oBinding.filter([oFilter]);
	},
	showContactF4: function(e) {
		var m = this.getView().getModel();
		this.contactF4Fragment.getContent()[0].removeSelections();
		this.contactF4Fragment.setModel(new sap.ui.model.json.JSONModel());
		this.contactF4Fragment.setModel(this.getView().getModel("i18n"), "i18n");
		this.contactF4Fragment.getContent()[0].setNoDataText(sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText(
			'LOADING_TEXT'));
		var t = this.contactF4Fragment.getContent()[0].getInfoToolbar();
		var a = t.getContent()[0];
		t.setVisible(false);
		var s = this.byId('inputMainContact')._lastValue;
		var T = s.split('/');
		var b = T[0].replace(/\s+$/, "");
		this.contactF4Fragment.getSubHeader().getContentLeft()[0].setValue(b);
		var c = this.byId('customer').getValue();
		this.opportunity_number = this.accountId;
		this.contactF4Fragment.open();
		var j = new sap.ui.model.json.JSONModel();
		this.contactF4Fragment.setModel(j, "json");
		if (c != "" && c != undefined) {
			t.setVisible(true);
			a.setText(sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText('FILTER') + " " + c);
			m.read("/AccountCollection(accountID='" + this.opportunity_number + "')/Contacts", null, ["$filter=substringof('" + b + "'" +
				",fullName)"], true, jQuery.proxy(function(o, r) {
				this.contactF4Fragment.getModel('json').setData({
					ContactCollection: r.data.results
				});
				if (r.data.results.length === 0) this.contactF4Fragment.getContent()[0].setNoDataText(sap.ca.scfld.md.app.Application.getImpl().getResourceBundle()
					.getText('NO_CONTACTS'))
			}, this), jQuery.proxy(function(E) {
				this.contactF4Fragment.getModel('json').setData({
					ContactCollection: []
				});
				this.contactF4Fragment.getContent()[0].setNoDataText(sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText(
					'NO_CONTACTS'))
			}, this))
		} else {
			t.setVisible(false);
			this.contactF4Fragment.getModel('json').setData({
				ContactCollection: []
			});
			this.contactF4Fragment.getContent()[0].setNoDataText(sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText(
				'LOADING_TEXT'));
			m.read("ContactCollection", null, ["$filter=substringof('" + b + "'" + ",fullName)"], true, jQuery.proxy(function(o, r) {
				this.contactF4Fragment.getModel('json').setData({
					ContactCollection: r.data.results
				});
				if (r.data.results.length === 0) this.contactF4Fragment.getContent()[0].setNoDataText(sap.ca.scfld.md.app.Application.getImpl().getResourceBundle()
					.getText('NO_CONTACTS'))
			}, this), jQuery.proxy(function(E) {
				this.contactF4Fragment.getContent()[0].setNoDataText(sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText(
					'NO_CONTACTS'))
			}, this))
		}
	}
/*	fill_dropDowns: function(s) {
		var i, a;
		var j = new sap.ui.model.json.JSONModel();
		var b = new sap.ui.model.json.JSONModel();
		var c = new sap.ui.model.json.JSONModel();
		a = s.UserStatuses.length;
		var d = {
			UserStatuses: [{
				BusinessTransaction: "",
				LanguageCode: "",
				ProcessType: this.processType,
				StatusProfile: "",
				UserStatusCode: "",
				UserStatusText: ""
			}]
		};
		for (i = 0; i < a; i++) {
			if (s.UserStatuses[i].ProcessType === this.processType) {
				d.UserStatuses.push(s.UserStatuses[i]);
				if (this.UserStatusCode === "" && s.UserStatuses[i].UserStatusCode != "") {
					this.UserStatusCode = s.UserStatuses[i].UserStatusCode;
					this.UserStatusText = s.UserStatuses[i].UserStatusText;
				}
				if (s.UserStatuses[i].BusinessTransaction === "WINN") {
					this.getView().getController().WinStatusCode = s.UserStatuses[i].UserStatusCode;
				}
				if (s.UserStatuses[i].BusinessTransaction === "LOST") {
					this.getView().getController().LostStatusCode = s.UserStatuses[i].UserStatusCode;
				}
				this.StatusProfile = s.UserStatuses[i].StatusProfile;
			}
		}
		j.setData(d);
		this.byId('statusdropdown').setModel(j, "json");
		var e = {
			Priorities: [{
				LanguageCode: "",
				PriorityCode: "",
				PriorityText: ""
			}]
		};
		a = s.Priorities.length;
		for (i = 0; i < a; i++) {
			e.Priorities.push(s.Priorities[i]);
		}
		b.setData(e);
		this.byId('priority_val').setModel(b, "json");
		a = s.SalesStages.length;
		var f = {
			SalesStages: [{
				ChanceOfSuccess: "",
				LanguageCode: "",
				ProcessType: this.processType,
				SalesStageCode: "",
				SalesStageDescription: "",
				SalesStageOrder: ""
			}]
		};
		for (i = 0; i < a; i++) {
			if (s.SalesStages[i].ProcessType === this.processType) {
				f.SalesStages.push(s.SalesStages[i]);
			}
		}
		c.setData(f);
		this.byId('stagedropdown').setModel(c, "json");
	}*/

	/**
	 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
	 * (NOT before the first rendering! onInit() is used for that one!).
	 * @memberOf view.CreateOpportunity
	 */
	//	onBeforeRendering: function() {
	//
	//	},

	/**
	 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
	 * This hook is the same one that SAPUI5 controls get after being rendered.
	 * @memberOf view.CreateOpportunity
	 */
	//	onAfterRendering: function() {
	//
	//	},

	/**
	 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
	 * @memberOf view.CreateOpportunity
	 */
	//	onExit: function() {
	//
	//	}

});