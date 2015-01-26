/*TEMPLATES***************************************************************************/
window.JST = {};

window.JST['nav/section/expand'] = _.template(
      "<a href='#' class='nav-section-title nav-panel-section-<%= type %>-title'><%= title %><img src='img/expand.svg' class='svg-inject expand' /></a>"+
      "<div class='nav-panel-section-<%= type %>-content panel-content'>"+
      "</div>" 
);
window.JST['nav/section/button'] = _.template(
      "<a href='#' class='nav-section-title nav-panel-section-<%= type %>-title'><%= title %><img src='img/next.svg' class='svg-inject next' /></a>"
);
window.JST['nav/section/expand-link'] = _.template(
      "<a href='#' class='nav-section-title nav-panel-section-<%= type %>-title'><%= title %>"+
        "<img src='img/expand.svg' class='svg-inject expand' />"+
      "</a>"+
      "<a href='#' class='nav-section-title-button'><img src='img/next.svg' class='svg-inject link' /></a>"+
      "<div class='nav-panel-section-<%= type %>-content panel-content'>"+
      "</div>" 
);
window.JST['nav/section/expand-refresh-info'] = _.template(
      "<a href='#' class='nav-section-title nav-panel-section-<%= type %>-title'><%= title %>"+
        "<img src='img/expand.svg' class='svg-inject expand' />"+
      "</a>"+
      "<a href='#' class='nav-section-title-info-button'><img src='img/refresh.svg' class='svg-inject refresh' /></a>"+
      "<div class='nav-section-title-info'>23</div>"+
      "<div class='nav-panel-section-<%= type %>-content panel-content'>"+
      "</div>" 
);
window.JST['nav/section/expand-link-tiles'] = _.template(
      "<a href='#' class='nav-section-title nav-panel-section-<%= type %>-title'><%= title %>"+
        "<img src='img/expand.svg' class='svg-inject expand' />"+
      "</a>"+
      "<a href='#' class='nav-section-title-button'><img src='img/next.svg' class='svg-inject link' /></a>"+
      "<div class='nav-panel-section-<%= type %>-preview'></div>"+
      "<div class='nav-panel-section-<%= type %>-content panel-content'>"+
      "</div>" 
);
window.JST['nav/section/user'] = _.template(
      "<a href='#' class='nav-section-title nav-panel-section-<%= type %>-title'><%= title %><img src='img/user.svg' class='svg-inject user' /></a>"+
      "<div class='nav-panel-section-<%= type %>-content panel-content'>"+
      "</div>" 
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

/*VIEWS***************************************************************************/
var NAVpanel_view = Backbone.View.extend({

  tagName: "div",
  className: "nav-panel",
  main_sections: [],
  foot_sections: [],
  section_views: [],

  initialize: function(args) {
    this.main_sections = args.main_sections;
    this.foot_sections = args.foot_sections;
  },

  render: function() {
    var view = this;
    view.$el.addClass(view.className);
    //main
    _.each(view.main_sections.models,function(section) {
      var id_content = section.get("id_content");
      var nS_v = new NAVsection_view({model: section, $content: (id_content!="")?$("#"+id_content):[], collapsed: false});
      view.$el.children("#main-panel").append(nS_v.render().$el);
      view.section_views.push(nS_v);
    });
    //foot
    _.each(view.foot_sections.models,function(section) {
      var id_content = section.get("id_content");
      var nS_v = new NAVsection_view({model: section, $content: (id_content!="")?$("#"+id_content):[], collapsed: true});
      if (section.get("type") != "user") {
        view.$el.children("#foot-panel").prepend(nS_v.render().$el);
      } else {
        view.$el.children("#foot-panel").append(nS_v.render().$el);
      }
      view.section_views.push(nS_v);
    });
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
    if (view.$content.length > 0) {
      view.$content.appendTo(view.$el.find(".nav-panel-section-"+view.model.get("type")+"-content"));
    } else {
      view.collapsed = true;
    }

    if (view.collapsed) {
      view.$el.addClass("collapsed").removeClass("expanded");
      view.$(".nav-panel-section-"+view.model.get("type")+"-title").addClass("title-collapsed");
      view.$(".nav-panel-section-"+view.model.get("type")+"-content").hide();
    } else {
      view.$el.addClass("expanded").removeClass("collapsed");
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
      view.$el.addClass("expanded").removeClass("collapsed");
      view.$(".nav-panel-section-"+view.model.get("type")+"-title").removeClass("title-collapsed").addClass("title-expanded");
    } else {
      view.$el.addClass("collapsed").removeClass("expanded");
      view.$(".nav-panel-section-"+view.model.get("type")+"-title").removeClass("title-expanded").addClass("title-collapsed");
    }
  }

});