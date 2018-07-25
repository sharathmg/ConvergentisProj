/*
 * Copyright (C) 2009-2014 SAP AG or an SAP affiliate company. All rights reserved
 */
jQuery.sap.declare("opportunity.app.util.Formatter");
jQuery.sap.require("sap.ca.ui.model.format.DateFormat");
jQuery.sap.require("sap.ca.ui.model.format.NumberFormat");
jQuery.sap.require("sap.ca.ui.model.format.AmountFormat");
opportunity.app.util.Formatter = {
	Date: function(v) {
		if (v) {
			return sap.ca.ui.model.format.DateFormat.getDateInstance({
				style: "short"
			}).format(v)
		} else {
			return ""
		}
	},
	currencycode: function(v) {
		if (v) {
			return sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText("UNWEIGHTED_VOLUME_IN", [v])
		} else {
			return ""
		}
	},
	statusState: function(v) {
		if (v) {
			if (v == "E0001") {
				return "None"
			}
			if (v == "E0002") {
				return "Warning"
			}
			if (v == "E0003") {
				return "Success"
			}
			if (v == "E0004") {
				return "Error"
			}
		} else return "None"
	},
	quantity: function(v, a) {
		return sap.ca.ui.model.format.NumberFormat.getInstance().format(v) + " " + a
	},
	weightedvolume: function(v, a, b) {
		var c = v * a * 1.00 / 100.00;
		return sap.ca.ui.model.format.AmountFormat.FormatAmountStandardWithCurrency(c, b)
	},
	formatDescription: function(t, d) {
		return t + " : " + d
	},
	concatenateNameAndId: function(t, d) {
		return t + " " + d
	},
	volumeFormatter: function(v, c) {
		return sap.ca.ui.model.format.AmountFormat.FormatAmountStandard(v, c)
	},
	dateFormatter: function(v) {
		if (v === "" || v === null || v === undefined) return "";
		var l = new sap.ui.core.Locale(sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().sLocale);
		var f = sap.ca.ui.model.format.DateFormat.getDateInstance({
			style: "medium"
		}, l);
		return f.format(v)
	},
	texttonumber: function(v) {
		return Number(v)
	},
	infotexttonumber: function(v) {
		return Number(v) + sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText("PERCENTAGE_SIGN")
	},
	checkValue: function(v, a, b) {
		var c;
		if (a === "X") {
			c = sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText("VALUE_TURNED_ON", [b])
		} else if ((v === "X")) {
			c = sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText("VALUE_TURNED_OFF", [b])
		} else {
			if (a === " ") {
				c = sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText("VALUE_CHANGED_FROM_NULL", [b, a])
			} else {
				c = sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText("VALUE_CHANGED_FROM", [b, v, a])
			}
		}
		return c
	},
	forecast: function(v) {
		if (v === "X") {
			return true
		} else {
			return false
		}
	},
	mimeTypeFormatter: function(v) {
		switch (v) {
			case 'application/vnd.openxmlformats-officedocument.presentationml.presentation':
			case 'application/vnd.ms-powerpoint':
				return 'pptx';
				break;
			case 'application/msword':
			case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
				return 'doc';
				break;
			case 'application/vnd.ms-excel':
			case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
				return 'xls';
				break;
			case 'image/jpeg':
			case 'image/png':
			case 'image/tiff':
			case 'image/gif':
				return 'jpg';
				break;
			case 'application/pdf':
				return 'pdf';
				break;
			case 'text/plain':
				return 'txt';
				break;
			default:
				return 'unknown'
		}
	},
	resetFooterContentRightWidth: function(c) {
		var p = c.getView().getContent()[0];
		var r = jQuery.sap.byId(p.getFooter().getId() + "-BarRight");
		var R = r.outerWidth(true);
		if (R > 0) {
			c.iRBWidth = R
		}
		if (r.width() === 0 && c.iRBWidth) {
			jQuery.sap.log.info('Update footer contentRight Width=' + c.iRBWidth);
			r.width(c.iRBWidth)
		}
	},
	truncateVolume: function(v, c) {
		if (v > 0) {
			return sap.ca.ui.model.format.AmountFormat.FormatAmountShort(v, c)
		}
		return ""
	},
	urlConverter: function(v) {
		var s = jQuery.sap.getUriParameters().get("sap-server");
		var a = jQuery.sap.getUriParameters().get("sap-host");
		var b = jQuery.sap.getUriParameters().get("sap-host-http");
		var c = jQuery.sap.getUriParameters().get("sap-client");
		var u;
		var U = URI(v);
		var C = location.protocol.replace(':', '');
		if (C !== U.protocol()) U.protocol(C);
		if (s) U.addSearch('sap-server', s);
		if (a) U.addSearch('sap-host', a);
		if (b) U.addSearch('sap-host-http', b);
		if (c) U.addSearch('sap-client', c);
		u = U.toString();
		if (u == "") {
			v = v.replace("https", "http");
			return v
		} else {
			return U.toString()
		}
	},
	salesteamplacement: function(v) {
		return "  " + " : " + "  " + v
	},
	formatQuantityField: function(v) {
		if (v === null) return false;
		return true
	},
	formatDeleteButton: function(v) {
		if (v === null) return false;
		return true
	},
	formatProdClassification: function(v) {
		var r = sap.ca.scfld.md.app.Application.getImpl().AppI18nModel.getResourceBundle();
		if (v !== null) return r.getText('PRODUCT');
		else return r.getText('CATEGORY')
	},
	formatProductName: function(v) {
		if (v !== null) return this.getBindingContext('json').getObject().ProductName;
		return this.getBindingContext('json').getObject().ProductCategory
	},
	formatAddMoreProductsText: function(t) {
		if (jQuery.device.is.phone) return "";
		return t
	},
	formatParticipant: function(p) {
		var s = this.getParent().getParent().data("controller");
		var d = parseFloat(s.sBackendVersion);
		if (d < 2) return false;
		var P = s.getRuleForPartnerFunction(p);
		if (P === null) {
			return false
		}
		if (!P.ChangeableFlag) {
			return false
		}
		return true
	},
	formatParticipantDelete: function(p) {
		var s = this.getParent().getParent().data("controller");
		if (parseFloat(s.sBackendVersion) < 2) return false;
		var P = s.getRuleForPartnerFunction(p);
		if (P === null) {
			return false
		}
		if (!P.ChangeableFlag) {
			return false
		}
		return true
	},
	formatEmployeeRespField: function(b) {
		if (parseInt(b) < 2) {
			return false
		}
		return true
	},
	formatProspect: function(p, a) {
		if (p === "") return a;
		return p
	},
	formatBusinessCardCaller: function(p) {
		var s = this.getParent().getParent().getParent().data("controller");
		var P = this.getBindingContext('json').getObject().PartnerFunctionCode;
		switch (P) {
			case '00000014':
				this.attachPress(s.onEmpBusCardLaunch, s);
				break;
			case '00000015':
			case '00000021':
				this.attachPress(s.onEmployeeLaunch, s);
				break;
			default:
				this.attachPress(s.onAccountBusCardLaunch, s)
		}
		return p
	},
	formatPhotoUrl: function(m) {
		return m ? m : "sap-icon://person-placeholder"
	},
	urlConverter: function(v) {
		var s = jQuery.sap.getUriParameters().get("sap-server");
		var a = jQuery.sap.getUriParameters().get("sap-host");
		var b = jQuery.sap.getUriParameters().get("sap-host-http");
		var c = jQuery.sap.getUriParameters().get("sap-client");
		var u;
		var U = URI(v);
		var C = location.protocol.replace(':', '');
		if (C !== U.protocol()) {
			U.protocol(C)
		}
		if (s) {
			U.addSearch('sap-server', s)
		}
		if (a) {
			U.addSearch('sap-host', a)
		}
		if (b) {
			U.addSearch('sap-host-http', b)
		}
		if (c) {
			U.addSearch('sap-client', c)
		}
		u = U.toString();
		if (u == "") {
			v = v.replace("https", "http");
			return v
		} else {
			return U.toString()
		}
	},
	formatAccountF4Description: function(a, c, b) {
		var r = a;
		if (c) {
			r += " / " + c;
			if (b) {
				r += ", " + b
			}
		} else {
			if (b) {
				r += " / " + b
			}
		}
		return r
	}
};