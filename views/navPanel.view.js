/*TEMPLATES***************************************************************************/
window.JST = {};

window.JST['nav/section/normal'] = _.template(
      "<div class='nav-panel-section-normal-title'><%= title %></div>"+
      "<div class='nav-panel-section-normal-content'>"+
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."+
      "</div>" 
);
window.JST['nav/report'] = _.template(
      "<a href='<%= url %>' class='nav-panel-section-reports-report><%= text %></a>"
);
window.JST['nav/messages/tile'] = _.template(
      "<label class='nav-panel-section-messages-tile message-<%= type %>'></label>"
);
window.JST['nav/messages/info'] = _.template(
      "<div class='nav-panel-section-messages-info'>"+
        "<label class='info-label message-<%= type %>'></label>"+
        "<div class='info-title'><%= title %></div>"+
        "<div class='info-description'><%= description %></div>"+
      "</div>"
);
window.JST['nav/setting'] = _.template(
      "<a href='<%= url %>' class='nav-panel-section-user-setting setting-<%= type %>'><%= text %></a>"
);


/*MODELS***************************************************************************/
/*SECTIONS*/
var NAVpanel_model = Backbone.Model.extend({
  code: '',
  type: '',
  title: '',
  description: ''
});

var NAVpanel_collection = Backbone.Collection.extend({
  model: NAVpanel_model
});
/*REPORTS*/
var Reports_model = Backbone.Model.extend({
  id: '',
  text: '',
  url: ''
});
var Reports_collection = Backbone.Collection.extend({
  model: Reports_model
});
/*MESSAGES*/
var Message_model = Backbone.Model.extend({
  code: '',
  index: -1,
  number: -1,
  type: '',
  title: '',
  summary: '',
  
  initialize: function (args) {
    this.code = args.type+"_"+args.index+"_"+args.number;
  }
});

var Messages_collection = Backbone.Collection.extend({
  model: Message_model
});
/*SETTINGS*/
var Settings_model = Backbone.Model.extend({
  id: '',
  text: '',
  url: '',
  type: ''
});
var Settings_collection = Backbone.Collection.extend({
  model: Settings_model
});

/*VIEWS***************************************************************************/
var NAVpanel_view = Backbone.View.extend({

  tagName: "div",
  className: "nav-panel",
  collection: NAVpanel_collection,
  reports: [],
  reports_view: null,
  messages: [],
  messages_view: null,
  settings: [],
  settings_view: null,
  section_views: [],
  userName: "",

  initialize: function(args) {
    this.userName = args.user;
    this.reports = args.reports;
    this.messages = args.messages;
    this.settings = args.settings;
  },

  render: function() {
    var view = this;
    view.$el.addClass(view.className);
    _.each(view.collection.models,function(section) {
      switch (section.get('type')) {
        case 'normal':
          var nS_v = null;
          if (view.$el.children(".nav-panel-section-items").children("#"+section.get("code")).length > 0) {
            nS_v = new NAVsection_view({model: section, el: view.$el.children(".nav-panel-section-items").children("#"+section.get("code"))});
          } else {
            nS_v = new NAVsection_view({model: section});
          }
          view.$el.children(".nav-panel-section-items").append(nS_v.render().$el);
          view.section_views.push(nS_v);
          break;
      }
    })
    console.log(view.section_views)
    //view.reports_view = new Reports_view({collection: view.reports, el: view.$(".nav-panel-section-reports")[0]});
    //view.reports_view.render();
    view.messages_view = new Messages_view({collection: view.messages, el: view.$(".nav-panel-section-messages")[0]});
    view.messages_view.render();
    view.settings_view = new Settings_view({collection: view.settings, el: view.$(".nav-panel-section-user")[0]});
    view.settings_view.render();
    $(window).resize(function () {view.resize()});
    view.resize();
    return this;
  },

  resize: function () {
    $(".nav-panel-section-items").height($("#nav-panel-elem").height() - $(".nav-panel-section-search").height() - $(".nav-panel-foot").height());    
  }

});

var NAVsection_view = Backbone.View.extend({

  tagName: "div",
  className: "nav-panel-section-normal",
  model: NAVpanel_model,

  events: {
    "click .nav-panel-section-normal-title": "clickHeader"
  },

  render: function() {
    var view = this;
    if (view.$el.parent().length == 0) {
      view.$el
        .attr("id", view.model.get("code"))
        .addClass(view.className)
        .append(window.JST['nav/section/normal'](view.model.attributes));
    }
    view.$(".nav-panel-section-normal-title").addClass("title-expanded");
    return this;
  },

  clickHeader: function() {
    var view = this;
    var hidden = view.$(".nav-panel-section-normal-content").css("display") == "none";
    view.$(".nav-panel-section-normal-content").slideToggle(function() {$(window).resize();});
    if (hidden) {
      view.$(".nav-panel-section-normal-title").removeClass("title-collapsed").addClass("title-expanded");
    } else {
      view.$(".nav-panel-section-normal-title").removeClass("title-expanded").addClass("title-collapsed");
    }
  }

});
/*MESSAGES VIEW*/
var Messages_view = Backbone.View.extend({

  tagName: "div",
  className: "nav-panel-section-messages",
  collection: Messages_collection,

  events: {
    "click": "clickHeader"
  },

  render: function() {
    var view = this;
    view.$(".nav-panel-section-messages-title").addClass("title-collapsed");
    view.$(".nav-panel-section-messages-tiles").addClass("tiles-collapsed");
    if (view.collection.length > 0) {
      view.$el.show();
      _.each(view.collection.models, function(message) {
        view.$(".nav-panel-section-messages-tiles").append(window.JST['nav/messages/tile'](message.attributes));
        view.$(".nav-panel-section-messages-content").append(window.JST['nav/messages/info'](message.attributes));
      });
    }
    return this;
  },

  clickHeader: function() {
    var view = this;
    var hidden = view.$(".nav-panel-section-messages-content").css("display") == "none";
    view.$(".nav-panel-section-messages-content").slideToggle(function() {$(window).resize();});
    if (hidden) {
      view.$(".nav-panel-section-messages-title").removeClass("title-collapsed").addClass("title-expanded");
      view.$(".nav-panel-section-messages-tiles").removeClass("tiles-collapsed").addClass("tiles-expanded");
    } else {
      view.$(".nav-panel-section-messages-title").removeClass("title-expanded").addClass("title-collapsed");
      view.$(".nav-panel-section-messages-tiles").removeClass("tiles-expanded").addClass("tiles-collapsed");
    }
  }

});
/*SETTINGS VIEW*/
var Settings_view = Backbone.View.extend({

  tagName: "div",
  className: "nav-panel-section-user",
  collection: Settings_collection,

  events: {
    "click": "clickHeader"
  },

  render: function() {
    var view = this;
    view.$(".nav-panel-section-user-title").addClass("title-collapsed");
    if (view.collection.length > 0) {
      view.$el.show();
      _.each(view.collection.models, function(setting) {
        view.$(".nav-panel-section-user-content").append(window.JST['nav/setting'](setting.attributes));
      });
    }
    return this;
  },

  clickHeader: function() {
    var view = this;
    var hidden = view.$(".nav-panel-section-user-content").css("display") == "none";
    view.$(".nav-panel-section-user-content").slideToggle(function() {$(window).resize();});
    if (hidden) {
      view.$(".nav-panel-section-user-title").removeClass("title-collapsed").addClass("title-expanded");
    } else {
      view.$(".nav-panel-section-user-title").removeClass("title-expanded").addClass("title-collapsed");
    }
  }

});