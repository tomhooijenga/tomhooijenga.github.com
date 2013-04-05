$(function () {
    "use strict";
    var $portfolio = $('#portfolio'),
        $progress = $('#loading'),
        $progressBar = $progress.find('.bar');

    $portfolio.imagesLoaded({
        callback: function () {
            $progress.removeClass('active progress-striped').fadeOut();
            $("#overlay").fadeOut();
            $portfolio.isotope({
                itemSelector: '.item',
                layoutMode: 'masonry',
                masonry: {
                    columnWidth: $(".span1").outerWidth(true),
                    cornerStampSelector: '#filter'
                },
                getSortData: {
                    open: function ($item) {
                        var r;
                        if ($item.hasClass("open")) {
                            r = -3000;
                        } else if ($item.is("#comments")) {
                            r = -2000;
                        } else {
                            r = $item.index();
                        }
                        return r;
                    }
                },
                filter: "#portfolio .item:not(#comments)",
                sortBy: "open"
            });
        },
        progress: function (isBroken, $images, $proper, $broken) {
            $progressBar.css({ width: Math.round((($proper.length + $broken.length) * 100) / $images.length) + '%' });
        }
    });
    var Nice = {
        settings: {
            offset: null
        }
      , open: function ($item) {
          this.settings.offset = $item.offset().top;
          if (!$item.hasClass("open")) {
              $("#portfolio .item.open").toggleClass("open span4 span8").find(".toggle-hide").toggleClass("in");
              $item.toggleClass("open span4 span8").find(".toggle-hide").toggleClass("in");
              $("#overlay").fadeIn();
              var url = "http://api.flickr.com/services/rest/?method=flickr.photos.comments.getList&api_key=f145d868b3c75506f0e858f479777f07&format=json&nojsoncallback=1&photo_id=" + $item.data("id");
              $.getJSON(url, function (data) {
                  $("#comments .loading").hide();
                  data.comments.comment.forEach(function (item, index) {
                        if (index < 50) {
                            var href = "http://flickr.com/profile/" + item.author;
                            var $c = $(".sample-comment").clone().toggleClass("sample-comment comment");
                            $c.find("a").prop("href", href).prop("target", "_blank").text(item.authorname);
                            $c.find("p").html(item._content);
                            $("#comments .comments").append($c);
                        }
                    });
                  $("#comments .comments").height($item.height() - 51);
                  $("#portfolio").isotope({
                      filter: "*"
                  });
              }).error(function () {
                  window.alert("Could not load comments");
              });
              $('#portfolio').isotope('updateSortData',
                    $("#portfolio .item")
                ).isotope({
                    filter: "*"
                });
              $(window).scrollTop(0);

              // chaining //
              return this;
          }
      }
      , close: function () {
          $("#portfolio .item.open").toggleClass("open span4 span8").find(".toggle-hide").toggleClass("in");
          $("#comments .loading").show();
          $("#comments .comments").empty().height("auto");
          $("#overlay").hide();
          $('#portfolio').isotope('updateSortData',
                $("#portfolio .item")
            ).isotope({
                filter: "#portfolio .item:not(#comments)",
                sortBy: "open",
                sortAscending: true
            });
          $(window).scrollTop(this.settings.offset);
          return this;
      }
    };
    $("#portfolio").on("click", "img.thumb", function () {
        var $item = $(this).parents("li");
        Nice.open($item);
    });
    $("#overlay, #close").on("click", function () {
        Nice.close();
    });
    $("#prev").on("click", function () {
        var $item = $("#portfolio .open").prev();
        Nice.close().open($item);
    });
    $("#next").on("click", function () {
        var $item = $("#portfolio .open").next();
        Nice.close().open($item);
    });
});