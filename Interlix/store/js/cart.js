jQuery(function () {
    'use strict';
    function setCookie(cname, cvalue, exdays) {
        var d = new Date();
        d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
        var expires = "expires="+d.toUTCString();

        if ('atob' in window) {
            cvalue = btoa(cvalue);
        }

        document.cookie = cname + "=" + cvalue + "; " + expires + ';path=/';
    }

    function getCookie(cname) {
        var name = cname + "=";
        var ca = document.cookie.split(';');
        for(var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c[0] == ' ') c = c.substring(1);
            if (c.indexOf(name) != -1) {
                if ('atob' in window) {
                    return atob(c.substring(name.length,c.length));
                }
                else {
                    return c.substring(name.length,c.length);
                }
            }
        }
        return false;
    }

    function urldecode(url) {
        return decodeURIComponent(url.replace(/\+/g, ' '));
    }

    function saveCart(inCartItemsNum, cartArticles) {
        setCookie('inCartItemsNum', inCartItemsNum, 5);
        setCookie('cartArticles', JSON.stringify(cartArticles), 5);
    }


    var inCartItemsNum;
    var cartArticles;
    var orderId = [];

    // toggle cart elements whether it's empty or not
    function cartEmptyToggle() {
        if (inCartItemsNum > 0) {
            $('#cart-dropdown .hidden').removeClass('hidden');
            $('#empty-cart-msg').hide();
        }

        else{
            $('#cart-dropdown .divider,#cart-dropdown .go-to-cart').addClass('hidden');
            $('#empty-cart-msg').show();
        }
    }

    function hydrateCart(inCartItemsNum, cartArticles) {
        $('#cart-dropdown > li.cart-item').remove();
        $('#in-cart-items-num').html(inCartItemsNum);

        var smallCartitems = '';
        cartArticles.forEach(function(v) {
            smallCartitems += '<li id="'+ v.id +'" class="cart-item"><a href="'+ v.url +'">'+ v.name +'<br><small>Quantité : <span class="qt">'+ v.qt +'</span></small></a></li>';
        });

        $('#cart-dropdown').prepend(smallCartitems);
    }

    function getUrlVars() {
        var query_string = {};
        var query = window.location.search.substring(1);
        var vars = query.split("&");

        for (var i = 0; i < vars.length; i++) {
            var pair = vars[i].split("=");

            // If first entry with this name
            if (typeof query_string[pair[0]] === "undefined") {
                query_string[pair[0]] = decodeURIComponent(pair[1]);
                // If second entry with this name
            }

            else if (typeof query_string[pair[0]] === "string") {
                var arr = [query_string[pair[0]],decodeURIComponent(pair[1])];
                query_string[pair[0]] = arr;
                // If third or later entry with this name
            }

            else {
                query_string[pair[0]].push(decodeURIComponent(pair[1]));
            }
        }

        return query_string;
    }

    // hydrate cart from url & override previous cart
    function setCartFromUrl() {
        var order = getUrlVars().order;

        if (order && order.length > 0) {
            order = JSON.parse(urldecode(order));

            if (order.products) {
                inCartItemsNum = order.products.length;
                cartArticles = order.products;
            }

            cartEmptyToggle();
            hydrateCart(inCartItemsNum, cartArticles);
            saveCart(inCartItemsNum, cartArticles);

            localStorage.setItem('firstname', order.fname);
            localStorage.setItem('lastname', order.lname);
            localStorage.setItem('email', order.email);
            localStorage.setItem('tel', order.tel);
            localStorage.setItem('street', order.street);
            localStorage.setItem('city', order.city);
            localStorage.setItem('postcode', order.zipcode);
            localStorage.setItem('country', order.country);
        }
    }

    function showCart() {
        $('#cart-dropdown').show(function() {
            setTimeout(function() {
                $('#cart-dropdown').hide();
            }, 5000);
        });
    }

    function addCart(id, name, price, weight, url, qt, inCartItemsNum) {
        // update cart
        $('#in-cart-items-num').html(inCartItemsNum);

        // check if product not already in cart
        var newArticle = true;
        cartArticles.forEach(function(v) {
            // just increment if product already in cart
            if (v.id == id) {
                newArticle = false;
                v.qt += qt;
                $('#'+ id).html('<a href="'+ url +'">'+ name +'<br><small>Quantité : <span class="qt">'+ v.qt +'</span></small></a>');
            }
        });

        // add it if new
        if (newArticle) {
            $('#cart-dropdown').prepend('<li id="'+ id +'"><a href="'+ url +'">'+ name +'<br><small>Quantité : <span class="qt">'+ qt +'</span></small></a></li>');

            cartArticles.push({
                id: id,
                name: name,
                price: price,
                weight: weight,
                qt: qt,
                url: url
            });
        }

        saveCart(inCartItemsNum, cartArticles);
        cartEmptyToggle();
        showCart();
    }

    // get cart details
    inCartItemsNum = parseInt(getCookie('inCartItemsNum') ? getCookie('inCartItemsNum') : 0);
    cartArticles = getCookie('cartArticles') ? JSON.parse(getCookie('cartArticles')) : [];
    orderId[0] = getCookie('orderId') ? getCookie('orderId') : 0;

    cartEmptyToggle();
    hydrateCart(inCartItemsNum, cartArticles);

    $('.add-to-cart').click(function(e) {
        // scroll to + show cart
        var body = $('html, body');
        body.animate({scrollTop: 0}, 400, 'swing', function() {
            $('#cart').addClass('adding');

            setTimeout(function() {
                $('#cart').removeClass('adding');
            }, 800);
        });

        // get product info
        var $this = $(this);
        var id = $this.attr('data-id');
        var name = $this.attr('data-name');
        var price = $this.attr('data-price');
        var weight = $this.attr('data-weight');
        var url = $this.attr('data-url');
        var qt = parseInt($('#qt').val());
        inCartItemsNum += qt;

        // if button has class options
        if ($(e.target).hasClass('options')) {
            var option = $(e.target).prevAll('.option-selector').val();
            id += '_' + option;
            name += ' ' + option;

            addCart(id, name, price, weight, url, qt, inCartItemsNum);
        }

        else {
            addCart(id, name, price, weight, url, qt, inCartItemsNum);
        }
    });

    // on hover cart's behaviour
    var timeout;
    $('#cart').on({
        mouseenter: function() {
            $('#cart-dropdown').show();
        },
        mouseleave: function() {
            timeout = setTimeout(function() {
                $('#cart-dropdown').hide();
            }, 200);
        }
    });

    // let cart open when hovering content
    // hide on mouseout
    $('#cart-dropdown').on({
        mouseenter: function() {
            clearTimeout(timeout);
        },
        mouseleave: function() {
            $('#cart-dropdown').hide();
        }
    });

/* ==========================================================================
   Cart page rendering
   ========================================================================== */
    if (window.location.pathname.indexOf('/panier/') !== -1) {
        var subTotal = 0;
        var shippingFrance = 5;
        var total;
        var weight = 0;
        var items = '';

        setCartFromUrl();

        // test for adblocker
        $.post('/test-ajax/').always(function(data, textStatus, jqXHR) {
            // request must have been blocked by an add blocker
            if (jqXHR.status === 200 && jqXHR.responseText == '') {
                $('#add-blocker-alert').modal({backdrop: 'static'});
            }
        });

        // display cart detail and hydrate vars
        cartArticles.forEach(function(v) {
            var itemPrice = v.price.replace(',', '.') * 1000;

            items += '<tr data-id="'+ v.id +'" data-weight="'+ v.weight +'">\
                     <td><a href="'+ v.url +'">'+ v.name +'</a></td><td>'+ v.price +'€</td>\
                     <td><span class="qt">'+ v.qt +'</span> <span class="qt-minus label label-default">–</span> <span class="qt-plus label label-default">+</span> \
                     <a class="delete-item pull-right">Supprimer</a></td></tr>';
            subTotal += itemPrice * v.qt;
            weight += v.weight * v.qt;
        });

        subTotal = subTotal / 1000;

        // render table & subtotal
        $('#cart-tablebody').empty().html(items);
        $('.subtotal').html(subTotal.toFixed(2).replace('.', ','));
        $('#totalFrance').html((subTotal + shippingFrance).toFixed(2).replace('.', ','));

        // qt +
        $('.qt-plus').on('click', function() {
            var $this = $(this);
            var qt = parseInt($this.prevAll('.qt').html());
            var id = $this.parent().parent().attr('data-id');
            var artWeight = parseInt($this.parent().parent().attr('data-weight'));

            // update qt
            inCartItemsNum += 1;
            weight += artWeight;
            $this.prevAll('.qt').html(qt + 1);
            $('#in-cart-items-num').html(inCartItemsNum);
            $('#'+ id + ' .qt').html(qt + 1);

            cartArticles.forEach(function(v) {
                // increment qt
                if (v.id == id) {
                    v.qt += 1;

                    // get price
                    subTotal = ((subTotal * 1000) + (parseFloat(v.price.replace(',', '.')) * 1000)) / 1000;
                }
            });

            $('.subtotal').html(subTotal.toFixed(2).replace('.', ','));
            $('#totalFrance').html((subTotal + shippingFrance).toFixed(2).replace('.', ','));
            saveCart(inCartItemsNum, cartArticles);
        });

        // qt -
        $('.qt-minus').click(function() {
            var $this = $(this);
            var qt = parseInt($this.prevAll('.qt').html());
            var id = $this.parent().parent().attr('data-id');
            var artWeight = parseInt($this.parent().parent().attr('data-weight'));

            if (qt > 1) {
                // update qt
                inCartItemsNum -= 1;
                weight -= artWeight;
                $this.prevAll('.qt').html(qt - 1);
                $('#in-cart-items-num').html(inCartItemsNum);
                $('#'+ id + ' .qt').html(qt - 1);

                cartArticles.forEach(function(v) {
                    // decrement qt
                    if (v.id == id) {
                        v.qt -= 1;

                        // get price
                        subTotal = ((subTotal * 1000) - (parseFloat(v.price.replace(',', '.')) * 1000)) / 1000;
                    }
                });

                $('.subtotal').html(subTotal.toFixed(2).replace('.', ','));
                $('#totalFrance').html((subTotal + shippingFrance).toFixed(2).replace('.', ','));
                saveCart(inCartItemsNum, cartArticles);
            }
        });

        $('.delete-item').click(function() {
            var $this = $(this);
            var id = $this.parent().parent().attr('data-id');
            var qt = parseInt($this.prevAll('.qt').html());
            var artWeight = parseInt($this.parent().parent().attr('data-weight'));
            var arrayId = 0;
            var price;

            // update qt
            inCartItemsNum -= qt;
            $('#in-cart-items-num').html(inCartItemsNum);

            // delete DOM item
            $this.parent().parent().hide(600);
            $('#'+ id).remove();

            cartArticles.forEach(function(v) {
                // het article id from array
                if (v.id == id) {
                    var itemPrice = v.price.replace(',', '.') * 1000;
                    subTotal -= (itemPrice * qt) / 1000;
                    weight -= artWeight * qt;
                    cartArticles.splice(arrayId, 1);

                    return false;
                }
                arrayId++;
            });

            $('.subtotal').html(subTotal.toFixed(2).replace('.', ','));
            $('#totalFrance').html((subTotal + shippingFrance).toFixed(2).replace('.', ','));
            saveCart(inCartItemsNum, cartArticles);
            cartEmptyToggle();
        });
    }
});
