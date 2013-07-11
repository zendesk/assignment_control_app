(function() {
  return {
    current_user: null,
    requests: {
      fetchCurrentUser: function(){
        return {
          url: '/api/v2/users/' + this.currentUser().id() + '.json?include=groups,organizations',
          method: 'GET',
          proxy_v2: true
        };
      }
    },
    events: {
      'app.activated': function(app){
        if (app.firstLoad) { return this.ajax('fetchCurrentUser'); }
      },
      'fetchCurrentUser.done': 'initialize'
    },

    initialize: function(data) {
      this.current_user = _.extend(data, data.user);

      if (this.currentUserIsTarget())
        return this.hideAssigneeOptions();
    },

    currentUserIsTarget: function(){
      var rules = [
        [ 'targeted_user_ids', String(this.current_user.id) ],
        [ 'targeted_user_tags', this.current_user.tags ],
        [ 'targeted_organization_ids', _.map(this.current_user.organizations, function(org) { return String(org.id); })],
        [ 'targeted_group_ids', _.map(this.current_user.groups, function(group) { return String(group.id); })]
      ];

      return _.any(_.map(
        rules,
        function(rule){
          return this._contains(this._settings(rule[0]), rule[1]);
        },
        this
      ));
    },

    hideAssigneeOptions: function(){
      var group_ids = this._settings('hidden_group_ids');
      var user_ids = this._settings('hidden_user_ids');

      _.each(this.ticketFields('assignee').options(), function(option){
        var group_and_user = option.value().split(':'),
        group_id = group_and_user[0],
        user_id = group_and_user[1] || "";

        if (_.contains(group_ids, group_id) ||
            _.contains(user_ids, user_id)){
          option.hide();
        }
      });
    },

    _settings: function(label){
      return _.compact((this.setting(label) || "").split(','));
    },

    _contains: function(list, values){
      if (typeof values !== "object")
        return _.contains(list, values);

      var flattened_contains = _.inject(values, function(memo, value){
        memo.push(_.contains(list, value));
        return memo;
      }, []);

      return _.any(flattened_contains);
    }
  };

}());
