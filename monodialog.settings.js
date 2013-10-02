(function ($) {
  $.fn.extend({
    responsive_dialog: function () {
      var text = $(this).text();
      $(this).dialog({
        // width: 'auto', // overcomes width:'auto' and maxWidth bug
        // maxWidth: 600,
        // height: 'auto',
        // modal: true,
        // fluid: true, //new option
        // resizable: false
        autoOpen: true,
        width: 'auto', // overcomes width:'auto' and maxWidth bug
        height: 'auto',
        maxWidth: 1000,
        //maxHeight: $(window).height()*0.9,
        modal: true,
        //fluid: true, //new option
        resizable: false,
        draggable: false,
        open: function(event, ui){ setDialogSize('open'); }, // needed when autoOpen is set to true in this codepen
      });
    }
  });

  // on window resize run function
  $(window).resize(function () {
    setDialogSize('resize');
  });

  /**
   * Set the dialog size (based on window size) when opening dialog.
   */
  $(document).on("dialogopen", ".ui-dialog", function (event, ui) {
    setDialogSize('open');
  });

  /**
   * Set the dialog size based on window size.
   */
  var distanceFromTop = 0;
  function setDialogSize(action) {



    var $visible = $(".ui-dialog:visible");
    // each open dialog
    $visible.each(function () {
      var $this = $(this);
      var dialog = $this.find(".ui-dialog-content").data("dialog");
      // if fluid option == true
      var wWidth = $(window).width();
      // check window width against dialog width
      if (wWidth < dialog.options.maxWidth + 50) {
          // keep dialog from filling entire screen
          $this.css("max-width", "90%");
      } else {
          // fix maxWidth bug
          $this.css("max-width", dialog.options.maxWidth);
      }

      //reposition dialog
      dialog.option("position", dialog.options.position);

      // set distanceFromTop for use in dialogScrollDown and dialogScrollUp
      action = typeof action !== 'undefined' ? action : 'open';
      if (action == 'open') {
        // reset each time.
        distanceFromTop = 0;

        var offset = $this.offset();
        distanceFromTop = offset.top;
        if (distanceFromTop < 20) {
          distanceFromTop = 20;
        }
      }
    });
  }



  /**
   * Modify dialog position when scrolling up and down.
   */
  var lastScroll = 0;
  $(window).scroll(function () {
    //Set the current scroll position
    var st = $(this).scrollTop();
    //Determine up-or-down scrolling
    if (st > lastScroll) {
       // scrolling down.
       dialogScrollDown();
    }
    else {
       // scrolling up.
       dialogScrollUp();
    }
    //Update scroll position
    lastScroll = st;
  });

  /**
   * Keeps top of dialof within 30px of bit of viewport.
   */
  function dialogScrollDown() {

    // if (distanceFromTop < 20) {
    //   distanceFromTop = 20;
    // }

    var $visible = $(".ui-dialog:visible");
    // each open dialog
    $visible.each(function () {
      var $this = $(this);
      //var dialog = $this.find(".ui-dialog-content").data("dialog");
      var wHeight = $(window).height();

      var offset = $this.offset();
      var top = offset.top;
      var left = offset.left;
      var bot = $this.height() + top;
      var scrollTop = $(window).scrollTop();

      if ((wHeight - bot + scrollTop) > distanceFromTop) {
        var diff = wHeight - bot + scrollTop - distanceFromTop;
        $this.offset({top: top + diff, left: left});
      }

    });
  }

  /**
   * Keeps top of dialof within 30px of top of viewport.
   */
  function dialogScrollUp() {
    var $visible = $(".ui-dialog:visible");
    // each open dialog
    $visible.each(function () {

      var $this = $(this);
      var dialog = $this.find(".ui-dialog-content").data("dialog");

      var wHeight = $(window).height();
      var offset = $this.offset();
      var top = offset.top;
      var left = offset.left;
      var bot = $this.height() + top;
      var scrollTop = $(window).scrollTop();

      if ((scrollTop - top) < (0-distanceFromTop)) {
        $this.offset({top: scrollTop + distanceFromTop, left: left});
      }
    });
  }

})(jQuery);
