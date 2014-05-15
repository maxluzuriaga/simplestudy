var app = app || {};

app.NewGuideView = Backbone.View.extend({
	events: {
		"click a.new-button": "show",
		"click a.hide-form": "hide",
		"change input.guide-name": "nameChange",
		"click #new-section": "addSection",
		"submit form": "submit"
	},

	render: function(callback) {
		this.guide.sections = new app.Sections([{}, {}]);

		app.getTemplate("guides/edit", function(file) {
			var template = _.template(file, { guide: this.guide });
			$(this.el).html(template);

			this.sectionFields = [];

			app.asyncForEach(this.guide.sections.models, function(section, next) {
				var view = new app.SectionEditView();
				view.section = section;
				view.parentView = this;

				view.render(function(v) {
					$(this.el).find("#sections-list").append(v.el);
					next();
				}.bind(this));

				this.sectionFields.push(view);
			}.bind(this), function() {
				callback(this);

				this.sectionMoved();
				$('.sortable').sortable().bind('sortupdate', this.sectionMoved.bind(this));
			}.bind(this));
		}.bind(this));
	},

	beforeClose: function() {
		this.sectionFields.forEach(function(view) {
			view.close();
		});
	},

	nameChange: function(e) {
		var name = $(this.el).find("input.guide-name").val();
		this.guide.set('name', name);
	},

	show: function(e) {
		e.preventDefault();

		$(".new-button").css({position: "absolute"});
		$("#new-guide-form").css("position", "static");
		$(".new-button").fadeOut(150);
		$("#new-guide-form").css({display: "block", opacity: 0});
		$("#new-guide-form").animate({opacity: 1.0}, function() {
			$(this).css("overflow", "visible");
		});
		$("#main").addClass("hidden");
		$("#main").animate({width: 530, opacity: 0.3});
		$("#creation-wrapper").animate({width: 370});

		if ($("#main").height() < $("#creation-wrapper").height()) {
			this.mainHeight = $("#main").height();
			$(".body-wrapper").height($("#creation-wrapper").height() + 40)
			$("#main").height($("#creation-wrapper").height())
		}
	},

	hide: function(e) {
		// TODO: confirm close, if stuff has been entered into form
		e.preventDefault();

		$(".new-button").fadeIn(150);
		$("#new-guide-form").css("overflow", "hidden");
		$("#new-guide-form").animate({opacity: 0}, function() {
			$(".new-button").css({position: "static"});
			$(this).css({display: "none"});
		});
		$("#main").removeClass("hidden");
		$("#main").animate({width: 770, opacity: 1.0});
		$("#creation-wrapper").animate({width: 130});

		if (this.mainHeight) {
			$(".body-wrapper").animate({height: this.mainHeight + 40});
			$("#main").height(this.mainHeight);
		}
	},

	addSection: function(e) {
		e.preventDefault();

		$('.sortable').sortable().unbind();
		$('.sortable').sortable('destroy');

		var section = new app.Section();
		this.guide.sections.push(section);

		var view = new app.SectionEditView();
		view.section = section;
		view.parentView = this;

		view.render(function(v) {
			$(this.el).find("#sections-list").append(v.el);

			if ($("#main").height() < $("#creation-wrapper").height()) {
				this.mainHeight = this.mainHeight ? Math.min(this.mainHeight, $("#main").height()) : $("#main").height();
				$(".body-wrapper").height($("#creation-wrapper").height() + 40)
				$("#main").height($("#creation-wrapper").height())
			}

			this.sectionFields.push(v);

			this.sectionMoved();
			$('.sortable').sortable().bind('sortupdate', this.sectionMoved.bind(this));
		}.bind(this));
	},

	removeSection: function(view) {
		this.sectionFields = _.without(this.sectionFields, view);
		this.guide.sections.remove(view.section);

		view.close();
		this.sectionMoved();
	},

	sectionMoved: function() {
		this.sectionFields.forEach(function(view) {
			view.sectionMoved();
		});
	},

	submit: function(e) {
		e.preventDefault();
		
		this.guide.create(function(id) {
			app.router.navigate('guides/' + id, {trigger: true});
		});
	}
});