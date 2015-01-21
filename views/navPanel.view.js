/*TEMPLATES***************************************************************************/
window.JST = {};

window.JST['nav/section/expand'] = _.template(
      "<div class='nav-section-title nav-panel-section-<%= type %>-title'><%= title %><img src='img/expand.svg' class='svg-inject expand' /></div>"+
      "<div class='nav-panel-section-<%= type %>-content'>"+
      "</div>" 
);
window.JST['nav/section/expand-link'] = _.template(
      "<a href='#' class='nav-section-title nav-panel-section-<%= type %>-title'><%= title %>"+
        "<img src='img/expand.svg' class='svg-inject expand' />"+
      "</a>"+
      "<a href='#' class='nav-section-title-button'><img src='img/next.svg' class='svg-inject link' /></a>"+
      "<div class='nav-panel-section-<%= type %>-content'>"+
      "</div>" 
);
window.JST['nav/section/user'] = _.template(
      "<div class='nav-section-title nav-panel-section-<%= type %>-title'><%= title %><img src='img/user.svg' class='svg-inject user' /></div>"+
      "<div class='nav-panel-section-<%= type %>-content'>"+
      "</div>" 
);


window.JST['nav/report'] = _.template(
      "<a href='<%= url %>' class='nav-panel-section-reports-report><%= text %></a>"
);
window.JST['nav/section/agenda'] = _.template(
      "<div class='nav-panel-section-messages-title'>"+
        "<%= text %>"+
        "<div class='nav-panel-section-messages-title-button'><img src='img/next.svg' class='svg-inject' /></div>"+
      "</div>"+
      "<div class='nav-panel-section-messages-tiles'></div>"+
      "<div class='nav-panel-section-messages-content'></div>"
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
var NP_main_sections_model = Backbone.Model.extend({
  code: '',
  type: '',
  title: '',
  description: '',
  id_content: ''
});

var NP_sections_collection = Backbone.Collection.extend({
  model: NP_main_sections_model
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
var Agenda_model = Backbone.Model.extend({
  id: '',
  text: '',
  messages: Messages_collection
});
var Agendas_collection = Backbone.Collection.extend({
  model: Agenda_model
});

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
  collection: NP_sections_collection,
  main_sections: [],
  foot_sections: [],
  agendas: [],
  agendas_views: [],
  settings: [],
  settings_view: null,
  section_views: [],
  userName: "",

  initialize: function(args) {
    this.userName = args.user;
    this.main_sections = args.main_sections;
    this.foot_sections = args.foot_sections;
    this.agendas = args.agendas;
    this.settings = args.settings;
  },

  render: function() {
    var view = this;
    view.$el.addClass(view.className);
    //main
    _.each(view.main_sections.models,function(section) {
      var nS_v = new NAVsection_view({model: section, $content: $("#"+section.get("id_content")), collapsed: false});
      view.$el.children("#main-panel").append(nS_v.render().$el);
      view.section_views.push(nS_v);
    });
    //foot
    _.each(view.foot_sections.models,function(section) {
      var nS_v = new NAVsection_view({model: section, $content: $("#"+section.get("id_content")), collapsed: true});
      if (section.get("type") != "user") {
        view.$el.children("#foot-panel").prepend(nS_v.render().$el);
      } else {
        view.$el.children("#foot-panel").append(nS_v.render().$el);
      }
      view.section_views.push(nS_v);
    });
    /*

    _.each(view.agendas.models,function(agenda){
      var nA_v = new Agenda_view({model: agenda});
      view.$el.find(".nav-panel-section-agendas").append(nA_v.render().$el);
      view.agendas_views.push(nA_v);
    });
    view.settings_view = new Settings_view({collection: view.settings, el: view.$(".nav-panel-section-user")[0]});
    view.settings_view.render();
    */
    $(window).resize(function () {view.resize()});
    view.resize();
    return this;
  },

  resize: function () {
    $("#main-panel").height($(".nav-panel").height() - $(".nav-panel-section-search").height() - $("#foot-panel").height());
  }

});

var NAVsection_view = Backbone.View.extend({

  tagName: "div",
  model: NP_main_sections_model,
  $content: null,
  collapsed: false,

  events: {
    "click .nav-section-title": "clickHeader"
  },

  initialize: function(args) {
    this.$content = args.$content;
    this.collapsed = args.collapsed;
  },

  render: function() {
    var view = this;
    view.$el
      .attr("id", view.model.get("code"))
      .addClass("nav-panel-section")
      .addClass("nav-panel-section-" + view.model.get("type"))
      .append(window.JST['nav/section/'+view.model.get("type")](view.model.attributes));
    view.$content.appendTo(view.$el.find(".nav-panel-section-"+view.model.get("type")+"-content"));

    if (view.collapsed) {
      view.$(".nav-panel-section-"+view.model.get("type")+"-title").addClass("title-collapsed");
      view.$(".nav-panel-section-"+view.model.get("type")+"-content").hide();
    } else {
      view.$(".nav-panel-section-"+view.model.get("type")+"-title").addClass("title-expanded");
      view.$(".nav-panel-section-"+view.model.get("type")+"-content").show();
    }
    return this;
  },

  clickHeader: function() {
    var view = this;
    var hidden = view.$(".nav-panel-section-"+view.model.get("type")+"-content").css("display") == "none";
    view.$(".nav-panel-section-"+view.model.get("type")+"-content").slideToggle(function() {$(window).resize();});
    if (hidden) {
      view.$(".nav-panel-section-"+view.model.get("type")+"-title").removeClass("title-collapsed").addClass("title-expanded");
    } else {
      view.$(".nav-panel-section-"+view.model.get("type")+"-title").removeClass("title-expanded").addClass("title-collapsed");
    }
  }

});
/*AGENDA VIEW*/
var Agenda_view = Backbone.View.extend({

  tagName: "div",
  className: "nav-panel-section-agenda",
  model: Agenda_model,

  events: {
    "click": "clickHeader"
  },

  render: function() {
    var view = this;
    view.$el
        .attr("id", view.model.get("id"))
        .addClass(view.className)
        .append(window.JST['nav/section/agenda'](view.model.attributes));
    view.$(".nav-panel-section-messages-title").addClass("title-collapsed");
    var cM = view.model.get("messages");
    if (cM.length > 0) {
      _.each(cM, function(message) {
        view.$(".nav-panel-section-messages-tiles").append(window.JST['nav/messages/tile'](message));
        view.$(".nav-panel-section-messages-content").append(window.JST['nav/messages/info'](message));
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
      view.$(".nav-panel-section-messages-tiles").slideUp();
    } else {
      view.$(".nav-panel-section-messages-title").removeClass("title-expanded").addClass("title-collapsed");
      view.$(".nav-panel-section-messages-tiles").slideDown();
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