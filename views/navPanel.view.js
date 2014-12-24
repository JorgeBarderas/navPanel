/*TEMPLATES***************************************************************************/
window.JST = {};

window.JST['nav/section/normal'] = _.template(
      "<div class='nav-panel-section-normal-title'><%= title %></div>"+
      "<div class='nav-panel-section-normal-content'>"+
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."+
      "</div>" 
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
  model: message_model
});

/*VIEWS***************************************************************************/
var NAVpanel_view = Backbone.View.extend({

  tagName: "div",
  className: "nav-panel",
  collection: NAVpanel_collection,
  messages: [],
  messages_view: null,
  section_views: [],
  userName: "",

  initialize: function(args) {
    this.userName = args.user;
    this.messages = args.messages;
  },

  events: {
    "click .nav-panel-section-user-title": "clickUser"
  },

  render: function() {
    var view = this;
    view.$el.addClass(view.className);
    view.$(".nav-panel-section-user-title").addClass("user-collapsed");
    _.each(this.collection.models,function(section) {
      switch (section.get('type')) {
        case 'normal':
          var nS_v = new NAVsection_view({$container: view.$el.children(".nav-panel-section-items"), model: section});
          nS_v.render();
          view.section_views.push(nS_v);
          break;
      }
    })
    view.messages_view = new Messages_view({collection: view.messages});
    $(window).resize(function () {view.resize()});
    view.resize();
    return this;
  },

  resize: function () {
    $(".nav-panel-section-items").height($("#nav-panel-elem").height() - $(".nav-panel-section-search").height() - $(".nav-panel-foot").height());    
  },

  clickUser: function() {
    var view = this;
    var hidden = view.$(".nav-panel-section-user-content").css("display") == "none";
    view.$(".nav-panel-section-user-content").slideToggle();
    if (hidden) {
      view.$(".nav-panel-section-user-title").removeClass("user-collapsed").addClass("user-expanded");
    } else {
      view.$(".nav-panel-section-user-title").removeClass("user-expanded").addClass("user-collapsed");
    }
  }

});

var NAVsection_view = Backbone.View.extend({

  tagName: "div",
  className: "nav-panel-section-normal",
  model: NAVpanel_model,
  $container: null,

  events: {
    "click .nav-panel-section-normal-title": "clickHeader"
  },

  initialize: function(args) {
    this.$container = args.$container;
    this.listenTo(this.model, "change", this.render);
  },

  render: function() {
    var view = this;
    view.$el.addClass(view.className);
    view.$el.append(window.JST['nav/section/normal'](view.model.attributes));
    view.$(".nav-panel-section-normal-title").addClass("title-expanded");
    view.$container.append(view.$el);
    return this;
  },

  clickHeader: function() {
    var view = this;
    var hidden = view.$(".nav-panel-section-normal-content").css("display") == "none";
    view.$(".nav-panel-section-normal-content").slideToggle();
    if (hidden) {
      view.$(".nav-panel-section-normal-title").removeClass("title-collapsed").addClass("title-expanded");
    } else {
      view.$(".nav-panel-section-normal-title").removeClass("title-expanded").addClass("title-collapsed");
    }
  }

});

var Messages_view = Backbone.View.extend({

  tagName: "div",
  className: "nav-panel-section-messages",
  collection: Messages_collection,

  render: function() {
    return this;
  }

});