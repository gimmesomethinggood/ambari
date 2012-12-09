/**
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

var App = require('app');

App.MainHostSummaryView = Em.View.extend({
  templateName: require('templates/main/host/summary'),

  content:function(){
    return App.router.get('mainHostDetailsController.content');
  }.property('App.router.mainHostDetailsController.content'),

  ComponentButtonView: Em.View.extend({
    content: null,

    /**
     * Disable element while component is starting/stopping
     */
    disabledClass:function(){
      var workStatus = this.get('content.workStatus');
      if(['STARTING', 'STOPPING'].contains(workStatus) ){
        return 'disabled';
      } else {
        return '';
      }
    }.property('content.workStatus'),

    adjustedIndex: function() {
      return this.get('_parentView.contentIndex') + 1;
    }.property(),

    positionButton: function() {
      return (this.get("adjustedIndex")%2 == 0) ? true : false;
    }.property('content.id') ,

    indicatorClass: function() {
      return 'health-status-' + this.get('content.workStatus');
    }.property('content.workStatus'),

    componentCheckStatus : function() {
      return (this.get('content.workStatus') === "STARTED" || this.get('content.workStatus') === "STARTING");
    }.property('content.workStatus'),

    /**
     * Do blinking for 1 minute
     */
    doBlinking : function(){
      var workStatus = this.get('content.workStatus');
      var self = this;

      if(['STARTING', 'STOPPING'].contains(workStatus) ){
        this.$('.components-health').effect("pulsate", null, 1000, function () {
          self.doBlinking();
        });
      }
    },

    /**
     * Start blinking when host component is starting/stopping
     */
    startBlinking:function(){
      this.doBlinking();
    }.observes('content.workStatus'),

    /**
     * Shows whether we need to show Decommision/Recomission buttons
     */
    isDataNode: function() {
      return this.get('content.componentName') === 'DataNode';
    }.property('content')
  })

});