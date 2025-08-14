/*!
 * FLORYN THEME - OPTIMIZED JAVASCRIPT
 * Arquivo consolidado para melhor performance
 */

// Utility functions
function debounce(func, wait, immediate) {
  var timeout;
  return function() {
    var context = this, args = arguments;
    var later = function() {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    var callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
}

// Optimized cart functions
function custome_addcart(button, variantId, quantity) {
  var data = {
    quantity: quantity,
    id: variantId
  };
  var originalHtml = $(button).html();
  
  $.ajax({
    type: "POST",
    url: "/cart/add.js",
    dataType: "json",
    data: data,
    beforeSend: function() {
      $(button).attr("disabled", true);
      $(button).html('<span>Adicionando...</span>');
    },
    success: function(response) {
      $(button).removeAttr("disabled");
      setTimeout(function() {
        $(".custome_close_r").trigger("click");
      }, 1500);
      $(button).html(originalHtml);
      where_to_go();
      
      // Update cart count and total
      jQuery.getJSON("/cart.js", function(cart) {
        var itemCount = cart.item_count;
        $("#related_cart_sucsses_msg").html(
          '<div class="alert alert-success alert-dismissable fade in">' +
          '<a href="#" class="close custome_close_r" data-dismiss="alert" aria-label="close">&times;</a>' +
          'Total ' + itemCount + ' itens no carrinho.</div>'
        );
        jQuery("#CartCount").text(itemCount);
        $("#CartCost").html(theme.Currency.formatMoney(cart.total_price, theme.moneyFormat));
        
        if (typeof convertCurrencies === 'function' && currency_dropdown) {
          convertCurrencies();
        }
      });
    },
    error: function(xhr) {
      $(button).removeAttr("disabled");
      $(button).html(originalHtml);
      console.error('Erro ao adicionar ao carrinho:', xhr.responseText);
    }
  });
}

function related_poup() {
  if ($("#check_collection_emty").val() == 1) {
    $("#related_popup_upsell").modal("show");
    $("#comment_child_like").html('<div class="loading-spinner">Carregando...</div>');
    $("#comment_child_like").load(location.href + " #comment_parent_like", function() {
      setTimeout(function() {
        $("body").addClass("modal-open");
      }, 1500);
      setTimeout(function() {
        if (typeof convertCurrencies === 'function' && currency_dropdown) {
          convertCurrencies();
        }
      }, 2500);
    });
  } else {
    where_to_go();
  }
}

function where_to_go() {
  if (typeof thankmsg !== 'undefined' && thankmsg) {
    setTimeout(function() {
      $(".close").trigger("click");
    }, 1500);
  } else if (typeof drchkout !== 'undefined' && drchkout) {
    $(".custome_checkout").trigger("click");
  } else {
    window.location.href = "/cart";
  }
}

// Sticky button functionality
function initStickyButton() {
  if (typeof eblstcky !== 'undefined' && eblstcky) {
    $("#mst-stiky-box").addClass("fix-search");
    
    $(".stiky_button").on("click", function() {
      $("#AddToCartForm").find('button[type="submit"]').trigger("click");
    });

    var stickyHandler = debounce(function() {
      if (document.body.clientWidth <= 749) {
        var scrollTop = $(document).scrollTop();
        var footerOffset = $("#shopify-section-footer").offset();
        var threshold = footerOffset ? footerOffset.top - 400 : 0;
        
        if (scrollTop > threshold) {
          $(".mst-stiky-div").fadeOut("fast");
          $("#mst-stiky-box").removeClass("fix-search").hide();
          if (typeof ebl_pay_but !== 'undefined' && ebl_pay_but) {
            $(".shopify-payment-button").fadeOut("fast");
          }
        } else {
          $(".mst-stiky-div").fadeIn("fast");
          $("#mst-stiky-box").addClass("fix-search").show();
          if (typeof ebl_pay_but !== 'undefined' && ebl_pay_but) {
            $(".shopify-payment-button").fadeIn("fast");
          }
        }
      }
    }, 100);

    $(document).scroll(stickyHandler);
    $(window).on("resize orientationchange", stickyHandler);
  }
}

// Optimized swatch functionality
function initSwatch() {
  $(document).on('change', '.swatch :radio', function() {
    var optionIndex = $(this).closest(".swatch").attr("data-option-index");
    var value = $(this).val();
    $(this).closest("form").find(".single-option-selector").eq(optionIndex).val(value).trigger("change");
  });
}

// Initialize everything when DOM is ready
$(document).ready(function() {
  // Initialize core functionality
  initStickyButton();
  initSwatch();
  
  // Modal event handlers
  $(document).on("hide.bs.modal", "#related_popup_upsell", function() {
    where_to_go();
  });
  
  // Optimize images loading
  if ('loading' in HTMLImageElement.prototype) {
    const images = document.querySelectorAll('img[data-src]');
    images.forEach(img => {
      img.src = img.dataset.src;
    });
  }
  
  // Performance monitoring
  if (window.performance && window.performance.mark) {
    window.performance.mark('floryn-js-loaded');
  }
});

// Export functions for global access
window.florynTheme = {
  custome_addcart: custome_addcart,
  related_poup: related_poup,
  where_to_go: where_to_go
};