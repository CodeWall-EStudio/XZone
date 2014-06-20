/*!
 * jQuery Validation Plugin 1.11.1
 *
 * http://bassistance.de/jquery-plugins/jquery-plugin-validation/
 * http://docs.jquery.com/Plugins/Validation
 *
 * Copyright 2013 Jörn Zaefferer
 * Released under the MIT license:
 *   http://www.opensource.org/licenses/mit-license.php
 */

(function($) {

$.extend($.fn, {
	// http://docs.jquery.com/Plugins/Validation/validate
	validate: function( options ) {

		// if nothing is selected, return nothing; can't chain anyway
		if ( !this.length ) {
			if ( options && options.debug && window.console ) {
				//console.warn( "Nothing selected, can't validate, returning nothing." );
			}
			return;
		}

		// check if a validator for this form was already created
		var validator = $.data( this[0], "validator" );
		if ( validator ) {
			return validator;
		}

		// Add novalidate tag if HTML5.
		this.attr( "novalidate", "novalidate" );

		validator = new $.validator( options, this[0] );
		$.data( this[0], "validator", validator );

		if ( validator.settings.onsubmit ) {

			this.validateDelegate( ":submit", "click", function( event ) {
				if ( validator.settings.submitHandler ) {
					validator.submitButton = event.target;
				}
				// allow suppressing validation by adding a cancel class to the submit button
				if ( $(event.target).hasClass("cancel") ) {
					validator.cancelSubmit = true;
				}

				// allow suppressing validation by adding the html5 formnovalidate attribute to the submit button
				if ( $(event.target).attr("formnovalidate") !== undefined ) {
					validator.cancelSubmit = true;
				}
			});

			// validate the form on submit
			this.submit( function( event ) {
				if ( validator.settings.debug ) {
					// prevent form submit to be able to see console output
					event.preventDefault();
				}
				function handle() {
					var hidden;
					if ( validator.settings.submitHandler ) {
						if ( validator.submitButton ) {
							// insert a hidden input as a replacement for the missing submit button
							hidden = $("<input type='hidden'/>").attr("name", validator.submitButton.name).val( $(validator.submitButton).val() ).appendTo(validator.currentForm);
						}
						validator.settings.submitHandler.call( validator, validator.currentForm, event );
						if ( validator.submitButton ) {
							// and clean up afterwards; thanks to no-block-scope, hidden can be referenced
							hidden.remove();
						}
						return false;
					}
					return true;
				}

				// prevent submit for invalid forms or custom submit handlers
				if ( validator.cancelSubmit ) {
					validator.cancelSubmit = false;
					return handle();
				}
				if ( validator.form() ) {
					if ( validator.pendingRequest ) {
						validator.formSubmitted = true;
						return false;
					}
					return handle();
				} else {
					validator.focusInvalid();
					return false;
				}
			});
		}

		return validator;
	},
	// http://docs.jquery.com/Plugins/Validation/valid
	valid: function() {
		if ( $(this[0]).is("form")) {
			return this.validate().form();
		} else {
			var valid = true;
			var validator = $(this[0].form).validate();
			this.each(function() {
				valid = valid && validator.element(this);
			});
			return valid;
		}
	},
	// attributes: space seperated list of attributes to retrieve and remove
	removeAttrs: function( attributes ) {
		var result = {},
			$element = this;
		$.each(attributes.split(/\s/), function( index, value ) {
			result[value] = $element.attr(value);
			$element.removeAttr(value);
		});
		return result;
	},
	// http://docs.jquery.com/Plugins/Validation/rules
	rules: function( command, argument ) {
		var element = this[0];

		if ( command ) {
			var settings = $.data(element.form, "validator").settings;
			var staticRules = settings.rules;
			var existingRules = $.validator.staticRules(element);
			switch(command) {
			case "add":
				$.extend(existingRules, $.validator.normalizeRule(argument));
				// remove messages from rules, but allow them to be set separetely
				delete existingRules.messages;
				staticRules[element.name] = existingRules;
				if ( argument.messages ) {
					settings.messages[element.name] = $.extend( settings.messages[element.name], argument.messages );
				}
				break;
			case "remove":
				if ( !argument ) {
					delete staticRules[element.name];
					return existingRules;
				}
				var filtered = {};
				$.each(argument.split(/\s/), function( index, method ) {
					filtered[method] = existingRules[method];
					delete existingRules[method];
				});
				return filtered;
			}
		}

		var data = $.validator.normalizeRules(
		$.extend(
			{},
			$.validator.classRules(element),
			$.validator.attributeRules(element),
			$.validator.dataRules(element),
			$.validator.staticRules(element)
		), element);

		// make sure required is at front
		if ( data.required ) {
			var param = data.required;
			delete data.required;
			data = $.extend({required: param}, data);
		}

		return data;
	}
});

// Custom selectors
$.extend($.expr[":"], {
	// http://docs.jquery.com/Plugins/Validation/blank
	blank: function( a ) { return !$.trim("" + $(a).val()); },
	// http://docs.jquery.com/Plugins/Validation/filled
	filled: function( a ) { return !!$.trim("" + $(a).val()); },
	// http://docs.jquery.com/Plugins/Validation/unchecked
	unchecked: function( a ) { return !$(a).prop("checked"); }
});

// constructor for validator
$.validator = function( options, form ) {
	this.settings = $.extend( true, {}, $.validator.defaults, options );
	this.currentForm = form;
	this.init();
};

$.validator.format = function( source, params ) {
	if ( arguments.length === 1 ) {
		return function() {
			var args = $.makeArray(arguments);
			args.unshift(source);
			return $.validator.format.apply( this, args );
		};
	}
	if ( arguments.length > 2 && params.constructor !== Array  ) {
		params = $.makeArray(arguments).slice(1);
	}
	if ( params.constructor !== Array ) {
		params = [ params ];
	}
	$.each(params, function( i, n ) {
		source = source.replace( new RegExp("\\{" + i + "\\}", "g"), function() {
			return n;
		});
	});
	return source;
};

$.extend($.validator, {

	defaults: {
		messages: {},
		groups: {},
		rules: {},
		errorClass: "error",
		validClass: "valid",
		errorElement: "label",
		focusInvalid: true,
		errorContainer: $([]),
		errorLabelContainer: $([]),
		onsubmit: true,
		ignore: ":hidden",
		ignoreTitle: false,
		onfocusin: function( element, event ) {
			this.lastActive = element;

			// hide error label and remove error class on focus if enabled
			if ( this.settings.focusCleanup && !this.blockFocusCleanup ) {
				if ( this.settings.unhighlight ) {
					this.settings.unhighlight.call( this, element, this.settings.errorClass, this.settings.validClass );
				}
				this.addWrapper(this.errorsFor(element)).hide();
			}
		},
		onfocusout: function( element, event ) {
			if ( !this.checkable(element) && (element.name in this.submitted || !this.optional(element)) ) {
				this.element(element);
			}
		},
		onkeyup: function( element, event ) {
			if ( event.which === 9 && this.elementValue(element) === "" ) {
				return;
			} else if ( element.name in this.submitted || element === this.lastElement ) {
				this.element(element);
			}
		},
		onclick: function( element, event ) {
			// click on selects, radiobuttons and checkboxes
			if ( element.name in this.submitted ) {
				this.element(element);
			}
			// or option elements, check parent select in that case
			else if ( element.parentNode.name in this.submitted ) {
				this.element(element.parentNode);
			}
		},
		highlight: function( element, errorClass, validClass ) {
			if ( element.type === "radio" ) {
				this.findByName(element.name).addClass(errorClass).removeClass(validClass);
			} else {
				$(element).addClass(errorClass).removeClass(validClass);
			}
		},
		unhighlight: function( element, errorClass, validClass ) {
			if ( element.type === "radio" ) {
				this.findByName(element.name).removeClass(errorClass).addClass(validClass);
			} else {
				$(element).removeClass(errorClass).addClass(validClass);
			}
		}
	},

	// http://docs.jquery.com/Plugins/Validation/Validator/setDefaults
	setDefaults: function( settings ) {
		$.extend( $.validator.defaults, settings );
	},

	messages: {
		required: "This field is required.",
		remote: "Please fix this field.",
		email: "Please enter a valid email address.",
		url: "Please enter a valid URL.",
		date: "Please enter a valid date.",
		dateISO: "Please enter a valid date (ISO).",
		number: "Please enter a valid number.",
		digits: "Please enter only digits.",
		creditcard: "Please enter a valid credit card number.",
		equalTo: "Please enter the same value again.",
		maxlength: $.validator.format("Please enter no more than {0} characters."),
		minlength: $.validator.format("Please enter at least {0} characters."),
		rangelength: $.validator.format("Please enter a value between {0} and {1} characters long."),
		range: $.validator.format("Please enter a value between {0} and {1}."),
		max: $.validator.format("Please enter a value less than or equal to {0}."),
		min: $.validator.format("Please enter a value greater than or equal to {0}.")
	},

	autoCreateRanges: false,

	prototype: {

		init: function() {
			this.labelContainer = $(this.settings.errorLabelContainer);
			this.errorContext = this.labelContainer.length && this.labelContainer || $(this.currentForm);
			this.containers = $(this.settings.errorContainer).add( this.settings.errorLabelContainer );
			this.submitted = {};
			this.valueCache = {};
			this.pendingRequest = 0;
			this.pending = {};
			this.invalid = {};
			this.reset();

			var groups = (this.groups = {});
			$.each(this.settings.groups, function( key, value ) {
				if ( typeof value === "string" ) {
					value = value.split(/\s/);
				}
				$.each(value, function( index, name ) {
					groups[name] = key;
				});
			});
			var rules = this.settings.rules;
			$.each(rules, function( key, value ) {
				rules[key] = $.validator.normalizeRule(value);
			});

			function delegate(event) {
				var validator = $.data(this[0].form, "validator"),
					eventType = "on" + event.type.replace(/^validate/, "");
				try{
				if ( validator.settings[eventType] ) {
					validator.settings[eventType].call(validator, this[0], event);
				}
				}catch(e){
					
				}
			}
			$(this.currentForm)
				.validateDelegate(":text, [type='password'], [type='file'], select, textarea, " +
					"[type='number'], [type='search'] ,[type='tel'], [type='url'], " +
					"[type='email'], [type='datetime'], [type='date'], [type='month'], " +
					"[type='week'], [type='time'], [type='datetime-local'], " +
					"[type='range'], [type='color'] ",
					"focusin focusout keyup", delegate)
				.validateDelegate("[type='radio'], [type='checkbox'], select, option", "click", delegate);

			if ( this.settings.invalidHandler ) {
				$(this.currentForm).bind("invalid-form.validate", this.settings.invalidHandler);
			}
		},

		// http://docs.jquery.com/Plugins/Validation/Validator/form
		form: function() {
			this.checkForm();
			$.extend(this.submitted, this.errorMap);
			this.invalid = $.extend({}, this.errorMap);
			if ( !this.valid() ) {
				$(this.currentForm).triggerHandler("invalid-form", [this]);
			}
			this.showErrors();
			return this.valid();
		},

		checkForm: function() {
			this.prepareForm();
			for ( var i = 0, elements = (this.currentElements = this.elements()); elements[i]; i++ ) {
				this.check( elements[i] );
			}
			return this.valid();
		},

		// http://docs.jquery.com/Plugins/Validation/Validator/element
		element: function( element ) {
			element = this.validationTargetFor( this.clean( element ) );
			this.lastElement = element;
			this.prepareElement( element );
			this.currentElements = $(element);
			var result = this.check( element ) !== false;
			if ( result ) {
				delete this.invalid[element.name];
			} else {
				this.invalid[element.name] = true;
			}
			if ( !this.numberOfInvalids() ) {
				// Hide error containers on last error
				this.toHide = this.toHide.add( this.containers );
			}
			this.showErrors();
			return result;
		},

		// http://docs.jquery.com/Plugins/Validation/Validator/showErrors
		showErrors: function( errors ) {
			if ( errors ) {
				// add items to error list and map
				$.extend( this.errorMap, errors );
				this.errorList = [];
				for ( var name in errors ) {
					this.errorList.push({
						message: errors[name],
						element: this.findByName(name)[0]
					});
				}
				// remove items from success list
				this.successList = $.grep( this.successList, function( element ) {
					return !(element.name in errors);
				});
			}
			if ( this.settings.showErrors ) {
				this.settings.showErrors.call( this, this.errorMap, this.errorList );
			} else {
				this.defaultShowErrors();
			}
		},

		// http://docs.jquery.com/Plugins/Validation/Validator/resetForm
		resetForm: function() {
			if ( $.fn.resetForm ) {
				$(this.currentForm).resetForm();
			}
			this.submitted = {};
			this.lastElement = null;
			this.prepareForm();
			this.hideErrors();
			this.elements().removeClass( this.settings.errorClass ).removeData( "previousValue" );
		},

		numberOfInvalids: function() {
			return this.objectLength(this.invalid);
		},

		objectLength: function( obj ) {
			var count = 0;
			for ( var i in obj ) {
				count++;
			}
			return count;
		},

		hideErrors: function() {
			this.addWrapper( this.toHide ).hide();
		},

		valid: function() {
			return this.size() === 0;
		},

		size: function() {
			return this.errorList.length;
		},

		focusInvalid: function() {
			if ( this.settings.focusInvalid ) {
				try {
					$(this.findLastActive() || this.errorList.length && this.errorList[0].element || [])
					.filter(":visible")
					.focus()
					// manually trigger focusin event; without it, focusin handler isn't called, findLastActive won't have anything to find
					.trigger("focusin");
				} catch(e) {
					// ignore IE throwing errors when focusing hidden elements
				}
			}
		},

		findLastActive: function() {
			var lastActive = this.lastActive;
			return lastActive && $.grep(this.errorList, function( n ) {
				return n.element.name === lastActive.name;
			}).length === 1 && lastActive;
		},

		elements: function() {
			var validator = this,
				rulesCache = {};

			// select all valid inputs inside the form (no submit or reset buttons)
			return $(this.currentForm)
			.find("input, select, textarea")
			.not(":submit, :reset, :image, [disabled]")
			.not( this.settings.ignore )
			.filter(function() {
				if ( !this.name && validator.settings.debug && window.console ) {
					//console.error( "%o has no name assigned", this);
				}

				// select only the first element for each name, and only those with rules specified
				if ( this.name in rulesCache || !validator.objectLength($(this).rules()) ) {
					return false;
				}

				rulesCache[this.name] = true;
				return true;
			});
		},

		clean: function( selector ) {
			return $(selector)[0];
		},

		errors: function() {
			var errorClass = this.settings.errorClass.replace(" ", ".");
			return $(this.settings.errorElement + "." + errorClass, this.errorContext);
		},

		reset: function() {
			this.successList = [];
			this.errorList = [];
			this.errorMap = {};
			this.toShow = $([]);
			this.toHide = $([]);
			this.currentElements = $([]);
		},

		prepareForm: function() {
			this.reset();
			this.toHide = this.errors().add( this.containers );
		},

		prepareElement: function( element ) {
			this.reset();
			this.toHide = this.errorsFor(element);
		},

		elementValue: function( element ) {
			var type = $(element).attr("type"),
				val = $(element).val();

			if ( type === "radio" || type === "checkbox" ) {
				return $("input[name='" + $(element).attr("name") + "']:checked").val();
			}

			if ( typeof val === "string" ) {
				return val.replace(/\r/g, "");
			}
			return val;
		},

		check: function( element ) {
			element = this.validationTargetFor( this.clean( element ) );

			var rules = $(element).rules();
			var dependencyMismatch = false;
			var val = this.elementValue(element);
			var result;

			for (var method in rules ) {
				var rule = { method: method, parameters: rules[method] };
				try {

					result = $.validator.methods[method].call( this, val, element, rule.parameters );

					// if a method indicates that the field is optional and therefore valid,
					// don't mark it as valid when there are no other rules
					if ( result === "dependency-mismatch" ) {
						dependencyMismatch = true;
						continue;
					}
					dependencyMismatch = false;

					if ( result === "pending" ) {
						this.toHide = this.toHide.not( this.errorsFor(element) );
						return;
					}

					if ( !result ) {
						this.formatAndAdd( element, rule );
						return false;
					}
				} catch(e) {
					if ( this.settings.debug && window.console ) {
						//console.log( "Exception occurred when checking element " + element.id + ", check the '" + rule.method + "' method.", e );
					}
					throw e;
				}
			}
			if ( dependencyMismatch ) {
				return;
			}
			if ( this.objectLength(rules) ) {
				this.successList.push(element);
			}
			return true;
		},

		// return the custom message for the given element and validation method
		// specified in the element's HTML5 data attribute
		customDataMessage: function( element, method ) {
			return $(element).data("msg-" + method.toLowerCase()) || (element.attributes && $(element).attr("data-msg-" + method.toLowerCase()));
		},

		// return the custom message for the given element name and validation method
		customMessage: function( name, method ) {
			var m = this.settings.messages[name];
			return m && (m.constructor === String ? m : m[method]);
		},

		// return the first defined argument, allowing empty strings
		findDefined: function() {
			for(var i = 0; i < arguments.length; i++) {
				if ( arguments[i] !== undefined ) {
					return arguments[i];
				}
			}
			return undefined;
		},

		defaultMessage: function( element, method ) {
			return this.findDefined(
				this.customMessage( element.name, method ),
				this.customDataMessage( element, method ),
				// title is never undefined, so handle empty string as undefined
				!this.settings.ignoreTitle && element.title || undefined,
				$.validator.messages[method],
				"<strong>Warning: No message defined for " + element.name + "</strong>"
			);
		},

		formatAndAdd: function( element, rule ) {
			var message = this.defaultMessage( element, rule.method ),
				theregex = /\$?\{(\d+)\}/g;
			if ( typeof message === "function" ) {
				message = message.call(this, rule.parameters, element);
			} else if (theregex.test(message)) {
				message = $.validator.format(message.replace(theregex, "{$1}"), rule.parameters);
			}
			this.errorList.push({
				message: message,
				element: element
			});

			this.errorMap[element.name] = message;
			this.submitted[element.name] = message;
		},

		addWrapper: function( toToggle ) {
			if ( this.settings.wrapper ) {
				toToggle = toToggle.add( toToggle.parent( this.settings.wrapper ) );
			}
			return toToggle;
		},

		defaultShowErrors: function() {
			var i, elements;
			for ( i = 0; this.errorList[i]; i++ ) {
				var error = this.errorList[i];
				if ( this.settings.highlight ) {
					this.settings.highlight.call( this, error.element, this.settings.errorClass, this.settings.validClass );
				}
				this.showLabel( error.element, error.message );
			}
			if ( this.errorList.length ) {
				this.toShow = this.toShow.add( this.containers );
			}
			if ( this.settings.success ) {
				for ( i = 0; this.successList[i]; i++ ) {
					this.showLabel( this.successList[i] );
				}
			}
			if ( this.settings.unhighlight ) {
				for ( i = 0, elements = this.validElements(); elements[i]; i++ ) {
					this.settings.unhighlight.call( this, elements[i], this.settings.errorClass, this.settings.validClass );
				}
			}
			this.toHide = this.toHide.not( this.toShow );
			this.hideErrors();
			this.addWrapper( this.toShow ).show();
		},

		validElements: function() {
			return this.currentElements.not(this.invalidElements());
		},

		invalidElements: function() {
			return $(this.errorList).map(function() {
				return this.element;
			});
		},

		showLabel: function( element, message ) {
			var label = this.errorsFor( element );
			if ( label.length ) {
				// refresh error/success class
				label.removeClass( this.settings.validClass ).addClass( this.settings.errorClass );
				// replace message on existing label
				label.html(message);
			} else {
				// create label
				label = $("<" + this.settings.errorElement + ">")
					.attr("for", this.idOrName(element))
					.addClass(this.settings.errorClass)
					.html(message || "");
				if ( this.settings.wrapper ) {
					// make sure the element is visible, even in IE
					// actually showing the wrapped element is handled elsewhere
					label = label.hide().show().wrap("<" + this.settings.wrapper + "/>").parent();
				}
				if ( !this.labelContainer.append(label).length ) {
					if ( this.settings.errorPlacement ) {
						this.settings.errorPlacement(label, $(element) );
					} else {
						label.insertAfter(element);
					}
				}
			}
			if ( !message && this.settings.success ) {
				label.text("");
				if ( typeof this.settings.success === "string" ) {
					label.addClass( this.settings.success );
				} else {
					this.settings.success( label, element );
				}
			}
			this.toShow = this.toShow.add(label);
		},

		errorsFor: function( element ) {
			var name = this.idOrName(element);
			return this.errors().filter(function() {
				return $(this).attr("for") === name;
			});
		},

		idOrName: function( element ) {
			return this.groups[element.name] || (this.checkable(element) ? element.name : element.id || element.name);
		},

		validationTargetFor: function( element ) {
			// if radio/checkbox, validate first element in group instead
			if ( this.checkable(element) ) {
				element = this.findByName( element.name ).not(this.settings.ignore)[0];
			}
			return element;
		},

		checkable: function( element ) {
			return (/radio|checkbox/i).test(element.type);
		},

		findByName: function( name ) {
			return $(this.currentForm).find("[name='" + name + "']");
		},

		getLength: function( value, element ) {
			switch( element.nodeName.toLowerCase() ) {
			case "select":
				return $("option:selected", element).length;
			case "input":
				if ( this.checkable( element) ) {
					return this.findByName(element.name).filter(":checked").length;
				}
			}
			return value.length;
		},

		depend: function( param, element ) {
			return this.dependTypes[typeof param] ? this.dependTypes[typeof param](param, element) : true;
		},

		dependTypes: {
			"boolean": function( param, element ) {
				return param;
			},
			"string": function( param, element ) {
				return !!$(param, element.form).length;
			},
			"function": function( param, element ) {
				return param(element);
			}
		},

		optional: function( element ) {
			var val = this.elementValue(element);
			return !$.validator.methods.required.call(this, val, element) && "dependency-mismatch";
		},

		startRequest: function( element ) {
			if ( !this.pending[element.name] ) {
				this.pendingRequest++;
				this.pending[element.name] = true;
			}
		},

		stopRequest: function( element, valid ) {
			this.pendingRequest--;
			// sometimes synchronization fails, make sure pendingRequest is never < 0
			if ( this.pendingRequest < 0 ) {
				this.pendingRequest = 0;
			}
			delete this.pending[element.name];
			if ( valid && this.pendingRequest === 0 && this.formSubmitted && this.form() ) {
				$(this.currentForm).submit();
				this.formSubmitted = false;
			} else if (!valid && this.pendingRequest === 0 && this.formSubmitted) {
				$(this.currentForm).triggerHandler("invalid-form", [this]);
				this.formSubmitted = false;
			}
		},

		previousValue: function( element ) {
			return $.data(element, "previousValue") || $.data(element, "previousValue", {
				old: null,
				valid: true,
				message: this.defaultMessage( element, "remote" )
			});
		}

	},

	classRuleSettings: {
		required: {required: true},
		email: {email: true},
		url: {url: true},
		date: {date: true},
		dateISO: {dateISO: true},
		number: {number: true},
		digits: {digits: true},
		creditcard: {creditcard: true}
	},

	addClassRules: function( className, rules ) {
		if ( className.constructor === String ) {
			this.classRuleSettings[className] = rules;
		} else {
			$.extend(this.classRuleSettings, className);
		}
	},

	classRules: function( element ) {
		var rules = {};
		var classes = $(element).attr("class");
		if ( classes ) {
			$.each(classes.split(" "), function() {
				if ( this in $.validator.classRuleSettings ) {
					$.extend(rules, $.validator.classRuleSettings[this]);
				}
			});
		}
		return rules;
	},

	attributeRules: function( element ) {
		var rules = {};
		var $element = $(element);
		var type = $element[0].getAttribute("type");

		for (var method in $.validator.methods) {
			var value;

			// support for <input required> in both html5 and older browsers
			if ( method === "required" ) {
				value = $element.get(0).getAttribute(method);
				// Some browsers return an empty string for the required attribute
				// and non-HTML5 browsers might have required="" markup
				if ( value === "" ) {
					value = true;
				}
				// force non-HTML5 browsers to return bool
				value = !!value;
			} else {
				value = $element.attr(method);
			}

			// convert the value to a number for number inputs, and for text for backwards compability
			// allows type="date" and others to be compared as strings
			if ( /min|max/.test( method ) && ( type === null || /number|range|text/.test( type ) ) ) {
				value = Number(value);
			}

			if ( value ) {
				rules[method] = value;
			} else if ( type === method && type !== 'range' ) {
				// exception: the jquery validate 'range' method
				// does not test for the html5 'range' type
				rules[method] = true;
			}
		}

		// maxlength may be returned as -1, 2147483647 (IE) and 524288 (safari) for text inputs
		if ( rules.maxlength && /-1|2147483647|524288/.test(rules.maxlength) ) {
			delete rules.maxlength;
		}

		return rules;
	},

	dataRules: function( element ) {
		var method, value,
			rules = {}, $element = $(element);
		for (method in $.validator.methods) {
			value = $element.data("rule-" + method.toLowerCase());
			if ( value !== undefined ) {
				rules[method] = value;
			}
		}
		return rules;
	},

	staticRules: function( element ) {
		var rules = {};
		var validator = $.data(element.form, "validator");
		if ( validator.settings.rules ) {
			rules = $.validator.normalizeRule(validator.settings.rules[element.name]) || {};
		}
		return rules;
	},

	normalizeRules: function( rules, element ) {
		// handle dependency check
		$.each(rules, function( prop, val ) {
			// ignore rule when param is explicitly false, eg. required:false
			if ( val === false ) {
				delete rules[prop];
				return;
			}
			if ( val.param || val.depends ) {
				var keepRule = true;
				switch (typeof val.depends) {
				case "string":
					keepRule = !!$(val.depends, element.form).length;
					break;
				case "function":
					keepRule = val.depends.call(element, element);
					break;
				}
				if ( keepRule ) {
					rules[prop] = val.param !== undefined ? val.param : true;
				} else {
					delete rules[prop];
				}
			}
		});

		// evaluate parameters
		$.each(rules, function( rule, parameter ) {
			rules[rule] = $.isFunction(parameter) ? parameter(element) : parameter;
		});

		// clean number parameters
		$.each(['minlength', 'maxlength'], function() {
			if ( rules[this] ) {
				rules[this] = Number(rules[this]);
			}
		});
		$.each(['rangelength', 'range'], function() {
			var parts;
			if ( rules[this] ) {
				if ( $.isArray(rules[this]) ) {
					rules[this] = [Number(rules[this][0]), Number(rules[this][1])];
				} else if ( typeof rules[this] === "string" ) {
					parts = rules[this].split(/[\s,]+/);
					rules[this] = [Number(parts[0]), Number(parts[1])];
				}
			}
		});

		if ( $.validator.autoCreateRanges ) {
			// auto-create ranges
			if ( rules.min && rules.max ) {
				rules.range = [rules.min, rules.max];
				delete rules.min;
				delete rules.max;
			}
			if ( rules.minlength && rules.maxlength ) {
				rules.rangelength = [rules.minlength, rules.maxlength];
				delete rules.minlength;
				delete rules.maxlength;
			}
		}

		return rules;
	},

	// Converts a simple string to a {string: true} rule, e.g., "required" to {required:true}
	normalizeRule: function( data ) {
		if ( typeof data === "string" ) {
			var transformed = {};
			$.each(data.split(/\s/), function() {
				transformed[this] = true;
			});
			data = transformed;
		}
		return data;
	},

	// http://docs.jquery.com/Plugins/Validation/Validator/addMethod
	addMethod: function( name, method, message ) {
		$.validator.methods[name] = method;
		$.validator.messages[name] = message !== undefined ? message : $.validator.messages[name];
		if ( method.length < 3 ) {
			$.validator.addClassRules(name, $.validator.normalizeRule(name));
		}
	},

	methods: {

		// http://docs.jquery.com/Plugins/Validation/Methods/required
		required: function( value, element, param ) {
			// check if dependency is met
			if ( !this.depend(param, element) ) {
				return "dependency-mismatch";
			}
			if ( element.nodeName.toLowerCase() === "select" ) {
				// could be an array for select-multiple or a string, both are fine this way
				var val = $(element).val();
				return val && val.length > 0;
			}
			if ( this.checkable(element) ) {
				return this.getLength(value, element) > 0;
			}
			return $.trim(value).length > 0;
		},

		// http://docs.jquery.com/Plugins/Validation/Methods/email
		email: function( value, element ) {
			// contributed by Scott Gonzalez: http://projects.scottsplayground.com/email_address_validation/
			return this.optional(element) || /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i.test(value);
		},

		// http://docs.jquery.com/Plugins/Validation/Methods/url
		url: function( value, element ) {
			// contributed by Scott Gonzalez: http://projects.scottsplayground.com/iri/
			return this.optional(element) || /^(https?|s?ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i.test(value);
		},

		// http://docs.jquery.com/Plugins/Validation/Methods/date
		date: function( value, element ) {
			return this.optional(element) || !/Invalid|NaN/.test(new Date(value).toString());
		},

		// http://docs.jquery.com/Plugins/Validation/Methods/dateISO
		dateISO: function( value, element ) {
			return this.optional(element) || /^\d{4}[\/\-]\d{1,2}[\/\-]\d{1,2}$/.test(value);
		},

		// http://docs.jquery.com/Plugins/Validation/Methods/number
		number: function( value, element ) {
			return this.optional(element) || /^-?(?:\d+|\d{1,3}(?:,\d{3})+)?(?:\.\d+)?$/.test(value);
		},

		// http://docs.jquery.com/Plugins/Validation/Methods/digits
		digits: function( value, element ) {
			return this.optional(element) || /^\d+$/.test(value);
		},

		// http://docs.jquery.com/Plugins/Validation/Methods/creditcard
		// based on http://en.wikipedia.org/wiki/Luhn
		creditcard: function( value, element ) {
			if ( this.optional(element) ) {
				return "dependency-mismatch";
			}
			// accept only spaces, digits and dashes
			if ( /[^0-9 \-]+/.test(value) ) {
				return false;
			}
			var nCheck = 0,
				nDigit = 0,
				bEven = false;

			value = value.replace(/\D/g, "");

			for (var n = value.length - 1; n >= 0; n--) {
				var cDigit = value.charAt(n);
				nDigit = parseInt(cDigit, 10);
				if ( bEven ) {
					if ( (nDigit *= 2) > 9 ) {
						nDigit -= 9;
					}
				}
				nCheck += nDigit;
				bEven = !bEven;
			}

			return (nCheck % 10) === 0;
		},

		// http://docs.jquery.com/Plugins/Validation/Methods/minlength
		minlength: function( value, element, param ) {
			var length = $.isArray( value ) ? value.length : this.getLength($.trim(value), element);
			return this.optional(element) || length >= param;
		},

		// http://docs.jquery.com/Plugins/Validation/Methods/maxlength
		maxlength: function( value, element, param ) {
			var length = $.isArray( value ) ? value.length : this.getLength($.trim(value), element);
			return this.optional(element) || length <= param;
		},

		// http://docs.jquery.com/Plugins/Validation/Methods/rangelength
		rangelength: function( value, element, param ) {
			var length = $.isArray( value ) ? value.length : this.getLength($.trim(value), element);
			return this.optional(element) || ( length >= param[0] && length <= param[1] );
		},

		// http://docs.jquery.com/Plugins/Validation/Methods/min
		min: function( value, element, param ) {
			return this.optional(element) || value >= param;
		},

		// http://docs.jquery.com/Plugins/Validation/Methods/max
		max: function( value, element, param ) {
			return this.optional(element) || value <= param;
		},

		// http://docs.jquery.com/Plugins/Validation/Methods/range
		range: function( value, element, param ) {
			return this.optional(element) || ( value >= param[0] && value <= param[1] );
		},

		// http://docs.jquery.com/Plugins/Validation/Methods/equalTo
		equalTo: function( value, element, param ) {
			// bind to the blur event of the target in order to revalidate whenever the target field is updated
			// TODO find a way to bind the event just once, avoiding the unbind-rebind overhead
			var target = $(param);
			if ( this.settings.onfocusout ) {
				target.unbind(".validate-equalTo").bind("blur.validate-equalTo", function() {
					$(element).valid();
				});
			}
			return value === target.val();
		},

		// http://docs.jquery.com/Plugins/Validation/Methods/remote
		remote: function( value, element, param ) {
			if ( this.optional(element) ) {
				return "dependency-mismatch";
			}

			var previous = this.previousValue(element);
			if (!this.settings.messages[element.name] ) {
				this.settings.messages[element.name] = {};
			}
			previous.originalMessage = this.settings.messages[element.name].remote;
			this.settings.messages[element.name].remote = previous.message;

			param = typeof param === "string" && {url:param} || param;

			if ( previous.old === value ) {
				return previous.valid;
			}

			previous.old = value;
			var validator = this;
			this.startRequest(element);
			var data = {};
			data[element.name] = value;
			$.ajax($.extend(true, {
				url: param,
				mode: "abort",
				port: "validate" + element.name,
				dataType: "json",
				data: data,
				success: function( response ) {
					validator.settings.messages[element.name].remote = previous.originalMessage;
					var valid = response === true || response === "true";
					if ( valid ) {
						var submitted = validator.formSubmitted;
						validator.prepareElement(element);
						validator.formSubmitted = submitted;
						validator.successList.push(element);
						delete validator.invalid[element.name];
						validator.showErrors();
					} else {
						var errors = {};
						var message = response || validator.defaultMessage( element, "remote" );
						errors[element.name] = previous.message = $.isFunction(message) ? message(value) : message;
						validator.invalid[element.name] = true;
						validator.showErrors(errors);
					}
					previous.valid = valid;
					validator.stopRequest(element, valid);
				}
			}, param));
			return "pending";
		}

	}

});

// deprecated, use $.validator.format instead
$.format = $.validator.format;

}(jQuery));

// ajax mode: abort
// usage: $.ajax({ mode: "abort"[, port: "uniqueport"]});
// if mode:"abort" is used, the previous request on that port (port can be undefined) is aborted via XMLHttpRequest.abort()
(function($) {
	var pendingRequests = {};
	// Use a prefilter if available (1.5+)
	if ( $.ajaxPrefilter ) {
		$.ajaxPrefilter(function( settings, _, xhr ) {
			var port = settings.port;
			if ( settings.mode === "abort" ) {
				if ( pendingRequests[port] ) {
					pendingRequests[port].abort();
				}
				pendingRequests[port] = xhr;
			}
		});
	} else {
		// Proxy ajax
		var ajax = $.ajax;
		$.ajax = function( settings ) {
			var mode = ( "mode" in settings ? settings : $.ajaxSettings ).mode,
				port = ( "port" in settings ? settings : $.ajaxSettings ).port;
			if ( mode === "abort" ) {
				if ( pendingRequests[port] ) {
					pendingRequests[port].abort();
				}
				pendingRequests[port] = ajax.apply(this, arguments);
				return pendingRequests[port];
			}
			return ajax.apply(this, arguments);
		};
	}
}(jQuery));

// provides delegate(type: String, delegate: Selector, handler: Callback) plugin for easier event delegation
// handler is only called when $(event.target).is(delegate), in the scope of the jquery-object for event.target
(function($) {
	$.extend($.fn, {
		validateDelegate: function( delegate, type, handler ) {
			return this.bind(type, function( event ) {
				var target = $(event.target);
				if ( target.is(delegate) ) {
					return handler.apply(target, arguments);
				}
			});
		}
	});
}(jQuery));

;(function (d) {
	function getMaxDays () {
		var tmpDate	= new Date(this.toString()),
			d		= 28,
			m		= tmpDate.getMonth();
		while (tmpDate.getMonth() == m) {
			++d;
			tmpDate.setDate(d);
		}
		return d - 1;
	}
	d.addDays		= function (n) {
		this.setDate(this.getDate() + n);
	};
	d.addMonths	= function (n) {
		var day	= this.getDate();
		this.setDate(1);
		this.setMonth(this.getMonth() + n);
		this.setDate(Math.min(day, getMaxDays.apply(this)));
	};
	d.addYears		= function (n) {
		var day	= this.getDate();
		this.setDate(1);
		this.setFullYear(this.getFullYear() + n);
		this.setDate(Math.min(day, getMaxDays.apply(this)));
	};
	d.getDayOfYear	= function() {
		var now		= new Date(this.getFullYear(), this.getMonth(), this.getDate(), 0, 0, 0);
		var then	= new Date(this.getFullYear(), 0, 0, 0, 0, 0);
		var time	= now - then;
		return Math.floor(time / 24*60*60*1000);
	};
})(Date.prototype);
;(function ($) {
	$.pickmeup = $.extend($.pickmeup || {}, {
		date			: new Date,
		flat			: false,
		first_day		: 1,
		prev			: '&#9664;',
		next			: '&#9654;',
		mode			: 'single',
		select_year		: true,
		select_month	: true,
		view			: 'days',
		calendars		: 1,
		format			: 'd-m-Y',
		position		: 'bottom',
		trigger_event	: 'click',
		class_name		: '',
		separator		: ' - ',
		hide_on_select	: false,
		min				: null,
		max				: null,
		render			: function () {},
		change			: function () {return true;},
		before_show		: function () {return true;},
		show			: function () {return true;},
		hide			: function () {return true;},
		fill			: function () {return true;},
		locale			: {
			days		: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
			daysShort	: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
			daysMin		: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'],
			months		: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
			monthsShort	: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
		}
	});
	var	views	= {
			years	: 'pmu-view-years',
			months	: 'pmu-view-months',
			days	: 'pmu-view-days'
		},
		tpl		= {
			wrapper	: '<div class="pickmeup" />',
			head	: function (d) {
				var result	= '';
				for (var i = 0; i < 7; ++i) {
					result	+= '<div>' + d.day[i] + '</div>'
				}
				return '<div class="pmu-instance">' +
					'<nav>' +
						'<div class="pmu-prev pmu-button">' + d.prev + '</div>' +
						'<div class="pmu-month pmu-button" />' +
						'<div class="pmu-next pmu-button">' + d.next + '</div>' +
					'</nav>' +
					'<nav class="pmu-day-of-week">' + result + '</nav>' +
				'</div>';
			},
			days	: function (days) {
				var result	= '';
				for (var i = 0; i < 42; ++i) {
					result	+= '<div class="' + days[i].class_name + ' pmu-button">' + days[i].text + '</div>'
				}
				return '<div class="pmu-days">' + result + '</div>';
			},
			months	: function (d) {
				var result	= '';
				for (var i = 0; i < 12; ++i) {
					result	+= '<div class="pmu-button">' + d.data[i] + '</div>'
				}
				return '<div class="' + d.class_name + '">' + result + '</div>';
			}
		};
	function fill () {
		var options		= $(this).data('pickmeup-options'),
			pickmeup	= this.pickmeup,
			current_cal	= Math.floor(options.calendars / 2),
			date,
			data,
			header,
			year,
			day,
			month,
			count		= 0,
			days,
			html,
			instance,
			today		= (new Date).setHours(0,0,0,0).valueOf();
		/**
		 * Remove old content except header navigation
		 */
		pickmeup.find('.pmu-instance > :not(nav)').remove();
		/**
		 * If several calendars should be shown
		 */
		for (var i = 0; i < options.calendars; i++) {
			date		= new Date(options.current);
			instance	= pickmeup.find('.pmu-instance').eq(i);
			if (pickmeup.hasClass('pmu-view-years')) {
				date.addYears((i - current_cal) * 12);
				header = (date.getFullYear() - 6) + ' - ' + (date.getFullYear()+5);
			} else if (pickmeup.hasClass('pmu-view-months')) {
				date.addYears(i - current_cal);
				header = date.getFullYear();
			} else if (pickmeup.hasClass('pmu-view-days')) {
				date.addMonths(i - current_cal);
				header = formatDate(date, 'B, Y', options.locale);
			}
			instance
				.find('.pmu-month')
				.text(header);
			year		= date.getFullYear() - 6;
			data		= {
				data		: [],
				class_name	: 'pmu-years'
			};
			for (var j = 0; j < 12; j++) {
				data.data.push(year + j);
			}
			html		= tpl.months(data);
			date.setDate(1);
			data		= [];
			month		= date.getMonth();
			day			= (date.getDay() - options.first_day) % 7;
			date.addDays(-(day + (day < 0 ? 7 : 0)));
			count		= 0;
			while (count < 42) {
				day	= {
					text		: date.getDate(),
					class_name	: []
				};
				if (month != date.getMonth()) {
					day.class_name.push('pmu-not-in-month');
				}
				if (date.getDay() == 0) {
					day.class_name.push('pmu-sunday');
				} else if (date.getDay() == 6) {
					day.class_name.push('pmu-saturday');
				}
				var from_user	= options.render(date) || {},
					val			= date.valueOf(),
					disabled	= (options.min && options.min > date) || (options.max && options.max < date);
				if (
					!disabled &&
					(
						from_user.selected ||
						options.date == val ||
						$.inArray(val, options.date) > -1 ||
						(
							options.mode == 'range' && val >= options.date[0] && val <= options.date[1]
						)
					)
				) {
					day.class_name.push('pmu-selected');
				}
				if (val == today) {
					day.class_name.push('pmu-today');
				}
				if (from_user.disabled || disabled) {
					day.class_name.push('pmu-disabled');
				}
				if (from_user.class_name) {
					day.class_name.push(from_user.class_name);
				}
				day.class_name = day.class_name.join(' ');
				data.push(day);
				date.addDays(1);
				count++;
			}
			html	= tpl.days(data) + html;
			data	= {
				data		: options.locale.monthsShort,
				class_name	: 'pmu-months'
			};
			html	= tpl.months(data) + html;
			instance.append(html);
		}
		options.fill.apply(this);
	}
	function parseDate (date, format, separator) {
		if (date.constructor == Date) {
			return date;
		} else if (!date) {
			return new Date;
		}
		var splitted_date	= date.split(separator);
		if (splitted_date.length > 1) {
			splitted_date.forEach(function (element, index, array) {
				array[index]	= parseDate(element, format, separator);
			});
			return splitted_date;
		}
		var parts	= date.split(/\W+/),
			against	= format.split(/\W+/),
			d,
			m,
			y,
			h,
			min,
			now = new Date();
		for (var i = 0; i < parts.length; i++) {
			switch (against[i]) {
				case 'd':
				case 'e':
					d = parseInt(parts[i],10);
				break;
				case 'm':
					m = parseInt(parts[i], 10)-1;
				break;
				case 'Y':
				case 'y':
					y = parseInt(parts[i], 10);
					y += y > 100 ? 0 : (y < 29 ? 2000 : 1900);
				break;
				case 'H':
				case 'I':
				case 'k':
				case 'l':
					h = parseInt(parts[i], 10);
				break;
				case 'P':
				case 'p':
					if (/pm/i.test(parts[i]) && h < 12) {
						h += 12;
					} else if (/am/i.test(parts[i]) && h >= 12) {
						h -= 12;
					}
				break;
				case 'M':
					min = parseInt(parts[i], 10);
				break;
			}
		}
		return new Date(
			y === undefined ? now.getFullYear() : y,
			m === undefined ? now.getMonth() : m,
			d === undefined ? now.getDate() : d,
			h === undefined ? now.getHours() : h,
			min === undefined ? now.getMinutes() : min,
			0
		);
	}
	function formatDate (date, format, locale) {
		var m = date.getMonth();
		var d = date.getDate();
		var y = date.getFullYear();
		var w = date.getDay();
		var s = {};
		var hr = date.getHours();
		var pm = (hr >= 12);
		var ir = (pm) ? (hr - 12) : hr;
		var dy = date.getDayOfYear();
		if (ir == 0) {
			ir = 12;
		}
		var min = date.getMinutes();
		var sec = date.getSeconds();
		var parts = format.split(''), part;
		for (var i = 0; i < parts.length; i++) {
			part = parts[i];
			switch (part) {
				case 'a':
					part = locale.daysShort[w];
				break;
				case 'A':
					part = locale.days[w];
				break;
				case 'b':
					part = locale.monthsShort[m];
				break;
				case 'B':
					part = locale.months[m];
				break;
				case 'C':
					part = 1 + Math.floor(y / 100);
				break;
				case 'd':
					part = (d < 10) ? ("0" + d) : d;
				break;
				case 'e':
					part = d;
				break;
				case 'H':
					part = (hr < 10) ? ("0" + hr) : hr;
				break;
				case 'I':
					part = (ir < 10) ? ("0" + ir) : ir;
				break;
				case 'j':
					part = (dy < 100) ? ((dy < 10) ? ("00" + dy) : ("0" + dy)) : dy;
				break;
				case 'k':
					part = hr;
				break;
				case 'l':
					part = ir;
				break;
				case 'm':
					part = (m < 9) ? ("0" + (1+m)) : (1+m);
				break;
				case 'M':
					part = (min < 10) ? ("0" + min) : min;
				break;
				case 'p':
				case 'P':
					part = pm ? "PM" : "AM";
				break;
				case 's':
					part = Math.floor(date.getTime() / 1000);
				break;
				case 'S':
					part = (sec < 10) ? ("0" + sec) : sec;
				break;
				case 'u':
					part = w + 1;
				break;
				case 'w':
					part = w;
				break;
				case 'y':
					part = ('' + y).substr(2, 2);
				break;
				case 'Y':
					part = y;
				break;
			}
			parts[i] = part;
		}
		return parts.join('');
	}
	function click (e) {
		var el	= $(e.target);
		if (el.hasClass('pmu-button')) {
			if (el.hasClass('pmu-disabled')) {
				return false;
			}
			var	$this			= $(this),
				options			= $this.data('pickmeup-options'),
				instance		= el.parents('.pmu-instance').eq(0),
				root			= instance.parent(),
				instance_index	= $('.pmu-instance', root).index(instance),
				current_date	= new Date(options.current),
				val;
			if (el.parent().is('nav')) {
				if (el.hasClass('pmu-month')) {
					current_date.addMonths(instance_index - Math.floor(options.calendars / 2));
					if (root.hasClass('pmu-view-years')) {
						root.removeClass('pmu-view-years').addClass('pmu-view-days');
						el.text(formatDate(current_date, 'B, Y', options.locale));
					} else if (root.hasClass('pmu-view-months')) {
						if (options.select_year) {
							root.removeClass('pmu-view-months').addClass('pmu-view-years');
							el.text((current_date.getFullYear() - 6) + ' - ' + (current_date.getFullYear() + 5));
						} else {
							root.removeClass('pmu-view-months').addClass('pmu-view-days');
							el.text(formatDate(current_date, 'B, Y', options.locale));
						}
					} else if (root.hasClass('pmu-view-days') && options.select_month) {
						root.removeClass('pmu-view-days').addClass('pmu-view-months');
						el.text(current_date.getFullYear());
					}
				} else {
					var prev	= el.hasClass('pmu-prev');
					if (root.hasClass('pmu-view-years')) {
						options.current.addYears(prev ? -12 : 12);
					} else if (root.hasClass('pmu-view-months')) {
						options.current.addYears(prev ? -1 : 1);
					} else if (root.hasClass('pmu-view-days')) {
						options.current.addMonths(prev ? -1 : 1);
					}
				}
			} else if (!el.hasClass('pmu-disabled')) {
				if (root.hasClass('pmu-view-years')) {
					options.current.setFullYear(parseInt(el.text(), 10));
					root.removeClass('pmu-view-years').addClass('pmu-view-months');
				} else if (root.hasClass('pmu-view-months')) {
					options.current.setMonth(instance.find('.pmu-months .pmu-button').index(el));
					options.current.setFullYear(parseInt(instance.find('.pmu-month').text(), 10));
					options.current.addMonths(Math.floor(options.calendars / 2) - instance_index);
					root.removeClass('pmu-view-months').addClass('pmu-view-days');
				} else {
					val	= parseInt(el.text(), 10);
					current_date.addMonths(instance_index - Math.floor(options.calendars / 2));
					if (el.hasClass('pmu-not-in-month')) {
						current_date.addMonths(val > 15 ? -1 : 1);
					}
					current_date.setDate(val);
					switch (options.mode) {
						case 'multiple':
							val = (current_date.setHours(0,0,0,0)).valueOf();
							if ($.inArray(val, options.date) > -1) {
								$.each(options.date, function (nr, dat){
									if (dat == val) {
										options.date.splice(nr,1);
										return false;
									}
									return true;
								});
							} else {
								options.date.push(val);
							}
							break;
						case 'range':
							if (!options.lastSel) {
								options.date[0]	= (current_date.setHours(0,0,0,0)).valueOf();
							}
							val				= (current_date.setHours(23,59,59,0)).valueOf();
							if (val < options.date[0]) {
								options.date[1]	= options.date[0] + 86399000;
								options.date[0]	= val - 86399000;
							} else {
								options.date[1]	= val;
							}
							options.lastSel	= !options.lastSel;
							break;
						default:
							options.date	= current_date.valueOf();
							break;
					}
					(function (prepared_date) {
						if ($this.is('input')) {
							$this.val(options.mode == 'single' ? prepared_date[0] : prepared_date[0].join(options.separator));
						}
						options.change.apply(this, prepared_date);
					})(prepareDate(options));
					if (
						options.hide_on_select &&
						(
							options.mode != 'range' ||
							!options.lastSel
						)
					) {
						options.binded.hide();
						return false;
					}
				}
			}
			options.binded.fill();
		}
		return false;
	}
	function prepareDate (options) {
		var result;
		if (options.mode == 'single') {
			result = new Date(options.date);
			return [formatDate(result, options.format, options.locale), result];
		} else {
			result = [[],[]];
			$.each(options.date, function(nr, val){
				var date = new Date(val);
				result[0].push(formatDate(date, options.format, options.locale));
				result[1].push(date);
			});
			return result;
		}
	}
	function show (force) {
		var pickmeup	= this.pickmeup;
		if (force || !pickmeup.is(':visible')) {
			var $this		= $(this),
				options		= $this.data('pickmeup-options'),
				pos			= $this.offset(),
				viewport	= {
					l : document.documentElement.scrollLeft,
					t : document.documentElement.scrollTop,
					w : document.documentElement.clientWidth,
					h : document.documentElement.clientHeight
				},
				top			= pos.top,
				left		= pos.left;
			options.binded.fill();
			if ($this.is('input')) {
				$this
					.pickmeup('set_date', parseDate($this.val(), options.format, options.separator))
					.keydown(function (e) {
						if (e.which == 9) {
							$this.pickmeup('hide');
						}
					});
			}
			options.before_show();
			switch (options.position){
				case 'top':
					top -= pickmeup.outerHeight();
					break;
				case 'left':
					left -= pickmeup.outerWidth();
					break;
				case 'right':
					left += this.offsetWidth;
					break;
				case 'bottom':
					top += this.offsetHeight;
					break;
			}
			if (top + pickmeup.offsetHeight > viewport.t + viewport.h) {
				top = pos.top  - pickmeup.offsetHeight;
			}
			if (top < viewport.t) {
				top = pos.top + this.offsetHeight + pickmeup.offsetHeight;
			}
			if (left + pickmeup.offsetWidth > viewport.l + viewport.w) {
				left = pos.left - pickmeup.offsetWidth;
			}
			if (left < viewport.l) {
				left = pos.left + this.offsetWidth
			}
			if (options.show() == false) {
				return;
			}
			pickmeup.css({
				display	: 'inline-block',
				top		: top + 'px',
				left	: left + 'px'
			});
			$(document)
				.on(
					'mousedown',
					options.binded.hide
				)
				.on(
					'resize',
					[
						true
					],
					options.binded.forced_show
				);
		}
	}
	function forced_show () {
		show.call(this, true);
	}
	function hide (e) {
		if (!e || !e.target ||	(e.target != this && !(this.pickmeup.get(0).compareDocumentPosition(e.target) & 16))
		) {
			var pickmeup	= this.pickmeup,
				options		= $(this).data('pickmeup-options');
			if (options.hide() != false) {
				pickmeup.hide();
				$(document)
					.off('mousedown', options.binded.hide)
					.off('resize', options.binded.forced_show);
				options.date[1]	= options.date[0];
				options.lastSel	= false;
			}
		}
	}
	function update () {
		var	options	= $(this).data('pickmeup-options');
		$(document)
			.off('mousedown', options.binded.hide)
			.off('resize', options.binded.forced_show);
		options.binded.forced_show();
	}
	function clear () {
		var options = $(this).data('pickmeup-options');
		if (options.mode != 'single') {
			options.date = [];
			options.binded.fill();
		}
	}
	function get_date (formatted) {
		return prepareDate($(this).data('pickmeup-options'))[formatted ? 0 : 1];
	}
	function set_date (date) {
		var options = $(this).data('pickmeup-options');
		options.date = date;
		if (typeof options.date === 'string') {
			options.date = parseDate(options.date, options.format, options.separator).setHours(0,0,0,0);
		} else if (options.date.constructor == Date) {
			options.date.setHours(0,0,0,0);
		}
		if (!options.date) {
			options.date = new Date;
			options.date.setHours(0,0,0,0);
		}
		if (options.mode != 'single') {
			if (options.date.constructor != Array) {
				options.date = [options.date.valueOf()];
				if (options.mode == 'range') {
					options.date.push(((new Date(options.date[0])).setHours(23,59,59,0)).valueOf());
				}
			} else {
				for (var i = 0; i < options.date.length; i++) {
					options.date[i] = (parseDate(options.date[i], options.format, options.separator).setHours(0,0,0,0)).valueOf();
				}
				if (options.mode == 'range') {
					options.date[1] = ((new Date(options.date[1])).setHours(23,59,59,0)).valueOf();
				}
			}
		} else {
			options.date = options.date.valueOf();
		}
		options.current = new Date (options.mode != 'single' ? options.date[0] : options.date);
		options.binded.fill();
	}
	$.fn.pickmeup	= function (initial_options) {
		if (typeof initial_options === 'string') {
			var data,
				parameters	= Array.prototype.slice.call(arguments, 1);
			switch (initial_options) {
				case 'hide':
				case 'show':
				case 'clear':
				case 'update':
					this.each(function () {
						data	= $(this).data('pickmeup-options');
						if (data) {
							data.binded[initial_options]();
						}
					});
				break;
				case 'get_date':
					data	= this.data('pickmeup-options');
					if (data) {
						return data.binded.get_date(parameters[0]);
					} else {
						return null;
					}
				break;
				case 'set_date':
					this.each(function () {
						data	= $(this).data('pickmeup-options');
						if (data) {
							data.binded[initial_options].apply(this, parameters);
						}
					});
			}
			return this;
		}
		return this.each(function () {
			var	$this			= $(this);
			if ($this.data('pickmeup-options')) {
				return;
			}
			var i,
				option,
				options	= $.extend({}, $.pickmeup, initial_options || {});
			for (i in options) {
				option	= $this.data('pmu-' + i);
				if (typeof option !== 'undefined') {
					options[i]	= option;
				}
			}
			options.calendars	= Math.max(1, parseInt(options.calendars, 10) || 1);
			options.mode		= /single|multiple|range/.test(options.mode) ? options.mode : 'single';
			if (typeof options.min === 'string') {
				options.min = parseDate(options.min, options.format, options.separator).setHours(0,0,0,0);
			} else if (options.min && options.min.constructor == Date) {
				options.min.setHours(0,0,0,0);
			}
			if (typeof options.max === 'string') {
				options.max = parseDate(options.max, options.format, options.separator).setHours(23,59,59,0);
			} else if (options.max && options.max.constructor == Date) {
				options.max.setHours(23,59,59,0);
			}
			if (typeof options.date === 'string') {
				options.date = parseDate(options.date, options.format, options.separator).setHours(0,0,0,0);
			} else if (options.date.constructor == Date) {
				options.date.setHours(0,0,0,0);
			}
			if (!options.date) {
				options.date = new Date;
				options.date.setHours(0,0,0,0);
			}
			if (options.mode != 'single') {
				if (options.date.constructor != Array) {
					options.date = [options.date.valueOf()];
					if (options.mode == 'range') {
						options.date.push(((new Date(options.date[0])).setHours(23,59,59,0)).valueOf());
					}
				} else {
					for (i = 0; i < options.date.length; i++) {
						options.date[i] = (parseDate(options.date[i], options.format, options.separator).setHours(0,0,0,0)).valueOf();
					}
					if (options.mode == 'range') {
						options.date[1] = ((new Date(options.date[1])).setHours(23,59,59,0)).valueOf();
					}
				}
				options.current	= new Date(options.date[0]);
			} else {
				options.date	= options.date.valueOf();
				options.current	= new Date(options.date);
			}
			options.current.setDate(1);
			options.current.setHours(0,0,0,0);
			var cnt,
				pickmeup = $(tpl.wrapper);
			this.pickmeup	= pickmeup;
			if (options.class_name) {
				pickmeup.addClass(options.class_name);
			}
			var html = '';
			for (i = 0; i < options.calendars; i++) {
				cnt		= options.first_day;
				html	+= tpl.head({
					prev	: options.prev,
					next	: options.next,
					day		: [
						options.locale.daysMin[(cnt++) % 7],
						options.locale.daysMin[(cnt++) % 7],
						options.locale.daysMin[(cnt++) % 7],
						options.locale.daysMin[(cnt++) % 7],
						options.locale.daysMin[(cnt++) % 7],
						options.locale.daysMin[(cnt++) % 7],
						options.locale.daysMin[(cnt++) % 7]
					]
				});
			}
			$this.data('pickmeup-options', options);
			for (i in options) {
				if ($.inArray(i, ['render', 'change', 'before_show', 'show', 'hide']) != -1) {
					options[i]	= options[i].bind(this);
				}
			}
			options.binded	= {
				fill		: fill.bind(this),
				click		: click.bind(this),
				show		: show.bind(this),
				forced_show	: forced_show.bind(this),
				hide		: hide.bind(this),
				update		: update.bind(this),
				clear		: clear.bind(this),
				get_date	: get_date.bind(this),
				set_date	: set_date.bind(this)
			};
			pickmeup
				.on('click', options.binded.click)
				.addClass(views[options.view])
				.append(html)
				.on(
					$.support.selectstart ? 'selectstart' : 'mousedown',
					function(e){
						e.preventDefault();
					}
				);
			options.binded.fill();
			if (options.flat) {
				pickmeup.appendTo(this).css({
					position	: 'relative',
					display		: 'inline-block'
				});
			} else {
				pickmeup.appendTo(document.body);
				$this.on(options.trigger_event, options.binded.show);
			}
		});
	};
})(jQuery);

/**
 * jqPlot
 * Pure JavaScript plotting plugin using jQuery
 *
 * Version: 1.0.0b2_r792
 *
 * Copyright (c) 2009-2011 Chris Leonello
 * jqPlot is currently available for use in all personal or commercial projects 
 * under both the MIT (http://www.opensource.org/licenses/mit-license.php) and GPL 
 * version 2.0 (http://www.gnu.org/licenses/gpl-2.0.html) licenses. This means that you can 
 * choose the license that best suits your project and use it accordingly. 
 *
 * Although not required, the author would appreciate an email letting him 
 * know of any substantial use of jqPlot.  You can reach the author at: 
 * chris at jqplot dot com or see http://www.jqplot.com/info.php .
 *
 * If you are feeling kind and generous, consider supporting the project by
 * making a donation at: http://www.jqplot.com/donate.php .
 *
 * sprintf functions contained in jqplot.sprintf.js by Ash Searle:
 *
 *     version 2007.04.27
 *     author Ash Searle
 *     http://hexmen.com/blog/2007/03/printf-sprintf/
 *     http://hexmen.com/js/sprintf.js
 *     The author (Ash Searle) has placed this code in the public domain:
 *     "This code is unrestricted: you are free to use it however you like."
 * 
 */
(function(w){var l;w.fn.emptyForce=function(){for(var O=0,P;(P=w(this)[O])!=null;O++){if(P.nodeType===1){jQuery.cleanData(P.getElementsByTagName("*"))}if(w.jqplot_use_excanvas){P.outerHTML=""}else{while(P.firstChild){P.removeChild(P.firstChild)}}P=null}return w(this)};w.fn.removeChildForce=function(O){while(O.firstChild){this.removeChildForce(O.firstChild);O.removeChild(O.firstChild)}};w.jqplot=function(U,R,P){var Q,O;if(P==null){if(jQuery.isArray(R)){Q=R;O=null}else{if(typeof(R)==="object"){Q=null;O=R}}}else{Q=R;O=P}var T=new C();w("#"+U).removeClass("jqplot-error");if(w.jqplot.config.catchErrors){try{T.init(U,Q,O);T.draw();T.themeEngine.init.call(T);return T}catch(S){var V=w.jqplot.config.errorMessage||S.message;w("#"+U).append('<div class="jqplot-error-message">'+V+"</div>");w("#"+U).addClass("jqplot-error");document.getElementById(U).style.background=w.jqplot.config.errorBackground;document.getElementById(U).style.border=w.jqplot.config.errorBorder;document.getElementById(U).style.fontFamily=w.jqplot.config.errorFontFamily;document.getElementById(U).style.fontSize=w.jqplot.config.errorFontSize;document.getElementById(U).style.fontStyle=w.jqplot.config.errorFontStyle;document.getElementById(U).style.fontWeight=w.jqplot.config.errorFontWeight}}else{T.init(U,Q,O);T.draw();T.themeEngine.init.call(T);return T}};w.jqplot.version="1.0.0b2_r792";w.jqplot.CanvasManager=function(){if(typeof w.jqplot.CanvasManager.canvases=="undefined"){w.jqplot.CanvasManager.canvases=[];w.jqplot.CanvasManager.free=[]}var O=[];this.getCanvas=function(){var R;var Q=true;if(!w.jqplot.use_excanvas){for(var S=0,P=w.jqplot.CanvasManager.canvases.length;S<P;S++){if(w.jqplot.CanvasManager.free[S]===true){Q=false;R=w.jqplot.CanvasManager.canvases[S];w.jqplot.CanvasManager.free[S]=false;O.push(S);break}}}if(Q){R=document.createElement("canvas");O.push(w.jqplot.CanvasManager.canvases.length);w.jqplot.CanvasManager.canvases.push(R);w.jqplot.CanvasManager.free.push(false)}return R};this.initCanvas=function(P){if(w.jqplot.use_excanvas){return window.G_vmlCanvasManager.initElement(P)}return P};this.freeAllCanvases=function(){for(var Q=0,P=O.length;Q<P;Q++){this.freeCanvas(O[Q])}O=[]};this.freeCanvas=function(P){if(w.jqplot.use_excanvas){window.G_vmlCanvasManager.uninitElement(w.jqplot.CanvasManager.canvases[P]);w.jqplot.CanvasManager.canvases[P]=null}else{var Q=w.jqplot.CanvasManager.canvases[P];Q.getContext("2d").clearRect(0,0,Q.width,Q.height);w(Q).unbind().removeAttr("class").removeAttr("style");w(Q).css({left:"",top:"",position:""});Q.width=0;Q.height=0;w.jqplot.CanvasManager.free[P]=true}}};w.jqplot.log=function(){if(window.console){console.log.apply(console,arguments)}};w.jqplot.config={enablePlugins:false,defaultHeight:300,defaultWidth:400,UTCAdjust:false,timezoneOffset:new Date(new Date().getTimezoneOffset()*60000),errorMessage:"",errorBackground:"",errorBorder:"",errorFontFamily:"",errorFontSize:"",errorFontStyle:"",errorFontWeight:"",catchErrors:false,defaultTickFormatString:"%.1f",defaultColors:["#4bb2c5","#EAA228","#c5b47f","#579575","#839557","#958c12","#953579","#4b5de4","#d8b83f","#ff5800","#0085cc","#c747a3","#cddf54","#FBD178","#26B4E3","#bd70c7"],defaultNegativeColors:["#498991","#C08840","#9F9274","#546D61","#646C4A","#6F6621","#6E3F5F","#4F64B0","#A89050","#C45923","#187399","#945381","#959E5C","#C7AF7B","#478396","#907294"]};w.jqplot.arrayMax=function(O){return Math.max.apply(Math,O)};w.jqplot.arrayMin=function(O){return Math.min.apply(Math,O)};w.jqplot.enablePlugins=w.jqplot.config.enablePlugins;w.jqplot.support_canvas=function(){if(typeof w.jqplot.support_canvas.result=="undefined"){w.jqplot.support_canvas.result=!!document.createElement("canvas").getContext}return w.jqplot.support_canvas.result};w.jqplot.support_canvas_text=function(){if(typeof w.jqplot.support_canvas_text.result=="undefined"){w.jqplot.support_canvas_text.result=!!(document.createElement("canvas").getContext&&typeof document.createElement("canvas").getContext("2d").fillText=="function")}return w.jqplot.support_canvas_text.result};w.jqplot.use_excanvas=(w.browser.msie&&!w.jqplot.support_canvas())?true:false;w.jqplot.preInitHooks=[];w.jqplot.postInitHooks=[];w.jqplot.preParseOptionsHooks=[];w.jqplot.postParseOptionsHooks=[];w.jqplot.preDrawHooks=[];w.jqplot.postDrawHooks=[];w.jqplot.preDrawSeriesHooks=[];w.jqplot.postDrawSeriesHooks=[];w.jqplot.preDrawLegendHooks=[];w.jqplot.addLegendRowHooks=[];w.jqplot.preSeriesInitHooks=[];w.jqplot.postSeriesInitHooks=[];w.jqplot.preParseSeriesOptionsHooks=[];w.jqplot.postParseSeriesOptionsHooks=[];w.jqplot.eventListenerHooks=[];w.jqplot.preDrawSeriesShadowHooks=[];w.jqplot.postDrawSeriesShadowHooks=[];w.jqplot.ElemContainer=function(){this._elem;this._plotWidth;this._plotHeight;this._plotDimensions={height:null,width:null}};w.jqplot.ElemContainer.prototype.createElement=function(R,T,P,Q,U){this._offsets=T;var O=P||"jqplot";var S=document.createElement(R);this._elem=w(S);this._elem.addClass(O);this._elem.css(Q);this._elem.attr(U);S=null;return this._elem};w.jqplot.ElemContainer.prototype.getWidth=function(){if(this._elem){return this._elem.outerWidth(true)}else{return null}};w.jqplot.ElemContainer.prototype.getHeight=function(){if(this._elem){return this._elem.outerHeight(true)}else{return null}};w.jqplot.ElemContainer.prototype.getPosition=function(){if(this._elem){return this._elem.position()}else{return{top:null,left:null,bottom:null,right:null}}};w.jqplot.ElemContainer.prototype.getTop=function(){return this.getPosition().top};w.jqplot.ElemContainer.prototype.getLeft=function(){return this.getPosition().left};w.jqplot.ElemContainer.prototype.getBottom=function(){return this._elem.css("bottom")};w.jqplot.ElemContainer.prototype.getRight=function(){return this._elem.css("right")};function m(O){w.jqplot.ElemContainer.call(this);this.name=O;this._series=[];this.show=false;this.tickRenderer=w.jqplot.AxisTickRenderer;this.tickOptions={};this.labelRenderer=w.jqplot.AxisLabelRenderer;this.labelOptions={};this.label=null;this.showLabel=true;this.min=null;this.max=null;this.autoscale=false;this.pad=1.2;this.padMax=null;this.padMin=null;this.ticks=[];this.numberTicks;this.tickInterval;this.renderer=w.jqplot.LinearAxisRenderer;this.rendererOptions={};this.showTicks=true;this.showTickMarks=true;this.showMinorTicks=true;this.useSeriesColor=false;this.borderWidth=null;this.borderColor=null;this._dataBounds={min:null,max:null};this._intervalStats=[];this._offsets={min:null,max:null};this._ticks=[];this._label=null;this.syncTicks=null;this.tickSpacing=75;this._min=null;this._max=null;this._tickInterval=null;this._numberTicks=null;this.__ticks=null;this._options={}}m.prototype=new w.jqplot.ElemContainer();m.prototype.constructor=m;m.prototype.init=function(){this.renderer=new this.renderer();this.tickOptions.axis=this.name;if(this.tickOptions.showMark==null){this.tickOptions.showMark=this.showTicks}if(this.tickOptions.showMark==null){this.tickOptions.showMark=this.showTickMarks}if(this.tickOptions.showLabel==null){this.tickOptions.showLabel=this.showTicks}if(this.label==null||this.label==""){this.showLabel=false}else{this.labelOptions.label=this.label}if(this.showLabel==false){this.labelOptions.show=false}if(this.pad==0){this.pad=1}if(this.padMax==0){this.padMax=1}if(this.padMin==0){this.padMin=1}if(this.padMax==null){this.padMax=(this.pad-1)/2+1}if(this.padMin==null){this.padMin=(this.pad-1)/2+1}this.pad=this.padMax+this.padMin-1;if(this.min!=null||this.max!=null){this.autoscale=false}if(this.syncTicks==null&&this.name.indexOf("y")>-1){this.syncTicks=true}else{if(this.syncTicks==null){this.syncTicks=false}}this.renderer.init.call(this,this.rendererOptions)};m.prototype.draw=function(O,P){if(this.__ticks){this.__ticks=null}return this.renderer.draw.call(this,O,P)};m.prototype.set=function(){this.renderer.set.call(this)};m.prototype.pack=function(P,O){if(this.show){this.renderer.pack.call(this,P,O)}if(this._min==null){this._min=this.min;this._max=this.max;this._tickInterval=this.tickInterval;this._numberTicks=this.numberTicks;this.__ticks=this._ticks}};m.prototype.reset=function(){this.renderer.reset.call(this)};m.prototype.resetScale=function(O){w.extend(true,this,{min:null,max:null,numberTicks:null,tickInterval:null,_ticks:[],ticks:[]},O);this.resetDataBounds()};m.prototype.resetDataBounds=function(){var O=this._dataBounds;O.min=null;O.max=null;var R=(this.show)?true:false;for(var Q=0;Q<this._series.length;Q++){var S=this._series[Q];var V=S._plotData;var T=1,U=1;if(S._type!=null&&S._type=="ohlc"){T=3;U=2}for(var P=0;P<V.length;P++){if(this.name=="xaxis"||this.name=="x2axis"){if((V[P][0]!=null&&V[P][0]<O.min)||O.min==null){O.min=V[P][0]}if((V[P][0]!=null&&V[P][0]>O.max)||O.max==null){O.max=V[P][0]}}else{if((V[P][T]!=null&&V[P][T]<O.min)||O.min==null){O.min=V[P][T]}if((V[P][U]!=null&&V[P][U]>O.max)||O.max==null){O.max=V[P][U]}}}if(R&&S.renderer.constructor!==w.jqplot.BarRenderer){R=false}else{if(R&&this._options.hasOwnProperty("forceTickAt0")&&this._options.forceTickAt0==false){R=false}else{if(R&&S.renderer.constructor===w.jqplot.BarRenderer){if(S.barDirection=="vertical"&&this.name!="xaxis"&&this.name!="x2axis"){if(this._options.pad!=null||this._options.padMin!=null){R=false}}else{if(S.barDirection=="horizontal"&&(this.name=="xaxis"||this.name=="x2axis")){if(this._options.pad!=null||this._options.padMin!=null){R=false}}}}}}}if(R&&this.renderer.constructor===w.jqplot.LinearAxisRenderer&&O.min>=0){this.padMin=1;this.forceTickAt0=true}};function h(O){w.jqplot.ElemContainer.call(this);this.show=false;this.location="ne";this.labels=[];this.showLabels=true;this.showSwatches=true;this.placement="insideGrid";this.xoffset=0;this.yoffset=0;this.border;this.background;this.textColor;this.fontFamily;this.fontSize;this.rowSpacing="0.5em";this.renderer=w.jqplot.TableLegendRenderer;this.rendererOptions={};this.preDraw=false;this.marginTop=null;this.marginRight=null;this.marginBottom=null;this.marginLeft=null;this.escapeHtml=false;this._series=[];w.extend(true,this,O)}h.prototype=new w.jqplot.ElemContainer();h.prototype.constructor=h;h.prototype.setOptions=function(O){w.extend(true,this,O);if(this.placement=="inside"){this.placement="insideGrid"}if(this.xoffset>0){if(this.placement=="insideGrid"){switch(this.location){case"nw":case"w":case"sw":if(this.marginLeft==null){this.marginLeft=this.xoffset+"px"}this.marginRight="0px";break;case"ne":case"e":case"se":default:if(this.marginRight==null){this.marginRight=this.xoffset+"px"}this.marginLeft="0px";break}}else{if(this.placement=="outside"){switch(this.location){case"nw":case"w":case"sw":if(this.marginRight==null){this.marginRight=this.xoffset+"px"}this.marginLeft="0px";break;case"ne":case"e":case"se":default:if(this.marginLeft==null){this.marginLeft=this.xoffset+"px"}this.marginRight="0px";break}}}this.xoffset=0}if(this.yoffset>0){if(this.placement=="outside"){switch(this.location){case"sw":case"s":case"se":if(this.marginTop==null){this.marginTop=this.yoffset+"px"}this.marginBottom="0px";break;case"ne":case"n":case"nw":default:if(this.marginBottom==null){this.marginBottom=this.yoffset+"px"}this.marginTop="0px";break}}else{if(this.placement=="insideGrid"){switch(this.location){case"sw":case"s":case"se":if(this.marginBottom==null){this.marginBottom=this.yoffset+"px"}this.marginTop="0px";break;case"ne":case"n":case"nw":default:if(this.marginTop==null){this.marginTop=this.yoffset+"px"}this.marginBottom="0px";break}}}this.yoffset=0}};h.prototype.init=function(){this.renderer=new this.renderer();this.renderer.init.call(this,this.rendererOptions)};h.prototype.draw=function(P){for(var O=0;O<w.jqplot.preDrawLegendHooks.length;O++){w.jqplot.preDrawLegendHooks[O].call(this,P)}return this.renderer.draw.call(this,P)};h.prototype.pack=function(O){this.renderer.pack.call(this,O)};function n(O){w.jqplot.ElemContainer.call(this);this.text=O;this.show=true;this.fontFamily;this.fontSize;this.textAlign;this.textColor;this.renderer=w.jqplot.DivTitleRenderer;this.rendererOptions={}}n.prototype=new w.jqplot.ElemContainer();n.prototype.constructor=n;n.prototype.init=function(){this.renderer=new this.renderer();this.renderer.init.call(this,this.rendererOptions)};n.prototype.draw=function(O){return this.renderer.draw.call(this,O)};n.prototype.pack=function(){this.renderer.pack.call(this)};function D(){w.jqplot.ElemContainer.call(this);this.show=true;this.xaxis="xaxis";this._xaxis;this.yaxis="yaxis";this._yaxis;this.gridBorderWidth=2;this.renderer=w.jqplot.LineRenderer;this.rendererOptions={};this.data=[];this.gridData=[];this.label="";this.showLabel=true;this.color;this.lineWidth=2.5;this.lineJoin="round";this.lineCap="round";this.shadow=true;this.shadowAngle=45;this.shadowOffset=1.25;this.shadowDepth=3;this.shadowAlpha="0.1";this.breakOnNull=false;this.markerRenderer=w.jqplot.MarkerRenderer;this.markerOptions={};this.showLine=true;this.showMarker=true;this.index;this.fill=false;this.fillColor;this.fillAlpha;this.fillAndStroke=false;this.disableStack=false;this._stack=false;this.neighborThreshold=4;this.fillToZero=false;this.fillToValue=0;this.fillAxis="y";this.useNegativeColors=true;this._stackData=[];this._plotData=[];this._plotValues={x:[],y:[]};this._intervals={x:{},y:{}};this._prevPlotData=[];this._prevGridData=[];this._stackAxis="y";this._primaryAxis="_xaxis";this.canvas=new w.jqplot.GenericCanvas();this.shadowCanvas=new w.jqplot.GenericCanvas();this.plugins={};this._sumy=0;this._sumx=0;this._type=""}D.prototype=new w.jqplot.ElemContainer();D.prototype.constructor=D;D.prototype.init=function(Q,U,S){this.index=Q;this.gridBorderWidth=U;var T=this.data;var P=[],R;for(R=0;R<T.length;R++){if(!this.breakOnNull){if(T[R]==null||T[R][0]==null||T[R][1]==null){continue}else{P.push(T[R])}}else{P.push(T[R])}}this.data=P;if(!this.fillColor){this.fillColor=this.color}if(this.fillAlpha){var O=w.jqplot.normalize2rgb(this.fillColor);var O=w.jqplot.getColorComponents(O);this.fillColor="rgba("+O[0]+","+O[1]+","+O[2]+","+this.fillAlpha+")"}this.renderer=new this.renderer();this.renderer.init.call(this,this.rendererOptions,S);this.markerRenderer=new this.markerRenderer();if(!this.markerOptions.color){this.markerOptions.color=this.color}if(this.markerOptions.show==null){this.markerOptions.show=this.showMarker}this.showMarker=this.markerOptions.show;this.markerRenderer.init(this.markerOptions)};D.prototype.draw=function(U,R,T){var P=(R==l)?{}:R;U=(U==l)?this.canvas._ctx:U;var O,S,Q;for(O=0;O<w.jqplot.preDrawSeriesHooks.length;O++){w.jqplot.preDrawSeriesHooks[O].call(this,U,P)}if(this.show){this.renderer.setGridData.call(this,T);if(!P.preventJqPlotSeriesDrawTrigger){w(U.canvas).trigger("jqplotSeriesDraw",[this.data,this.gridData])}S=[];if(P.data){S=P.data}else{if(!this._stack){S=this.data}else{S=this._plotData}}Q=P.gridData||this.renderer.makeGridData.call(this,S,T);this.renderer.draw.call(this,U,Q,P,T)}for(O=0;O<w.jqplot.postDrawSeriesHooks.length;O++){w.jqplot.postDrawSeriesHooks[O].call(this,U,P)}U=R=T=O=S=Q=null};D.prototype.drawShadow=function(U,R,T){var P=(R==l)?{}:R;U=(U==l)?this.shadowCanvas._ctx:U;var O,S,Q;for(O=0;O<w.jqplot.preDrawSeriesShadowHooks.length;O++){w.jqplot.preDrawSeriesShadowHooks[O].call(this,U,P)}if(this.shadow){this.renderer.setGridData.call(this,T);S=[];if(P.data){S=P.data}else{if(!this._stack){S=this.data}else{S=this._plotData}}Q=P.gridData||this.renderer.makeGridData.call(this,S,T);this.renderer.drawShadow.call(this,U,Q,P)}for(O=0;O<w.jqplot.postDrawSeriesShadowHooks.length;O++){w.jqplot.postDrawSeriesShadowHooks[O].call(this,U,P)}U=R=T=O=S=Q=null};D.prototype.toggleDisplay=function(P){var O,Q;if(P.data.series){O=P.data.series}else{O=this}if(P.data.speed){Q=P.data.speed}if(Q){if(O.canvas._elem.is(":hidden")){if(O.shadowCanvas._elem){O.shadowCanvas._elem.fadeIn(Q)}O.canvas._elem.fadeIn(Q);O.canvas._elem.nextAll(".jqplot-point-label.jqplot-series-"+O.index).fadeIn(Q)}else{if(O.shadowCanvas._elem){O.shadowCanvas._elem.fadeOut(Q)}O.canvas._elem.fadeOut(Q);O.canvas._elem.nextAll(".jqplot-point-label.jqplot-series-"+O.index).fadeOut(Q)}}else{if(O.canvas._elem.is(":hidden")){if(O.shadowCanvas._elem){O.shadowCanvas._elem.show()}O.canvas._elem.show();O.canvas._elem.nextAll(".jqplot-point-label.jqplot-series-"+O.index).show()}else{if(O.shadowCanvas._elem){O.shadowCanvas._elem.hide()}O.canvas._elem.hide();O.canvas._elem.nextAll(".jqplot-point-label.jqplot-series-"+O.index).hide()}}};function x(){w.jqplot.ElemContainer.call(this);this.drawGridlines=true;this.gridLineColor="#cccccc";this.gridLineWidth=1;this.background="#fffdf6";this.borderColor="#999999";this.borderWidth=2;this.drawBorder=true;this.shadow=true;this.shadowAngle=45;this.shadowOffset=1.5;this.shadowWidth=3;this.shadowDepth=3;this.shadowColor=null;this.shadowAlpha="0.07";this._left;this._top;this._right;this._bottom;this._width;this._height;this._axes=[];this.renderer=w.jqplot.CanvasGridRenderer;this.rendererOptions={};this._offsets={top:null,bottom:null,left:null,right:null}}x.prototype=new w.jqplot.ElemContainer();x.prototype.constructor=x;x.prototype.init=function(){this.renderer=new this.renderer();this.renderer.init.call(this,this.rendererOptions)};x.prototype.createElement=function(O,P){this._offsets=O;return this.renderer.createElement.call(this,P)};x.prototype.draw=function(){this.renderer.draw.call(this)};w.jqplot.GenericCanvas=function(){w.jqplot.ElemContainer.call(this);this._ctx};w.jqplot.GenericCanvas.prototype=new w.jqplot.ElemContainer();w.jqplot.GenericCanvas.prototype.constructor=w.jqplot.GenericCanvas;w.jqplot.GenericCanvas.prototype.createElement=function(S,Q,P,T){this._offsets=S;var O="jqplot";if(Q!=l){O=Q}var R;R=T.canvasManager.getCanvas();if(P!=null){this._plotDimensions=P}R.width=this._plotDimensions.width-this._offsets.left-this._offsets.right;R.height=this._plotDimensions.height-this._offsets.top-this._offsets.bottom;this._elem=w(R);this._elem.css({position:"absolute",left:this._offsets.left,top:this._offsets.top});this._elem.addClass(O);R=T.canvasManager.initCanvas(R);R=null;return this._elem};w.jqplot.GenericCanvas.prototype.setContext=function(){this._ctx=this._elem.get(0).getContext("2d");return this._ctx};w.jqplot.GenericCanvas.prototype.resetCanvas=function(){if(this._elem){if(w.jqplot.use_excanvas){window.G_vmlCanvasManager.uninitElement(this._elem.get(0))}this._elem.emptyForce()}this._ctx=null};w.jqplot.HooksManager=function(){this.hooks=[]};w.jqplot.HooksManager.prototype.addOnce=function(P){var Q=false,O;for(O=0;O<this.hooks.length;O++){if(this.hooks[O][0]==P){Q=true}}if(!Q){this.hooks.push(P)}};w.jqplot.HooksManager.prototype.add=function(O){this.hooks.push(O)};w.jqplot.EventListenerManager=function(){this.hooks=[]};w.jqplot.EventListenerManager.prototype.addOnce=function(R,Q){var S=false,P,O;for(O=0;O<this.hooks.length;O++){P=this.hooks[O];if(P[0]==R&&P[1]==Q){S=true}}if(!S){this.hooks.push([R,Q])}};w.jqplot.EventListenerManager.prototype.add=function(P,O){this.hooks.push([P,O])};function C(){this.data=[];this.dataRenderer;this.dataRendererOptions;this.noDataIndicator={show:false,indicator:"Loading Data...",axes:{xaxis:{min:0,max:10,tickInterval:2,show:true},yaxis:{min:0,max:12,tickInterval:3,show:true}}};this.targetId=null;this.target=null;this.defaults={axesDefaults:{},axes:{xaxis:{},yaxis:{},x2axis:{},y2axis:{},y3axis:{},y4axis:{},y5axis:{},y6axis:{},y7axis:{},y8axis:{},y9axis:{}},seriesDefaults:{},series:[]};this.series=[];this.axes={xaxis:new m("xaxis"),yaxis:new m("yaxis"),x2axis:new m("x2axis"),y2axis:new m("y2axis"),y3axis:new m("y3axis"),y4axis:new m("y4axis"),y5axis:new m("y5axis"),y6axis:new m("y6axis"),y7axis:new m("y7axis"),y8axis:new m("y8axis"),y9axis:new m("y9axis")};this.grid=new x();this.legend=new h();this.baseCanvas=new w.jqplot.GenericCanvas();this.seriesStack=[];this.previousSeriesStack=[];this.eventCanvas=new w.jqplot.GenericCanvas();this._width=null;this._height=null;this._plotDimensions={height:null,width:null};this._gridPadding={top:null,right:null,bottom:null,left:null};this._defaultGridPadding={top:10,right:10,bottom:23,left:10};this.syncXTicks=true;this.syncYTicks=true;this.seriesColors=w.jqplot.config.defaultColors;this.negativeSeriesColors=w.jqplot.config.defaultNegativeColors;this.sortData=true;var Q=0;this.textColor;this.fontFamily;this.fontSize;this.title=new n();this.options={};this.stackSeries=false;this.defaultAxisStart=1;this._stackData=[];this._plotData=[];this.plugins={};this._drawCount=0;this.drawIfHidden=false;this.captureRightClick=false;this.themeEngine=new w.jqplot.ThemeEngine();this._sumy=0;this._sumx=0;this.preInitHooks=new w.jqplot.HooksManager();this.postInitHooks=new w.jqplot.HooksManager();this.preParseOptionsHooks=new w.jqplot.HooksManager();this.postParseOptionsHooks=new w.jqplot.HooksManager();this.preDrawHooks=new w.jqplot.HooksManager();this.postDrawHooks=new w.jqplot.HooksManager();this.preDrawSeriesHooks=new w.jqplot.HooksManager();this.postDrawSeriesHooks=new w.jqplot.HooksManager();this.preDrawLegendHooks=new w.jqplot.HooksManager();this.addLegendRowHooks=new w.jqplot.HooksManager();this.preSeriesInitHooks=new w.jqplot.HooksManager();this.postSeriesInitHooks=new w.jqplot.HooksManager();this.preParseSeriesOptionsHooks=new w.jqplot.HooksManager();this.postParseSeriesOptionsHooks=new w.jqplot.HooksManager();this.eventListenerHooks=new w.jqplot.EventListenerManager();this.preDrawSeriesShadowHooks=new w.jqplot.HooksManager();this.postDrawSeriesShadowHooks=new w.jqplot.HooksManager();this.colorGenerator=w.jqplot.ColorGenerator;this.canvasManager=new w.jqplot.CanvasManager();this.init=function(Z,W,ab){ab=ab||{};for(var X=0;X<w.jqplot.preInitHooks.length;X++){w.jqplot.preInitHooks[X].call(this,Z,W,ab)}for(var X=0;X<this.preInitHooks.hooks.length;X++){this.preInitHooks.hooks[X].call(this,Z,W,ab)}this.targetId="#"+Z;this.target=w("#"+Z);this.target.removeClass("jqplot-error");if(!this.target.get(0)){throw"No plot target specified"}if(this.target.css("position")=="static"){this.target.css("position","relative")}if(!this.target.hasClass("jqplot-target")){this.target.addClass("jqplot-target")}if(!this.target.height()){var Y;if(ab&&ab.height){Y=parseInt(ab.height,10)}else{if(this.target.attr("data-height")){Y=parseInt(this.target.attr("data-height"),10)}else{Y=parseInt(w.jqplot.config.defaultHeight,10)}}this._height=Y;this.target.css("height",Y+"px")}else{this._height=Y=this.target.height()}if(!this.target.width()){var aa;if(ab&&ab.width){aa=parseInt(ab.width,10)}else{if(this.target.attr("data-width")){aa=parseInt(this.target.attr("data-width"),10)}else{aa=parseInt(w.jqplot.config.defaultWidth,10)}}this._width=aa;this.target.css("width",aa+"px")}else{this._width=aa=this.target.width()}this._plotDimensions.height=this._height;this._plotDimensions.width=this._width;this.grid._plotDimensions=this._plotDimensions;this.title._plotDimensions=this._plotDimensions;this.baseCanvas._plotDimensions=this._plotDimensions;this.eventCanvas._plotDimensions=this._plotDimensions;this.legend._plotDimensions=this._plotDimensions;if(this._height<=0||this._width<=0||!this._height||!this._width){throw"Canvas dimension not set"}if(ab.dataRenderer&&jQuery.isFunction(ab.dataRenderer)){if(ab.dataRendererOptions){this.dataRendererOptions=ab.dataRendererOptions}this.dataRenderer=ab.dataRenderer;W=this.dataRenderer(W,this,this.dataRendererOptions)}if(ab.noDataIndicator&&jQuery.isPlainObject(ab.noDataIndicator)){w.extend(true,this.noDataIndicator,ab.noDataIndicator)}if(W==null||jQuery.isArray(W)==false||W.length==0||jQuery.isArray(W[0])==false||W[0].length==0){if(this.noDataIndicator.show==false){throw {name:"DataError",message:"No data to plot."}}else{for(var S in this.noDataIndicator.axes){for(var U in this.noDataIndicator.axes[S]){this.axes[S][U]=this.noDataIndicator.axes[S][U]}}this.postDrawHooks.add(function(){var ah=this.eventCanvas.getHeight();var ae=this.eventCanvas.getWidth();var ad=w('<div class="jqplot-noData-container" style="position:absolute;"></div>');this.target.append(ad);ad.height(ah);ad.width(ae);ad.css("top",this.eventCanvas._offsets.top);ad.css("left",this.eventCanvas._offsets.left);var ag=w('<div class="jqplot-noData-contents" style="text-align:center; position:relative; margin-left:auto; margin-right:auto;"></div>');ad.append(ag);ag.html(this.noDataIndicator.indicator);var af=ag.height();var ac=ag.width();ag.height(af);ag.width(ac);ag.css("top",(ah-af)/2+"px")})}}this.data=W;this.parseOptions(ab);if(this.textColor){this.target.css("color",this.textColor)}if(this.fontFamily){this.target.css("font-family",this.fontFamily)}if(this.fontSize){this.target.css("font-size",this.fontSize)}this.title.init();this.legend.init();this._sumy=0;this._sumx=0;for(var X=0;X<this.series.length;X++){this.seriesStack.push(X);this.previousSeriesStack.push(X);this.series[X].shadowCanvas._plotDimensions=this._plotDimensions;this.series[X].canvas._plotDimensions=this._plotDimensions;for(var V=0;V<w.jqplot.preSeriesInitHooks.length;V++){w.jqplot.preSeriesInitHooks[V].call(this.series[X],Z,W,this.options.seriesDefaults,this.options.series[X],this)}for(var V=0;V<this.preSeriesInitHooks.hooks.length;V++){this.preSeriesInitHooks.hooks[V].call(this.series[X],Z,W,this.options.seriesDefaults,this.options.series[X],this)}this.populatePlotData(this.series[X],X);this.series[X]._plotDimensions=this._plotDimensions;this.series[X].init(X,this.grid.borderWidth,this);for(var V=0;V<w.jqplot.postSeriesInitHooks.length;V++){w.jqplot.postSeriesInitHooks[V].call(this.series[X],Z,W,this.options.seriesDefaults,this.options.series[X],this)}for(var V=0;V<this.postSeriesInitHooks.hooks.length;V++){this.postSeriesInitHooks.hooks[V].call(this.series[X],Z,W,this.options.seriesDefaults,this.options.series[X],this)}this._sumy+=this.series[X]._sumy;this._sumx+=this.series[X]._sumx}for(var T in this.axes){this.axes[T]._plotDimensions=this._plotDimensions;this.axes[T].init()}if(this.sortData){O(this.series)}this.grid.init();this.grid._axes=this.axes;this.legend._series=this.series;for(var X=0;X<w.jqplot.postInitHooks.length;X++){w.jqplot.postInitHooks[X].call(this,Z,W,ab)}for(var X=0;X<this.postInitHooks.hooks.length;X++){this.postInitHooks.hooks[X].call(this,Z,W,ab)}};this.resetAxesScale=function(X,T){var V=T||{};var W=X||this.axes;if(W===true){W=this.axes}if(jQuery.isArray(W)){for(var U=0;U<W.length;U++){this.axes[W[U]].resetScale(V[W[U]])}}else{if(typeof(W)==="object"){for(var S in W){this.axes[S].resetScale(V[S])}}}};this.reInitialize=function(){this._height=this.target.height();this._width=this.target.width();if(this._height<=0||this._width<=0||!this._height||!this._width){throw"Target dimension not set"}this._plotDimensions.height=this._height;this._plotDimensions.width=this._width;this.grid._plotDimensions=this._plotDimensions;this.title._plotDimensions=this._plotDimensions;this.baseCanvas._plotDimensions=this._plotDimensions;this.eventCanvas._plotDimensions=this._plotDimensions;this.legend._plotDimensions=this._plotDimensions;for(var W in this.axes){this.axes[W]._plotWidth=this._width;this.axes[W]._plotHeight=this._height}this.title._plotWidth=this._width;if(this.textColor){this.target.css("color",this.textColor)}if(this.fontFamily){this.target.css("font-family",this.fontFamily)}if(this.fontSize){this.target.css("font-size",this.fontSize)}this._sumy=0;this._sumx=0;for(var U=0;U<this.series.length;U++){this.populatePlotData(this.series[U],U);this.series[U]._plotDimensions=this._plotDimensions;this.series[U].canvas._plotDimensions=this._plotDimensions;this._sumy+=this.series[U]._sumy;this._sumx+=this.series[U]._sumx}for(var S in this.axes){var T=this.axes[S]._ticks;for(var U=0;U<T.length;U++){var V=T[U]._elem;if(V){if(w.jqplot.use_excanvas){window.G_vmlCanvasManager.uninitElement(V.get(0))}V.emptyForce();V=null;T._elem=null}}T=null;this.axes[S]._plotDimensions=this._plotDimensions;this.axes[S]._ticks=[];this.axes[S].renderer.init.call(this.axes[S],{})}if(this.sortData){O(this.series)}this.grid._axes=this.axes;this.legend._series=this.series};function O(W){var aa,ab,ac,S,Z;for(var X=0;X<W.length;X++){var T;var Y=[W[X].data,W[X]._stackData,W[X]._plotData,W[X]._prevPlotData];for(var U=0;U<4;U++){T=true;aa=Y[U];if(W[X]._stackAxis=="x"){for(var V=0;V<aa.length;V++){if(typeof(aa[V][1])!="number"){T=false;break}}if(T){aa.sort(function(ae,ad){return ae[1]-ad[1]})}}else{for(var V=0;V<aa.length;V++){if(typeof(aa[V][0])!="number"){T=false;break}}if(T){aa.sort(function(ae,ad){return ae[0]-ad[0]})}}}}}this.populatePlotData=function(W,X){this._plotData=[];this._stackData=[];W._stackData=[];W._plotData=[];var aa={x:[],y:[]};if(this.stackSeries&&!W.disableStack){W._stack=true;var Y=W._stackAxis=="x"?0:1;var Z=Y?0:1;var ab=w.extend(true,[],W.data);var ac=w.extend(true,[],W.data);for(var U=0;U<X;U++){var S=this.series[U].data;for(var T=0;T<S.length;T++){ab[T][0]+=S[T][0];ab[T][1]+=S[T][1];ac[T][Y]+=S[T][Y]}}for(var V=0;V<ac.length;V++){aa.x.push(ac[V][0]);aa.y.push(ac[V][1])}this._plotData.push(ac);this._stackData.push(ab);W._stackData=ab;W._plotData=ac;W._plotValues=aa}else{for(var V=0;V<W.data.length;V++){aa.x.push(W.data[V][0]);aa.y.push(W.data[V][1])}this._stackData.push(W.data);this.series[X]._stackData=W.data;this._plotData.push(W.data);W._plotData=W.data;W._plotValues=aa}if(X>0){W._prevPlotData=this.series[X-1]._plotData}W._sumy=0;W._sumx=0;for(V=W.data.length-1;V>-1;V--){W._sumy+=W.data[V][1];W._sumx+=W.data[V][0]}};this.getNextSeriesColor=(function(T){var S=0;var U=T.seriesColors;return function(){if(S<U.length){return U[S++]}else{S=0;return U[S++]}}})(this);this.parseOptions=function(aa){for(var X=0;X<this.preParseOptionsHooks.hooks.length;X++){this.preParseOptionsHooks.hooks[X].call(this,aa)}for(var X=0;X<w.jqplot.preParseOptionsHooks.length;X++){w.jqplot.preParseOptionsHooks[X].call(this,aa)}this.options=w.extend(true,{},this.defaults,aa);this.stackSeries=this.options.stackSeries;if(this.options.seriesColors){this.seriesColors=this.options.seriesColors}if(this.options.negativeSeriesColors){this.negativeSeriesColors=this.options.negativeSeriesColors}if(this.options.captureRightClick){this.captureRightClick=this.options.captureRightClick}this.defaultAxisStart=(aa&&aa.defaultAxisStart!=null)?aa.defaultAxisStart:this.defaultAxisStart;var S=new this.colorGenerator(this.seriesColors);w.extend(true,this._gridPadding,this.options.gridPadding);this.sortData=(this.options.sortData!=null)?this.options.sortData:this.sortData;for(var T in this.axes){var V=this.axes[T];V._options=w.extend(true,{},this.options.axesDefaults,this.options.axes[T]);w.extend(true,V,this.options.axesDefaults,this.options.axes[T]);V._plotWidth=this._width;V._plotHeight=this._height}var Y=function(ae,ac,af){var ab=[];var ad;ac=ac||"vertical";if(!jQuery.isArray(ae[0])){for(ad=0;ad<ae.length;ad++){if(ac=="vertical"){ab.push([af+ad,ae[ad]])}else{ab.push([ae[ad],af+ad])}}}else{w.extend(true,ab,ae)}return ab};for(var X=0;X<this.data.length;X++){var Z=new D();for(var W=0;W<w.jqplot.preParseSeriesOptionsHooks.length;W++){w.jqplot.preParseSeriesOptionsHooks[W].call(Z,this.options.seriesDefaults,this.options.series[X])}for(var W=0;W<this.preParseSeriesOptionsHooks.hooks.length;W++){this.preParseSeriesOptionsHooks.hooks[W].call(Z,this.options.seriesDefaults,this.options.series[X])}w.extend(true,Z,{seriesColors:this.seriesColors,negativeSeriesColors:this.negativeSeriesColors},this.options.seriesDefaults,this.options.series[X]);var U="vertical";if(Z.renderer===w.jqplot.BarRenderer&&Z.rendererOptions&&Z.rendererOptions.barDirection=="horizontal"){U="horizontal"}Z.data=Y(this.data[X],U,this.defaultAxisStart);switch(Z.xaxis){case"xaxis":Z._xaxis=this.axes.xaxis;break;case"x2axis":Z._xaxis=this.axes.x2axis;break;default:break}Z._yaxis=this.axes[Z.yaxis];Z._xaxis._series.push(Z);Z._yaxis._series.push(Z);if(Z.show){Z._xaxis.show=true;Z._yaxis.show=true}if(!Z.color&&Z.show!=false){Z.color=S.next()}if(!Z.label){Z.label="Series "+(X+1).toString()}this.series.push(Z);for(var W=0;W<w.jqplot.postParseSeriesOptionsHooks.length;W++){w.jqplot.postParseSeriesOptionsHooks[W].call(this.series[X],this.options.seriesDefaults,this.options.series[X])}for(var W=0;W<this.postParseSeriesOptionsHooks.hooks.length;W++){this.postParseSeriesOptionsHooks.hooks[W].call(this.series[X],this.options.seriesDefaults,this.options.series[X])}}w.extend(true,this.grid,this.options.grid);for(var T in this.axes){var V=this.axes[T];if(V.borderWidth==null){V.borderWidth=this.grid.borderWidth}if(V.borderColor==null){if(T!="xaxis"&&T!="x2axis"&&V.useSeriesColor===true&&V.show){V.borderColor=V._series[0].color}else{V.borderColor=this.grid.borderColor}}}if(typeof this.options.title=="string"){this.title.text=this.options.title}else{if(typeof this.options.title=="object"){w.extend(true,this.title,this.options.title)}}this.title._plotWidth=this._width;this.legend.setOptions(this.options.legend);for(var X=0;X<w.jqplot.postParseOptionsHooks.length;X++){w.jqplot.postParseOptionsHooks[X].call(this,aa)}for(var X=0;X<this.postParseOptionsHooks.hooks.length;X++){this.postParseOptionsHooks.hooks[X].call(this,aa)}};this.destroy=function(){this.canvasManager.freeAllCanvases();this.target[0].innerHTML=""};this.replot=function(T){var U=T||{};var S=U.clear||true;var V=U.resetAxes||false;this.target.trigger("jqplotPreReplot");if(S){this.canvasManager.freeAllCanvases();if(this._eventCanvas){this.eventCanvas._elem.unbind()}this.target.unbind();this.target.empty()}this.reInitialize();if(V){this.resetAxesScale(V,U.axes)}this.draw();this.target.trigger("jqplotPostReplot")};this.redraw=function(S){S=(S!=null)?S:true;this.target.trigger("jqplotPreRedraw");if(S){this.canvasManager.freeAllCanvases();this.eventCanvas._elem.unbind();this.target.unbind();this.target.empty()}for(var U in this.axes){this.axes[U]._ticks=[]}for(var T=0;T<this.series.length;T++){this.populatePlotData(this.series[T],T)}this._sumy=0;this._sumx=0;for(T=0;T<this.series.length;T++){this._sumy+=this.series[T]._sumy;this._sumx+=this.series[T]._sumx}this.draw();this.target.trigger("jqplotPostRedraw")};this.draw=function(){if(this.drawIfHidden||this.target.is(":visible")){this.target.trigger("jqplotPreDraw");var Y,X;for(Y=0;Y<w.jqplot.preDrawHooks.length;Y++){w.jqplot.preDrawHooks[Y].call(this)}for(Y=0;Y<this.preDrawHooks.hooks.length;Y++){this.preDrawHooks.hooks[Y].call(this)}this.target.append(this.baseCanvas.createElement({left:0,right:0,top:0,bottom:0},"jqplot-base-canvas",null,this));this.baseCanvas.setContext();this.target.append(this.title.draw());this.title.pack({top:0,left:0});var ad=this.legend.draw();var ac={top:0,left:0,bottom:0,right:0};if(this.legend.placement=="outsideGrid"){this.target.append(ad);switch(this.legend.location){case"n":ac.top+=this.legend.getHeight();break;case"s":ac.bottom+=this.legend.getHeight();break;case"ne":case"e":case"se":ac.right+=this.legend.getWidth();break;case"nw":case"w":case"sw":ac.left+=this.legend.getWidth();break;default:ac.right+=this.legend.getWidth();break}ad=ad.detach()}var S=this.axes;for(var U in S){this.target.append(S[U].draw(this.baseCanvas._ctx,this));S[U].set()}if(S.yaxis.show){ac.left+=S.yaxis.getWidth()}var V=["y2axis","y3axis","y4axis","y5axis","y6axis","y7axis","y8axis","y9axis"];var T=[0,0,0,0,0,0,0,0];var aa=0;var W;for(W=0;W<8;W++){if(S[V[W]].show){aa+=S[V[W]].getWidth();T[W]=aa}}ac.right+=aa;if(S.x2axis.show){ac.top+=S.x2axis.getHeight()}if(this.title.show){ac.top+=this.title.getHeight()}if(S.xaxis.show){ac.bottom+=S.xaxis.getHeight()}var Z=["top","bottom","left","right"];for(var W in Z){if(this._gridPadding[Z[W]]==null&&ac[Z[W]]>0){this._gridPadding[Z[W]]=ac[Z[W]]}else{if(this._gridPadding[Z[W]]==null){this._gridPadding[Z[W]]=this._defaultGridPadding[Z[W]]}}}var ab=(this.legend.placement=="outsideGrid")?{top:this.title.getHeight(),left:0,right:0,bottom:0}:this._gridPadding;S.xaxis.pack({position:"absolute",bottom:this._gridPadding.bottom-S.xaxis.getHeight(),left:0,width:this._width},{min:this._gridPadding.left,max:this._width-this._gridPadding.right});S.yaxis.pack({position:"absolute",top:0,left:this._gridPadding.left-S.yaxis.getWidth(),height:this._height},{min:this._height-this._gridPadding.bottom,max:this._gridPadding.top});S.x2axis.pack({position:"absolute",top:this._gridPadding.top-S.x2axis.getHeight(),left:0,width:this._width},{min:this._gridPadding.left,max:this._width-this._gridPadding.right});for(Y=8;Y>0;Y--){S[V[Y-1]].pack({position:"absolute",top:0,right:this._gridPadding.right-T[Y-1]},{min:this._height-this._gridPadding.bottom,max:this._gridPadding.top})}this.target.append(this.grid.createElement(this._gridPadding,this));this.grid.draw();for(Y=0;Y<this.series.length;Y++){X=this.seriesStack[Y];this.target.append(this.series[X].shadowCanvas.createElement(this._gridPadding,"jqplot-series-shadowCanvas",null,this));this.series[X].shadowCanvas.setContext();this.series[X].shadowCanvas._elem.data("seriesIndex",X)}for(Y=0;Y<this.series.length;Y++){X=this.seriesStack[Y];this.target.append(this.series[X].canvas.createElement(this._gridPadding,"jqplot-series-canvas",null,this));this.series[X].canvas.setContext();this.series[X].canvas._elem.data("seriesIndex",X)}this.target.append(this.eventCanvas.createElement(this._gridPadding,"jqplot-event-canvas",null,this));this.eventCanvas.setContext();this.eventCanvas._ctx.fillStyle="rgba(0,0,0,0)";this.eventCanvas._ctx.fillRect(0,0,this.eventCanvas._ctx.canvas.width,this.eventCanvas._ctx.canvas.height);this.bindCustomEvents();if(this.legend.preDraw){this.eventCanvas._elem.before(ad);this.legend.pack(ab);if(this.legend._elem){this.drawSeries({legendInfo:{location:this.legend.location,placement:this.legend.placement,width:this.legend.getWidth(),height:this.legend.getHeight(),xoffset:this.legend.xoffset,yoffset:this.legend.yoffset}})}else{this.drawSeries()}}else{this.drawSeries();if(this.series.length){w(this.series[this.series.length-1].canvas._elem).after(ad)}this.legend.pack(ab)}for(var Y=0;Y<w.jqplot.eventListenerHooks.length;Y++){this.eventCanvas._elem.bind(w.jqplot.eventListenerHooks[Y][0],{plot:this},w.jqplot.eventListenerHooks[Y][1])}for(var Y=0;Y<this.eventListenerHooks.hooks.length;Y++){this.eventCanvas._elem.bind(this.eventListenerHooks.hooks[Y][0],{plot:this},this.eventListenerHooks.hooks[Y][1])}for(var Y=0;Y<w.jqplot.postDrawHooks.length;Y++){w.jqplot.postDrawHooks[Y].call(this)}for(var Y=0;Y<this.postDrawHooks.hooks.length;Y++){this.postDrawHooks.hooks[Y].call(this)}if(this.target.is(":visible")){this._drawCount+=1}this.target.trigger("jqplotPostDraw",[this])}};this.bindCustomEvents=function(){this.eventCanvas._elem.bind("click",{plot:this},this.onClick);this.eventCanvas._elem.bind("dblclick",{plot:this},this.onDblClick);this.eventCanvas._elem.bind("mousedown",{plot:this},this.onMouseDown);this.eventCanvas._elem.bind("mousemove",{plot:this},this.onMouseMove);this.eventCanvas._elem.bind("mouseenter",{plot:this},this.onMouseEnter);this.eventCanvas._elem.bind("mouseleave",{plot:this},this.onMouseLeave);if(this.captureRightClick){this.eventCanvas._elem.bind("mouseup",{plot:this},this.onRightClick);this.eventCanvas._elem.get(0).oncontextmenu=function(){return false}}else{this.eventCanvas._elem.bind("mouseup",{plot:this},this.onMouseUp)}};function P(aa){var Z=aa.data.plot;var V=Z.eventCanvas._elem.offset();var Y={x:aa.pageX-V.left,y:aa.pageY-V.top};var W={xaxis:null,yaxis:null,x2axis:null,y2axis:null,y3axis:null,y4axis:null,y5axis:null,y6axis:null,y7axis:null,y8axis:null,y9axis:null};var X=["xaxis","yaxis","x2axis","y2axis","y3axis","y4axis","y5axis","y6axis","y7axis","y8axis","y9axis"];var S=Z.axes;var T,U;for(T=11;T>0;T--){U=X[T-1];if(S[U].show){W[U]=S[U].series_p2u(Y[U.charAt(0)])}}return{offsets:V,gridPos:Y,dataPos:W}}function R(S,T){var X=T.series;var aC,aB,aA,av,aw,ap,ao,ac,aa,af,ag,aq;var az,aD,ax,Y,an,at;var U,au;for(aA=T.seriesStack.length-1;aA>=0;aA--){aC=T.seriesStack[aA];av=X[aC];switch(av.renderer.constructor){case w.jqplot.BarRenderer:ap=S.x;ao=S.y;for(aB=0;aB<av._barPoints.length;aB++){an=av._barPoints[aB];ax=av.gridData[aB];if(ap>an[0][0]&&ap<an[2][0]&&ao>an[2][1]&&ao<an[0][1]){return{seriesIndex:av.index,pointIndex:aB,gridData:ax,data:av.data[aB],points:av._barPoints[aB]}}}break;case w.jqplot.DonutRenderer:af=av.startAngle/180*Math.PI;ap=S.x-av._center[0];ao=S.y-av._center[1];aw=Math.sqrt(Math.pow(ap,2)+Math.pow(ao,2));if(ap>0&&-ao>=0){ac=2*Math.PI-Math.atan(-ao/ap)}else{if(ap>0&&-ao<0){ac=-Math.atan(-ao/ap)}else{if(ap<0){ac=Math.PI-Math.atan(-ao/ap)}else{if(ap==0&&-ao>0){ac=3*Math.PI/2}else{if(ap==0&&-ao<0){ac=Math.PI/2}else{if(ap==0&&ao==0){ac=0}}}}}}if(af){ac-=af;if(ac<0){ac+=2*Math.PI}else{if(ac>2*Math.PI){ac-=2*Math.PI}}}aa=av.sliceMargin/180*Math.PI;if(aw<av._radius&&aw>av._innerRadius){for(aB=0;aB<av.gridData.length;aB++){ag=(aB>0)?av.gridData[aB-1][1]+aa:aa;aq=av.gridData[aB][1];if(ac>ag&&ac<aq){return{seriesIndex:av.index,pointIndex:aB,gridData:av.gridData[aB],data:av.data[aB]}}}}break;case w.jqplot.PieRenderer:af=av.startAngle/180*Math.PI;ap=S.x-av._center[0];ao=S.y-av._center[1];aw=Math.sqrt(Math.pow(ap,2)+Math.pow(ao,2));if(ap>0&&-ao>=0){ac=2*Math.PI-Math.atan(-ao/ap)}else{if(ap>0&&-ao<0){ac=-Math.atan(-ao/ap)}else{if(ap<0){ac=Math.PI-Math.atan(-ao/ap)}else{if(ap==0&&-ao>0){ac=3*Math.PI/2}else{if(ap==0&&-ao<0){ac=Math.PI/2}else{if(ap==0&&ao==0){ac=0}}}}}}if(af){ac-=af;if(ac<0){ac+=2*Math.PI}else{if(ac>2*Math.PI){ac-=2*Math.PI}}}aa=av.sliceMargin/180*Math.PI;if(aw<av._radius){for(aB=0;aB<av.gridData.length;aB++){ag=(aB>0)?av.gridData[aB-1][1]+aa:aa;aq=av.gridData[aB][1];if(ac>ag&&ac<aq){return{seriesIndex:av.index,pointIndex:aB,gridData:av.gridData[aB],data:av.data[aB]}}}}break;case w.jqplot.BubbleRenderer:ap=S.x;ao=S.y;var al=null;if(av.show){for(var aB=0;aB<av.gridData.length;aB++){ax=av.gridData[aB];aD=Math.sqrt((ap-ax[0])*(ap-ax[0])+(ao-ax[1])*(ao-ax[1]));if(aD<=ax[2]&&(aD<=az||az==null)){az=aD;al={seriesIndex:aC,pointIndex:aB,gridData:ax,data:av.data[aB]}}}if(al!=null){return al}}break;case w.jqplot.FunnelRenderer:ap=S.x;ao=S.y;var ar=av._vertices,W=ar[0],V=ar[ar.length-1],Z,ak,ae;function ay(aG,aI,aH){var aF=(aI[1]-aH[1])/(aI[0]-aH[0]);var aE=aI[1]-aF*aI[0];var aJ=aG+aI[1];return[(aJ-aE)/aF,aJ]}Z=ay(ao,W[0],V[3]);ak=ay(ao,W[1],V[2]);for(aB=0;aB<ar.length;aB++){ae=ar[aB];if(ao>=ae[0][1]&&ao<=ae[3][1]&&ap>=Z[0]&&ap<=ak[0]){return{seriesIndex:av.index,pointIndex:aB,gridData:null,data:av.data[aB]}}}break;case w.jqplot.LineRenderer:ap=S.x;ao=S.y;aw=av.renderer;if(av.show){if(av.fill){var ad=false;if(ap>av._boundingBox[0][0]&&ap<av._boundingBox[1][0]&&ao>av._boundingBox[1][1]&&ao<av._boundingBox[0][1]){var aj=av._areaPoints.length;var am;var aB=aj-1;for(var am=0;am<aj;am++){var ai=[av._areaPoints[am][0],av._areaPoints[am][1]];var ah=[av._areaPoints[aB][0],av._areaPoints[aB][1]];if(ai[1]<ao&&ah[1]>=ao||ah[1]<ao&&ai[1]>=ao){if(ai[0]+(ao-ai[1])/(ah[1]-ai[1])*(ah[0]-ai[0])<ap){ad=!ad}}aB=am}}if(ad){return{seriesIndex:aC,pointIndex:null,gridData:av.gridData,data:av.data,points:av._areaPoints}}break}else{au=av.markerRenderer.size/2+av.neighborThreshold;U=(au>0)?au:0;for(var aB=0;aB<av.gridData.length;aB++){ax=av.gridData[aB];if(aw.constructor==w.jqplot.OHLCRenderer){if(aw.candleStick){var ab=av._yaxis.series_u2p;if(ap>=ax[0]-aw._bodyWidth/2&&ap<=ax[0]+aw._bodyWidth/2&&ao>=ab(av.data[aB][2])&&ao<=ab(av.data[aB][3])){return{seriesIndex:aC,pointIndex:aB,gridData:ax,data:av.data[aB]}}}else{if(!aw.hlc){var ab=av._yaxis.series_u2p;if(ap>=ax[0]-aw._tickLength&&ap<=ax[0]+aw._tickLength&&ao>=ab(av.data[aB][2])&&ao<=ab(av.data[aB][3])){return{seriesIndex:aC,pointIndex:aB,gridData:ax,data:av.data[aB]}}}else{var ab=av._yaxis.series_u2p;if(ap>=ax[0]-aw._tickLength&&ap<=ax[0]+aw._tickLength&&ao>=ab(av.data[aB][1])&&ao<=ab(av.data[aB][2])){return{seriesIndex:aC,pointIndex:aB,gridData:ax,data:av.data[aB]}}}}}else{if(ax[0]!=null&&ax[1]!=null){aD=Math.sqrt((ap-ax[0])*(ap-ax[0])+(ao-ax[1])*(ao-ax[1]));if(aD<=U&&(aD<=az||az==null)){az=aD;return{seriesIndex:aC,pointIndex:aB,gridData:ax,data:av.data[aB]}}}}}}}break;default:ap=S.x;ao=S.y;aw=av.renderer;if(av.show){au=av.markerRenderer.size/2+av.neighborThreshold;U=(au>0)?au:0;for(var aB=0;aB<av.gridData.length;aB++){ax=av.gridData[aB];if(aw.constructor==w.jqplot.OHLCRenderer){if(aw.candleStick){var ab=av._yaxis.series_u2p;if(ap>=ax[0]-aw._bodyWidth/2&&ap<=ax[0]+aw._bodyWidth/2&&ao>=ab(av.data[aB][2])&&ao<=ab(av.data[aB][3])){return{seriesIndex:aC,pointIndex:aB,gridData:ax,data:av.data[aB]}}}else{if(!aw.hlc){var ab=av._yaxis.series_u2p;if(ap>=ax[0]-aw._tickLength&&ap<=ax[0]+aw._tickLength&&ao>=ab(av.data[aB][2])&&ao<=ab(av.data[aB][3])){return{seriesIndex:aC,pointIndex:aB,gridData:ax,data:av.data[aB]}}}else{var ab=av._yaxis.series_u2p;if(ap>=ax[0]-aw._tickLength&&ap<=ax[0]+aw._tickLength&&ao>=ab(av.data[aB][1])&&ao<=ab(av.data[aB][2])){return{seriesIndex:aC,pointIndex:aB,gridData:ax,data:av.data[aB]}}}}}else{aD=Math.sqrt((ap-ax[0])*(ap-ax[0])+(ao-ax[1])*(ao-ax[1]));if(aD<=U&&(aD<=az||az==null)){az=aD;return{seriesIndex:aC,pointIndex:aB,gridData:ax,data:av.data[aB]}}}}}break}}return null}this.onClick=function(U){var T=P(U);var W=U.data.plot;var V=R(T.gridPos,W);var S=jQuery.Event("jqplotClick");S.pageX=U.pageX;S.pageY=U.pageY;w(this).trigger(S,[T.gridPos,T.dataPos,V,W])};this.onDblClick=function(U){var T=P(U);var W=U.data.plot;var V=R(T.gridPos,W);var S=jQuery.Event("jqplotDblClick");S.pageX=U.pageX;S.pageY=U.pageY;w(this).trigger(S,[T.gridPos,T.dataPos,V,W])};this.onMouseDown=function(U){var T=P(U);var W=U.data.plot;var V=R(T.gridPos,W);var S=jQuery.Event("jqplotMouseDown");S.pageX=U.pageX;S.pageY=U.pageY;w(this).trigger(S,[T.gridPos,T.dataPos,V,W])};this.onMouseUp=function(U){var T=P(U);var S=jQuery.Event("jqplotMouseUp");S.pageX=U.pageX;S.pageY=U.pageY;w(this).trigger(S,[T.gridPos,T.dataPos,null,U.data.plot])};this.onRightClick=function(U){var T=P(U);var W=U.data.plot;var V=R(T.gridPos,W);if(W.captureRightClick){if(U.which==3){var S=jQuery.Event("jqplotRightClick");S.pageX=U.pageX;S.pageY=U.pageY;w(this).trigger(S,[T.gridPos,T.dataPos,V,W])}else{var S=jQuery.Event("jqplotMouseUp");S.pageX=U.pageX;S.pageY=U.pageY;w(this).trigger(S,[T.gridPos,T.dataPos,V,W])}}};this.onMouseMove=function(U){var T=P(U);var W=U.data.plot;var V=R(T.gridPos,W);var S=jQuery.Event("jqplotMouseMove");S.pageX=U.pageX;S.pageY=U.pageY;w(this).trigger(S,[T.gridPos,T.dataPos,V,W])};this.onMouseEnter=function(U){var T=P(U);var V=U.data.plot;var S=jQuery.Event("jqplotMouseEnter");S.pageX=U.pageX;S.pageY=U.pageY;w(this).trigger(S,[T.gridPos,T.dataPos,null,V])};this.onMouseLeave=function(U){var T=P(U);var V=U.data.plot;var S=jQuery.Event("jqplotMouseLeave");S.pageX=U.pageX;S.pageY=U.pageY;w(this).trigger(S,[T.gridPos,T.dataPos,null,V])};this.drawSeries=function(U,S){var W,V,T;S=(typeof(U)==="number"&&S==null)?U:S;U=(typeof(U)==="object")?U:{};if(S!=l){V=this.series[S];T=V.shadowCanvas._ctx;T.clearRect(0,0,T.canvas.width,T.canvas.height);V.drawShadow(T,U,this);T=V.canvas._ctx;T.clearRect(0,0,T.canvas.width,T.canvas.height);V.draw(T,U,this);if(V.renderer.constructor==w.jqplot.BezierCurveRenderer){if(S<this.series.length-1){this.drawSeries(S+1)}}}else{for(W=0;W<this.series.length;W++){V=this.series[W];T=V.shadowCanvas._ctx;T.clearRect(0,0,T.canvas.width,T.canvas.height);V.drawShadow(T,U,this);T=V.canvas._ctx;T.clearRect(0,0,T.canvas.width,T.canvas.height);V.draw(T,U,this)}}U=S=W=V=T=null};this.moveSeriesToFront=function(T){T=parseInt(T,10);var W=w.inArray(T,this.seriesStack);if(W==-1){return}if(W==this.seriesStack.length-1){this.previousSeriesStack=this.seriesStack.slice(0);return}var S=this.seriesStack[this.seriesStack.length-1];var V=this.series[T].canvas._elem.detach();var U=this.series[T].shadowCanvas._elem.detach();this.series[S].shadowCanvas._elem.after(U);this.series[S].canvas._elem.after(V);this.previousSeriesStack=this.seriesStack.slice(0);this.seriesStack.splice(W,1);this.seriesStack.push(T)};this.moveSeriesToBack=function(T){T=parseInt(T,10);var W=w.inArray(T,this.seriesStack);if(W==0||W==-1){return}var S=this.seriesStack[0];var V=this.series[T].canvas._elem.detach();var U=this.series[T].shadowCanvas._elem.detach();this.series[S].shadowCanvas._elem.before(U);this.series[S].canvas._elem.before(V);this.previousSeriesStack=this.seriesStack.slice(0);this.seriesStack.splice(W,1);this.seriesStack.unshift(T)};this.restorePreviousSeriesOrder=function(){var Y,X,W,V,U,S,T;if(this.seriesStack==this.previousSeriesStack){return}for(Y=1;Y<this.previousSeriesStack.length;Y++){S=this.previousSeriesStack[Y];T=this.previousSeriesStack[Y-1];W=this.series[S].canvas._elem.detach();V=this.series[S].shadowCanvas._elem.detach();this.series[T].shadowCanvas._elem.after(V);this.series[T].canvas._elem.after(W)}U=this.seriesStack.slice(0);this.seriesStack=this.previousSeriesStack.slice(0);this.previousSeriesStack=U};this.restoreOriginalSeriesOrder=function(){var W,V,S=[],U,T;for(W=0;W<this.series.length;W++){S.push(W)}if(this.seriesStack==S){return}this.previousSeriesStack=this.seriesStack.slice(0);this.seriesStack=S;for(W=1;W<this.seriesStack.length;W++){U=this.series[W].canvas._elem.detach();T=this.series[W].shadowCanvas._elem.detach();this.series[W-1].shadowCanvas._elem.after(T);this.series[W-1].canvas._elem.after(U)}};this.activateTheme=function(S){this.themeEngine.activate(this,S)}}w.jqplot.computeHighlightColors=function(P){var R;if(jQuery.isArray(P)){R=[];for(var T=0;T<P.length;T++){var S=w.jqplot.getColorComponents(P[T]);var O=[S[0],S[1],S[2]];var U=O[0]+O[1]+O[2];for(var Q=0;Q<3;Q++){O[Q]=(U>570)?O[Q]*0.8:O[Q]+0.3*(255-O[Q]);O[Q]=parseInt(O[Q],10)}R.push("rgb("+O[0]+","+O[1]+","+O[2]+")")}}else{var S=w.jqplot.getColorComponents(P);var O=[S[0],S[1],S[2]];var U=O[0]+O[1]+O[2];for(var Q=0;Q<3;Q++){O[Q]=(U>570)?O[Q]*0.8:O[Q]+0.3*(255-O[Q]);O[Q]=parseInt(O[Q],10)}R="rgb("+O[0]+","+O[1]+","+O[2]+")"}return R};w.jqplot.ColorGenerator=function(P){P=P||w.jqplot.config.defaultColors;var O=0;this.next=function(){if(O<P.length){return P[O++]}else{O=0;return P[O++]}};this.previous=function(){if(O>0){return P[O--]}else{O=P.length-1;return P[O]}};this.get=function(R){var Q=R-P.length*Math.floor(R/P.length);return P[Q]};this.setColors=function(Q){P=Q};this.reset=function(){O=0}};w.jqplot.hex2rgb=function(Q,O){Q=Q.replace("#","");if(Q.length==3){Q=Q.charAt(0)+Q.charAt(0)+Q.charAt(1)+Q.charAt(1)+Q.charAt(2)+Q.charAt(2)}var P;P="rgba("+parseInt(Q.slice(0,2),16)+", "+parseInt(Q.slice(2,4),16)+", "+parseInt(Q.slice(4,6),16);if(O){P+=", "+O}P+=")";return P};w.jqplot.rgb2hex=function(T){var Q=/rgba?\( *([0-9]{1,3}\.?[0-9]*%?) *, *([0-9]{1,3}\.?[0-9]*%?) *, *([0-9]{1,3}\.?[0-9]*%?) *(?:, *[0-9.]*)?\)/;var O=T.match(Q);var S="#";for(var R=1;R<4;R++){var P;if(O[R].search(/%/)!=-1){P=parseInt(255*O[R]/100,10).toString(16);if(P.length==1){P="0"+P}}else{P=parseInt(O[R],10).toString(16);if(P.length==1){P="0"+P}}S+=P}return S};w.jqplot.normalize2rgb=function(P,O){if(P.search(/^ *rgba?\(/)!=-1){return P}else{if(P.search(/^ *#?[0-9a-fA-F]?[0-9a-fA-F]/)!=-1){return w.jqplot.hex2rgb(P,O)}else{throw"invalid color spec"}}};w.jqplot.getColorComponents=function(T){T=w.jqplot.colorKeywordMap[T]||T;var R=w.jqplot.normalize2rgb(T);var Q=/rgba?\( *([0-9]{1,3}\.?[0-9]*%?) *, *([0-9]{1,3}\.?[0-9]*%?) *, *([0-9]{1,3}\.?[0-9]*%?) *,? *([0-9.]* *)?\)/;var O=R.match(Q);var P=[];for(var S=1;S<4;S++){if(O[S].search(/%/)!=-1){P[S-1]=parseInt(255*O[S]/100,10)}else{P[S-1]=parseInt(O[S],10)}}P[3]=parseFloat(O[4])?parseFloat(O[4]):1;return P};w.jqplot.colorKeywordMap={aliceblue:"rgb(240, 248, 255)",antiquewhite:"rgb(250, 235, 215)",aqua:"rgb( 0, 255, 255)",aquamarine:"rgb(127, 255, 212)",azure:"rgb(240, 255, 255)",beige:"rgb(245, 245, 220)",bisque:"rgb(255, 228, 196)",black:"rgb( 0, 0, 0)",blanchedalmond:"rgb(255, 235, 205)",blue:"rgb( 0, 0, 255)",blueviolet:"rgb(138, 43, 226)",brown:"rgb(165, 42, 42)",burlywood:"rgb(222, 184, 135)",cadetblue:"rgb( 95, 158, 160)",chartreuse:"rgb(127, 255, 0)",chocolate:"rgb(210, 105, 30)",coral:"rgb(255, 127, 80)",cornflowerblue:"rgb(100, 149, 237)",cornsilk:"rgb(255, 248, 220)",crimson:"rgb(220, 20, 60)",cyan:"rgb( 0, 255, 255)",darkblue:"rgb( 0, 0, 139)",darkcyan:"rgb( 0, 139, 139)",darkgoldenrod:"rgb(184, 134, 11)",darkgray:"rgb(169, 169, 169)",darkgreen:"rgb( 0, 100, 0)",darkgrey:"rgb(169, 169, 169)",darkkhaki:"rgb(189, 183, 107)",darkmagenta:"rgb(139, 0, 139)",darkolivegreen:"rgb( 85, 107, 47)",darkorange:"rgb(255, 140, 0)",darkorchid:"rgb(153, 50, 204)",darkred:"rgb(139, 0, 0)",darksalmon:"rgb(233, 150, 122)",darkseagreen:"rgb(143, 188, 143)",darkslateblue:"rgb( 72, 61, 139)",darkslategray:"rgb( 47, 79, 79)",darkslategrey:"rgb( 47, 79, 79)",darkturquoise:"rgb( 0, 206, 209)",darkviolet:"rgb(148, 0, 211)",deeppink:"rgb(255, 20, 147)",deepskyblue:"rgb( 0, 191, 255)",dimgray:"rgb(105, 105, 105)",dimgrey:"rgb(105, 105, 105)",dodgerblue:"rgb( 30, 144, 255)",firebrick:"rgb(178, 34, 34)",floralwhite:"rgb(255, 250, 240)",forestgreen:"rgb( 34, 139, 34)",fuchsia:"rgb(255, 0, 255)",gainsboro:"rgb(220, 220, 220)",ghostwhite:"rgb(248, 248, 255)",gold:"rgb(255, 215, 0)",goldenrod:"rgb(218, 165, 32)",gray:"rgb(128, 128, 128)",grey:"rgb(128, 128, 128)",green:"rgb( 0, 128, 0)",greenyellow:"rgb(173, 255, 47)",honeydew:"rgb(240, 255, 240)",hotpink:"rgb(255, 105, 180)",indianred:"rgb(205, 92, 92)",indigo:"rgb( 75, 0, 130)",ivory:"rgb(255, 255, 240)",khaki:"rgb(240, 230, 140)",lavender:"rgb(230, 230, 250)",lavenderblush:"rgb(255, 240, 245)",lawngreen:"rgb(124, 252, 0)",lemonchiffon:"rgb(255, 250, 205)",lightblue:"rgb(173, 216, 230)",lightcoral:"rgb(240, 128, 128)",lightcyan:"rgb(224, 255, 255)",lightgoldenrodyellow:"rgb(250, 250, 210)",lightgray:"rgb(211, 211, 211)",lightgreen:"rgb(144, 238, 144)",lightgrey:"rgb(211, 211, 211)",lightpink:"rgb(255, 182, 193)",lightsalmon:"rgb(255, 160, 122)",lightseagreen:"rgb( 32, 178, 170)",lightskyblue:"rgb(135, 206, 250)",lightslategray:"rgb(119, 136, 153)",lightslategrey:"rgb(119, 136, 153)",lightsteelblue:"rgb(176, 196, 222)",lightyellow:"rgb(255, 255, 224)",lime:"rgb( 0, 255, 0)",limegreen:"rgb( 50, 205, 50)",linen:"rgb(250, 240, 230)",magenta:"rgb(255, 0, 255)",maroon:"rgb(128, 0, 0)",mediumaquamarine:"rgb(102, 205, 170)",mediumblue:"rgb( 0, 0, 205)",mediumorchid:"rgb(186, 85, 211)",mediumpurple:"rgb(147, 112, 219)",mediumseagreen:"rgb( 60, 179, 113)",mediumslateblue:"rgb(123, 104, 238)",mediumspringgreen:"rgb( 0, 250, 154)",mediumturquoise:"rgb( 72, 209, 204)",mediumvioletred:"rgb(199, 21, 133)",midnightblue:"rgb( 25, 25, 112)",mintcream:"rgb(245, 255, 250)",mistyrose:"rgb(255, 228, 225)",moccasin:"rgb(255, 228, 181)",navajowhite:"rgb(255, 222, 173)",navy:"rgb( 0, 0, 128)",oldlace:"rgb(253, 245, 230)",olive:"rgb(128, 128, 0)",olivedrab:"rgb(107, 142, 35)",orange:"rgb(255, 165, 0)",orangered:"rgb(255, 69, 0)",orchid:"rgb(218, 112, 214)",palegoldenrod:"rgb(238, 232, 170)",palegreen:"rgb(152, 251, 152)",paleturquoise:"rgb(175, 238, 238)",palevioletred:"rgb(219, 112, 147)",papayawhip:"rgb(255, 239, 213)",peachpuff:"rgb(255, 218, 185)",peru:"rgb(205, 133, 63)",pink:"rgb(255, 192, 203)",plum:"rgb(221, 160, 221)",powderblue:"rgb(176, 224, 230)",purple:"rgb(128, 0, 128)",red:"rgb(255, 0, 0)",rosybrown:"rgb(188, 143, 143)",royalblue:"rgb( 65, 105, 225)",saddlebrown:"rgb(139, 69, 19)",salmon:"rgb(250, 128, 114)",sandybrown:"rgb(244, 164, 96)",seagreen:"rgb( 46, 139, 87)",seashell:"rgb(255, 245, 238)",sienna:"rgb(160, 82, 45)",silver:"rgb(192, 192, 192)",skyblue:"rgb(135, 206, 235)",slateblue:"rgb(106, 90, 205)",slategray:"rgb(112, 128, 144)",slategrey:"rgb(112, 128, 144)",snow:"rgb(255, 250, 250)",springgreen:"rgb( 0, 255, 127)",steelblue:"rgb( 70, 130, 180)",tan:"rgb(210, 180, 140)",teal:"rgb( 0, 128, 128)",thistle:"rgb(216, 191, 216)",tomato:"rgb(255, 99, 71)",turquoise:"rgb( 64, 224, 208)",violet:"rgb(238, 130, 238)",wheat:"rgb(245, 222, 179)",white:"rgb(255, 255, 255)",whitesmoke:"rgb(245, 245, 245)",yellow:"rgb(255, 255, 0)",yellowgreen:"rgb(154, 205, 50)"};w.jqplot.AxisLabelRenderer=function(O){w.jqplot.ElemContainer.call(this);this.axis;this.show=true;this.label="";this.fontFamily=null;this.fontSize=null;this.textColor=null;this._elem;this.escapeHTML=false;w.extend(true,this,O)};w.jqplot.AxisLabelRenderer.prototype=new w.jqplot.ElemContainer();w.jqplot.AxisLabelRenderer.prototype.constructor=w.jqplot.AxisLabelRenderer;w.jqplot.AxisLabelRenderer.prototype.init=function(O){w.extend(true,this,O)};w.jqplot.AxisLabelRenderer.prototype.draw=function(O,P){if(this._elem){this._elem.emptyForce();this._elem=null}this._elem=w('<div style="position:absolute;" class="jqplot-'+this.axis+'-label"></div>');if(Number(this.label)){this._elem.css("white-space","nowrap")}if(!this.escapeHTML){this._elem.html(this.label)}else{this._elem.text(this.label)}if(this.fontFamily){this._elem.css("font-family",this.fontFamily)}if(this.fontSize){this._elem.css("font-size",this.fontSize)}if(this.textColor){this._elem.css("color",this.textColor)}return this._elem};w.jqplot.AxisLabelRenderer.prototype.pack=function(){};w.jqplot.AxisTickRenderer=function(O){w.jqplot.ElemContainer.call(this);this.mark="outside";this.axis;this.showMark=true;this.showGridline=true;this.isMinorTick=false;this.size=4;this.markSize=6;this.show=true;this.showLabel=true;this.label="";this.value=null;this._styles={};this.formatter=w.jqplot.DefaultTickFormatter;this.prefix="";this.formatString="";this.fontFamily;this.fontSize;this.textColor;this.escapeHTML=false;this._elem;this._breakTick=false;w.extend(true,this,O)};w.jqplot.AxisTickRenderer.prototype.init=function(O){w.extend(true,this,O)};w.jqplot.AxisTickRenderer.prototype=new w.jqplot.ElemContainer();w.jqplot.AxisTickRenderer.prototype.constructor=w.jqplot.AxisTickRenderer;w.jqplot.AxisTickRenderer.prototype.setTick=function(O,Q,P){this.value=O;this.axis=Q;if(P){this.isMinorTick=true}return this};w.jqplot.AxisTickRenderer.prototype.draw=function(){if(!this.label){this.label=this.prefix+this.formatter(this.formatString,this.value)}var P={position:"absolute"};if(Number(this.label)){P.whitSpace="nowrap"}if(this._elem){this._elem.emptyForce();this._elem=null}this._elem=w(document.createElement("div"));this._elem.addClass("jqplot-"+this.axis+"-tick");if(!this.escapeHTML){this._elem.html(this.label)}else{this._elem.text(this.label)}this._elem.css(P);for(var O in this._styles){this._elem.css(O,this._styles[O])}if(this.fontFamily){this._elem.css("font-family",this.fontFamily)}if(this.fontSize){this._elem.css("font-size",this.fontSize)}if(this.textColor){this._elem.css("color",this.textColor)}if(this._breakTick){this._elem.addClass("jqplot-breakTick")}return this._elem};w.jqplot.DefaultTickFormatter=function(O,P){if(typeof P=="number"){if(!O){O=w.jqplot.config.defaultTickFormatString}return w.jqplot.sprintf(O,P)}else{return String(P)}};w.jqplot.AxisTickRenderer.prototype.pack=function(){};w.jqplot.CanvasGridRenderer=function(){this.shadowRenderer=new w.jqplot.ShadowRenderer()};w.jqplot.CanvasGridRenderer.prototype.init=function(P){this._ctx;w.extend(true,this,P);var O={lineJoin:"miter",lineCap:"round",fill:false,isarc:false,angle:this.shadowAngle,offset:this.shadowOffset,alpha:this.shadowAlpha,depth:this.shadowDepth,lineWidth:this.shadowWidth,closePath:false,strokeStyle:this.shadowColor};this.renderer.shadowRenderer.init(O)};w.jqplot.CanvasGridRenderer.prototype.createElement=function(R){var Q;if(this._elem){if(w.jqplot.use_excanvas){Q=this._elem.get(0);window.G_vmlCanvasManager.uninitElement(Q);Q=null}this._elem.emptyForce();this._elem=null}Q=R.canvasManager.getCanvas();var O=this._plotDimensions.width;var P=this._plotDimensions.height;Q.width=O;Q.height=P;this._elem=w(Q);this._elem.addClass("jqplot-grid-canvas");this._elem.css({position:"absolute",left:0,top:0});Q=R.canvasManager.initCanvas(Q);this._top=this._offsets.top;this._bottom=P-this._offsets.bottom;this._left=this._offsets.left;this._right=O-this._offsets.right;this._width=this._right-this._left;this._height=this._bottom-this._top;Q=null;return this._elem};w.jqplot.CanvasGridRenderer.prototype.draw=function(){this._ctx=this._elem.get(0).getContext("2d");var Y=this._ctx;var ab=this._axes;Y.save();Y.clearRect(0,0,this._plotDimensions.width,this._plotDimensions.height);Y.fillStyle=this.backgroundColor||this.background;Y.fillRect(this._left,this._top,this._width,this._height);if(true){Y.save();Y.lineJoin="miter";Y.lineCap="butt";Y.lineWidth=this.gridLineWidth;Y.strokeStyle=this.gridLineColor;var ae,ad,W,X;var T=["xaxis","yaxis","x2axis","y2axis"];for(var ac=4;ac>0;ac--){var ag=T[ac-1];var O=ab[ag];var af=O._ticks;if(O.show){for(var Z=af.length;Z>0;Z--){var U=af[Z-1];if(U.show){var R=Math.round(O.u2p(U.value))+0.5;switch(ag){case"xaxis":if(U.showGridline&&this.drawGridlines){V(R,this._top,R,this._bottom)}if(U.showMark&&U.mark){W=U.markSize;X=U.mark;var R=Math.round(O.u2p(U.value))+0.5;switch(X){case"outside":ae=this._bottom;ad=this._bottom+W;break;case"inside":ae=this._bottom-W;ad=this._bottom;break;case"cross":ae=this._bottom-W;ad=this._bottom+W;break;default:ae=this._bottom;ad=this._bottom+W;break}if(this.shadow){this.renderer.shadowRenderer.draw(Y,[[R,ae],[R,ad]],{lineCap:"butt",lineWidth:this.gridLineWidth,offset:this.gridLineWidth*0.75,depth:2,fill:false,closePath:false})}V(R,ae,R,ad)}break;case"yaxis":if(U.showGridline&&this.drawGridlines){V(this._right,R,this._left,R)}if(U.showMark&&U.mark){W=U.markSize;X=U.mark;var R=Math.round(O.u2p(U.value))+0.5;switch(X){case"outside":ae=this._left-W;ad=this._left;break;case"inside":ae=this._left;ad=this._left+W;break;case"cross":ae=this._left-W;ad=this._left+W;break;default:ae=this._left-W;ad=this._left;break}if(this.shadow){this.renderer.shadowRenderer.draw(Y,[[ae,R],[ad,R]],{lineCap:"butt",lineWidth:this.gridLineWidth*1.5,offset:this.gridLineWidth*0.75,fill:false,closePath:false})}V(ae,R,ad,R,{strokeStyle:O.borderColor})}break;case"x2axis":if(U.showGridline&&this.drawGridlines){V(R,this._bottom,R,this._top)}if(U.showMark&&U.mark){W=U.markSize;X=U.mark;var R=Math.round(O.u2p(U.value))+0.5;switch(X){case"outside":ae=this._top-W;ad=this._top;break;case"inside":ae=this._top;ad=this._top+W;break;case"cross":ae=this._top-W;ad=this._top+W;break;default:ae=this._top-W;ad=this._top;break}if(this.shadow){this.renderer.shadowRenderer.draw(Y,[[R,ae],[R,ad]],{lineCap:"butt",lineWidth:this.gridLineWidth,offset:this.gridLineWidth*0.75,depth:2,fill:false,closePath:false})}V(R,ae,R,ad)}break;case"y2axis":if(U.showGridline&&this.drawGridlines){V(this._left,R,this._right,R)}if(U.showMark&&U.mark){W=U.markSize;X=U.mark;var R=Math.round(O.u2p(U.value))+0.5;switch(X){case"outside":ae=this._right;ad=this._right+W;break;case"inside":ae=this._right-W;ad=this._right;break;case"cross":ae=this._right-W;ad=this._right+W;break;default:ae=this._right;ad=this._right+W;break}if(this.shadow){this.renderer.shadowRenderer.draw(Y,[[ae,R],[ad,R]],{lineCap:"butt",lineWidth:this.gridLineWidth*1.5,offset:this.gridLineWidth*0.75,fill:false,closePath:false})}V(ae,R,ad,R,{strokeStyle:O.borderColor})}break;default:break}}}U=null}O=null;af=null}T=["y3axis","y4axis","y5axis","y6axis","y7axis","y8axis","y9axis"];for(var ac=7;ac>0;ac--){var O=ab[T[ac-1]];var af=O._ticks;if(O.show){var P=af[O.numberTicks-1];var S=af[0];var Q=O.getLeft();var aa=[[Q,P.getTop()+P.getHeight()/2],[Q,S.getTop()+S.getHeight()/2+1]];if(this.shadow){this.renderer.shadowRenderer.draw(Y,aa,{lineCap:"butt",fill:false,closePath:false})}V(aa[0][0],aa[0][1],aa[1][0],aa[1][1],{lineCap:"butt",strokeStyle:O.borderColor,lineWidth:O.borderWidth});for(var Z=af.length;Z>0;Z--){var U=af[Z-1];W=U.markSize;X=U.mark;var R=Math.round(O.u2p(U.value))+0.5;if(U.showMark&&U.mark){switch(X){case"outside":ae=Q;ad=Q+W;break;case"inside":ae=Q-W;ad=Q;break;case"cross":ae=Q-W;ad=Q+W;break;default:ae=Q;ad=Q+W;break}aa=[[ae,R],[ad,R]];if(this.shadow){this.renderer.shadowRenderer.draw(Y,aa,{lineCap:"butt",lineWidth:this.gridLineWidth*1.5,offset:this.gridLineWidth*0.75,fill:false,closePath:false})}V(ae,R,ad,R,{strokeStyle:O.borderColor})}U=null}S=null}O=null;af=null}Y.restore()}function V(al,ak,ai,ah,aj){Y.save();aj=aj||{};if(aj.lineWidth==null||aj.lineWidth!=0){w.extend(true,Y,aj);Y.beginPath();Y.moveTo(al,ak);Y.lineTo(ai,ah);Y.stroke();Y.restore()}}if(this.shadow){var aa=[[this._left,this._bottom],[this._right,this._bottom],[this._right,this._top]];this.renderer.shadowRenderer.draw(Y,aa)}if(this.borderWidth!=0&&this.drawBorder){V(this._left,this._top,this._right,this._top,{lineCap:"round",strokeStyle:ab.x2axis.borderColor,lineWidth:ab.x2axis.borderWidth});V(this._right,this._top,this._right,this._bottom,{lineCap:"round",strokeStyle:ab.y2axis.borderColor,lineWidth:ab.y2axis.borderWidth});V(this._right,this._bottom,this._left,this._bottom,{lineCap:"round",strokeStyle:ab.xaxis.borderColor,lineWidth:ab.xaxis.borderWidth});V(this._left,this._bottom,this._left,this._top,{lineCap:"round",strokeStyle:ab.yaxis.borderColor,lineWidth:ab.yaxis.borderWidth})}Y.restore();Y=null;ab=null};w.jqplot.DivTitleRenderer=function(){};w.jqplot.DivTitleRenderer.prototype.init=function(O){w.extend(true,this,O)};w.jqplot.DivTitleRenderer.prototype.draw=function(){if(this._elem){this._elem.emptyForce();this._elem=null}var R=this.renderer;var Q=document.createElement("div");this._elem=w(Q);this._elem.addClass("jqplot-title");if(!this.text){this.show=false;this._elem.height(0);this._elem.width(0)}else{if(this.text){var O;if(this.color){O=this.color}else{if(this.textColor){O=this.textColor}}var P={position:"absolute",top:"0px",left:"0px"};if(this._plotWidth){P.width=this._plotWidth+"px"}if(this.fontSize){P.fontSize=this.fontSize}if(this.textAlign){P.textAlign=this.textAlign}else{P.textAlign="center"}if(O){P.color=O}if(this.paddingBottom){P.paddingBottom=this.paddingBottom}if(this.fontFamily){P.fontFamily=this.fontFamily}this._elem.css(P);this._elem.text(this.text)}}Q=null;return this._elem};w.jqplot.DivTitleRenderer.prototype.pack=function(){};w.jqplot.LineRenderer=function(){this.shapeRenderer=new w.jqplot.ShapeRenderer();this.shadowRenderer=new w.jqplot.ShadowRenderer()};w.jqplot.LineRenderer.prototype.init=function(P,T){P=P||{};this._type="line";var R={highlightMouseOver:P.highlightMouseOver,highlightMouseDown:P.highlightMouseDown,highlightColor:P.highlightColor};delete (P.highlightMouseOver);delete (P.highlightMouseDown);delete (P.highlightColor);w.extend(true,this.renderer,P);var S={lineJoin:this.lineJoin,lineCap:this.lineCap,fill:this.fill,isarc:false,strokeStyle:this.color,fillStyle:this.fillColor,lineWidth:this.lineWidth,closePath:this.fill};this.renderer.shapeRenderer.init(S);if(this.lineWidth>2.5){var Q=this.shadowOffset*(1+(Math.atan((this.lineWidth/2.5))/0.785398163-1)*0.6)}else{var Q=this.shadowOffset*Math.atan((this.lineWidth/2.5))/0.785398163}var O={lineJoin:this.lineJoin,lineCap:this.lineCap,fill:this.fill,isarc:false,angle:this.shadowAngle,offset:Q,alpha:this.shadowAlpha,depth:this.shadowDepth,lineWidth:this.lineWidth,closePath:this.fill};this.renderer.shadowRenderer.init(O);this._areaPoints=[];this._boundingBox=[[],[]];if(!this.isTrendline&&this.fill){this.highlightMouseOver=true;this.highlightMouseDown=false;this.highlightColor=null;if(R.highlightMouseDown&&R.highlightMouseOver==null){R.highlightMouseOver=false}w.extend(true,this,{highlightMouseOver:R.highlightMouseOver,highlightMouseDown:R.highlightMouseDown,highlightColor:R.highlightColor});if(!this.highlightColor){this.highlightColor=w.jqplot.computeHighlightColors(this.fillColor)}if(this.highlighter){this.highlighter.show=false}}if(!this.isTrendline&&T){T.plugins.lineRenderer={};T.postInitHooks.addOnce(o);T.postDrawHooks.addOnce(M);T.eventListenerHooks.addOnce("jqplotMouseMove",d);T.eventListenerHooks.addOnce("jqplotMouseDown",a);T.eventListenerHooks.addOnce("jqplotMouseUp",L);T.eventListenerHooks.addOnce("jqplotClick",c);T.eventListenerHooks.addOnce("jqplotRightClick",j)}};w.jqplot.LineRenderer.prototype.setGridData=function(T){var P=this._xaxis.series_u2p;var S=this._yaxis.series_u2p;var Q=this._plotData;var R=this._prevPlotData;this.gridData=[];this._prevGridData=[];for(var O=0;O<this.data.length;O++){if(Q[O][0]!=null&&Q[O][1]!=null){this.gridData.push([P.call(this._xaxis,Q[O][0]),S.call(this._yaxis,Q[O][1])])}else{if(Q[O][0]==null){this.gridData.push([null,S.call(this._yaxis,Q[O][1])])}else{if(Q[O][1]==null){this.gridData.push([P.call(this._xaxis,Q[O][0]),null])}}}if(R[O]!=null&&R[O][0]!=null&&R[O][1]!=null){this._prevGridData.push([P.call(this._xaxis,R[O][0]),S.call(this._yaxis,R[O][1])])}else{if(R[O]!=null&&R[O][0]==null){this._prevGridData.push([null,S.call(this._yaxis,R[O][1])])}else{if(R[O]!=null&&R[O][0]!=null&&R[O][1]==null){this._prevGridData.push([P.call(this._xaxis,R[O][0]),null])}}}}};w.jqplot.LineRenderer.prototype.makeGridData=function(R,T){var Q=this._xaxis.series_u2p;var S=this._yaxis.series_u2p;var P=[];var U=[];for(var O=0;O<R.length;O++){if(R[O][0]!=null&&R[O][1]!=null){P.push([Q.call(this._xaxis,R[O][0]),S.call(this._yaxis,R[O][1])])}else{if(R[O][0]==null){P.push([null,S.call(this._yaxis,R[O][1])])}else{if(R[O][1]==null){P.push([Q.call(this._xaxis,R[O][0]),null])}}}}return P};w.jqplot.LineRenderer.prototype.draw=function(ad,an,P){var ah;var X=(P!=l)?P:{};var R=(X.shadow!=l)?X.shadow:this.shadow;var ao=(X.showLine!=l)?X.showLine:this.showLine;var ag=(X.fill!=l)?X.fill:this.fill;var O=(X.fillAndStroke!=l)?X.fillAndStroke:this.fillAndStroke;var Y,ae,ab,aj;ad.save();if(an.length){if(ao){if(ag){if(this.fillToZero){var S=new w.jqplot.ColorGenerator(this.negativeSeriesColors);var ak=S.get(this.index);if(!this.useNegativeColors){ak=X.fillStyle}var V=false;var W=X.fillStyle;if(O){var am=an.slice(0)}if(this.index==0||!this._stack){var ac=[];this._areaPoints=[];var al=this._yaxis.series_u2p(this.fillToValue);var Q=this._xaxis.series_u2p(this.fillToValue);if(this.fillAxis=="y"){ac.push([an[0][0],al]);this._areaPoints.push([an[0][0],al]);for(var ah=0;ah<an.length-1;ah++){ac.push(an[ah]);this._areaPoints.push(an[ah]);if(this._plotData[ah][1]*this._plotData[ah+1][1]<0){if(this._plotData[ah][1]<0){V=true;X.fillStyle=ak}else{V=false;X.fillStyle=W}var U=an[ah][0]+(an[ah+1][0]-an[ah][0])*(al-an[ah][1])/(an[ah+1][1]-an[ah][1]);ac.push([U,al]);this._areaPoints.push([U,al]);if(R){this.renderer.shadowRenderer.draw(ad,ac,X)}this.renderer.shapeRenderer.draw(ad,ac,X);ac=[[U,al]]}}if(this._plotData[an.length-1][1]<0){V=true;X.fillStyle=ak}else{V=false;X.fillStyle=W}ac.push(an[an.length-1]);this._areaPoints.push(an[an.length-1]);ac.push([an[an.length-1][0],al]);this._areaPoints.push([an[an.length-1][0],al])}if(R){this.renderer.shadowRenderer.draw(ad,ac,X)}this.renderer.shapeRenderer.draw(ad,ac,X)}else{var aa=this._prevGridData;for(var ah=aa.length;ah>0;ah--){an.push(aa[ah-1])}if(R){this.renderer.shadowRenderer.draw(ad,an,X)}this._areaPoints=an;this.renderer.shapeRenderer.draw(ad,an,X)}}else{if(O){var am=an.slice(0)}if(this.index==0||!this._stack){var T=ad.canvas.height;an.unshift([an[0][0],T]);var ai=an.length;an.push([an[ai-1][0],T])}else{var aa=this._prevGridData;for(var ah=aa.length;ah>0;ah--){an.push(aa[ah-1])}}this._areaPoints=an;if(R){this.renderer.shadowRenderer.draw(ad,an,X)}this.renderer.shapeRenderer.draw(ad,an,X)}if(O){var af=w.extend(true,{},X,{fill:false,closePath:false});this.renderer.shapeRenderer.draw(ad,am,af);if(this.markerRenderer.show){for(ah=0;ah<am.length;ah++){this.markerRenderer.draw(am[ah][0],am[ah][1],ad,X.markerOptions)}}}}else{if(R){this.renderer.shadowRenderer.draw(ad,an,X)}this.renderer.shapeRenderer.draw(ad,an,X)}}var Y=ab=ae=aj=null;for(ah=0;ah<this._areaPoints.length;ah++){var Z=this._areaPoints[ah];if(Y>Z[0]||Y==null){Y=Z[0]}if(aj<Z[1]||aj==null){aj=Z[1]}if(ab<Z[0]||ab==null){ab=Z[0]}if(ae>Z[1]||ae==null){ae=Z[1]}}this._boundingBox=[[Y,aj],[ab,ae]];if(this.markerRenderer.show&&!ag){for(ah=0;ah<an.length;ah++){if(an[ah][0]!=null&&an[ah][1]!=null){this.markerRenderer.draw(an[ah][0],an[ah][1],ad,X.markerOptions)}}}}ad.restore()};w.jqplot.LineRenderer.prototype.drawShadow=function(O,Q,P){};function o(R,Q,O){for(var P=0;P<this.series.length;P++){if(this.series[P].renderer.constructor==w.jqplot.LineRenderer){if(this.series[P].highlightMouseOver){this.series[P].highlightMouseDown=false}}}this.target.bind("mouseout",{plot:this},function(S){I(S.data.plot)})}function M(){if(this.plugins.lineRenderer&&this.plugins.lineRenderer.highlightCanvas){this.plugins.lineRenderer.highlightCanvas.resetCanvas();this.plugins.lineRenderer.highlightCanvas=null}this.plugins.lineRenderer.highlightedSeriesIndex=null;this.plugins.lineRenderer.highlightCanvas=new w.jqplot.GenericCanvas();this.eventCanvas._elem.before(this.plugins.lineRenderer.highlightCanvas.createElement(this._gridPadding,"jqplot-lineRenderer-highlight-canvas",this._plotDimensions,this));this.plugins.lineRenderer.highlightCanvas.setContext()}function K(U,T,R,Q){var P=U.series[T];var O=U.plugins.lineRenderer.highlightCanvas;O._ctx.clearRect(0,0,O._ctx.canvas.width,O._ctx.canvas.height);P._highlightedPoint=R;U.plugins.lineRenderer.highlightedSeriesIndex=T;var S={fillStyle:P.highlightColor};P.renderer.shapeRenderer.draw(O._ctx,Q,S);O=null}function I(Q){var O=Q.plugins.lineRenderer.highlightCanvas;O._ctx.clearRect(0,0,O._ctx.canvas.width,O._ctx.canvas.height);for(var P=0;P<Q.series.length;P++){Q.series[P]._highlightedPoint=null}Q.plugins.lineRenderer.highlightedSeriesIndex=null;Q.target.trigger("jqplotDataUnhighlight");O=null}function d(S,R,V,U,T){if(U){var Q=[U.seriesIndex,U.pointIndex,U.data];var P=jQuery.Event("jqplotDataMouseOver");P.pageX=S.pageX;P.pageY=S.pageY;T.target.trigger(P,Q);if(T.series[Q[0]].highlightMouseOver&&!(Q[0]==T.plugins.lineRenderer.highlightedSeriesIndex)){var O=jQuery.Event("jqplotDataHighlight");O.pageX=S.pageX;O.pageY=S.pageY;T.target.trigger(O,Q);K(T,U.seriesIndex,U.pointIndex,U.points)}}else{if(U==null){I(T)}}}function a(R,Q,U,T,S){if(T){var P=[T.seriesIndex,T.pointIndex,T.data];if(S.series[P[0]].highlightMouseDown&&!(P[0]==S.plugins.lineRenderer.highlightedSeriesIndex)){var O=jQuery.Event("jqplotDataHighlight");O.pageX=R.pageX;O.pageY=R.pageY;S.target.trigger(O,P);K(S,T.seriesIndex,T.pointIndex,T.points)}}else{if(T==null){I(S)}}}function L(Q,P,T,S,R){var O=R.plugins.lineRenderer.highlightedSeriesIndex;if(O!=null&&R.series[O].highlightMouseDown){I(R)}}function c(R,Q,U,T,S){if(T){var P=[T.seriesIndex,T.pointIndex,T.data];var O=jQuery.Event("jqplotDataClick");O.pageX=R.pageX;O.pageY=R.pageY;S.target.trigger(O,P)}}function j(S,R,V,U,T){if(U){var Q=[U.seriesIndex,U.pointIndex,U.data];var O=T.plugins.lineRenderer.highlightedSeriesIndex;if(O!=null&&T.series[O].highlightMouseDown){I(T)}var P=jQuery.Event("jqplotDataRightClick");P.pageX=S.pageX;P.pageY=S.pageY;T.target.trigger(P,Q)}}w.jqplot.LinearAxisRenderer=function(){};w.jqplot.LinearAxisRenderer.prototype.init=function(O){this.breakPoints=null;this.breakTickLabel="&asymp;";this.forceTickAt0=false;this.forceTickAt100=false;this._autoFormatString="";this._overrideFormatString=false;w.extend(true,this,O);if(this.breakPoints){if(!w.isArray(this.breakPoints)){this.breakPoints=null}else{if(this.breakPoints.length<2||this.breakPoints[1]<=this.breakPoints[0]){this.breakPoints=null}}}this.resetDataBounds()};w.jqplot.LinearAxisRenderer.prototype.draw=function(O,V){if(this.show){this.renderer.createTicks.call(this);var U=0;var P;if(this._elem){this._elem.emptyForce();this._elem=null}this._elem=w(document.createElement("div"));this._elem.addClass("jqplot-axis jqplot-"+this.name);this._elem.css("posiiton","absolute");if(this.name=="xaxis"||this.name=="x2axis"){this._elem.width(this._plotDimensions.width)}else{this._elem.height(this._plotDimensions.height)}this.labelOptions.axis=this.name;this._label=new this.labelRenderer(this.labelOptions);if(this._label.show){var T=this._label.draw(O,V);T.appendTo(this._elem);T=null}var S=this._ticks;var R;for(var Q=0;Q<S.length;Q++){R=S[Q];if(R.show&&R.showLabel&&(!R.isMinorTick||this.showMinorTicks)){this._elem.append(R.draw(O,V))}}R=null;S=null}return this._elem};w.jqplot.LinearAxisRenderer.prototype.reset=function(){this.min=this._min;this.max=this._max;this.tickInterval=this._tickInterval;this.numberTicks=this._numberTicks;this._autoFormatString="";if(this._overrideFormatString&&this.tickOptions&&this.tickOptions.formatString){this.tickOptions.formatString=""}};w.jqplot.LinearAxisRenderer.prototype.set=function(){var V=0;var Q;var P=0;var U=0;var O=(this._label==null)?false:this._label.show;if(this.show){var T=this._ticks;var S;for(var R=0;R<T.length;R++){S=T[R];if(!S._breakTick&&S.show&&S.showLabel&&(!S.isMinorTick||this.showMinorTicks)){if(this.name=="xaxis"||this.name=="x2axis"){Q=S._elem.outerHeight(true)}else{Q=S._elem.outerWidth(true)}if(Q>V){V=Q}}}S=null;T=null;if(O){P=this._label._elem.outerWidth(true);U=this._label._elem.outerHeight(true)}if(this.name=="xaxis"){V=V+U;this._elem.css({height:V+"px",left:"0px",bottom:"0px"})}else{if(this.name=="x2axis"){V=V+U;this._elem.css({height:V+"px",left:"0px",top:"0px"})}else{if(this.name=="yaxis"){V=V+P;this._elem.css({width:V+"px",left:"0px",top:"0px"});if(O&&this._label.constructor==w.jqplot.AxisLabelRenderer){this._label._elem.css("width",P+"px")}}else{V=V+P;this._elem.css({width:V+"px",right:"0px",top:"0px"});if(O&&this._label.constructor==w.jqplot.AxisLabelRenderer){this._label._elem.css("width",P+"px")}}}}}};w.jqplot.LinearAxisRenderer.prototype.createTicks=function(){var ax=this._ticks;var an=this.ticks;var ae=this.name;var ag=this._dataBounds;var O,T;var aJ,al;var V,U;var aH,aE;var ak=this.min;var aI=this.max;var aA=this.numberTicks;var aM=this.tickInterval;if(an.length){for(aE=0;aE<an.length;aE++){var aq=an[aE];var ay=new this.tickRenderer(this.tickOptions);if(aq.constructor==Array){ay.value=aq[0];if(this.breakPoints){if(aq[0]==this.breakPoints[0]){ay.label=this.breakTickLabel;ay._breakTick=true;ay.showGridline=false;ay.showMark=false}else{if(aq[0]>this.breakPoints[0]&&aq[0]<=this.breakPoints[1]){ay.show=false;ay.showGridline=false;ay.label=aq[1]}else{ay.label=aq[1]}}}else{ay.label=aq[1]}ay.setTick(aq[0],this.name);this._ticks.push(ay)}else{ay.value=aq;if(this.breakPoints){if(aq==this.breakPoints[0]){ay.label=this.breakTickLabel;ay._breakTick=true;ay.showGridline=false;ay.showMark=false}else{if(aq>this.breakPoints[0]&&aq<=this.breakPoints[1]){ay.show=false;ay.showGridline=false}}}ay.setTick(aq,this.name);this._ticks.push(ay)}}this.numberTicks=an.length;this.min=this._ticks[0].value;this.max=this._ticks[this.numberTicks-1].value;this.tickInterval=(this.max-this.min)/(this.numberTicks-1)}else{if(ae=="xaxis"||ae=="x2axis"){O=this._plotDimensions.width}else{O=this._plotDimensions.height}aJ=((this.min!=null)?this.min:ag.min);al=((this.max!=null)?this.max:ag.max);var aa=al-aJ;var aw,ad;var Y;if(this.min==null&&this.max==null&&this.numberTicks==null&&this.tickInterval==null&&!this.autoscale){if(this.tickOptions==null||!this.tickOptions.formatString){this._overrideFormatString=true}if(this.forceTickAt0){if(aJ>0){aJ=0}if(al<0){al=0}}if(this.forceTickAt100){if(aJ>100){aJ=100}if(al<100){al=100}}var S=30;var at=Math.max(O,S+1);var ab=(at-S)/300;var ar=w.jqplot.LinearTickGenerator(aJ,al,ab);var ac=aJ+aa*(this.padMin-1);var au=al-aa*(this.padMax-1);if(aJ<=ac||al>=au){ac=aJ-aa*(this.padMin-1);au=al+aa*(this.padMax-1);ar=w.jqplot.LinearTickGenerator(ac,au,ab)}this.min=ar[0];this.max=ar[1];this.numberTicks=ar[2];this._autoFormatString=ar[3];this.tickInterval=ar[4]}else{if(aJ==al){var P=0.05;if(aJ>0){P=Math.max(Math.log(aJ)/Math.LN10,0.05)}aJ-=P;al+=P}if(this.autoscale&&this.min==null&&this.max==null){var Q,R,X;var ah=false;var ap=false;var af={min:null,max:null,average:null,stddev:null};for(var aE=0;aE<this._series.length;aE++){var az=this._series[aE];var ai=(az.fillAxis=="x")?az._xaxis.name:az._yaxis.name;if(this.name==ai){var av=az._plotValues[az.fillAxis];var aj=av[0];var aF=av[0];for(var aD=1;aD<av.length;aD++){if(av[aD]<aj){aj=av[aD]}else{if(av[aD]>aF){aF=av[aD]}}}var Z=(aF-aj)/aF;if(az.renderer.constructor==w.jqplot.BarRenderer){if(aj>=0&&(az.fillToZero||Z>0.1)){ah=true}else{ah=false;if(az.fill&&az.fillToZero&&aj<0&&aF>0){ap=true}else{ap=false}}}else{if(az.fill){if(aj>=0&&(az.fillToZero||Z>0.1)){ah=true}else{if(aj<0&&aF>0&&az.fillToZero){ah=false;ap=true}else{ah=false;ap=false}}}else{if(aj<0){ah=false}}}}}if(ah){this.numberTicks=2+Math.ceil((O-(this.tickSpacing-1))/this.tickSpacing);this.min=0;ak=0;R=al/(this.numberTicks-1);Y=Math.pow(10,Math.abs(Math.floor(Math.log(R)/Math.LN10)));if(R/Y==parseInt(R/Y,10)){R+=Y}this.tickInterval=Math.ceil(R/Y)*Y;this.max=this.tickInterval*(this.numberTicks-1)}else{if(ap){this.numberTicks=2+Math.ceil((O-(this.tickSpacing-1))/this.tickSpacing);var am=Math.ceil(Math.abs(aJ)/aa*(this.numberTicks-1));var aL=this.numberTicks-1-am;R=Math.max(Math.abs(aJ/am),Math.abs(al/aL));Y=Math.pow(10,Math.abs(Math.floor(Math.log(R)/Math.LN10)));this.tickInterval=Math.ceil(R/Y)*Y;this.max=this.tickInterval*aL;this.min=-this.tickInterval*am}else{if(this.numberTicks==null){if(this.tickInterval){this.numberTicks=3+Math.ceil(aa/this.tickInterval)}else{this.numberTicks=2+Math.ceil((O-(this.tickSpacing-1))/this.tickSpacing)}}if(this.tickInterval==null){R=aa/(this.numberTicks-1);if(R<1){Y=Math.pow(10,Math.abs(Math.floor(Math.log(R)/Math.LN10)))}else{Y=1}this.tickInterval=Math.ceil(R*Y*this.pad)/Y}else{Y=1/this.tickInterval}Q=this.tickInterval*(this.numberTicks-1);X=(Q-aa)/2;if(this.min==null){this.min=Math.floor(Y*(aJ-X))/Y}if(this.max==null){this.max=this.min+Q}}}}else{aw=(this.min!=null)?this.min:aJ-aa*(this.padMin-1);ad=(this.max!=null)?this.max:al+aa*(this.padMax-1);this.min=aw;this.max=ad;aa=this.max-this.min;if(this.numberTicks==null){if(this.tickInterval!=null){this.numberTicks=Math.ceil((this.max-this.min)/this.tickInterval)+1;this.max=this.min+this.tickInterval*(this.numberTicks-1)}else{if(O>100){this.numberTicks=parseInt(3+(O-100)/75,10)}else{this.numberTicks=2}}}if(this.tickInterval==null){this.tickInterval=aa/(this.numberTicks-1)}}if(this.renderer.constructor==w.jqplot.LinearAxisRenderer&&this._autoFormatString==""){aa=this.max-this.min;var aK=new this.tickRenderer(this.tickOptions);var ao=aK.formatString||w.jqplot.config.defaultTickFormatString;var ao=ao.match(w.jqplot.sprintf.regex)[0];var aG=0;if(ao){if(ao.search(/[fFeEgGpP]/)>-1){var aC=ao.match(/\%\.(\d{0,})?[eEfFgGpP]/);if(aC){aG=parseInt(aC[1],10)}else{aG=6}}else{if(ao.search(/[di]/)>-1){aG=0}}var W=Math.pow(10,-aG);if(this.tickInterval<W){if(aA==null&&aM==null){this.tickInterval=W;if(aI==null&&ak==null){this.min=Math.floor(this._dataBounds.min/W)*W;if(this.min==this._dataBounds.min){this.min=this._dataBounds.min-this.tickInterval}this.max=Math.ceil(this._dataBounds.max/W)*W;if(this.max==this._dataBounds.max){this.max=this._dataBounds.max+this.tickInterval}var aB=(this.max-this.min)/this.tickInterval;aB=aB.toFixed(11);aB=Math.ceil(aB);this.numberTicks=aB+1}else{if(aI==null){var aB=(this._dataBounds.max-this.min)/this.tickInterval;aB=aB.toFixed(11);this.numberTicks=Math.ceil(aB)+2;this.max=this.min+this.tickInterval*(this.numberTicks-1)}else{if(ak==null){var aB=(this.max-this._dataBounds.min)/this.tickInterval;aB=aB.toFixed(11);this.numberTicks=Math.ceil(aB)+2;this.min=this.max-this.tickInterval*(this.numberTicks-1)}else{this.numberTicks=Math.ceil((aI-ak)/this.tickInterval)+1;this.min=Math.floor(ak*Math.pow(10,aG))/Math.pow(10,aG);this.max=Math.ceil(aI*Math.pow(10,aG))/Math.pow(10,aG);this.numberTicks=Math.ceil((this.max-this.min)/this.tickInterval)+1}}}}}}}}if(this._overrideFormatString&&this._autoFormatString!=""){this.tickOptions=this.tickOptions||{};this.tickOptions.formatString=this._autoFormatString}for(var aE=0;aE<this.numberTicks;aE++){aH=this.min+aE*this.tickInterval;var ay=new this.tickRenderer(this.tickOptions);ay.setTick(aH,this.name);this._ticks.push(ay);ay=null}}ax=null};w.jqplot.LinearAxisRenderer.prototype.resetTickValues=function(Q){if(w.isArray(Q)&&Q.length==this._ticks.length){var P;for(var O=0;O<Q.length;O++){P=this._ticks[O];P.value=Q[O];P.label=P.formatter(P.formatString,Q[O]);P.label=P.prefix+P.label;P._elem.html(P.label)}P=null;this.min=w.jqplot.arrayMin(Q);this.max=w.jqplot.arrayMax(Q);this.pack()}};w.jqplot.LinearAxisRenderer.prototype.pack=function(Q,P){Q=Q||{};P=P||this._offsets;var ae=this._ticks;var aa=this.max;var Z=this.min;var V=P.max;var T=P.min;var X=(this._label==null)?false:this._label.show;for(var Y in Q){this._elem.css(Y,Q[Y])}this._offsets=P;var R=V-T;var S=aa-Z;if(this.breakPoints){S=S-this.breakPoints[1]+this.breakPoints[0];this.p2u=function(ag){return(ag-T)*S/R+Z};this.u2p=function(ag){if(ag>this.breakPoints[0]&&ag<this.breakPoints[1]){ag=this.breakPoints[0]}if(ag<=this.breakPoints[0]){return(ag-Z)*R/S+T}else{return(ag-this.breakPoints[1]+this.breakPoints[0]-Z)*R/S+T}};if(this.name.charAt(0)=="x"){this.series_u2p=function(ag){if(ag>this.breakPoints[0]&&ag<this.breakPoints[1]){ag=this.breakPoints[0]}if(ag<=this.breakPoints[0]){return(ag-Z)*R/S}else{return(ag-this.breakPoints[1]+this.breakPoints[0]-Z)*R/S}};this.series_p2u=function(ag){return ag*S/R+Z}}else{this.series_u2p=function(ag){if(ag>this.breakPoints[0]&&ag<this.breakPoints[1]){ag=this.breakPoints[0]}if(ag>=this.breakPoints[1]){return(ag-aa)*R/S}else{return(ag+this.breakPoints[1]-this.breakPoints[0]-aa)*R/S}};this.series_p2u=function(ag){return ag*S/R+aa}}}else{this.p2u=function(ag){return(ag-T)*S/R+Z};this.u2p=function(ag){return(ag-Z)*R/S+T};if(this.name=="xaxis"||this.name=="x2axis"){this.series_u2p=function(ag){return(ag-Z)*R/S};this.series_p2u=function(ag){return ag*S/R+Z}}else{this.series_u2p=function(ag){return(ag-aa)*R/S};this.series_p2u=function(ag){return ag*S/R+aa}}}if(this.show){if(this.name=="xaxis"||this.name=="x2axis"){for(var ab=0;ab<ae.length;ab++){var W=ae[ab];if(W.show&&W.showLabel){var O;if(W.constructor==w.jqplot.CanvasAxisTickRenderer&&W.angle){var ad=(this.name=="xaxis")?1:-1;switch(W.labelPosition){case"auto":if(ad*W.angle<0){O=-W.getWidth()+W._textRenderer.height*Math.sin(-W._textRenderer.angle)/2}else{O=-W._textRenderer.height*Math.sin(W._textRenderer.angle)/2}break;case"end":O=-W.getWidth()+W._textRenderer.height*Math.sin(-W._textRenderer.angle)/2;break;case"start":O=-W._textRenderer.height*Math.sin(W._textRenderer.angle)/2;break;case"middle":O=-W.getWidth()/2+W._textRenderer.height*Math.sin(-W._textRenderer.angle)/2;break;default:O=-W.getWidth()/2+W._textRenderer.height*Math.sin(-W._textRenderer.angle)/2;break}}else{O=-W.getWidth()/2}var af=this.u2p(W.value)+O+"px";W._elem.css("left",af);W.pack()}}if(X){var U=this._label._elem.outerWidth(true);this._label._elem.css("left",T+R/2-U/2+"px");if(this.name=="xaxis"){this._label._elem.css("bottom","0px")}else{this._label._elem.css("top","0px")}this._label.pack()}}else{for(var ab=0;ab<ae.length;ab++){var W=ae[ab];if(W.show&&W.showLabel){var O;if(W.constructor==w.jqplot.CanvasAxisTickRenderer&&W.angle){var ad=(this.name=="yaxis")?1:-1;switch(W.labelPosition){case"auto":case"end":if(ad*W.angle<0){O=-W._textRenderer.height*Math.cos(-W._textRenderer.angle)/2}else{O=-W.getHeight()+W._textRenderer.height*Math.cos(W._textRenderer.angle)/2}break;case"start":if(W.angle>0){O=-W._textRenderer.height*Math.cos(-W._textRenderer.angle)/2}else{O=-W.getHeight()+W._textRenderer.height*Math.cos(W._textRenderer.angle)/2}break;case"middle":O=-W.getHeight()/2;break;default:O=-W.getHeight()/2;break}}else{O=-W.getHeight()/2}var af=this.u2p(W.value)+O+"px";W._elem.css("top",af);W.pack()}}if(X){var ac=this._label._elem.outerHeight(true);this._label._elem.css("top",V-R/2-ac/2+"px");if(this.name=="yaxis"){this._label._elem.css("left","0px")}else{this._label._elem.css("right","0px")}this._label.pack()}}}ae=null};function e(O){O=Math.abs(O);if(O>1){return"%d"}var P=-Math.floor(Math.log(O)/Math.LN10);return"%."+P+"f"}function B(P,O){var Q=Math.floor(Math.log(P)/Math.LN10);var S=Math.pow(10,Q);var R=P/S;R=R/O;if(R<=0.38){return 0.1*S}if(R<=1.6){return 0.2*S}if(R<=4){return 0.5*S}if(R<=8){return S}if(R<=16){return 2*S}return 5*S}w.jqplot.LinearTickGenerator=function(Q,T,P){if(Q==T){T=(T)?0:1}P=P||1;if(T<Q){var O=T;T=Q;Q=O}var R=B(T-Q,P);var S=[];S[0]=Math.floor(Q/R)*R;S[1]=Math.ceil(T/R)*R;S[2]=Math.round((S[1]-S[0])/R+1);S[3]=e(R);S[4]=R;return S};w.jqplot.MarkerRenderer=function(O){this.show=true;this.style="filledCircle";this.lineWidth=2;this.size=9;this.color="#666666";this.shadow=true;this.shadowAngle=45;this.shadowOffset=1;this.shadowDepth=3;this.shadowAlpha="0.07";this.shadowRenderer=new w.jqplot.ShadowRenderer();this.shapeRenderer=new w.jqplot.ShapeRenderer();w.extend(true,this,O)};w.jqplot.MarkerRenderer.prototype.init=function(O){w.extend(true,this,O);var Q={angle:this.shadowAngle,offset:this.shadowOffset,alpha:this.shadowAlpha,lineWidth:this.lineWidth,depth:this.shadowDepth,closePath:true};if(this.style.indexOf("filled")!=-1){Q.fill=true}if(this.style.indexOf("ircle")!=-1){Q.isarc=true;Q.closePath=false}this.shadowRenderer.init(Q);var P={fill:false,isarc:false,strokeStyle:this.color,fillStyle:this.color,lineWidth:this.lineWidth,closePath:true};if(this.style.indexOf("filled")!=-1){P.fill=true}if(this.style.indexOf("ircle")!=-1){P.isarc=true;P.closePath=false}this.shapeRenderer.init(P)};w.jqplot.MarkerRenderer.prototype.drawDiamond=function(Q,P,T,S,V){var O=1.2;var W=this.size/2/O;var U=this.size/2*O;var R=[[Q-W,P],[Q,P+U],[Q+W,P],[Q,P-U]];if(this.shadow){this.shadowRenderer.draw(T,R)}this.shapeRenderer.draw(T,R,V)};w.jqplot.MarkerRenderer.prototype.drawPlus=function(R,Q,U,T,X){var P=1;var Y=this.size/2*P;var V=this.size/2*P;var W=[[R,Q-V],[R,Q+V]];var S=[[R+Y,Q],[R-Y,Q]];var O=w.extend(true,{},this.options,{closePath:false});if(this.shadow){this.shadowRenderer.draw(U,W,{closePath:false});this.shadowRenderer.draw(U,S,{closePath:false})}this.shapeRenderer.draw(U,W,O);this.shapeRenderer.draw(U,S,O)};w.jqplot.MarkerRenderer.prototype.drawX=function(R,Q,U,T,X){var P=1;var Y=this.size/2*P;var V=this.size/2*P;var O=w.extend(true,{},this.options,{closePath:false});var W=[[R-Y,Q-V],[R+Y,Q+V]];var S=[[R-Y,Q+V],[R+Y,Q-V]];if(this.shadow){this.shadowRenderer.draw(U,W,{closePath:false});this.shadowRenderer.draw(U,S,{closePath:false})}this.shapeRenderer.draw(U,W,O);this.shapeRenderer.draw(U,S,O)};w.jqplot.MarkerRenderer.prototype.drawDash=function(Q,P,T,S,V){var O=1;var W=this.size/2*O;var U=this.size/2*O;var R=[[Q-W,P],[Q+W,P]];if(this.shadow){this.shadowRenderer.draw(T,R)}this.shapeRenderer.draw(T,R,V)};w.jqplot.MarkerRenderer.prototype.drawLine=function(T,S,O,R,P){var Q=[T,S];if(this.shadow){this.shadowRenderer.draw(O,Q)}this.shapeRenderer.draw(O,Q,P)};w.jqplot.MarkerRenderer.prototype.drawSquare=function(Q,P,T,S,V){var O=1;var W=this.size/2/O;var U=this.size/2*O;var R=[[Q-W,P-U],[Q-W,P+U],[Q+W,P+U],[Q+W,P-U]];if(this.shadow){this.shadowRenderer.draw(T,R)}this.shapeRenderer.draw(T,R,V)};w.jqplot.MarkerRenderer.prototype.drawCircle=function(P,V,R,U,S){var O=this.size/2;var Q=2*Math.PI;var T=[P,V,O,0,Q,true];if(this.shadow){this.shadowRenderer.draw(R,T)}this.shapeRenderer.draw(R,T,S)};w.jqplot.MarkerRenderer.prototype.draw=function(O,R,P,Q){Q=Q||{};if(Q.show==null||Q.show!=false){if(Q.color&&!Q.fillStyle){Q.fillStyle=Q.color}if(Q.color&&!Q.strokeStyle){Q.strokeStyle=Q.color}switch(this.style){case"diamond":this.drawDiamond(O,R,P,false,Q);break;case"filledDiamond":this.drawDiamond(O,R,P,true,Q);break;case"circle":this.drawCircle(O,R,P,false,Q);break;case"filledCircle":this.drawCircle(O,R,P,true,Q);break;case"square":this.drawSquare(O,R,P,false,Q);break;case"filledSquare":this.drawSquare(O,R,P,true,Q);break;case"x":this.drawX(O,R,P,true,Q);break;case"plus":this.drawPlus(O,R,P,true,Q);break;case"dash":this.drawDash(O,R,P,true,Q);break;case"line":this.drawLine(O,R,P,false,Q);break;default:this.drawDiamond(O,R,P,false,Q);break}}};w.jqplot.ShadowRenderer=function(O){this.angle=45;this.offset=1;this.alpha=0.07;this.lineWidth=1.5;this.lineJoin="miter";this.lineCap="round";this.closePath=false;this.fill=false;this.depth=3;this.strokeStyle="rgba(0,0,0,0.1)";this.isarc=false;w.extend(true,this,O)};w.jqplot.ShadowRenderer.prototype.init=function(O){w.extend(true,this,O)};w.jqplot.ShadowRenderer.prototype.draw=function(Y,W,aa){Y.save();var O=(aa!=null)?aa:{};var X=(O.fill!=null)?O.fill:this.fill;var V=(O.closePath!=null)?O.closePath:this.closePath;var S=(O.offset!=null)?O.offset:this.offset;var Q=(O.alpha!=null)?O.alpha:this.alpha;var U=(O.depth!=null)?O.depth:this.depth;var Z=(O.isarc!=null)?O.isarc:this.isarc;Y.lineWidth=(O.lineWidth!=null)?O.lineWidth:this.lineWidth;Y.lineJoin=(O.lineJoin!=null)?O.lineJoin:this.lineJoin;Y.lineCap=(O.lineCap!=null)?O.lineCap:this.lineCap;Y.strokeStyle=O.strokeStyle||this.strokeStyle||"rgba(0,0,0,"+Q+")";Y.fillStyle=O.fillStyle||this.fillStyle||"rgba(0,0,0,"+Q+")";for(var R=0;R<U;R++){Y.translate(Math.cos(this.angle*Math.PI/180)*S,Math.sin(this.angle*Math.PI/180)*S);Y.beginPath();if(Z){Y.arc(W[0],W[1],W[2],W[3],W[4],true)}else{if(W&&W.length){var P=true;for(var T=0;T<W.length;T++){if(W[T][0]!=null&&W[T][1]!=null){if(P){Y.moveTo(W[T][0],W[T][1]);P=false}else{Y.lineTo(W[T][0],W[T][1])}}else{P=true}}}}if(V){Y.closePath()}if(X){Y.fill()}else{Y.stroke()}}Y.restore()};w.jqplot.ShapeRenderer=function(O){this.lineWidth=1.5;this.lineJoin="miter";this.lineCap="round";this.closePath=false;this.fill=false;this.isarc=false;this.fillRect=false;this.strokeRect=false;this.clearRect=false;this.strokeStyle="#999999";this.fillStyle="#999999";w.extend(true,this,O)};w.jqplot.ShapeRenderer.prototype.init=function(O){w.extend(true,this,O)};w.jqplot.ShapeRenderer.prototype.draw=function(X,V,Z){X.save();var O=(Z!=null)?Z:{};var W=(O.fill!=null)?O.fill:this.fill;var T=(O.closePath!=null)?O.closePath:this.closePath;var U=(O.fillRect!=null)?O.fillRect:this.fillRect;var R=(O.strokeRect!=null)?O.strokeRect:this.strokeRect;var P=(O.clearRect!=null)?O.clearRect:this.clearRect;var Y=(O.isarc!=null)?O.isarc:this.isarc;X.lineWidth=O.lineWidth||this.lineWidth;X.lineJoin=O.lineJoin||this.lineJoin;X.lineCap=O.lineCap||this.lineCap;X.strokeStyle=(O.strokeStyle||O.color)||this.strokeStyle;X.fillStyle=O.fillStyle||this.fillStyle;X.beginPath();if(Y){X.arc(V[0],V[1],V[2],V[3],V[4],true);if(T){X.closePath()}if(W){X.fill()}else{X.stroke()}X.restore();return}else{if(P){X.clearRect(V[0],V[1],V[2],V[3]);X.restore();return}else{if(U||R){if(U){X.fillRect(V[0],V[1],V[2],V[3])}if(R){X.strokeRect(V[0],V[1],V[2],V[3]);X.restore();return}}else{if(V&&V.length){var Q=true;for(var S=0;S<V.length;S++){if(V[S][0]!=null&&V[S][1]!=null){if(Q){X.moveTo(V[S][0],V[S][1]);Q=false}else{X.lineTo(V[S][0],V[S][1])}}else{Q=true}}if(T){X.closePath()}if(W){X.fill()}else{X.stroke()}}}}}X.restore()};w.jqplot.TableLegendRenderer=function(){};w.jqplot.TableLegendRenderer.prototype.init=function(O){w.extend(true,this,O)};w.jqplot.TableLegendRenderer.prototype.addrow=function(X,R,O,V){var S=(O)?this.rowSpacing+"px":"0px";var W;var Q;var P;var U;var T;P=document.createElement("tr");W=w(P);W.addClass("jqplot-table-legend");P=null;if(V){W.prependTo(this._elem)}else{W.appendTo(this._elem)}if(this.showSwatches){Q=w(document.createElement("td"));Q.addClass("jqplot-table-legend");Q.css({textAlign:"center",paddingTop:S});U=w(document.createElement("div"));T=w(document.createElement("div"));T.addClass("jqplot-table-legend-swatch");T.css({backgroundColor:R,borderColor:R});W.append(Q.append(U.append(T)))}if(this.showLabels){Q=w(document.createElement("td"));Q.addClass("jqplot-table-legend");Q.css("paddingTop",S);W.append(Q);if(this.escapeHtml){Q.text(X)}else{Q.html(X)}}Q=null;U=null;T=null;W=null;P=null};w.jqplot.TableLegendRenderer.prototype.draw=function(){if(this._elem){this._elem.emptyForce();this._elem=null}if(this.show){var T=this._series;var P=document.createElement("table");this._elem=w(P);this._elem.addClass("jqplot-table-legend");var Y={position:"absolute"};if(this.background){Y.background=this.background}if(this.border){Y.border=this.border}if(this.fontSize){Y.fontSize=this.fontSize}if(this.fontFamily){Y.fontFamily=this.fontFamily}if(this.textColor){Y.textColor=this.textColor}if(this.marginTop!=null){Y.marginTop=this.marginTop}if(this.marginBottom!=null){Y.marginBottom=this.marginBottom}if(this.marginLeft!=null){Y.marginLeft=this.marginLeft}if(this.marginRight!=null){Y.marginRight=this.marginRight}var O=false,V=false,X;for(var U=0;U<T.length;U++){X=T[U];if(X._stack||X.renderer.constructor==w.jqplot.BezierCurveRenderer){V=true}if(X.show&&X.showLabel){var S=this.labels[U]||X.label.toString();if(S){var Q=X.color;if(V&&U<T.length-1){O=true}else{if(V&&U==T.length-1){O=false}}this.renderer.addrow.call(this,S,Q,O,V);O=true}for(var R=0;R<w.jqplot.addLegendRowHooks.length;R++){var W=w.jqplot.addLegendRowHooks[R].call(this,X);if(W){this.renderer.addrow.call(this,W.label,W.color,O);O=true}}S=null}}}return this._elem};w.jqplot.TableLegendRenderer.prototype.pack=function(Q){if(this.show){if(this.placement=="insideGrid"){switch(this.location){case"nw":var P=Q.left;var O=Q.top;this._elem.css("left",P);this._elem.css("top",O);break;case"n":var P=(Q.left+(this._plotDimensions.width-Q.right))/2-this.getWidth()/2;var O=Q.top;this._elem.css("left",P);this._elem.css("top",O);break;case"ne":var P=Q.right;var O=Q.top;this._elem.css({right:P,top:O});break;case"e":var P=Q.right;var O=(Q.top+(this._plotDimensions.height-Q.bottom))/2-this.getHeight()/2;this._elem.css({right:P,top:O});break;case"se":var P=Q.right;var O=Q.bottom;this._elem.css({right:P,bottom:O});break;case"s":var P=(Q.left+(this._plotDimensions.width-Q.right))/2-this.getWidth()/2;var O=Q.bottom;this._elem.css({left:P,bottom:O});break;case"sw":var P=Q.left;var O=Q.bottom;this._elem.css({left:P,bottom:O});break;case"w":var P=Q.left;var O=(Q.top+(this._plotDimensions.height-Q.bottom))/2-this.getHeight()/2;this._elem.css({left:P,top:O});break;default:var P=Q.right;var O=Q.bottom;this._elem.css({right:P,bottom:O});break}}else{if(this.placement=="outside"){switch(this.location){case"nw":var P=this._plotDimensions.width-Q.left;var O=Q.top;this._elem.css("right",P);this._elem.css("top",O);break;case"n":var P=(Q.left+(this._plotDimensions.width-Q.right))/2-this.getWidth()/2;var O=this._plotDimensions.height-Q.top;this._elem.css("left",P);this._elem.css("bottom",O);break;case"ne":var P=this._plotDimensions.width-Q.right;var O=Q.top;this._elem.css({left:P,top:O});break;case"e":var P=this._plotDimensions.width-Q.right;var O=(Q.top+(this._plotDimensions.height-Q.bottom))/2-this.getHeight()/2;this._elem.css({left:P,top:O});break;case"se":var P=this._plotDimensions.width-Q.right;var O=Q.bottom;this._elem.css({left:P,bottom:O});break;case"s":var P=(Q.left+(this._plotDimensions.width-Q.right))/2-this.getWidth()/2;var O=this._plotDimensions.height-Q.bottom;this._elem.css({left:P,top:O});break;case"sw":var P=this._plotDimensions.width-Q.left;var O=Q.bottom;this._elem.css({right:P,bottom:O});break;case"w":var P=this._plotDimensions.width-Q.left;var O=(Q.top+(this._plotDimensions.height-Q.bottom))/2-this.getHeight()/2;this._elem.css({right:P,top:O});break;default:var P=Q.right;var O=Q.bottom;this._elem.css({right:P,bottom:O});break}}else{switch(this.location){case"nw":this._elem.css({left:0,top:Q.top});break;case"n":var P=(Q.left+(this._plotDimensions.width-Q.right))/2-this.getWidth()/2;this._elem.css({left:P,top:Q.top});break;case"ne":this._elem.css({right:0,top:Q.top});break;case"e":var O=(Q.top+(this._plotDimensions.height-Q.bottom))/2-this.getHeight()/2;this._elem.css({right:Q.right,top:O});break;case"se":this._elem.css({right:Q.right,bottom:Q.bottom});break;case"s":var P=(Q.left+(this._plotDimensions.width-Q.right))/2-this.getWidth()/2;this._elem.css({left:P,bottom:Q.bottom});break;case"sw":this._elem.css({left:Q.left,bottom:Q.bottom});break;case"w":var O=(Q.top+(this._plotDimensions.height-Q.bottom))/2-this.getHeight()/2;this._elem.css({left:Q.left,top:O});break;default:this._elem.css({right:Q.right,bottom:Q.bottom});break}}}}};w.jqplot.ThemeEngine=function(){this.themes={};this.activeTheme=null};w.jqplot.ThemeEngine.prototype.init=function(){var R=new w.jqplot.Theme({_name:"Default"});var U,P,T;for(U in R.target){if(U=="textColor"){R.target[U]=this.target.css("color")}else{R.target[U]=this.target.css(U)}}if(this.title.show&&this.title._elem){for(U in R.title){if(U=="textColor"){R.title[U]=this.title._elem.css("color")}else{R.title[U]=this.title._elem.css(U)}}}for(U in R.grid){R.grid[U]=this.grid[U]}if(R.grid.backgroundColor==null&&this.grid.background!=null){R.grid.backgroundColor=this.grid.background}if(this.legend.show&&this.legend._elem){for(U in R.legend){if(U=="textColor"){R.legend[U]=this.legend._elem.css("color")}else{R.legend[U]=this.legend._elem.css(U)}}}var Q;for(P=0;P<this.series.length;P++){Q=this.series[P];if(Q.renderer.constructor==w.jqplot.LineRenderer){R.series.push(new i())}else{if(Q.renderer.constructor==w.jqplot.BarRenderer){R.series.push(new E())}else{if(Q.renderer.constructor==w.jqplot.PieRenderer){R.series.push(new b())}else{if(Q.renderer.constructor==w.jqplot.DonutRenderer){R.series.push(new t())}else{if(Q.renderer.constructor==w.jqplot.FunnelRenderer){R.series.push(new H())}else{if(Q.renderer.constructor==w.jqplot.MeterGaugeRenderer){R.series.push(new r())}else{R.series.push({})}}}}}}for(U in R.series[P]){R.series[P][U]=Q[U]}}var O,S;for(U in this.axes){S=this.axes[U];O=R.axes[U]=new A();O.borderColor=S.borderColor;O.borderWidth=S.borderWidth;if(S._ticks&&S._ticks[0]){for(T in O.ticks){if(S._ticks[0].hasOwnProperty(T)){O.ticks[T]=S._ticks[0][T]}else{if(S._ticks[0]._elem){O.ticks[T]=S._ticks[0]._elem.css(T)}}}}if(S._label&&S._label.show){for(T in O.label){if(S._label[T]){O.label[T]=S._label[T]}else{if(S._label._elem){if(T=="textColor"){O.label[T]=S._label._elem.css("color")}else{O.label[T]=S._label._elem.css(T)}}}}}}this.themeEngine._add(R);this.themeEngine.activeTheme=this.themeEngine.themes[R._name]};w.jqplot.ThemeEngine.prototype.get=function(O){if(!O){return this.activeTheme}else{return this.themes[O]}};function z(P,O){return P-O}w.jqplot.ThemeEngine.prototype.getThemeNames=function(){var O=[];for(var P in this.themes){O.push(P)}return O.sort(z)};w.jqplot.ThemeEngine.prototype.getThemes=function(){var P=[];var O=[];for(var R in this.themes){P.push(R)}P.sort(z);for(var Q=0;Q<P.length;Q++){O.push(this.themes[P[Q]])}return O};w.jqplot.ThemeEngine.prototype.activate=function(ab,ag){var O=false;if(!ag&&this.activeTheme&&this.activeTheme._name){ag=this.activeTheme._name}if(!this.themes.hasOwnProperty(ag)){throw new Error("No theme of that name")}else{var T=this.themes[ag];this.activeTheme=T;var af,Z=false,Y=false;var P=["xaxis","x2axis","yaxis","y2axis"];for(ac=0;ac<P.length;ac++){var U=P[ac];if(T.axesStyles.borderColor!=null){ab.axes[U].borderColor=T.axesStyles.borderColor}if(T.axesStyles.borderWidth!=null){ab.axes[U].borderWidth=T.axesStyles.borderWidth}}for(var ae in ab.axes){var R=ab.axes[ae];if(R.show){var X=T.axes[ae]||{};var V=T.axesStyles;var S=w.jqplot.extend(true,{},X,V);af=(T.axesStyles.borderColor!=null)?T.axesStyles.borderColor:S.borderColor;if(S.borderColor!=null){R.borderColor=S.borderColor;O=true}af=(T.axesStyles.borderWidth!=null)?T.axesStyles.borderWidth:S.borderWidth;if(S.borderWidth!=null){R.borderWidth=S.borderWidth;O=true}if(R._ticks&&R._ticks[0]){for(var Q in S.ticks){af=S.ticks[Q];if(af!=null){R.tickOptions[Q]=af;R._ticks=[];O=true}}}if(R._label&&R._label.show){for(var Q in S.label){af=S.label[Q];if(af!=null){R.labelOptions[Q]=af;O=true}}}}}for(var aa in T.grid){if(T.grid[aa]!=null){ab.grid[aa]=T.grid[aa]}}if(!O){ab.grid.draw()}if(ab.legend.show){for(aa in T.legend){if(T.legend[aa]!=null){ab.legend[aa]=T.legend[aa]}}}if(ab.title.show){for(aa in T.title){if(T.title[aa]!=null){ab.title[aa]=T.title[aa]}}}var ac;for(ac=0;ac<T.series.length;ac++){var W={};var ad=false;for(aa in T.series[ac]){af=(T.seriesStyles[aa]!=null)?T.seriesStyles[aa]:T.series[ac][aa];if(af!=null){W[aa]=af;if(aa=="color"){ab.series[ac].renderer.shapeRenderer.fillStyle=af;ab.series[ac].renderer.shapeRenderer.strokeStyle=af;ab.series[ac][aa]=af}else{if(aa=="lineWidth"){ab.series[ac].renderer.shapeRenderer.lineWidth=af;ab.series[ac][aa]=af}else{if(aa=="markerOptions"){F(ab.series[ac].markerOptions,af);F(ab.series[ac].markerRenderer,af)}else{ab.series[ac][aa]=af}}}O=true}}}if(O){ab.target.empty();ab.draw()}for(aa in T.target){if(T.target[aa]!=null){ab.target.css(aa,T.target[aa])}}}};w.jqplot.ThemeEngine.prototype._add=function(P,O){if(O){P._name=O}if(!P._name){P._name=Date.parse(new Date())}if(!this.themes.hasOwnProperty(P._name)){this.themes[P._name]=P}else{throw new Error("jqplot.ThemeEngine Error: Theme already in use")}};w.jqplot.ThemeEngine.prototype.remove=function(O){if(O=="Default"){return false}return delete this.themes[O]};w.jqplot.ThemeEngine.prototype.newTheme=function(O,Q){if(typeof(O)=="object"){Q=Q||O;O=null}if(Q&&Q._name){O=Q._name}else{O=O||Date.parse(new Date())}var P=this.copy(this.themes.Default._name,O);w.jqplot.extend(P,Q);return P};function p(Q){if(Q==null||typeof(Q)!="object"){return Q}var O=new Q.constructor();for(var P in Q){O[P]=p(Q[P])}return O}w.jqplot.clone=p;function F(Q,P){if(P==null||typeof(P)!="object"){return}for(var O in P){if(O=="highlightColors"){Q[O]=p(P[O])}if(P[O]!=null&&typeof(P[O])=="object"){if(!Q.hasOwnProperty(O)){Q[O]={}}F(Q[O],P[O])}else{Q[O]=P[O]}}}w.jqplot.merge=F;w.jqplot.extend=function(){var T=arguments[0]||{},R=1,S=arguments.length,O=false,Q;if(typeof T==="boolean"){O=T;T=arguments[1]||{};R=2}if(typeof T!=="object"&&!toString.call(T)==="[object Function]"){T={}}for(;R<S;R++){if((Q=arguments[R])!=null){for(var P in Q){var U=T[P],V=Q[P];if(T===V){continue}if(O&&V&&typeof V==="object"&&!V.nodeType){T[P]=w.jqplot.extend(O,U||(V.length!=null?[]:{}),V)}else{if(V!==l){T[P]=V}}}}}return T};w.jqplot.ThemeEngine.prototype.rename=function(P,O){if(P=="Default"||O=="Default"){throw new Error("jqplot.ThemeEngine Error: Cannot rename from/to Default")}if(this.themes.hasOwnProperty(O)){throw new Error("jqplot.ThemeEngine Error: New name already in use.")}else{if(this.themes.hasOwnProperty(P)){var Q=this.copy(P,O);this.remove(P);return Q}}throw new Error("jqplot.ThemeEngine Error: Old name or new name invalid")};w.jqplot.ThemeEngine.prototype.copy=function(O,Q,S){if(Q=="Default"){throw new Error("jqplot.ThemeEngine Error: Cannot copy over Default theme")}if(!this.themes.hasOwnProperty(O)){var P="jqplot.ThemeEngine Error: Source name invalid";throw new Error(P)}if(this.themes.hasOwnProperty(Q)){var P="jqplot.ThemeEngine Error: Target name invalid";throw new Error(P)}else{var R=p(this.themes[O]);R._name=Q;w.jqplot.extend(true,R,S);this._add(R);return R}};w.jqplot.Theme=function(O,P){if(typeof(O)=="object"){P=P||O;O=null}O=O||Date.parse(new Date());this._name=O;this.target={backgroundColor:null};this.legend={textColor:null,fontFamily:null,fontSize:null,border:null,background:null};this.title={textColor:null,fontFamily:null,fontSize:null,textAlign:null};this.seriesStyles={};this.series=[];this.grid={drawGridlines:null,gridLineColor:null,gridLineWidth:null,backgroundColor:null,borderColor:null,borderWidth:null,shadow:null};this.axesStyles={label:{},ticks:{}};this.axes={};if(typeof(P)=="string"){this._name=P}else{if(typeof(P)=="object"){w.jqplot.extend(true,this,P)}}};var A=function(){this.borderColor=null;this.borderWidth=null;this.ticks=new g();this.label=new k()};var g=function(){this.show=null;this.showGridline=null;this.showLabel=null;this.showMark=null;this.size=null;this.textColor=null;this.whiteSpace=null;this.fontSize=null;this.fontFamily=null};var k=function(){this.textColor=null;this.whiteSpace=null;this.fontSize=null;this.fontFamily=null;this.fontWeight=null};var i=function(){this.color=null;this.lineWidth=null;this.shadow=null;this.fillColor=null;this.showMarker=null;this.markerOptions=new v()};var v=function(){this.show=null;this.style=null;this.lineWidth=null;this.size=null;this.color=null;this.shadow=null};var E=function(){this.color=null;this.seriesColors=null;this.lineWidth=null;this.shadow=null;this.barPadding=null;this.barMargin=null;this.barWidth=null;this.highlightColors=null};var b=function(){this.seriesColors=null;this.padding=null;this.sliceMargin=null;this.fill=null;this.shadow=null;this.startAngle=null;this.lineWidth=null;this.highlightColors=null};var t=function(){this.seriesColors=null;this.padding=null;this.sliceMargin=null;this.fill=null;this.shadow=null;this.startAngle=null;this.lineWidth=null;this.innerDiameter=null;this.thickness=null;this.ringMargin=null;this.highlightColors=null};var H=function(){this.color=null;this.lineWidth=null;this.shadow=null;this.padding=null;this.sectionMargin=null;this.seriesColors=null;this.highlightColors=null};var r=function(){this.padding=null;this.backgroundColor=null;this.ringColor=null;this.tickColor=null;this.ringWidth=null;this.intervalColors=null;this.intervalInnerRadius=null;this.intervalOuterRadius=null;this.hubRadius=null;this.needleThickness=null;this.needlePad=null};var N=function(){this.syntax=N.config.syntax;this._type="jsDate";this.utcOffset=new Date().getTimezoneOffset*60000;this.proxy=new Date();this.options={};this.locale=N.regional.getLocale();this.formatString="";this.defaultCentury=N.config.defaultCentury;switch(arguments.length){case 0:break;case 1:if(f(arguments[0])=="[object Object]"&&arguments[0]._type!="jsDate"){var Q=this.options=arguments[0];this.syntax=Q.syntax||this.syntax;this.defaultCentury=Q.defaultCentury||this.defaultCentury;this.proxy=N.createDate(Q.date)}else{this.proxy=N.createDate(arguments[0])}break;default:var O=[];for(var P=0;P<arguments.length;P++){O.push(arguments[P])}this.proxy=new Date(this.utcOffset);this.proxy.setFullYear.apply(this.proxy,O.slice(0,3));if(O.slice(3).length){this.proxy.setHours.apply(this.proxy,O.slice(3))}break}};N.config={defaultLocale:"en",syntax:"perl",defaultCentury:1900};N.prototype.add=function(Q,P){var O=s[P]||s.day;if(typeof O=="number"){this.proxy.setTime(this.proxy.getTime()+(O*Q))}else{O.add(this,Q)}return this};N.prototype.clone=function(){return new N(this.proxy.getTime())};N.prototype.diff=function(P,S,O){P=new N(P);if(P===null){return null}var Q=s[S]||s.day;if(typeof Q=="number"){var R=(this.proxy.getTime()-P.proxy.getTime())/Q}else{var R=Q.diff(this.proxy,P.proxy)}return(O?R:Math[R>0?"floor":"ceil"](R))};N.prototype.getAbbrDayName=function(){return N.regional[this.locale]["dayNamesShort"][this.proxy.getDay()]};N.prototype.getAbbrMonthName=function(){return N.regional[this.locale]["monthNamesShort"][this.proxy.getMonth()]};N.prototype.getAMPM=function(){return this.proxy.getHours()>=12?"PM":"AM"};N.prototype.getAmPm=function(){return this.proxy.getHours()>=12?"pm":"am"};N.prototype.getCentury=function(){return parseInt(this.proxy.getFullYear()/100,10)};N.prototype.getDate=function(){return this.proxy.getDate()};N.prototype.getDay=function(){return this.proxy.getDay()};N.prototype.getDayOfWeek=function(){var O=this.proxy.getDay();return O===0?7:O};N.prototype.getDayOfYear=function(){var P=this.proxy;var O=P-new Date(""+P.getFullYear()+"/1/1 GMT");O+=P.getTimezoneOffset()*60000;P=null;return parseInt(O/60000/60/24,10)+1};N.prototype.getDayName=function(){return N.regional[this.locale]["dayNames"][this.proxy.getDay()]};N.prototype.getFullWeekOfYear=function(){var R=this.proxy;var O=this.getDayOfYear();var Q=6-R.getDay();var P=parseInt((O+Q)/7,10);return P};N.prototype.getFullYear=function(){return this.proxy.getFullYear()};N.prototype.getGmtOffset=function(){var O=this.proxy.getTimezoneOffset()/60;var P=O<0?"+":"-";O=Math.abs(O);return P+y(Math.floor(O),2)+":"+y((O%1)*60,2)};N.prototype.getHours=function(){return this.proxy.getHours()};N.prototype.getHours12=function(){var O=this.proxy.getHours();return O>12?O-12:(O==0?12:O)};N.prototype.getIsoWeek=function(){var R=this.proxy;var Q=R.getWeekOfYear();var O=(new Date(""+R.getFullYear()+"/1/1")).getDay();var P=Q+(O>4||O<=1?0:1);if(P==53&&(new Date(""+R.getFullYear()+"/12/31")).getDay()<4){P=1}else{if(P===0){R=new N(new Date(""+(R.getFullYear()-1)+"/12/31"));P=R.getIsoWeek()}}R=null;return P};N.prototype.getMilliseconds=function(){return this.proxy.getMilliseconds()};N.prototype.getMinutes=function(){return this.proxy.getMinutes()};N.prototype.getMonth=function(){return this.proxy.getMonth()};N.prototype.getMonthName=function(){return N.regional[this.locale]["monthNames"][this.proxy.getMonth()]};N.prototype.getMonthNumber=function(){return this.proxy.getMonth()+1};N.prototype.getSeconds=function(){return this.proxy.getSeconds()};N.prototype.getShortYear=function(){return this.proxy.getYear()%100};N.prototype.getTime=function(){return this.proxy.getTime()};N.prototype.getTimezoneAbbr=function(){return this.proxy.toString().replace(/^.*\(([^)]+)\)$/,"$1")};N.prototype.getTimezoneName=function(){var O=/(?:\((.+)\)$| ([A-Z]{3}) )/.exec(this.toString());return O[1]||O[2]||"GMT"+this.getGmtOffset()};N.prototype.getTimezoneOffset=function(){return this.proxy.getTimezoneOffset()};N.prototype.getWeekOfYear=function(){var O=this.getDayOfYear();var Q=7-this.getDayOfWeek();var P=parseInt((O+Q)/7,10);return P};N.prototype.getUnix=function(){return Math.round(this.proxy.getTime()/1000,0)};N.prototype.getYear=function(){return this.proxy.getYear()};N.prototype.next=function(O){O=O||"day";return this.clone().add(1,O)};N.prototype.set=function(){switch(arguments.length){case 0:this.proxy=new Date();break;case 1:if(f(arguments[0])=="[object Object]"&&arguments[0]._type!="jsDate"){var Q=this.options=arguments[0];this.syntax=Q.syntax||this.syntax;this.defaultCentury=Q.defaultCentury||this.defaultCentury;this.proxy=N.createDate(Q.date)}else{this.proxy=N.createDate(arguments[0])}break;default:var O=[];for(var P=0;P<arguments.length;P++){O.push(arguments[P])}this.proxy=new Date(this.utcOffset);this.proxy.setFullYear.apply(this.proxy,O.slice(0,3));if(O.slice(3).length){this.proxy.setHours.apply(this.proxy,O.slice(3))}break}};N.prototype.setDate=function(O){return this.proxy.setDate(O)};N.prototype.setFullYear=function(){return this.proxy.setFullYear.apply(this.proxy,arguments)};N.prototype.setHours=function(){return this.proxy.setHours.apply(this.proxy,arguments)};N.prototype.setMilliseconds=function(O){return this.proxy.setMilliseconds(O)};N.prototype.setMinutes=function(){return this.proxy.setMinutes.apply(this.proxy,arguments)};N.prototype.setMonth=function(){return this.proxy.setMonth.apply(this.proxy,arguments)};N.prototype.setSeconds=function(){return this.proxy.setSeconds.apply(this.proxy,arguments)};N.prototype.setTime=function(O){return this.proxy.setTime(O)};N.prototype.setYear=function(){return this.proxy.setYear.apply(this.proxy,arguments)};N.prototype.strftime=function(O){O=O||this.formatString||N.regional[this.locale]["formatString"];return N.strftime(this,O,this.syntax)};N.prototype.toString=function(){return this.proxy.toString()};N.prototype.toYmdInt=function(){return(this.proxy.getFullYear()*10000)+(this.getMonthNumber()*100)+this.proxy.getDate()};N.regional={en:{monthNames:["January","February","March","April","May","June","July","August","September","October","November","December"],monthNamesShort:["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],dayNames:["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],dayNamesShort:["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],formatString:"%Y-%m-%d %H:%M:%S"},fr:{monthNames:["Janvier","F茅vrier","Mars","Avril","Mai","Juin","Juillet","Ao没t","Septembre","Octobre","Novembre","D茅cembre"],monthNamesShort:["Jan","F茅v","Mar","Avr","Mai","Jun","Jul","Ao没","Sep","Oct","Nov","D茅c"],dayNames:["Dimanche","Lundi","Mardi","Mercredi","Jeudi","Vendredi","Samedi"],dayNamesShort:["Dim","Lun","Mar","Mer","Jeu","Ven","Sam"],formatString:"%Y-%m-%d %H:%M:%S"},de:{monthNames:["Januar","Februar","M盲rz","April","Mai","Juni","Juli","August","September","Oktober","November","Dezember"],monthNamesShort:["Jan","Feb","M盲r","Apr","Mai","Jun","Jul","Aug","Sep","Okt","Nov","Dez"],dayNames:["Sonntag","Montag","Dienstag","Mittwoch","Donnerstag","Freitag","Samstag"],dayNamesShort:["So","Mo","Di","Mi","Do","Fr","Sa"],formatString:"%Y-%m-%d %H:%M:%S"},es:{monthNames:["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"],monthNamesShort:["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"],dayNames:["Domingo","Lunes","Martes","Mi&eacute;rcoles","Jueves","Viernes","S&aacute;bado"],dayNamesShort:["Dom","Lun","Mar","Mi&eacute;","Juv","Vie","S&aacute;b"],formatString:"%Y-%m-%d %H:%M:%S"},ru:{monthNames:["携薪胁邪褉褜","肖械胁褉邪谢褜","袦邪褉褌","袗锌褉械谢褜","袦邪泄","袠褞薪褜","袠褞谢褜","袗胁谐褍褋褌","小械薪褌褟斜褉褜","袨泻褌褟斜褉褜","袧芯褟斜褉褜","袛械泻邪斜褉褜"],monthNamesShort:["携薪胁","肖械胁","袦邪褉","袗锌褉","袦邪泄","袠褞薪","袠褞谢","袗胁谐","小械薪","袨泻褌","袧芯褟","袛械泻"],dayNames:["胁芯褋泻褉械褋械薪褜械","锌芯薪械写械谢褜薪懈泻","胁褌芯褉薪懈泻","褋褉械写邪","褔械褌胁械褉谐","锌褟褌薪懈褑邪","褋褍斜斜芯褌邪"],dayNamesShort:["胁褋泻","锌薪写","胁褌褉","褋褉写","褔褌胁","锌褌薪","褋斜褌"],formatString:"%Y-%m-%d %H:%M:%S"},ar:{monthNames:["賰丕賳賵賳 丕賱孬丕賳賷","卮亘丕胤","丌匕丕乇","賳賷爻丕賳","丌匕丕乇","丨夭賷乇丕賳","鬲賲賵夭","丌亘","兀賷賱賵賱","鬲卮乇賷賳 丕賱兀賵賱","鬲卮乇賷賳 丕賱孬丕賳賷","賰丕賳賵賳 丕賱兀賵賱"],monthNamesShort:["1","2","3","4","5","6","7","8","9","10","11","12"],dayNames:["丕賱爻亘鬲","丕賱兀丨丿","丕賱丕孬賳賷賳","丕賱孬賱丕孬丕亍","丕賱兀乇亘毓丕亍","丕賱禺賲賷爻","丕賱噩賲毓丞"],dayNamesShort:["爻亘鬲","兀丨丿","丕孬賳賷賳","孬賱丕孬丕亍","兀乇亘毓丕亍","禺賲賷爻","噩賲毓丞"],formatString:"%Y-%m-%d %H:%M:%S"},pt:{monthNames:["Janeiro","Fevereiro","Mar&ccedil;o","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"],monthNamesShort:["Jan","Fev","Mar","Abr","Mai","Jun","Jul","Ago","Set","Out","Nov","Dez"],dayNames:["Domingo","Segunda-feira","Ter&ccedil;a-feira","Quarta-feira","Quinta-feira","Sexta-feira","S&aacute;bado"],dayNamesShort:["Dom","Seg","Ter","Qua","Qui","Sex","S&aacute;b"],formatString:"%Y-%m-%d %H:%M:%S"},"pt-BR":{monthNames:["Janeiro","Fevereiro","Mar&ccedil;o","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"],monthNamesShort:["Jan","Fev","Mar","Abr","Mai","Jun","Jul","Ago","Set","Out","Nov","Dez"],dayNames:["Domingo","Segunda-feira","Ter&ccedil;a-feira","Quarta-feira","Quinta-feira","Sexta-feira","S&aacute;bado"],dayNamesShort:["Dom","Seg","Ter","Qua","Qui","Sex","S&aacute;b"],formatString:"%Y-%m-%d %H:%M:%S"}};N.regional["en-US"]=N.regional["en-GB"]=N.regional.en;N.regional.getLocale=function(){var O=N.config.defaultLocale;if(document&&document.getElementsByTagName("html")&&document.getElementsByTagName("html")[0].lang){O=document.getElementsByTagName("html")[0].lang;if(!N.regional.hasOwnProperty(O)){O=N.config.defaultLocale}}return O};var q=24*60*60*1000;var y=function(O,R){O=String(O);var P=R-O.length;var Q=String(Math.pow(10,P)).slice(1);return Q.concat(O)};var s={millisecond:1,second:1000,minute:60*1000,hour:60*60*1000,day:q,week:7*q,month:{add:function(Q,O){s.year.add(Q,Math[O>0?"floor":"ceil"](O/12));var P=Q.getMonth()+(O%12);if(P==12){P=0;Q.setYear(Q.getFullYear()+1)}else{if(P==-1){P=11;Q.setYear(Q.getFullYear()-1)}}Q.setMonth(P)},diff:function(S,Q){var O=S.getFullYear()-Q.getFullYear();var P=S.getMonth()-Q.getMonth()+(O*12);var R=S.getDate()-Q.getDate();return P+(R/30)}},year:{add:function(P,O){P.setYear(P.getFullYear()+Math[O>0?"floor":"ceil"](O))},diff:function(P,O){return s.month.diff(P,O)/12}}};for(var G in s){if(G.substring(G.length-1)!="s"){s[G+"s"]=s[G]}}var u=function(S,R,P){if(N.formats[P]["shortcuts"][R]){return N.strftime(S,N.formats[P]["shortcuts"][R],P)}else{var O=(N.formats[P]["codes"][R]||"").split(".");var Q=S["get"+O[0]]?S["get"+O[0]]():"";if(O[1]){Q=y(Q,O[1])}return Q}};N.strftime=function(U,R,Q,V){var P="perl";var T=N.regional.getLocale();if(Q&&N.formats.hasOwnProperty(Q)){P=Q}else{if(Q&&N.regional.hasOwnProperty(Q)){T=Q}}if(V&&N.formats.hasOwnProperty(V)){P=V}else{if(V&&N.regional.hasOwnProperty(V)){T=V}}if(f(U)!="[object Object]"||U._type!="jsDate"){U=new N(U);U.locale=T}if(!R){R=U.formatString||N.regional[T]["formatString"]}var O=R||"%Y-%m-%d",W="",S;while(O.length>0){if(S=O.match(N.formats[P].codes.matcher)){W+=O.slice(0,S.index);W+=(S[1]||"")+u(U,S[2],P);O=O.slice(S.index+S[0].length)}else{W+=O;O=""}}return W};N.formats={ISO:"%Y-%m-%dT%H:%M:%S.%N%G",SQL:"%Y-%m-%d %H:%M:%S"};N.formats.perl={codes:{matcher:/()%(#?(%|[a-z]))/i,Y:"FullYear",y:"ShortYear.2",m:"MonthNumber.2","#m":"MonthNumber",B:"MonthName",b:"AbbrMonthName",d:"Date.2","#d":"Date",e:"Date",A:"DayName",a:"AbbrDayName",w:"Day",H:"Hours.2","#H":"Hours",I:"Hours12.2","#I":"Hours12",p:"AMPM",M:"Minutes.2","#M":"Minutes",S:"Seconds.2","#S":"Seconds",s:"Unix",N:"Milliseconds.3","#N":"Milliseconds",O:"TimezoneOffset",Z:"TimezoneName",G:"GmtOffset"},shortcuts:{F:"%Y-%m-%d",T:"%H:%M:%S",X:"%H:%M:%S",x:"%m/%d/%y",D:"%m/%d/%y","#c":"%a %b %e %H:%M:%S %Y",v:"%e-%b-%Y",R:"%H:%M",r:"%I:%M:%S %p",t:"\t",n:"\n","%":"%"}};N.formats.php={codes:{matcher:/()%((%|[a-z]))/i,a:"AbbrDayName",A:"DayName",d:"Date.2",e:"Date",j:"DayOfYear.3",u:"DayOfWeek",w:"Day",U:"FullWeekOfYear.2",V:"IsoWeek.2",W:"WeekOfYear.2",b:"AbbrMonthName",B:"MonthName",m:"MonthNumber.2",h:"AbbrMonthName",C:"Century.2",y:"ShortYear.2",Y:"FullYear",H:"Hours.2",I:"Hours12.2",l:"Hours12",p:"AMPM",P:"AmPm",M:"Minutes.2",S:"Seconds.2",s:"Unix",O:"TimezoneOffset",z:"GmtOffset",Z:"TimezoneAbbr"},shortcuts:{D:"%m/%d/%y",F:"%Y-%m-%d",T:"%H:%M:%S",X:"%H:%M:%S",x:"%m/%d/%y",R:"%H:%M",r:"%I:%M:%S %p",t:"\t",n:"\n","%":"%"}};N.createDate=function(Q){if(Q==null){return new Date()}if(Q instanceof Date){return Q}if(typeof Q=="number"){return new Date(Q)}var V=String(Q).replace(/^\s*(.+)\s*$/g,"$1");V=V.replace(/^([0-9]{1,4})-([0-9]{1,2})-([0-9]{1,4})/,"$1/$2/$3");V=V.replace(/^(3[01]|[0-2]?\d)[-\/]([a-z]{3,})[-\/](\d{4})/i,"$1 $2 $3");var U=V.match(/^(3[01]|[0-2]?\d)[-\/]([a-z]{3,})[-\/](\d{2})\D*/i);if(U&&U.length>3){var Z=parseFloat(U[3]);var T=N.config.defaultCentury+Z;T=String(T);V=V.replace(/^(3[01]|[0-2]?\d)[-\/]([a-z]{3,})[-\/](\d{2})\D*/i,U[1]+" "+U[2]+" "+T)}U=V.match(/^([0-9]{1,2})[-\/]([0-9]{1,2})[-\/]([0-9]{1,2})[^0-9]/);function Y(ad,ac){var ai=parseFloat(ac[1]);var ah=parseFloat(ac[2]);var ag=parseFloat(ac[3]);var af=N.config.defaultCentury;var ab,aa,aj,ae;if(ai>31){aa=ag;aj=ah;ab=af+ai}else{aa=ah;aj=ai;ab=af+ag}ae=aj+"/"+aa+"/"+ab;return ad.replace(/^([0-9]{1,2})[-\/]([0-9]{1,2})[-\/]([0-9]{1,2})/,ae)}if(U&&U.length>3){V=Y(V,U)}var U=V.match(/^([0-9]{1,2})[-\/]([0-9]{1,2})[-\/]([0-9]{1,2})$/);if(U&&U.length>3){V=Y(V,U)}var S=0;var P=N.matchers.length;var X,O,W=V;while(S<P){O=Date.parse(W);if(!isNaN(O)){return new Date(O)}X=N.matchers[S];if(typeof X=="function"){var R=X.call(N,W);if(R instanceof Date){return R}}else{W=V.replace(X[0],X[1])}S++}return NaN};N.daysInMonth=function(O,P){if(P==2){return new Date(O,1,29).getDate()==29?29:28}return[l,31,l,31,30,31,30,31,31,30,31,30,31][P]};N.matchers=[[/(3[01]|[0-2]\d)\s*\.\s*(1[0-2]|0\d)\s*\.\s*([1-9]\d{3})/,"$2/$1/$3"],[/([1-9]\d{3})\s*-\s*(1[0-2]|0\d)\s*-\s*(3[01]|[0-2]\d)/,"$2/$3/$1"],function(R){var P=R.match(/^(?:(.+)\s+)?([012]?\d)(?:\s*\:\s*(\d\d))?(?:\s*\:\s*(\d\d(\.\d*)?))?\s*(am|pm)?\s*$/i);if(P){if(P[1]){var Q=this.createDate(P[1]);if(isNaN(Q)){return}}else{var Q=new Date();Q.setMilliseconds(0)}var O=parseFloat(P[2]);if(P[6]){O=P[6].toLowerCase()=="am"?(O==12?0:O):(O==12?12:O+12)}Q.setHours(O,parseInt(P[3]||0,10),parseInt(P[4]||0,10),((parseFloat(P[5]||0))||0)*1000);return Q}else{return R}},function(R){var P=R.match(/^(?:(.+))[T|\s+]([012]\d)(?:\:(\d\d))(?:\:(\d\d))(?:\.\d+)([\+\-]\d\d\:\d\d)$/i);if(P){if(P[1]){var Q=this.createDate(P[1]);if(isNaN(Q)){return}}else{var Q=new Date();Q.setMilliseconds(0)}var O=parseFloat(P[2]);Q.setHours(O,parseInt(P[3],10),parseInt(P[4],10),parseFloat(P[5])*1000);return Q}else{return R}},function(S){var Q=S.match(/^([0-3]?\d)\s*[-\/.\s]{1}\s*([a-zA-Z]{3,9})\s*[-\/.\s]{1}\s*([0-3]?\d)$/);if(Q){var R=new Date();var T=N.config.defaultCentury;var V=parseFloat(Q[1]);var U=parseFloat(Q[3]);var P,O,W;if(V>31){O=U;P=T+V}else{O=V;P=T+U}var W=J(Q[2],N.regional[this.locale]["monthNamesShort"]);if(W==-1){W=J(Q[2],N.regional[this.locale]["monthNames"])}R.setFullYear(P,W,O);R.setHours(0,0,0,0);return R}else{return S}}];function J(Q,R){if(R.indexOf){return R.indexOf(Q)}for(var O=0,P=R.length;O<P;O++){if(R[O]===Q){return O}}return -1}function f(O){if(O===null){return"[object Null]"}return Object.prototype.toString.call(O)}w.jsDate=N;w.jqplot.sprintf=function(){function U(aa,W,X,Z){var Y=(aa.length>=W)?"":Array(1+W-aa.length>>>0).join(X);return Z?aa+Y:Y+aa}function R(Y){var X=new String(Y);for(var W=10;W>0;W--){if(X==(X=X.replace(/^(\d+)(\d{3})/,"$1"+w.jqplot.sprintf.thousandsSeparator+"$2"))){break}}return X}function Q(ab,aa,ad,Y,Z,X){var ac=Y-ab.length;if(ac>0){var W=" ";if(X){W="&nbsp;"}if(ad||!Z){ab=U(ab,Y,W,ad)}else{ab=ab.slice(0,aa.length)+U("",ac,"0",true)+ab.slice(aa.length)}}return ab}function V(ae,X,ac,Y,W,ab,ad,aa){var Z=ae>>>0;ac=ac&&Z&&{"2":"0b","8":"0","16":"0x"}[X]||"";ae=ac+U(Z.toString(X),ab||0,"0",false);return Q(ae,ac,Y,W,ad,aa)}function O(aa,ab,Y,W,Z,X){if(W!=null){aa=aa.slice(0,W)}return Q(aa,"",ab,Y,Z,X)}var P=arguments,S=0,T=P[S++];return T.replace(w.jqplot.sprintf.regex,function(ar,ad,ae,ah,au,ao,ab){if(ar=="%%"){return"%"}var ai=false,af="",ag=false,aq=false,ac=false,aa=false;for(var an=0;ae&&an<ae.length;an++){switch(ae.charAt(an)){case" ":af=" ";break;case"+":af="+";break;case"-":ai=true;break;case"0":ag=true;break;case"#":aq=true;break;case"&":ac=true;break;case"'":aa=true;break}}if(!ah){ah=0}else{if(ah=="*"){ah=+P[S++]}else{if(ah.charAt(0)=="*"){ah=+P[ah.slice(1,-1)]}else{ah=+ah}}}if(ah<0){ah=-ah;ai=true}if(!isFinite(ah)){throw new Error("$.jqplot.sprintf: (minimum-)width must be finite")}if(!ao){ao="fFeE".indexOf(ab)>-1?6:(ab=="d")?0:void (0)}else{if(ao=="*"){ao=+P[S++]}else{if(ao.charAt(0)=="*"){ao=+P[ao.slice(1,-1)]}else{ao=+ao}}}var ak=ad?P[ad.slice(0,-1)]:P[S++];switch(ab){case"s":if(ak==null){return""}return O(String(ak),ai,ah,ao,ag,ac);case"c":return O(String.fromCharCode(+ak),ai,ah,ao,ag,ac);case"b":return V(ak,2,aq,ai,ah,ao,ag,ac);case"o":return V(ak,8,aq,ai,ah,ao,ag,ac);case"x":return V(ak,16,aq,ai,ah,ao,ag,ac);case"X":return V(ak,16,aq,ai,ah,ao,ag,ac).toUpperCase();case"u":return V(ak,10,aq,ai,ah,ao,ag,ac);case"i":var Y=parseInt(+ak,10);if(isNaN(Y)){return""}var am=Y<0?"-":af;var ap=aa?R(String(Math.abs(Y))):String(Math.abs(Y));ak=am+U(ap,ao,"0",false);return Q(ak,am,ai,ah,ag,ac);case"d":var Y=Math.round(+ak);if(isNaN(Y)){return""}var am=Y<0?"-":af;var ap=aa?R(String(Math.abs(Y))):String(Math.abs(Y));ak=am+U(ap,ao,"0",false);return Q(ak,am,ai,ah,ag,ac);case"e":case"E":case"f":case"F":case"g":case"G":var Y=+ak;if(isNaN(Y)){return""}var am=Y<0?"-":af;var Z=["toExponential","toFixed","toPrecision"]["efg".indexOf(ab.toLowerCase())];var at=["toString","toUpperCase"]["eEfFgG".indexOf(ab)%2];var ap=Math.abs(Y)[Z](ao);ap=aa?R(ap):ap;ak=am+ap;return Q(ak,am,ai,ah,ag,ac)[at]();case"p":case"P":var Y=+ak;if(isNaN(Y)){return""}var am=Y<0?"-":af;var aj=String(Number(Math.abs(Y)).toExponential()).split(/e|E/);var X=(aj[0].indexOf(".")!=-1)?aj[0].length-1:aj[0].length;var al=(aj[1]<0)?-aj[1]-1:0;if(Math.abs(Y)<1){if(X+al<=ao){ak=am+Math.abs(Y).toPrecision(X)}else{if(X<=ao-1){ak=am+Math.abs(Y).toExponential(X-1)}else{ak=am+Math.abs(Y).toExponential(ao-1)}}}else{var W=(X<=ao)?X:ao;ak=am+Math.abs(Y).toPrecision(W)}var at=["toString","toUpperCase"]["pP".indexOf(ab)%2];return Q(ak,am,ai,ah,ag,ac)[at]();case"n":return"";default:return ar}})};w.jqplot.sprintf.thousandsSeparator=",";w.jqplot.sprintf.regex=/%%|%(\d+\$)?([-+#0&\' ]*)(\*\d+\$|\*|\d+)?(\.(\*\d+\$|\*|\d+))?([nAscboxXuidfegpEGP])/g})(jQuery);
/**
 * jqPlot
 * Pure JavaScript plotting plugin using jQuery
 *
 * Version: @VERSION
 * Revision: @REVISION
 *
 * Copyright (c) 2009-2013 Chris Leonello
 * jqPlot is currently available for use in all personal or commercial projects 
 * under both the MIT (http://www.opensource.org/licenses/mit-license.php) and GPL 
 * version 2.0 (http://www.gnu.org/licenses/gpl-2.0.html) licenses. This means that you can 
 * choose the license that best suits your project and use it accordingly. 
 *
 * Although not required, the author would appreciate an email letting him 
 * know of any substantial use of jqPlot.  You can reach the author at: 
 * chris at jqplot dot com or see http://www.jqplot.com/info.php .
 *
 * If you are feeling kind and generous, consider supporting the project by
 * making a donation at: http://www.jqplot.com/donate.php .
 *
 * sprintf functions contained in jqplot.sprintf.js by Ash Searle:
 *
 *     version 2007.04.27
 *     author Ash Searle
 *     http://hexmen.com/blog/2007/03/printf-sprintf/
 *     http://hexmen.com/js/sprintf.js
 *     The author (Ash Searle) has placed this code in the public domain:
 *     "This code is unrestricted: you are free to use it however you like."
 * 
 */
(function($) {
    /**
     * Class: $.jqplot.FunnelRenderer
     * Plugin renderer to draw a funnel chart.
     * x values, if present, will be used as labels.
     * y values give area size.
     * 
     * Funnel charts will draw a single series
     * only.
     * 
     * To use this renderer, you need to include the 
     * funnel renderer plugin, for example:
     * 
     * > <script type="text/javascript" src="plugins/jqplot.funnelRenderer.js"></script>
     * 
     * Properties described here are passed into the $.jqplot function
     * as options on the series renderer.  For example:
     * 
     * > plot2 = $.jqplot('chart2', [s1, s2], {
     * >     seriesDefaults: {
     * >         renderer:$.jqplot.FunnelRenderer,
     * >         rendererOptions:{
     * >              sectionMargin: 12,
     * >              widthRatio: 0.3
     * >          }
     * >      }
     * > });
     * 
     * IMPORTANT
     * 
     * *The funnel renderer will reorder data in descending order* so the largest value in
     * the data set is first and displayed on top of the funnel.  Data will then
     * be displayed in descending order down the funnel.  The area of each funnel
     * section will correspond to the value of each data point relative to the sum
     * of all values.  That is section area is proportional to section value divided by 
     * sum of all section values.
     * 
     * If your data is not in descending order when passed into the plot, *it will be
     * reordered* when stored in the series.data property.  A copy of the unordered
     * data is kept in the series._unorderedData property.
     * 
     * A funnel plot will trigger events on the plot target
     * according to user interaction.  All events return the event object,
     * the series index, the point (section) index, and the point data for 
     * the appropriate section. *Note* the point index will referr to the ordered
     * data, not the original unordered data.
     * 
     * 'jqplotDataMouseOver' - triggered when mousing over a section.
     * 'jqplotDataHighlight' - triggered the first time user mouses over a section,
     * if highlighting is enabled.
     * 'jqplotDataUnhighlight' - triggered when a user moves the mouse out of
     * a highlighted section.
     * 'jqplotDataClick' - triggered when the user clicks on a section.
     * 'jqplotDataRightClick' - tiggered when the user right clicks on a section if
     * the "captureRightClick" option is set to true on the plot.
     */
    $.jqplot.FunnelRenderer = function(){
        $.jqplot.LineRenderer.call(this);
    };
    
    $.jqplot.FunnelRenderer.prototype = new $.jqplot.LineRenderer();
    $.jqplot.FunnelRenderer.prototype.constructor = $.jqplot.FunnelRenderer;
    
    // called with scope of a series
    $.jqplot.FunnelRenderer.prototype.init = function(options, plot) {
        // Group: Properties
        //
        // prop: padding
        // padding between the funnel and plot edges, legend, etc.
        this.padding = {top: 20, right: 20, bottom: 20, left: 20};
        // prop: sectionMargin
        // spacing between funnel sections in pixels.
        this.sectionMargin = 6;
        // prop: fill
        // true or false, whether to fill the areas.
        this.fill = true;
        // prop: shadowOffset
        // offset of the shadow from the area and offset of 
        // each succesive stroke of the shadow from the last.
        this.shadowOffset = 2;
        // prop: shadowAlpha
        // transparency of the shadow (0 = transparent, 1 = opaque)
        this.shadowAlpha = 0.07;
        // prop: shadowDepth
        // number of strokes to apply to the shadow, 
        // each stroke offset shadowOffset from the last.
        this.shadowDepth = 5;
        // prop: highlightMouseOver
        // True to highlight area when moused over.
        // This must be false to enable highlightMouseDown to highlight when clicking on a area.
        this.highlightMouseOver = true;
        // prop: highlightMouseDown
        // True to highlight when a mouse button is pressed over a area.
        // This will be disabled if highlightMouseOver is true.
        this.highlightMouseDown = false;
        // prop: highlightColors
        // array of colors to use when highlighting an area.
        this.highlightColors = [];
        // prop: widthRatio
        // The ratio of the width of the top of the funnel to the bottom.
        // a ratio of 0 will make an upside down pyramid. 
        this.widthRatio = 0.2;
        // prop: lineWidth
        // width of line if areas are stroked and not filled.
        this.lineWidth = 2;
        // prop: dataLabels
        // Either 'label', 'value', 'percent' or an array of labels to place on the pie slices.
        // Defaults to percentage of each pie slice.
        this.dataLabels = 'percent';
        // prop: showDataLabels
        // true to show data labels on slices.
        this.showDataLabels = false;
        // prop: dataLabelFormatString
        // Format string for data labels.  If none, '%s' is used for "label" and for arrays, '%d' for value and '%d%%' for percentage.
        this.dataLabelFormatString = null;
        // prop: dataLabelThreshold
        // Threshhold in percentage (0 - 100) of pie area, below which no label will be displayed.
        // This applies to all label types, not just to percentage labels.
        this.dataLabelThreshold = 3;
        this._type = 'funnel';
        
        this.tickRenderer = $.jqplot.FunnelTickRenderer;
        
        // if user has passed in highlightMouseDown option and not set highlightMouseOver, disable highlightMouseOver
        if (options.highlightMouseDown && options.highlightMouseOver == null) {
            options.highlightMouseOver = false;
        }
        
        $.extend(true, this, options);
        
        // index of the currenty highlighted point, if any
        this._highlightedPoint = null;
        
        // lengths of bases, or horizontal sides of areas of trapezoid.
        this._bases = [];
        // total area
        this._atot;
        // areas of segments.
        this._areas = [];
        // vertical lengths of segments.
        this._lengths = [];
        // angle of the funnel to vertical.
        this._angle;
        this._dataIndices = [];
        
        // sort data
        this._unorderedData = $.extend(true, [], this.data);
        var idxs = $.extend(true, [], this.data);
        for (var i=0; i<idxs.length; i++) {
            idxs[i].push(i);
        }
        this.data.sort( function (a, b) { return b[1] - a[1]; } );
        idxs.sort( function (a, b) { return b[1] - a[1]; });
        for (var i=0; i<idxs.length; i++) {
            this._dataIndices.push(idxs[i][2]);
        }
        
        // set highlight colors if none provided
        if (this.highlightColors.length == 0) {
            for (var i=0; i<this.seriesColors.length; i++){
                var rgba = $.jqplot.getColorComponents(this.seriesColors[i]);
                var newrgb = [rgba[0], rgba[1], rgba[2]];
                var sum = newrgb[0] + newrgb[1] + newrgb[2];
                for (var j=0; j<3; j++) {
                    // when darkening, lowest color component can be is 60.
                    newrgb[j] = (sum > 570) ?  newrgb[j] * 0.8 : newrgb[j] + 0.4 * (255 - newrgb[j]);
                    newrgb[j] = parseInt(newrgb[j], 10);
                }
                this.highlightColors.push('rgb('+newrgb[0]+','+newrgb[1]+','+newrgb[2]+')');
            }
        }

        plot.postParseOptionsHooks.addOnce(postParseOptions);
        plot.postInitHooks.addOnce(postInit);
        plot.eventListenerHooks.addOnce('jqplotMouseMove', handleMove);
        plot.eventListenerHooks.addOnce('jqplotMouseDown', handleMouseDown);
        plot.eventListenerHooks.addOnce('jqplotMouseUp', handleMouseUp);
        plot.eventListenerHooks.addOnce('jqplotClick', handleClick);
        plot.eventListenerHooks.addOnce('jqplotRightClick', handleRightClick);
        plot.postDrawHooks.addOnce(postPlotDraw);        
        
    };
    
    // gridData will be of form [label, percentage of total]
    $.jqplot.FunnelRenderer.prototype.setGridData = function(plot) {
        // set gridData property.  This will hold angle in radians of each data point.
        var sum = 0;
        var td = [];
        for (var i=0; i<this.data.length; i++){
            sum += this.data[i][1];
            td.push([this.data[i][0], this.data[i][1]]);
        }
        
        // normalize y values, so areas are proportional.
        for (var i=0; i<td.length; i++) {
            td[i][1] = td[i][1]/sum;
        }
        
        this._bases = new Array(td.length + 1);
        this._lengths = new Array(td.length);
        
        this.gridData = td;
    };
    
    $.jqplot.FunnelRenderer.prototype.makeGridData = function(data, plot) {
        // set gridData property.  This will hold angle in radians of each data point.
        var sum = 0;
        var td = [];
        for (var i=0; i<this.data.length; i++){
            sum += this.data[i][1];
            td.push([this.data[i][0], this.data[i][1]]);
        }
        
        // normalize y values, so areas are proportional.
        for (var i=0; i<td.length; i++) {
            td[i][1] = td[i][1]/sum;
        }
        
        this._bases = new Array(td.length + 1);
        this._lengths = new Array(td.length);
        
        return td;
    };
    
    $.jqplot.FunnelRenderer.prototype.drawSection = function (ctx, vertices, color, isShadow) {
        var fill = this.fill;
        var lineWidth = this.lineWidth;
        ctx.save();
        
        if (isShadow) {
            for (var i=0; i<this.shadowDepth; i++) {
                ctx.save();
                ctx.translate(this.shadowOffset*Math.cos(this.shadowAngle/180*Math.PI), this.shadowOffset*Math.sin(this.shadowAngle/180*Math.PI));
                doDraw();
            }
        }
        
        else {
            doDraw();
        }
        
        function doDraw () {
            ctx.beginPath();  
            ctx.fillStyle = color;
            ctx.strokeStyle = color;
            ctx.lineWidth = lineWidth;
            ctx.moveTo(vertices[0][0], vertices[0][1]);
            for (var i=1; i<4; i++) {
                ctx.lineTo(vertices[i][0], vertices[i][1]);
            }
            ctx.closePath();
            if (fill) {
                ctx.fill();
            }
            else {
                ctx.stroke();
            }
        }
        
        if (isShadow) {
            for (var i=0; i<this.shadowDepth; i++) {
                ctx.restore();
            }
        }
        
        ctx.restore();
    };
    
    // called with scope of series
    $.jqplot.FunnelRenderer.prototype.draw = function (ctx, gd, options, plot) {
        var i;
        var opts = (options != undefined) ? options : {};
        // offset and direction of offset due to legend placement
        var offx = 0;
        var offy = 0;
        var trans = 1;
        this._areas = [];
        // var colorGenerator = new this.colorGenerator(this.seriesColors);
        if (options.legendInfo && options.legendInfo.placement == 'insideGrid') {
            var li = options.legendInfo;
            switch (li.location) {
                case 'nw':
                    offx = li.width + li.xoffset;
                    break;
                case 'w':
                    offx = li.width + li.xoffset;
                    break;
                case 'sw':
                    offx = li.width + li.xoffset;
                    break;
                case 'ne':
                    offx = li.width + li.xoffset;
                    trans = -1;
                    break;
                case 'e':
                    offx = li.width + li.xoffset;
                    trans = -1;
                    break;
                case 'se':
                    offx = li.width + li.xoffset;
                    trans = -1;
                    break;
                case 'n':
                    offy = li.height + li.yoffset;
                    break;
                case 's':
                    offy = li.height + li.yoffset;
                    trans = -1;
                    break;
                default:
                    break;
            }
        }
        
        var loff = (trans==1) ? this.padding.left + offx : this.padding.left;
        var toff = (trans==1) ? this.padding.top + offy : this.padding.top;
        var roff = (trans==-1) ? this.padding.right + offx : this.padding.right;
        var boff = (trans==-1) ? this.padding.bottom + offy : this.padding.bottom;
        
        var shadow = (opts.shadow != undefined) ? opts.shadow : this.shadow;
        var showLine = (opts.showLine != undefined) ? opts.showLine : this.showLine;
        var fill = (opts.fill != undefined) ? opts.fill : this.fill;
        var cw = ctx.canvas.width;
        var ch = ctx.canvas.height;
        this._bases[0] = cw - loff - roff;
        var ltot = this._length = ch - toff - boff;

        var hend = this._bases[0]*this.widthRatio;
        this._atot = ltot/2 * (this._bases[0] + this._bases[0]*this.widthRatio);

        this._angle = Math.atan((this._bases[0] - hend)/2/ltot);

        for (i=0; i<gd.length; i++) {
            this._areas.push(gd[i][1] * this._atot);
        }

        
        var guess, err, count, lsum=0;
        var tolerance = 0.0001;

        for (i=0; i<this._areas.length; i++) {
            guess = this._areas[i]/this._bases[i];
            err = 999999;
            this._lengths[i] = guess;
            count = 0;
            while (err > this._lengths[i]*tolerance && count < 100) {
                this._lengths[i] = this._areas[i]/(this._bases[i] - this._lengths[i] * Math.tan(this._angle));
                err = Math.abs(this._lengths[i] - guess);
                this._bases[i+1] = this._bases[i] - (2*this._lengths[i]*Math.tan(this._angle));
                guess = this._lengths[i];
                count++;
            }
            lsum += this._lengths[i];
        }
        
        // figure out vertices of each section
        this._vertices = new Array(gd.length);
        
        // these are 4 coners of entire trapezoid
        var p0 = [loff, toff],
            p1 = [loff+this._bases[0], toff],
            p2 = [loff + (this._bases[0] - this._bases[this._bases.length-1])/2, toff + this._length],
            p3 = [p2[0] + this._bases[this._bases.length-1], p2[1]];
            
        // equations of right and left sides, returns x, y values given height of section (y value)
        function findleft (l) {
            var m = (p0[1] - p2[1])/(p0[0] - p2[0]);
            var b = p0[1] - m*p0[0];
            var y = l + p0[1];
            
            return [(y - b)/m, y];
        }
        
        function findright (l) {
            var m = (p1[1] - p3[1])/(p1[0] - p3[0]);
            var b = p1[1] - m*p1[0];
            var y = l + p1[1];
            
            return [(y - b)/m, y];
        }
        
        var x = offx, y = offy;
        var h=0, adj=0;
        
        for (i=0; i<gd.length; i++) {
            this._vertices[i] = new Array();
            var v = this._vertices[i];
            var sm = this.sectionMargin;
            if (i == 0) {
                adj = 0;
            }
            if (i == 1) {
                adj = sm/3;
            }
            else if (i > 0 && i < gd.length-1) {
                adj = sm/2;
            }
            else if (i == gd.length -1) {
                adj = 2*sm/3;
            }
            v.push(findleft(h+adj));
            v.push(findright(h+adj));
            h += this._lengths[i];
            if (i == 0) {
                adj = -2*sm/3;
            }
            else if (i > 0 && i < gd.length-1) {
                adj = -sm/2;
            }
            else if (i == gd.length - 1) {
                adj = 0;
            }
            v.push(findright(h+adj));
            v.push(findleft(h+adj));
            
        }

        if (this.shadow) {
            var shadowColor = 'rgba(0,0,0,'+this.shadowAlpha+')';
            for (var i=0; i<gd.length; i++) {
                this.renderer.drawSection.call (this, ctx, this._vertices[i], shadowColor, true);
            }
            
        }
        for (var i=0; i<gd.length; i++) {
            var v = this._vertices[i];
            this.renderer.drawSection.call (this, ctx, v, this.seriesColors[i]);
            
            if (this.showDataLabels && gd[i][1]*100 >= this.dataLabelThreshold) {
                var fstr, label;
                
                if (this.dataLabels == 'label') {
                    fstr = this.dataLabelFormatString || '%s';
                    label = $.jqplot.sprintf(fstr, gd[i][0]);
                }
                else if (this.dataLabels == 'value') {
                    fstr = this.dataLabelFormatString || '%d';
                    label = $.jqplot.sprintf(fstr, this.data[i][1]);
                }
                else if (this.dataLabels == 'percent') {
                    fstr = this.dataLabelFormatString || '%d%%';
                    label = $.jqplot.sprintf(fstr, gd[i][1]*100);
                }
                else if (this.dataLabels.constructor == Array) {
                    fstr = this.dataLabelFormatString || '%s';
                    label = $.jqplot.sprintf(fstr, this.dataLabels[this._dataIndices[i]]);
                }
                
                var fact = (this._radius ) * this.dataLabelPositionFactor + this.sliceMargin + this.dataLabelNudge;
                
                var x = (v[0][0] + v[1][0])/2 + this.canvas._offsets.left;
                var y = (v[1][1] + v[2][1])/2 + this.canvas._offsets.top;
                
                var labelelem = $('<span class="jqplot-funnel-series jqplot-data-label" style="position:absolute;">' + label + '</span>').insertBefore(plot.eventCanvas._elem);
                x -= labelelem.width()/2;
                y -= labelelem.height()/2;
                x = Math.round(x);
                y = Math.round(y);
                labelelem.css({left: x, top: y});
            }
            
        }
               
    };
    
    $.jqplot.FunnelAxisRenderer = function() {
        $.jqplot.LinearAxisRenderer.call(this);
    };
    
    $.jqplot.FunnelAxisRenderer.prototype = new $.jqplot.LinearAxisRenderer();
    $.jqplot.FunnelAxisRenderer.prototype.constructor = $.jqplot.FunnelAxisRenderer;
        
    
    // There are no traditional axes on a funnel chart.  We just need to provide
    // dummy objects with properties so the plot will render.
    // called with scope of axis object.
    $.jqplot.FunnelAxisRenderer.prototype.init = function(options){
        //
        this.tickRenderer = $.jqplot.FunnelTickRenderer;
        $.extend(true, this, options);
        // I don't think I'm going to need _dataBounds here.
        // have to go Axis scaling in a way to fit chart onto plot area
        // and provide u2p and p2u functionality for mouse cursor, etc.
        // for convienence set _dataBounds to 0 and 100 and
        // set min/max to 0 and 100.
        this._dataBounds = {min:0, max:100};
        this.min = 0;
        this.max = 100;
        this.showTicks = false;
        this.ticks = [];
        this.showMark = false;
        this.show = false; 
    };
    
    
    
    /**
     * Class: $.jqplot.FunnelLegendRenderer
     * Legend Renderer specific to funnel plots.  Set by default
     * when the user creates a funnel plot.
     */
    $.jqplot.FunnelLegendRenderer = function(){
        $.jqplot.TableLegendRenderer.call(this);
    };
    
    $.jqplot.FunnelLegendRenderer.prototype = new $.jqplot.TableLegendRenderer();
    $.jqplot.FunnelLegendRenderer.prototype.constructor = $.jqplot.FunnelLegendRenderer;
    
    $.jqplot.FunnelLegendRenderer.prototype.init = function(options) {
        // Group: Properties
        //
        // prop: numberRows
        // Maximum number of rows in the legend.  0 or null for unlimited.
        this.numberRows = null;
        // prop: numberColumns
        // Maximum number of columns in the legend.  0 or null for unlimited.
        this.numberColumns = null;
        $.extend(true, this, options);
    };
    
    // called with context of legend
    $.jqplot.FunnelLegendRenderer.prototype.draw = function() {
        var legend = this;
        if (this.show) {
            var series = this._series;
            var ss = 'position:absolute;';
            ss += (this.background) ? 'background:'+this.background+';' : '';
            ss += (this.border) ? 'border:'+this.border+';' : '';
            ss += (this.fontSize) ? 'font-size:'+this.fontSize+';' : '';
            ss += (this.fontFamily) ? 'font-family:'+this.fontFamily+';' : '';
            ss += (this.textColor) ? 'color:'+this.textColor+';' : '';
            ss += (this.marginTop != null) ? 'margin-top:'+this.marginTop+';' : '';
            ss += (this.marginBottom != null) ? 'margin-bottom:'+this.marginBottom+';' : '';
            ss += (this.marginLeft != null) ? 'margin-left:'+this.marginLeft+';' : '';
            ss += (this.marginRight != null) ? 'margin-right:'+this.marginRight+';' : '';
            this._elem = $('<table class="jqplot-table-legend" style="'+ss+'"></table>');
            // Funnel charts legends don't go by number of series, but by number of data points
            // in the series.  Refactor things here for that.
            
            var pad = false, 
                reverse = false,
                nr, nc;
            var s = series[0];
            var colorGenerator = new $.jqplot.ColorGenerator(s.seriesColors);
            
            if (s.show) {
                var pd = s.data;
                if (this.numberRows) {
                    nr = this.numberRows;
                    if (!this.numberColumns){
                        nc = Math.ceil(pd.length/nr);
                    }
                    else{
                        nc = this.numberColumns;
                    }
                }
                else if (this.numberColumns) {
                    nc = this.numberColumns;
                    nr = Math.ceil(pd.length/this.numberColumns);
                }
                else {
                    nr = pd.length;
                    nc = 1;
                }
                
                var i, j, tr, td1, td2, lt, rs, color;
                var idx = 0;    
                
                for (i=0; i<nr; i++) {
                    if (reverse){
                        tr = $('<tr class="jqplot-table-legend"></tr>').prependTo(this._elem);
                    }
                    else{
                        tr = $('<tr class="jqplot-table-legend"></tr>').appendTo(this._elem);
                    }
                    for (j=0; j<nc; j++) {
                        if (idx < pd.length){
                            lt = this.labels[idx] || pd[idx][0].toString();
                            color = colorGenerator.next();
                            if (!reverse){
                                if (i>0){
                                    pad = true;
                                }
                                else{
                                    pad = false;
                                }
                            }
                            else{
                                if (i == nr -1){
                                    pad = false;
                                }
                                else{
                                    pad = true;
                                }
                            }
                            rs = (pad) ? this.rowSpacing : '0';
                
                            td1 = $('<td class="jqplot-table-legend" style="text-align:center;padding-top:'+rs+';">'+
                                '<div><div class="jqplot-table-legend-swatch" style="border-color:'+color+';"></div>'+
                                '</div></td>');
                            td2 = $('<td class="jqplot-table-legend" style="padding-top:'+rs+';"></td>');
                            if (this.escapeHtml){
                                td2.text(lt);
                            }
                            else {
                                td2.html(lt);
                            }
                            if (reverse) {
                                td2.prependTo(tr);
                                td1.prependTo(tr);
                            }
                            else {
                                td1.appendTo(tr);
                                td2.appendTo(tr);
                            }
                            pad = true;
                        }
                        idx++;
                    }   
                }
            }
        }
        return this._elem;                
    };
    
    // $.jqplot.FunnelLegendRenderer.prototype.pack = function(offsets) {
    //     if (this.show) {
    //         // fake a grid for positioning
    //         var grid = {_top:offsets.top, _left:offsets.left, _right:offsets.right, _bottom:this._plotDimensions.height - offsets.bottom};        
    //         if (this.placement == 'insideGrid') {
    //             switch (this.location) {
    //                 case 'nw':
    //                     var a = grid._left + this.xoffset;
    //                     var b = grid._top + this.yoffset;
    //                     this._elem.css('left', a);
    //                     this._elem.css('top', b);
    //                     break;
    //                 case 'n':
    //                     var a = (offsets.left + (this._plotDimensions.width - offsets.right))/2 - this.getWidth()/2;
    //                     var b = grid._top + this.yoffset;
    //                     this._elem.css('left', a);
    //                     this._elem.css('top', b);
    //                     break;
    //                 case 'ne':
    //                     var a = offsets.right + this.xoffset;
    //                     var b = grid._top + this.yoffset;
    //                     this._elem.css({right:a, top:b});
    //                     break;
    //                 case 'e':
    //                     var a = offsets.right + this.xoffset;
    //                     var b = (offsets.top + (this._plotDimensions.height - offsets.bottom))/2 - this.getHeight()/2;
    //                     this._elem.css({right:a, top:b});
    //                     break;
    //                 case 'se':
    //                     var a = offsets.right + this.xoffset;
    //                     var b = offsets.bottom + this.yoffset;
    //                     this._elem.css({right:a, bottom:b});
    //                     break;
    //                 case 's':
    //                     var a = (offsets.left + (this._plotDimensions.width - offsets.right))/2 - this.getWidth()/2;
    //                     var b = offsets.bottom + this.yoffset;
    //                     this._elem.css({left:a, bottom:b});
    //                     break;
    //                 case 'sw':
    //                     var a = grid._left + this.xoffset;
    //                     var b = offsets.bottom + this.yoffset;
    //                     this._elem.css({left:a, bottom:b});
    //                     break;
    //                 case 'w':
    //                     var a = grid._left + this.xoffset;
    //                     var b = (offsets.top + (this._plotDimensions.height - offsets.bottom))/2 - this.getHeight()/2;
    //                     this._elem.css({left:a, top:b});
    //                     break;
    //                 default:  // same as 'se'
    //                     var a = grid._right - this.xoffset;
    //                     var b = grid._bottom + this.yoffset;
    //                     this._elem.css({right:a, bottom:b});
    //                     break;
    //             }
    //             
    //         }
    //         else {
    //             switch (this.location) {
    //                 case 'nw':
    //                     var a = this._plotDimensions.width - grid._left + this.xoffset;
    //                     var b = grid._top + this.yoffset;
    //                     this._elem.css('right', a);
    //                     this._elem.css('top', b);
    //                     break;
    //                 case 'n':
    //                     var a = (offsets.left + (this._plotDimensions.width - offsets.right))/2 - this.getWidth()/2;
    //                     var b = this._plotDimensions.height - grid._top + this.yoffset;
    //                     this._elem.css('left', a);
    //                     this._elem.css('bottom', b);
    //                     break;
    //                 case 'ne':
    //                     var a = this._plotDimensions.width - offsets.right + this.xoffset;
    //                     var b = grid._top + this.yoffset;
    //                     this._elem.css({left:a, top:b});
    //                     break;
    //                 case 'e':
    //                     var a = this._plotDimensions.width - offsets.right + this.xoffset;
    //                     var b = (offsets.top + (this._plotDimensions.height - offsets.bottom))/2 - this.getHeight()/2;
    //                     this._elem.css({left:a, top:b});
    //                     break;
    //                 case 'se':
    //                     var a = this._plotDimensions.width - offsets.right + this.xoffset;
    //                     var b = offsets.bottom + this.yoffset;
    //                     this._elem.css({left:a, bottom:b});
    //                     break;
    //                 case 's':
    //                     var a = (offsets.left + (this._plotDimensions.width - offsets.right))/2 - this.getWidth()/2;
    //                     var b = this._plotDimensions.height - offsets.bottom + this.yoffset;
    //                     this._elem.css({left:a, top:b});
    //                     break;
    //                 case 'sw':
    //                     var a = this._plotDimensions.width - grid._left + this.xoffset;
    //                     var b = offsets.bottom + this.yoffset;
    //                     this._elem.css({right:a, bottom:b});
    //                     break;
    //                 case 'w':
    //                     var a = this._plotDimensions.width - grid._left + this.xoffset;
    //                     var b = (offsets.top + (this._plotDimensions.height - offsets.bottom))/2 - this.getHeight()/2;
    //                     this._elem.css({right:a, top:b});
    //                     break;
    //                 default:  // same as 'se'
    //                     var a = grid._right - this.xoffset;
    //                     var b = grid._bottom + this.yoffset;
    //                     this._elem.css({right:a, bottom:b});
    //                     break;
    //             }
    //         }
    //     } 
    // };
    
    // setup default renderers for axes and legend so user doesn't have to
    // called with scope of plot
    function preInit(target, data, options) {
        options = options || {};
        options.axesDefaults = options.axesDefaults || {};
        options.legend = options.legend || {};
        options.seriesDefaults = options.seriesDefaults || {};
        // only set these if there is a funnel series
        var setopts = false;
        if (options.seriesDefaults.renderer == $.jqplot.FunnelRenderer) {
            setopts = true;
        }
        else if (options.series) {
            for (var i=0; i < options.series.length; i++) {
                if (options.series[i].renderer == $.jqplot.FunnelRenderer) {
                    setopts = true;
                }
            }
        }
        
        if (setopts) {
            options.axesDefaults.renderer = $.jqplot.FunnelAxisRenderer;
            options.legend.renderer = $.jqplot.FunnelLegendRenderer;
            options.legend.preDraw = true;
            options.sortData = false;
            options.seriesDefaults.pointLabels = {show: false};
        }
    }
    
    function postInit(target, data, options) {
        // if multiple series, add a reference to the previous one so that
        // funnel rings can nest.
        for (var i=0; i<this.series.length; i++) {
            if (this.series[i].renderer.constructor == $.jqplot.FunnelRenderer) {
                // don't allow mouseover and mousedown at same time.
                if (this.series[i].highlightMouseOver) {
                    this.series[i].highlightMouseDown = false;
                }
            }
        }
    }
    
    // called with scope of plot
    function postParseOptions(options) {
        for (var i=0; i<this.series.length; i++) {
            this.series[i].seriesColors = this.seriesColors;
            this.series[i].colorGenerator = $.jqplot.colorGenerator;
        }
    }
    
    function highlight (plot, sidx, pidx) {
        var s = plot.series[sidx];
        var canvas = plot.plugins.funnelRenderer.highlightCanvas;
        canvas._ctx.clearRect(0,0,canvas._ctx.canvas.width, canvas._ctx.canvas.height);
        s._highlightedPoint = pidx;
        plot.plugins.funnelRenderer.highlightedSeriesIndex = sidx;
        s.renderer.drawSection.call(s, canvas._ctx, s._vertices[pidx], s.highlightColors[pidx], false);
    }
    
    function unhighlight (plot) {
        var canvas = plot.plugins.funnelRenderer.highlightCanvas;
        canvas._ctx.clearRect(0,0, canvas._ctx.canvas.width, canvas._ctx.canvas.height);
        for (var i=0; i<plot.series.length; i++) {
            plot.series[i]._highlightedPoint = null;
        }
        plot.plugins.funnelRenderer.highlightedSeriesIndex = null;
        plot.target.trigger('jqplotDataUnhighlight');
    }
    
    function handleMove(ev, gridpos, datapos, neighbor, plot) {
        if (neighbor) {
            var ins = [neighbor.seriesIndex, neighbor.pointIndex, neighbor.data];
            var evt1 = jQuery.Event('jqplotDataMouseOver');
            evt1.pageX = ev.pageX;
            evt1.pageY = ev.pageY;
            plot.target.trigger(evt1, ins);
            if (plot.series[ins[0]].highlightMouseOver && !(ins[0] == plot.plugins.funnelRenderer.highlightedSeriesIndex && ins[1] == plot.series[ins[0]]._highlightedPoint)) {
                var evt = jQuery.Event('jqplotDataHighlight');
                evt.which = ev.which;
                evt.pageX = ev.pageX;
                evt.pageY = ev.pageY;
                plot.target.trigger(evt, ins);
                highlight (plot, ins[0], ins[1]);
            }
        }
        else if (neighbor == null) {
            unhighlight (plot);
        }
    }
    
    function handleMouseDown(ev, gridpos, datapos, neighbor, plot) {
        if (neighbor) {
            var ins = [neighbor.seriesIndex, neighbor.pointIndex, neighbor.data];
            if (plot.series[ins[0]].highlightMouseDown && !(ins[0] == plot.plugins.funnelRenderer.highlightedSeriesIndex && ins[1] == plot.series[ins[0]]._highlightedPoint)) {
                var evt = jQuery.Event('jqplotDataHighlight');
                evt.which = ev.which;
                evt.pageX = ev.pageX;
                evt.pageY = ev.pageY;
                plot.target.trigger(evt, ins);
                highlight (plot, ins[0], ins[1]);
            }
        }
        else if (neighbor == null) {
            unhighlight (plot);
        }
    }
    
    function handleMouseUp(ev, gridpos, datapos, neighbor, plot) {
        var idx = plot.plugins.funnelRenderer.highlightedSeriesIndex;
        if (idx != null && plot.series[idx].highlightMouseDown) {
            unhighlight(plot);
        }
    }
    
    function handleClick(ev, gridpos, datapos, neighbor, plot) {
        if (neighbor) {
            var ins = [neighbor.seriesIndex, neighbor.pointIndex, neighbor.data];
            var evt = jQuery.Event('jqplotDataClick');
            evt.which = ev.which;
            evt.pageX = ev.pageX;
            evt.pageY = ev.pageY;
            plot.target.trigger(evt, ins);
        }
    }
    
    function handleRightClick(ev, gridpos, datapos, neighbor, plot) {
        if (neighbor) {
            var ins = [neighbor.seriesIndex, neighbor.pointIndex, neighbor.data];
            var idx = plot.plugins.funnelRenderer.highlightedSeriesIndex;
            if (idx != null && plot.series[idx].highlightMouseDown) {
                unhighlight(plot);
            }
            var evt = jQuery.Event('jqplotDataRightClick');
            evt.which = ev.which;
            evt.pageX = ev.pageX;
            evt.pageY = ev.pageY;
            plot.target.trigger(evt, ins);
        }
    }
    
    // called within context of plot
    // create a canvas which we can draw on.
    // insert it before the eventCanvas, so eventCanvas will still capture events.
    function postPlotDraw() {
        // Memory Leaks patch    
        if (this.plugins.funnelRenderer && this.plugins.funnelRenderer.highlightCanvas) {
            this.plugins.funnelRenderer.highlightCanvas.resetCanvas();
            this.plugins.funnelRenderer.highlightCanvas = null;
        }

        this.plugins.funnelRenderer = {};
        this.plugins.funnelRenderer.highlightCanvas = new $.jqplot.GenericCanvas();
        
        // do we have any data labels?  if so, put highlight canvas before those
        var labels = $(this.targetId+' .jqplot-data-label');
        if (labels.length) {
            $(labels[0]).before(this.plugins.funnelRenderer.highlightCanvas.createElement(this._gridPadding, 'jqplot-funnelRenderer-highlight-canvas', this._plotDimensions, this));
        }
        // else put highlight canvas before event canvas.
        else {
            this.eventCanvas._elem.before(this.plugins.funnelRenderer.highlightCanvas.createElement(this._gridPadding, 'jqplot-funnelRenderer-highlight-canvas', this._plotDimensions, this));
        }
        var hctx = this.plugins.funnelRenderer.highlightCanvas.setContext();
        this.eventCanvas._elem.bind('mouseleave', {plot:this}, function (ev) { unhighlight(ev.data.plot); });
    }
    
    $.jqplot.preInitHooks.push(preInit);
    
    $.jqplot.FunnelTickRenderer = function() {
        $.jqplot.AxisTickRenderer.call(this);
    };
    
    $.jqplot.FunnelTickRenderer.prototype = new $.jqplot.AxisTickRenderer();
    $.jqplot.FunnelTickRenderer.prototype.constructor = $.jqplot.FunnelTickRenderer;
    
})(jQuery);
    
    
/**
 * jqPlot
 * Pure JavaScript plotting plugin using jQuery
 *
 * Version: @VERSION
 * Revision: @REVISION
 *
 * Copyright (c) 2009-2013 Chris Leonello
 * jqPlot is currently available for use in all personal or commercial projects 
 * under both the MIT (http://www.opensource.org/licenses/mit-license.php) and GPL 
 * version 2.0 (http://www.gnu.org/licenses/gpl-2.0.html) licenses. This means that you can 
 * choose the license that best suits your project and use it accordingly. 
 *
 * Although not required, the author would appreciate an email letting him 
 * know of any substantial use of jqPlot.  You can reach the author at: 
 * chris at jqplot dot com or see http://www.jqplot.com/info.php .
 *
 * If you are feeling kind and generous, consider supporting the project by
 * making a donation at: http://www.jqplot.com/donate.php .
 *
 * sprintf functions contained in jqplot.sprintf.js by Ash Searle:
 *
 *     version 2007.04.27
 *     author Ash Searle
 *     http://hexmen.com/blog/2007/03/printf-sprintf/
 *     http://hexmen.com/js/sprintf.js
 *     The author (Ash Searle) has placed this code in the public domain:
 *     "This code is unrestricted: you are free to use it however you like."
 * 
 */
(function($) {
    /**
     * Class: $.jqplot.PieRenderer
     * Plugin renderer to draw a pie chart.
     * x values, if present, will be used as slice labels.
     * y values give slice size.
     * 
     * To use this renderer, you need to include the 
     * pie renderer plugin, for example:
     * 
     * > <script type="text/javascript" src="plugins/jqplot.pieRenderer.js"></script>
     * 
     * Properties described here are passed into the $.jqplot function
     * as options on the series renderer.  For example:
     * 
     * > plot2 = $.jqplot('chart2', [s1, s2], {
     * >     seriesDefaults: {
     * >         renderer:$.jqplot.PieRenderer,
     * >         rendererOptions:{
     * >              sliceMargin: 2,
     * >              startAngle: -90
     * >          }
     * >      }
     * > });
     * 
     * A pie plot will trigger events on the plot target
     * according to user interaction.  All events return the event object,
     * the series index, the point (slice) index, and the point data for 
     * the appropriate slice.
     * 
     * 'jqplotDataMouseOver' - triggered when user mouseing over a slice.
     * 'jqplotDataHighlight' - triggered the first time user mouses over a slice,
     * if highlighting is enabled.
     * 'jqplotDataUnhighlight' - triggered when a user moves the mouse out of
     * a highlighted slice.
     * 'jqplotDataClick' - triggered when the user clicks on a slice.
     * 'jqplotDataRightClick' - tiggered when the user right clicks on a slice if
     * the "captureRightClick" option is set to true on the plot.
     */
    $.jqplot.PieRenderer = function(){
        $.jqplot.LineRenderer.call(this);
    };
    
    $.jqplot.PieRenderer.prototype = new $.jqplot.LineRenderer();
    $.jqplot.PieRenderer.prototype.constructor = $.jqplot.PieRenderer;
    
    // called with scope of a series
    $.jqplot.PieRenderer.prototype.init = function(options, plot) {
        // Group: Properties
        //
        // prop: diameter
        // Outer diameter of the pie, auto computed by default
        this.diameter = null;
        // prop: padding
        // padding between the pie and plot edges, legend, etc.
        this.padding = 20;
        // prop: sliceMargin
        // angular spacing between pie slices in degrees.
        this.sliceMargin = 0;
        // prop: fill
        // true or false, whether to fil the slices.
        this.fill = true;
        // prop: shadowOffset
        // offset of the shadow from the slice and offset of 
        // each succesive stroke of the shadow from the last.
        this.shadowOffset = 2;
        // prop: shadowAlpha
        // transparency of the shadow (0 = transparent, 1 = opaque)
        this.shadowAlpha = 0.07;
        // prop: shadowDepth
        // number of strokes to apply to the shadow, 
        // each stroke offset shadowOffset from the last.
        this.shadowDepth = 5;
        // prop: highlightMouseOver
        // True to highlight slice when moused over.
        // This must be false to enable highlightMouseDown to highlight when clicking on a slice.
        this.highlightMouseOver = true;
        // prop: highlightMouseDown
        // True to highlight when a mouse button is pressed over a slice.
        // This will be disabled if highlightMouseOver is true.
        this.highlightMouseDown = false;
        // prop: highlightColors
        // an array of colors to use when highlighting a slice.
        this.highlightColors = [];
        // prop: dataLabels
        // Either 'label', 'value', 'percent' or an array of labels to place on the pie slices.
        // Defaults to percentage of each pie slice.
        this.dataLabels = 'percent';
        // prop: showDataLabels
        // true to show data labels on slices.
        this.showDataLabels = false;
        // prop: dataLabelFormatString
        // Format string for data labels.  If none, '%s' is used for "label" and for arrays, '%d' for value and '%d%%' for percentage.
        this.dataLabelFormatString = null;
        // prop: dataLabelThreshold
        // Threshhold in percentage (0-100) of pie area, below which no label will be displayed.
        // This applies to all label types, not just to percentage labels.
        this.dataLabelThreshold = 3;
        // prop: dataLabelPositionFactor
        // A Multiplier (0-1) of the pie radius which controls position of label on slice.
        // Increasing will slide label toward edge of pie, decreasing will slide label toward center of pie.
        this.dataLabelPositionFactor = 0.52;
        // prop: dataLabelNudge
        // Number of pixels to slide the label away from (+) or toward (-) the center of the pie.
        this.dataLabelNudge = 2;
        // prop: dataLabelCenterOn
        // True to center the data label at its position.
        // False to set the inside facing edge of the label at its position.
        this.dataLabelCenterOn = true;
        // prop: startAngle
        // Angle to start drawing pie in degrees.  
        // According to orientation of canvas coordinate system:
        // 0 = on the positive x axis
        // -90 = on the positive y axis.
        // 90 = on the negaive y axis.
        // 180 or - 180 = on the negative x axis.
        this.startAngle = 0;
        this.tickRenderer = $.jqplot.PieTickRenderer;
        // Used as check for conditions where pie shouldn't be drawn.
        this._drawData = true;
        this._type = 'pie';
        
        // if user has passed in highlightMouseDown option and not set highlightMouseOver, disable highlightMouseOver
        if (options.highlightMouseDown && options.highlightMouseOver == null) {
            options.highlightMouseOver = false;
        }
        
        $.extend(true, this, options);

        if (this.sliceMargin < 0) {
            this.sliceMargin = 0;
        }

        this._diameter = null;
        this._radius = null;
        // array of [start,end] angles arrays, one for each slice.  In radians.
        this._sliceAngles = [];
        // index of the currenty highlighted point, if any
        this._highlightedPoint = null;
        
        // set highlight colors if none provided
        if (this.highlightColors.length == 0) {
            for (var i=0; i<this.seriesColors.length; i++){
                var rgba = $.jqplot.getColorComponents(this.seriesColors[i]);
                var newrgb = [rgba[0], rgba[1], rgba[2]];
                var sum = newrgb[0] + newrgb[1] + newrgb[2];
                for (var j=0; j<3; j++) {
                    // when darkening, lowest color component can be is 60.
                    newrgb[j] = (sum > 570) ?  newrgb[j] * 0.8 : newrgb[j] + 0.3 * (255 - newrgb[j]);
                    newrgb[j] = parseInt(newrgb[j], 10);
                }
                this.highlightColors.push('rgb('+newrgb[0]+','+newrgb[1]+','+newrgb[2]+')');
            }
        }
        
        this.highlightColorGenerator = new $.jqplot.ColorGenerator(this.highlightColors);
        
        plot.postParseOptionsHooks.addOnce(postParseOptions);
        plot.postInitHooks.addOnce(postInit);
        plot.eventListenerHooks.addOnce('jqplotMouseMove', handleMove);
        plot.eventListenerHooks.addOnce('jqplotMouseDown', handleMouseDown);
        plot.eventListenerHooks.addOnce('jqplotMouseUp', handleMouseUp);
        plot.eventListenerHooks.addOnce('jqplotClick', handleClick);
        plot.eventListenerHooks.addOnce('jqplotRightClick', handleRightClick);
        plot.postDrawHooks.addOnce(postPlotDraw);
    };
    
    $.jqplot.PieRenderer.prototype.setGridData = function(plot) {
        // set gridData property.  This will hold angle in radians of each data point.
        var stack = [];
        var td = [];
        var sa = this.startAngle/180*Math.PI;
        var tot = 0;
        // don't know if we have any valid data yet, so set plot to not draw.
        this._drawData = false;
        for (var i=0; i<this.data.length; i++){
            if (this.data[i][1] != 0) {
                // we have data, O.K. to draw.
                this._drawData = true;
            }
            stack.push(this.data[i][1]);
            td.push([this.data[i][0]]);
            if (i>0) {
                stack[i] += stack[i-1];
            }
            tot += this.data[i][1];
        }
        var fact = Math.PI*2/stack[stack.length - 1];
        
        for (var i=0; i<stack.length; i++) {
            td[i][1] = stack[i] * fact;
            td[i][2] = this.data[i][1]/tot;
        }
        this.gridData = td;
    };
    
    $.jqplot.PieRenderer.prototype.makeGridData = function(data, plot) {
        var stack = [];
        var td = [];
        var tot = 0;
        var sa = this.startAngle/180*Math.PI;
        // don't know if we have any valid data yet, so set plot to not draw.
        this._drawData = false;
        for (var i=0; i<data.length; i++){
            if (this.data[i][1] != 0) {
                // we have data, O.K. to draw.
                this._drawData = true;
            }
            stack.push(data[i][1]);
            td.push([data[i][0]]);
            if (i>0) {
                stack[i] += stack[i-1];
            }
            tot += data[i][1];
        }
        var fact = Math.PI*2/stack[stack.length - 1];
        
        for (var i=0; i<stack.length; i++) {
            td[i][1] = stack[i] * fact;
            td[i][2] = data[i][1]/tot;
        }
        return td;
    };

    function calcRadiusAdjustment(ang) {
        return Math.sin((ang - (ang-Math.PI) / 8 / Math.PI )/2.0);
    }

    function calcRPrime(ang1, ang2, sliceMargin, fill, lineWidth) {
        var rprime = 0;
        var ang = ang2 - ang1;
        var absang = Math.abs(ang);
        var sm = sliceMargin;
        if (fill == false) {
            sm += lineWidth;
        }

        if (sm > 0 && absang > 0.01 && absang < 6.282) {
            rprime = parseFloat(sm) / 2.0 / calcRadiusAdjustment(ang);
        }

        return rprime;
    }
    
    $.jqplot.PieRenderer.prototype.drawSlice = function (ctx, ang1, ang2, color, isShadow) {
        if (this._drawData) {
            var r = this._radius;
            var fill = this.fill;
            var lineWidth = this.lineWidth;
            var sm = this.sliceMargin;
            if (this.fill == false) {
                sm += this.lineWidth;
            }
            ctx.save();
            ctx.translate(this._center[0], this._center[1]);
            
            var rprime = calcRPrime(ang1, ang2, this.sliceMargin, this.fill, this.lineWidth);

            var transx = rprime * Math.cos((ang1 + ang2) / 2.0);
            var transy = rprime * Math.sin((ang1 + ang2) / 2.0);

            if ((ang2 - ang1) <= Math.PI) {
                r -= rprime;  
            }
            else {
                r += rprime;
            }

            ctx.translate(transx, transy);
            
            if (isShadow) {
                for (var i=0, l=this.shadowDepth; i<l; i++) {
                    ctx.save();
                    ctx.translate(this.shadowOffset*Math.cos(this.shadowAngle/180*Math.PI), this.shadowOffset*Math.sin(this.shadowAngle/180*Math.PI));
                    doDraw(r);
                }
                for (var i=0, l=this.shadowDepth; i<l; i++) {
                    ctx.restore();
                }
            }
    
            else {
                doDraw(r);
            }
            ctx.restore();
        }
    
        function doDraw (rad) {
            // Fix for IE and Chrome that can't seem to draw circles correctly.
            // ang2 should always be <= 2 pi since that is the way the data is converted.
            // 2Pi = 6.2831853, Pi = 3.1415927
             if (ang2 > 6.282 + this.startAngle) {
                ang2 = 6.282 + this.startAngle;
                if (ang1 > ang2) {
                    ang1 = 6.281 + this.startAngle;
                }
            }
            // Fix for IE, where it can't seem to handle 0 degree angles.  Also avoids
            // ugly line on unfilled pies.
            if (ang1 >= ang2) {
                return;
            }            
        
            ctx.beginPath();  
            ctx.fillStyle = color;
            ctx.strokeStyle = color;
            ctx.lineWidth = lineWidth;
            ctx.arc(0, 0, rad, ang1, ang2, false);
            ctx.lineTo(0,0);
            ctx.closePath();
        
            if (fill) {
                ctx.fill();
            }
            else {
                ctx.stroke();
            }
        }
    };
    
    // called with scope of series
    $.jqplot.PieRenderer.prototype.draw = function (ctx, gd, options, plot) {
        var i;
        var opts = (options != undefined) ? options : {};
        // offset and direction of offset due to legend placement
        var offx = 0;
        var offy = 0;
        var trans = 1;
        var colorGenerator = new $.jqplot.ColorGenerator(this.seriesColors);
        if (options.legendInfo && options.legendInfo.placement == 'insideGrid') {
            var li = options.legendInfo;
            switch (li.location) {
                case 'nw':
                    offx = li.width + li.xoffset;
                    break;
                case 'w':
                    offx = li.width + li.xoffset;
                    break;
                case 'sw':
                    offx = li.width + li.xoffset;
                    break;
                case 'ne':
                    offx = li.width + li.xoffset;
                    trans = -1;
                    break;
                case 'e':
                    offx = li.width + li.xoffset;
                    trans = -1;
                    break;
                case 'se':
                    offx = li.width + li.xoffset;
                    trans = -1;
                    break;
                case 'n':
                    offy = li.height + li.yoffset;
                    break;
                case 's':
                    offy = li.height + li.yoffset;
                    trans = -1;
                    break;
                default:
                    break;
            }
        }
        
        var shadow = (opts.shadow != undefined) ? opts.shadow : this.shadow;
        var fill = (opts.fill != undefined) ? opts.fill : this.fill;
        var cw = ctx.canvas.width;
        var ch = ctx.canvas.height;
        var w = cw - offx - 2 * this.padding;
        var h = ch - offy - 2 * this.padding;
        var mindim = Math.min(w,h);
        var d = mindim;
        
        // Fixes issue #272.  Thanks hugwijst!
        // reset slice angles array.
        this._sliceAngles = [];

        var sm = this.sliceMargin;
        if (this.fill == false) {
            sm += this.lineWidth;
        }
        
        var rprime;
        var maxrprime = 0;

        var ang, ang1, ang2, shadowColor;
        var sa = this.startAngle / 180 * Math.PI;

        // have to pre-draw shadows, so loop throgh here and calculate some values also.
        for (var i=0, l=gd.length; i<l; i++) {
            ang1 = (i == 0) ? sa : gd[i-1][1] + sa;
            ang2 = gd[i][1] + sa;

            this._sliceAngles.push([ang1, ang2]);

            rprime = calcRPrime(ang1, ang2, this.sliceMargin, this.fill, this.lineWidth);

            if (Math.abs(ang2-ang1) > Math.PI) {
                maxrprime = Math.max(rprime, maxrprime);  
            }
        }

        if (this.diameter != null && this.diameter > 0) {
            this._diameter = this.diameter - 2*maxrprime;
        }
        else {
            this._diameter = d - 2*maxrprime;
        }

        // Need to check for undersized pie.  This can happen if
        // plot area too small and legend is too big.
        if (this._diameter < 6) {
            $.jqplot.log('Diameter of pie too small, not rendering.');
            return;
        }

        var r = this._radius = this._diameter/2;

        this._center = [(cw - trans * offx)/2 + trans * offx + maxrprime * Math.cos(sa), (ch - trans*offy)/2 + trans * offy + maxrprime * Math.sin(sa)];

        if (this.shadow) {
            for (var i=0, l=gd.length; i<l; i++) {
                shadowColor = 'rgba(0,0,0,'+this.shadowAlpha+')';
                this.renderer.drawSlice.call (this, ctx, this._sliceAngles[i][0], this._sliceAngles[i][1], shadowColor, true);
            }
        }
        
        for (var i=0; i<gd.length; i++) {
                      
            this.renderer.drawSlice.call (this, ctx, this._sliceAngles[i][0], this._sliceAngles[i][1], colorGenerator.next(), false);
        
            if (this.showDataLabels && gd[i][2]*100 >= this.dataLabelThreshold) {
                var fstr, avgang = (this._sliceAngles[i][0] + this._sliceAngles[i][1])/2, label;
            
                if (this.dataLabels == 'label') {
                    fstr = this.dataLabelFormatString || '%s';
                    label = $.jqplot.sprintf(fstr, gd[i][0]);
                }
                else if (this.dataLabels == 'value') {
                    fstr = this.dataLabelFormatString || '%d';
                    label = $.jqplot.sprintf(fstr, this.data[i][1]);
                }
                else if (this.dataLabels == 'percent') {
                    fstr = this.dataLabelFormatString || '%d%%';
                    label = $.jqplot.sprintf(fstr, gd[i][2]*100);
                }
                else if (this.dataLabels.constructor == Array) {
                    fstr = this.dataLabelFormatString || '%s';
                    label = $.jqplot.sprintf(fstr, this.dataLabels[i]);
                }
            
                var fact = (this._radius ) * this.dataLabelPositionFactor + this.sliceMargin + this.dataLabelNudge;
            
                var x = this._center[0] + Math.cos(avgang) * fact + this.canvas._offsets.left;
                var y = this._center[1] + Math.sin(avgang) * fact + this.canvas._offsets.top;
            
                var labelelem = $('<div class="jqplot-pie-series jqplot-data-label" style="position:absolute;">' + label + '</div>').insertBefore(plot.eventCanvas._elem);
                if (this.dataLabelCenterOn) {
                    x -= labelelem.width()/2;
                    y -= labelelem.height()/2;
                }
                else {
                    x -= labelelem.width() * Math.sin(avgang/2);
                    y -= labelelem.height()/2;
                }
                x = Math.round(x);
                y = Math.round(y);
                labelelem.css({left: x, top: y});
            }
        }            
    };
    
    $.jqplot.PieAxisRenderer = function() {
        $.jqplot.LinearAxisRenderer.call(this);
    };
    
    $.jqplot.PieAxisRenderer.prototype = new $.jqplot.LinearAxisRenderer();
    $.jqplot.PieAxisRenderer.prototype.constructor = $.jqplot.PieAxisRenderer;
        
    
    // There are no traditional axes on a pie chart.  We just need to provide
    // dummy objects with properties so the plot will render.
    // called with scope of axis object.
    $.jqplot.PieAxisRenderer.prototype.init = function(options){
        //
        this.tickRenderer = $.jqplot.PieTickRenderer;
        $.extend(true, this, options);
        // I don't think I'm going to need _dataBounds here.
        // have to go Axis scaling in a way to fit chart onto plot area
        // and provide u2p and p2u functionality for mouse cursor, etc.
        // for convienence set _dataBounds to 0 and 100 and
        // set min/max to 0 and 100.
        this._dataBounds = {min:0, max:100};
        this.min = 0;
        this.max = 100;
        this.showTicks = false;
        this.ticks = [];
        this.showMark = false;
        this.show = false; 
    };
    
    
    
    
    $.jqplot.PieLegendRenderer = function(){
        $.jqplot.TableLegendRenderer.call(this);
    };
    
    $.jqplot.PieLegendRenderer.prototype = new $.jqplot.TableLegendRenderer();
    $.jqplot.PieLegendRenderer.prototype.constructor = $.jqplot.PieLegendRenderer;
    
    /**
     * Class: $.jqplot.PieLegendRenderer
     * Legend Renderer specific to pie plots.  Set by default
     * when user creates a pie plot.
     */
    $.jqplot.PieLegendRenderer.prototype.init = function(options) {
        // Group: Properties
        //
        // prop: numberRows
        // Maximum number of rows in the legend.  0 or null for unlimited.
        this.numberRows = null;
        // prop: numberColumns
        // Maximum number of columns in the legend.  0 or null for unlimited.
        this.numberColumns = null;
        $.extend(true, this, options);
    };
    
    // called with context of legend
    $.jqplot.PieLegendRenderer.prototype.draw = function() {
        var legend = this;
        if (this.show) {
            var series = this._series;


            this._elem = $(document.createElement('table'));
            this._elem.addClass('jqplot-table-legend');

            var ss = {position:'absolute'};
            if (this.background) {
                ss['background'] = this.background;
            }
            if (this.border) {
                ss['border'] = this.border;
            }
            if (this.fontSize) {
                ss['fontSize'] = this.fontSize;
            }
            if (this.fontFamily) {
                ss['fontFamily'] = this.fontFamily;
            }
            if (this.textColor) {
                ss['textColor'] = this.textColor;
            }
            if (this.marginTop != null) {
                ss['marginTop'] = this.marginTop;
            }
            if (this.marginBottom != null) {
                ss['marginBottom'] = this.marginBottom;
            }
            if (this.marginLeft != null) {
                ss['marginLeft'] = this.marginLeft;
            }
            if (this.marginRight != null) {
                ss['marginRight'] = this.marginRight;
            }

            this._elem.css(ss);

            // Pie charts legends don't go by number of series, but by number of data points
            // in the series.  Refactor things here for that.
            
            var pad = false, 
                reverse = false,
                nr, 
                nc;
            var s = series[0];
            var colorGenerator = new $.jqplot.ColorGenerator(s.seriesColors);
            
            if (s.show) {
                var pd = s.data;
                if (this.numberRows) {
                    nr = this.numberRows;
                    if (!this.numberColumns){
                        nc = Math.ceil(pd.length/nr);
                    }
                    else{
                        nc = this.numberColumns;
                    }
                }
                else if (this.numberColumns) {
                    nc = this.numberColumns;
                    nr = Math.ceil(pd.length/this.numberColumns);
                }
                else {
                    nr = pd.length;
                    nc = 1;
                }
                
                var i, j;
                var tr, td1, td2; 
                var lt, rs, color;
                var idx = 0; 
                var div0, div1;   
                
                for (i=0; i<nr; i++) {
                    tr = $(document.createElement('tr'));
                    tr.addClass('jqplot-table-legend');
                    
                    if (reverse){
                        tr.prependTo(this._elem);
                    }
                    
                    else{
                        tr.appendTo(this._elem);
                    }
                    
                    for (j=0; j<nc; j++) {
                        if (idx < pd.length){
                            lt = this.labels[idx] || pd[idx][0].toString();
                            color = colorGenerator.next();
                            if (!reverse){
                                if (i>0){
                                    pad = true;
                                }
                                else{
                                    pad = false;
                                }
                            }
                            else{
                                if (i == nr -1){
                                    pad = false;
                                }
                                else{
                                    pad = true;
                                }
                            }
                            rs = (pad) ? this.rowSpacing : '0';



                            td1 = $(document.createElement('td'));
                            td1.addClass('jqplot-table-legend jqplot-table-legend-swatch');
                            td1.css({textAlign: 'center', paddingTop: rs});

                            div0 = $(document.createElement('div'));
                            div0.addClass('jqplot-table-legend-swatch-outline');
                            div1 = $(document.createElement('div'));
                            div1.addClass('jqplot-table-legend-swatch');
                            div1.css({backgroundColor: color, borderColor: color});
                            td1.append(div0.append(div1));

                            td2 = $(document.createElement('td'));
                            td2.addClass('jqplot-table-legend jqplot-table-legend-label');
                            td2.css('paddingTop', rs);

                            if (this.escapeHtml){
                                td2.text(lt);
                            }
                            else {
                                td2.html(lt);
                            }
                            if (reverse) {
                                td2.prependTo(tr);
                                td1.prependTo(tr);
                            }
                            else {
                                td1.appendTo(tr);
                                td2.appendTo(tr);
                            }
                            pad = true;
                        }
                        idx++;
                    }   
                }
            }
        }
        return this._elem;                
    };
    
    $.jqplot.PieRenderer.prototype.handleMove = function(ev, gridpos, datapos, neighbor, plot) {
        if (neighbor) {
            var ins = [neighbor.seriesIndex, neighbor.pointIndex, neighbor.data];
            plot.target.trigger('jqplotDataMouseOver', ins);
            if (plot.series[ins[0]].highlightMouseOver && !(ins[0] == plot.plugins.pieRenderer.highlightedSeriesIndex && ins[1] == plot.series[ins[0]]._highlightedPoint)) {
                plot.target.trigger('jqplotDataHighlight', ins);
                highlight (plot, ins[0], ins[1]);
            }
        }
        else if (neighbor == null) {
            unhighlight (plot);
        }
    };
    
    
    // this.eventCanvas._elem.bind($.jqplot.eventListenerHooks[i][0], {plot:this}, $.jqplot.eventListenerHooks[i][1]);
    
    // setup default renderers for axes and legend so user doesn't have to
    // called with scope of plot
    function preInit(target, data, options) {
        options = options || {};
        options.axesDefaults = options.axesDefaults || {};
        options.legend = options.legend || {};
        options.seriesDefaults = options.seriesDefaults || {};
        // only set these if there is a pie series
        var setopts = false;
        if (options.seriesDefaults.renderer == $.jqplot.PieRenderer) {
            setopts = true;
        }
        else if (options.series) {
            for (var i=0; i < options.series.length; i++) {
                if (options.series[i].renderer == $.jqplot.PieRenderer) {
                    setopts = true;
                }
            }
        }
        
        if (setopts) {
            options.axesDefaults.renderer = $.jqplot.PieAxisRenderer;
            options.legend.renderer = $.jqplot.PieLegendRenderer;
            options.legend.preDraw = true;
            options.seriesDefaults.pointLabels = {show: false};
        }
    }
    
    function postInit(target, data, options) {
        for (var i=0; i<this.series.length; i++) {
            if (this.series[i].renderer.constructor == $.jqplot.PieRenderer) {
                // don't allow mouseover and mousedown at same time.
                if (this.series[i].highlightMouseOver) {
                    this.series[i].highlightMouseDown = false;
                }
            }
        }
    }
    
    // called with scope of plot
    function postParseOptions(options) {
        for (var i=0; i<this.series.length; i++) {
            this.series[i].seriesColors = this.seriesColors;
            this.series[i].colorGenerator = $.jqplot.colorGenerator;
        }
    }
    
    function highlight (plot, sidx, pidx) {
        var s = plot.series[sidx];
        var canvas = plot.plugins.pieRenderer.highlightCanvas;
        canvas._ctx.clearRect(0,0,canvas._ctx.canvas.width, canvas._ctx.canvas.height);
        s._highlightedPoint = pidx;
        plot.plugins.pieRenderer.highlightedSeriesIndex = sidx;
        s.renderer.drawSlice.call(s, canvas._ctx, s._sliceAngles[pidx][0], s._sliceAngles[pidx][1], s.highlightColorGenerator.get(pidx), false);
    }
    
    function unhighlight (plot) {
        var canvas = plot.plugins.pieRenderer.highlightCanvas;
        canvas._ctx.clearRect(0,0, canvas._ctx.canvas.width, canvas._ctx.canvas.height);
        for (var i=0; i<plot.series.length; i++) {
            plot.series[i]._highlightedPoint = null;
        }
        plot.plugins.pieRenderer.highlightedSeriesIndex = null;
        plot.target.trigger('jqplotDataUnhighlight');
    }
 
    function handleMove(ev, gridpos, datapos, neighbor, plot) {
        if (neighbor) {
            var ins = [neighbor.seriesIndex, neighbor.pointIndex, neighbor.data];
            var evt1 = jQuery.Event('jqplotDataMouseOver');
            evt1.pageX = ev.pageX;
            evt1.pageY = ev.pageY;
            plot.target.trigger(evt1, ins);
            if (plot.series[ins[0]].highlightMouseOver && !(ins[0] == plot.plugins.pieRenderer.highlightedSeriesIndex && ins[1] == plot.series[ins[0]]._highlightedPoint)) {
                var evt = jQuery.Event('jqplotDataHighlight');
                evt.which = ev.which;
                evt.pageX = ev.pageX;
                evt.pageY = ev.pageY;
                plot.target.trigger(evt, ins);
                highlight (plot, ins[0], ins[1]);
            }
        }
        else if (neighbor == null) {
            unhighlight (plot);
        }
    } 
    
    function handleMouseDown(ev, gridpos, datapos, neighbor, plot) {
        if (neighbor) {
            var ins = [neighbor.seriesIndex, neighbor.pointIndex, neighbor.data];
            if (plot.series[ins[0]].highlightMouseDown && !(ins[0] == plot.plugins.pieRenderer.highlightedSeriesIndex && ins[1] == plot.series[ins[0]]._highlightedPoint)) {
                var evt = jQuery.Event('jqplotDataHighlight');
                evt.which = ev.which;
                evt.pageX = ev.pageX;
                evt.pageY = ev.pageY;
                plot.target.trigger(evt, ins);
                highlight (plot, ins[0], ins[1]);
            }
        }
        else if (neighbor == null) {
            unhighlight (plot);
        }
    }
    
    function handleMouseUp(ev, gridpos, datapos, neighbor, plot) {
        var idx = plot.plugins.pieRenderer.highlightedSeriesIndex;
        if (idx != null && plot.series[idx].highlightMouseDown) {
            unhighlight(plot);
        }
    }
    
    function handleClick(ev, gridpos, datapos, neighbor, plot) {
        if (neighbor) {
            var ins = [neighbor.seriesIndex, neighbor.pointIndex, neighbor.data];
            var evt = jQuery.Event('jqplotDataClick');
            evt.which = ev.which;
            evt.pageX = ev.pageX;
            evt.pageY = ev.pageY;
            plot.target.trigger(evt, ins);
        }
    }
    
    function handleRightClick(ev, gridpos, datapos, neighbor, plot) {
        if (neighbor) {
            var ins = [neighbor.seriesIndex, neighbor.pointIndex, neighbor.data];
            var idx = plot.plugins.pieRenderer.highlightedSeriesIndex;
            if (idx != null && plot.series[idx].highlightMouseDown) {
                unhighlight(plot);
            }
            var evt = jQuery.Event('jqplotDataRightClick');
            evt.which = ev.which;
            evt.pageX = ev.pageX;
            evt.pageY = ev.pageY;
            plot.target.trigger(evt, ins);
        }
    }    
    
    // called within context of plot
    // create a canvas which we can draw on.
    // insert it before the eventCanvas, so eventCanvas will still capture events.
    function postPlotDraw() {
        // Memory Leaks patch    
        if (this.plugins.pieRenderer && this.plugins.pieRenderer.highlightCanvas) {
            this.plugins.pieRenderer.highlightCanvas.resetCanvas();
            this.plugins.pieRenderer.highlightCanvas = null;
        }

        this.plugins.pieRenderer = {highlightedSeriesIndex:null};
        this.plugins.pieRenderer.highlightCanvas = new $.jqplot.GenericCanvas();
        
        // do we have any data labels?  if so, put highlight canvas before those
        var labels = $(this.targetId+' .jqplot-data-label');
        if (labels.length) {
            $(labels[0]).before(this.plugins.pieRenderer.highlightCanvas.createElement(this._gridPadding, 'jqplot-pieRenderer-highlight-canvas', this._plotDimensions, this));
        }
        // else put highlight canvas before event canvas.
        else {
            this.eventCanvas._elem.before(this.plugins.pieRenderer.highlightCanvas.createElement(this._gridPadding, 'jqplot-pieRenderer-highlight-canvas', this._plotDimensions, this));
        }
        
        var hctx = this.plugins.pieRenderer.highlightCanvas.setContext();
        this.eventCanvas._elem.bind('mouseleave', {plot:this}, function (ev) { unhighlight(ev.data.plot); });
    }
    
    $.jqplot.preInitHooks.push(preInit);
    
    $.jqplot.PieTickRenderer = function() {
        $.jqplot.AxisTickRenderer.call(this);
    };
    
    $.jqplot.PieTickRenderer.prototype = new $.jqplot.AxisTickRenderer();
    $.jqplot.PieTickRenderer.prototype.constructor = $.jqplot.PieTickRenderer;
    
})(jQuery);
    
    