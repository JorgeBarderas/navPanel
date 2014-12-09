var NAVpanel_view = Backbone.View.extend({

  tagName: "div",
  collection: NAVpanel_collection,
  className: "nav-panel",

  events: {
  },

  initialize: function() {
  },

  render: function() {
    _.each(this.collection.models,function(section) {
      console.log(section);
    })
    return this;
  }

});