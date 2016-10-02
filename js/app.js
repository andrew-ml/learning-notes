$(function() {

  var App = Marionette.Application.extend({
    region: '#app-element',

    onStart: function() {
      this.showView(new RootView());
    }
  });

  var RootView = Marionette.View.extend({
    template: '#root-tpl',

    ui: {
      lines: '.line',
      additionalLines: '.additional',
      sliderRange: '#slider-range',
      sliderSpeed: '#slider-speed',
      note: '#note'
    },

    events: {
      'click #note-checkbox': 'onNoteCheckboxClick',
      'change #lang-select': 'onLangChange'
    },

    notesList: {
      ru: ['До','Си','Ля','Соль','Фа','Ми','Ре'],
      en: ['C','B','A','G','F','E','D']
    },

    onRender: function () {
      var self = this;
      var oldIndex;
      var linesLength = this.ui.lines.length;
      var fromVal = 0;
      var toVal = linesLength - fromVal - 1;
      var speed;
      var interval;

      this.currentNotesList = this.notesList.ru;

      this.ui.sliderRange.slider({
        range: true,
        orientation: "vertical",
        min: -toVal,
        max: 0,
        values: [ -toVal, 0 ],
        slide: function( event, ui ) {
          if (ui.values[1] - ui.values[0] < 3) return false;
        },
        stop: function( event, ui ) {
          fromVal = -ui.values[1];
          toVal   = -ui.values[0];
        }
      });

      this.ui.sliderSpeed.slider({
        min: 0.05,
        max: 1,
        step: 0.01,
        value: this.speed = 0.2,
        stop: function( event, ui ) {
          self.speed = ui.value;
          clearInterval(interval);
          interval = newInterval();
        }
      });

      interval = newInterval();

      function newInterval() {
        return setInterval(setNewNote, Math.floor(1000 / self.speed));
      }

      function setNewNote() {
        var index = fromVal + Math.floor(Math.random() * (toVal - fromVal + 1));

        if (index == oldIndex) {
          setNewNote();
          return;
        } 

        oldIndex = index;
        self.changeNote(index)
      }
    },

    onNoteCheckboxClick: function (e) {
      this.ui.note.css('opacity', e.currentTarget.checked ? 1 : 0);
    },

    onLangChange: function (e) {
      var lang = e.currentTarget.value;
      var list = this.notesList[lang];

      if (typeof list !== 'undefined') {
        this.currentNotesList = list;
      }
    },
      
    changeNote: function (index) {
      var self = this;
      var hasAdditional = !this.ui.lines.eq(index).hasClass('additional');

      this.ui.lines.removeClass('active');
      this.ui.lines.eq(index).addClass('active');
      this.ui.additionalLines.toggleClass('hide', hasAdditional);

      setTimeout(function () {
        self.ui.note.html(self.currentNotesList[index % 7] )
      }, Math.floor(650 / self.speed))

      setTimeout(function () {
        self.ui.note.html('')
      }, Math.floor(900 / self.speed))
    }
  });

  var StaffView = Marionette.View.extend({
    template: '#staff-tpl',

    initialize: function () {
    },
  });

  var myApp = new App();
  myApp.start();

});
