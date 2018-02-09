(function () {

  var activity = {};


  /**
   * Connect to socket
   */
  activity.connect = function (socket_host, activity_event) {
    io.connect(socket_host).on(activity_event, function (data) {
      // get template
      var tmpl_source = document.getElementById('json_template').innerHTML;
      var template = Handlebars.compile(tmpl_source);
      var cards = $('#event-container .card');
      // control max events
      if(cards.length >= 100) {
        cards.last().remove();
      }
      // render
      $('#event-container').prepend(template({
        internal_id: data.internal_id,
        json_str: JSON.stringify(data.event, null, 2)
      }));
      $('#waiting-msg').hide();
    });
  };


  /**
   * Copies json string to clipboard
   */
  activity.copy_json = function (internal_id) {
    var textarea = $('#json-str-'+internal_id);
    textarea.prop('disabled', false);
    textarea.select();
    document.execCommand('copy');
    document.getSelection().removeAllRanges();
    textarea.prop('disabled', true);
    textarea.blur();
  };


  /**
   * Expands card to full height of json string
   */
  activity.expand = function (internal_id) {
    var textarea = $('#json-str-'+internal_id);
    if (textarea.height() > 200) {
      textarea.height(200);
      $('#max-btn-'+internal_id).show();
      $('#min-btn-'+internal_id).hide();
    } else {
      textarea.height(textarea[0].scrollHeight);
      $('#max-btn-'+internal_id).hide();
      $('#min-btn-'+internal_id).show();
    }
  };


  /**
   * Marke card by highlighting header yello
   */
  activity.mark = function (internal_id) {
    var header = $('#json-header-'+internal_id);
    if (header.hasClass('bg-warning')) {
      header.removeClass('bg-warning');
    } else {
      header.addClass('bg-warning');
    }
  };


  /**
   * Dismisses about message
   */
  activity.dismiss_about_msg = function () {
    $('#about-msg').hide();
  };


  window.activity = activity;

})()