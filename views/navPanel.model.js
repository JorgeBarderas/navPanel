var NAVpanel_model = Backbone.Model.extend({
  code: '',
  type: '',
  title: '',
  description: ''
});

var NAVpanel_collection = Backbone.Collection.extend({
  model: NAVpanel_model
});