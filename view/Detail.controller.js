jQuery.sap.require("opportunity.app.util.Formatter");
jQuery.sap.require("sap.ca.ui.model.type.FileSize");
jQuery.sap.require("sap.ca.scfld.md.controller.BaseDetailController");
sap.ui.core.mvc.Controller.extend("opportunity.app.view.Detail", {

	onInit: function() {
		this.oInitialLoadFinishedDeferred = jQuery.Deferred();
		if (sap.ui.Device.system.phone) {
			//Do not wait for the master when in mobile phone resolution
			this.oInitialLoadFinishedDeferred.resolve();
		} else {
			this.getView().setBusy(true);
			var oEventBus = this.getEventBus();
			oEventBus.subscribe("Component", "MetadataFailed", this.onMetadataFailed, this);
			oEventBus.subscribe("Master", "InitialLoadFinished", this.onMasterLoaded, this);
		}

		this.getRouter().attachRouteMatched(this.onRouteMatched, this);
	},

	onMasterLoaded: function(sChannel, sEvent) {
		this.getView().setBusy(false);
		this.oInitialLoadFinishedDeferred.resolve();
	},

	onMetadataFailed: function() {
		this.getView().setBusy(false);
		this.oInitialLoadFinishedDeferred.resolve();
		this.showEmptyView();
	},

	onRouteMatched: function(oEvent) {
		var oParameters = oEvent.getParameters();

		jQuery.when(this.oInitialLoadFinishedDeferred).then(jQuery.proxy(function() {
			var oView = this.getView();

			// When navigating in the Detail page, update the binding context 
			if (oParameters.name !== "detail") {
				return;
			}

			var sEntityPath = "/" + oParameters.arguments.entity;
			this.bindView(sEntityPath);

			var oIconTabBar = oView.byId("idIconTabBar");
			oIconTabBar.setSelectedKey();
			oIconTabBar.setExpanded(true);
			oIconTabBar.getItems().forEach(function(oItem) {
				if (oItem.getKey() !== "selfInfo") {
					oItem.bindElement(oItem.getKey());
				}
			});

			// Specify the tab being focused
			var sTabKey = oParameters.arguments.tab;
			this.getEventBus().publish("Detail", "TabChanged", {
				sTabKey: sTabKey
			});

			if (oIconTabBar.getSelectedKey() !== sTabKey) {
				oIconTabBar.setSelectedKey(sTabKey);
			}
		}, this));

	},

	bindView: function(sEntityPath) {
		var oView = this.getView();
		oView.bindElement(sEntityPath);

		//Check if the data is already on the client
		if (!oView.getModel().getData(sEntityPath)) {

			// Check that the entity specified was found.
			oView.getElementBinding().attachEventOnce("dataReceived", jQuery.proxy(function() {
				var oData = oView.getModel().getData(sEntityPath);
				if (!oData) {
					this.showEmptyView();
					this.fireDetailNotFound();
				} else {
					this.fireDetailChanged(sEntityPath);
				}
			}, this));

		} else {
			this.fireDetailChanged(sEntityPath);
		}

	},

	showEmptyView: function() {
		this.getRouter().myNavToWithoutHash({
			currentView: this.getView(),
			targetViewName: "opportunity.app.view.NotFound",
			targetViewType: "XML"
		});
	},

	fireDetailChanged: function(sEntityPath) {
		this.getEventBus().publish("Detail", "Changed", {
			sEntityPath: sEntityPath
		});
	},

	fireDetailNotFound: function() {
		this.getEventBus().publish("Detail", "NotFound");
	},

	onNavBack: function() {
		// This is only relevant when running on phone devices
		this.getRouter().myNavBack("main");
	},

	onDetailSelect: function(oEvent) {
		sap.ui.core.UIComponent.getRouterFor(this).navTo("detail", {
			entity: oEvent.getSource().getBindingContext().getPath().slice(1),
			tab: oEvent.getParameter("selectedKey")
		}, true);
	},

	openActionSheet: function() {

		if (!this._oActionSheet) {
			this._oActionSheet = new sap.m.ActionSheet({
				buttons: new sap.ushell.ui.footerbar.AddBookmarkButton()
			});
			this._oActionSheet.setShowCancelButton(true);
			this._oActionSheet.setPlacement(sap.m.PlacementType.Top);
		}

		this._oActionSheet.openBy(this.getView().byId("actionButton"));
	},

	/* Calling Expand based on selected tab */
	selectedTab: function(oControlEvent) {
		this.byId('info').setModel(
			new sap.ui.model.json.JSONModel(), "json");
		this.getView().setModel(
			new sap.ui.model.json.JSONModel(), "json");
		var oView = this.getView();
		var dataObj = oView.getBindingContext().getObject();
		var OppID = dataObj.ID;
		var oModel = this.getView().getModel();
		var tab_selection = oControlEvent.getSource().getSelectedKey();
		if (this.byId('info').getModel('json'))
			var headerGuid = this.byId('info').getModel('json')
				.getData().Guid;
		var sPath = "/Opportunities('" + OppID + "')";

		/* When Note tab is selected */
		if (tab_selection == "Notes") {
			var that = this;
			oModel
				.read(
					sPath,
					null, ["$expand=Notes"],
					true,
					function(odata, response) {
						var tab = that.getView().byId(
							"notesList");
						var jsonModel = new sap.ui.model.json.JSONModel();
						var data1 = {
							Notes: response.data.Notes.results
						};
						jsonModel.setData(data1);
						tab.setModel(jsonModel, "json");

					});

		}

		if (tab_selection === "Products") {
			var that = this;
			oModel
				.read(
					sPath,
					null, ["$expand=Products"],
					true,
					function(odata, response) {
						var tab = that.getView().byId(
							"Product_Tab");
						var jsonModel = new sap.ui.model.json.JSONModel();
						var data1 = {
							Products: response.data.Products.results
						};
						jsonModel.setData(data1);
						tab.setModel(jsonModel, "json");

					});

		}
		if (tab_selection === "SalesTeam") {
			var that = this;
			oModel
				.read(
					sPath,
					null, ["$expand=SalesTeams"],
					true,
					function(odata, response) {
						var tab = that.getView().byId(
							"Sales_Team");
						var jsonModel = new sap.ui.model.json.JSONModel();
						var data1 = {
							SalesTeams: response.data.SalesTeams.results
						};
						jsonModel.setData(data1);
						tab.setModel(jsonModel, "json");

					});

		}
		if (tab_selection === "Attachments") {
			var info = this.getView().byId('info');

			// get the list to set the post url param
			var that = this.getView();
			var file = that.byId("fileupload");
			if (file.getEditMode() === true)
				file.setEditMode(false);
			// refresh to get xcsrf Token
			oModel.refreshSecurityToken();
			// get token
			var oModelHeaders = oModel.getHeaders();
			file.setXsrfToken(oModelHeaders['x-csrf-token']);

			// remove - from guid
			//	var nheaderGuid = headerGuid.replace(/-/g, '');
			// set custom header
			//	file.setCustomHeader("slug", nheaderGuid);

			oModel
				.read(
					sPath,
					null, ["$expand=Attachments"],
					true,
					function(odata, response) {
						var data = {
							OpportunityAttachments: []
						};
						var length = response.data.Attachments.results.length;
						// NLUN - CodeScan Changes -
						// Global variables
						for (var i = 0; i < length; i++) {
							var value = response.data.Attachments.results[i];
							var URL = value.__metadata.media_src;
							// URL =
							// URL.replace(/^https:\/\//i,
							// 'http://');
							var o = {
								name: value.Name,
								size: value.fileSize,
								url: URL,
								//	uploadedDate : opportunity.app.util.Formatter
								//			.dateFormatter(value.CreatedAt),
								contributor: value.CreatedBy,
								fileExtension: opportunity.app.util.Formatter
									.mimeTypeFormatter(value.MimeType),
								fileId: value.DocumentId

							};
							data.OpportunityAttachments
								.push(o);
						}

						that
							.byId('fileupload')
							.setModel(
								new sap.ui.model.json.JSONModel(
									data));

					});

		}
	},

	getEventBus: function() {
		return sap.ui.getCore().getEventBus();
	},
	onUploadFile: function(oResponse) {
		// get uloaded data
		var oFile = oResponse.getParameter("d");
		// in url replace https to http
		var URL = oFile.__metadata.media_src;

		// date in correct formate
		var date = parseInt((oFile.CreatedAt).substr(6));

		var fName = decodeURIComponent(oFile.Name);
		// set the object
		// NLUN - CodeScan Changes - Global Variables
		var object = {

			"fileExtension": opportunity.app.util.Formatter
				.mimeTypeFormatter(oFile.MimeType),
			"contributor": oFile.CreatedBy,
			"uploadedDate": opportunity.app.util.Formatter
				.dateFormatter(new Date(date)),
			"name": fName,
			"url": URL,
			"size": oFile.fileSize,
			"fileId": oFile.DocumentId
		};

		// commit change
		this.byId('fileupload').commitFileUpload(object);
	},

	getRouter: function() {
		return sap.ui.core.UIComponent.getRouterFor(this);
	},

	onExit: function(oEvent) {
		var oEventBus = this.getEventBus();
		oEventBus.unsubscribe("Master", "InitialLoadFinished", this.onMasterLoaded, this);
		oEventBus.unsubscribe("Component", "MetadataFailed", this.onMetadataFailed, this);
		if (this._oActionSheet) {
			this._oActionSheet.destroy();
			this._oActionSheet = null;
		}
	}
});