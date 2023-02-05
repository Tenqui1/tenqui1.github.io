/*
 * @Author        : Qinver
 * @Url           : zibll.com
 * @Date          : 2020-09-29 13:18:40
 * @LastEditTime: 2022-12-04 16:28:30
 * @Email         : 770349780@qq.com
 * @Project       : Zibll子比主题
 * @Description   : 一款极其优雅的Wordpress主题
 * @Read me       : 感谢您使用子比主题，主题源码有详细的注释，支持二次开发。
 * @Remind        : 使用盗版主题会存在各种未知风险。支持正版，从我做起！
 */

(function ($, window) {
	'use strict';

	var Miniimgbox = function (img_selector, container_selector) {
		return _Miniimgbox(img_selector, container_selector, Miniimgbox.options);
	}

	Miniimgbox.options = {
		group: true,
		thumbs: true,
		down: true,
		play: true,
		zoom: true,
		full: true,
		exclude: '.no-imgbox,.avatar,.img-icon,.avatar-badge,.smilie-icon', //排除
	};

	Miniimgbox.swiper = '';
	Miniimgbox.thumbs_swiper = '';
	window.Miniimgbox = Miniimgbox;

	function _Miniimgbox(img_selector, container_selector, options) {

		var imgbox_calss = 'mini-imgbox imgbox';
		var imgbox_id = 'mini-imgbox';
		var data_key = 'imgbox_data';
		var imgbox_selector = '#' + imgbox_id;
		var _imgbox = $(imgbox_selector);
		var Miniimgbox = window.Miniimgbox;
		var imgbox_swiper = Miniimgbox.swiper;
		var imgbox_thumbs_swiper = Miniimgbox.thumbs_swiper;

		if (!options.group) {
			options.thumbs = false;
		}

		init();

		function init() {
			add_dom();

			if (options.exclude) {
				img_selector += ':not(' + options.exclude + ')';
			}

			var all_img_selector = container_selector ? container_selector + ' ' + img_selector : img_selector;
			container_selector = options.group ? container_selector : false;

			setTimeout(function () {
				update_all_slide_data(img_selector, container_selector); //更新dom数据
			}, 1000);

			//只绑定一次
			var _body = $('body');
			if (!_body.data('imgbox-ison-' + all_img_selector)) {
				_body.on('click', all_img_selector, function () {
					var _this = $(this);
					imgbox_open(_this, container_selector);
				});
				_body.data('imgbox-ison-' + all_img_selector, true);
			}
		}

		function imgbox_open(_this, container_s) {

			var slide_lists = get_slide_lists(_this, container_s);

			//没有则退出
			if (!slide_lists.slide) {
				return;
			}

			$(imgbox_selector + ' .swiper-imgbox .swiper-wrapper').html(slide_lists.slide);

			if (options.thumbs) {
				$(imgbox_selector + ' .swiper-thumbsbox .swiper-wrapper').html(slide_lists.thumbs);
			}

			var index = ~~(_this.attr('imgbox-index')) || 0;

			setTimeout(function () {
				if (options.thumbs) {
					imgbox_thumbs_swiper.update();
				}
				imgbox_swiper.update();
				imgbox_swiper.slideToLoop(index, 10);
				imgbox_swiper.autoplay.stop();
				update_count_badge(index, slide_lists.length);
				thumb_open();
			}, 10);

			show(_this);
		}

		function get_slide_lists(_this, container_s) {

			var data = _this.data(data_key);
			if (data) {
				return data;
			}

			var _container = container_s ? $(_this.parents(container_s)[0]) : {};

			if (_container.length) {
				var data = _container.data(data_key);
				if (data && data.node_length == get_node_length(_container)) {
					return data;
				}
			}

			return update_slide_data(_this, _container);
		}

		//获取节点数量
		function get_node_length(_container) {
			return _container.find(img_selector).length;
		}

		function update_all_slide_data(img_selector, container_s) {
			if (container_s) {
				$(container_s).each(function (i) {
					var each_this = $(this);
					if (!each_this.data(data_key)) {
						update_slide_data(each_this.find(img_selector).eq(0), each_this);
					}
				})
			} else {
				$(img_selector).each(function (i) {
					var each_this = $(this);
					if (!each_this.data(data_key)) {
						update_slide_data(each_this, {});
					}
				})
			}
		}

		//将数据保存到节点
		function update_slide_data(_this, _container) {

			var data = {
				slide: '',
				thumbs: '',
				length: 0
			};

			if (_container.length) {
				var index = 0;
				_container.find(img_selector).each(function (i) {
					if (i == 0) {
						index = 0;
					}

					var each_this = $(this);
					if (!is_no(each_this)) {
						each_this.attr('imgbox-index', index);
						data.slide += get_slide(each_this);
						data.length = index + 1;
						//缩略图
						if (options.thumbs) data.thumbs += get_thumbs(each_this);
						index++;
					}
				});

				data.node_length = get_node_length(_container);
				_container.data(data_key, data);
			} else {
				if (!is_no(_this) && !_this.find('img').length) {
					data.slide = get_slide(_this);
					data.length = index;
					_this.data(data_key, data);
				}
			}

			return data;
		}

		//加载dom
		function add_dom() {

			if (_imgbox.length) return;

			var swiper = '<div class="swiper-imgbox"><div class="swiper-wrapper"></div><div class="swiper-button-prev"></div><div class="swiper-button-next"></div><div class="abs-left counter-con"></div></div>';
			var thumbs_swiper = '<div class="swiper-thumbsbox"><div class="swiper-wrapper">' + '' + '</div><div class="swiper-button-prev"></div><div class="swiper-button-next"></div><div class="abs-center right-top"><i class="hide-but fa fa-angle-down em12"></i></div></div>';

			var button = options.down ? '<a href="javascript:;" download class="img-down toggle-radius mr6" title="下载图片"><i class="fa fa-download"></i></a>' : '';
			if (options.group) {
				button += options.play ? '<a href="javascript:;" class="toggle-palay toggle-radius mr6" title="播放图片"><i class="fa fa-play"></i></a>' : '';
				if (options.thumbs) {
					button += '<a href="javascript:;" class="toggle-thumbs toggle-radius mr6" title="查看更多图片"><i class="fa fa-th-large"></i></a>';
					swiper += thumbs_swiper;
				}
			}

			button += options.zoom ? '<a href="javascript:;" class="toggle-zoom toggle-radius mr6" title="切换图片缩放"><i class="fa fa-search"></i></a>' : '';
			button += options.full ? '<a href="javascript:;" class="hide-sm toggle-full toggle-radius mr6" title="切换全屏"><i class="fa fa-expand"></i></a>' : '';
			button += '<a href="javascript:;" title="关闭" class="icon-close toggle-radius"><svg viewBox="0 0 1024 1024" class="icon em12"><path d="M573.44 512.128l237.888 237.696a43.328 43.328 0 0 1 0 59.712 43.392 43.392 0 0 1-59.712 0L513.728 571.84 265.856 819.712a44.672 44.672 0 0 1-61.568 0 44.672 44.672 0 0 1 0-61.568L452.16 510.272 214.208 272.448a43.328 43.328 0 0 1 0-59.648 43.392 43.392 0 0 1 59.712 0l237.952 237.76 246.272-246.272a44.672 44.672 0 0 1 61.568 0 44.672 44.672 0 0 1 0 61.568L573.44 512.128z"></path></svg></a>';

			$('body').append('<div class="' + imgbox_calss + '" id="' + imgbox_id + '"><div class="modal-backdrop imgbox-bg"></div><div class="imgbox-an">' + button + '</div>' + swiper + '</div>');

			_imgbox = $(imgbox_selector);

			new_swiper();
			imgbox_on();
		}

		function update_count_badge(realIndex, length) {
			var _palay = _imgbox.find(".imgbox-an .toggle-palay");

			if (length > 1) {
				_palay.show()
			} else {
				_palay.hide()
			}

			//显示计数
			var badge = length > 1 ? '<badge class="b-black counter">' + (realIndex + 1) + '/' + length + '</badge>' : '';
			_imgbox.find(".counter-con").html(badge);
		}

		function new_swiper() {
			var selector = imgbox_selector + ' .swiper-imgbox';
			var speed = ~~(($(window).width() + 800) / 310);
			var option = {};
			//	option['init'] = false;
			option['speed'] = speed * 100;
			option['zoom'] = {
				maxRatio: ($(window).width() < 768 ? 3 : 2)
			};

			option['autoplay'] = {
				disableOnInteraction: false
			};
			option['grabCursor'] = true;
			option['navigation'] = {
				nextEl: selector + " .swiper-button-next",
				prevEl: selector + " .swiper-button-prev"
			};
			option['keyboard'] = {
				enabled: !0,
				onlyInViewport: !1
			};
			option['on'] = {
				slideChange: function () {
					update_count_badge(this.realIndex, this.slides.length);
				}
			}

			if (options.thumbs && options.group) {
				new_thumbs_swiper();
				option['thumbs'] = {
					swiper: imgbox_thumbs_swiper,
					autoScrollOffset: ~~(speed / 1.6),
				};
			}

			Miniimgbox.swiper = imgbox_swiper = new Swiper(selector, option);
		}

		function new_thumbs_swiper() {
			var selector = imgbox_selector + ' .swiper-thumbsbox';
			var option = {};
			//	option['init'] = true;
			option['watchSlidesVisibility'] = true; //防止不可点击
			option['navigation'] = {
				nextEl: selector + " .swiper-button-next",
				prevEl: selector + " .swiper-button-prev"
			};
			option.slidesPerView = 'auto';
			option.freeMode = true;
			option.freeModeSticky = true;
			Miniimgbox.thumbs_swiper = imgbox_thumbs_swiper = new Swiper(selector, option);
		}

		//绑定执行
		function imgbox_on() {
			//仅绑定一次
			if (_imgbox.data('is_on')) return;

			//下滑关闭
			touch_close();

			//关闭灯箱
			_imgbox.on('click', '.img-close,.imgbox-bg,.imgbox-an .icon-close', close);

			//切换thumb
			_imgbox.on('click', '.imgbox-an .toggle-thumbs,.hide-but', function () {
				_imgbox.toggleClass('show-thumb');
			});

			//下载图片
			_imgbox.on('click', '.imgbox-an .img-down', function () {
				var _this = $(this);
				var img = _imgbox.find('.swiper-imgbox .swiper-slide-active img');
				var src = img.attr("data-src") || img.attr("src");
				var down_name = src.substring(src.lastIndexOf('/') + 1) || src;

				_this.attr('href', src).attr('download', down_name);
			});

			//播放图片
			_imgbox.on('click', '.imgbox-an .toggle-palay', function () {
				var _this = $(this);

				_this.hasClass('is-play') ? imgbox_swiper.autoplay.stop() : imgbox_swiper.autoplay.start();
				_this.toggleClass('is-play');
			});

			//按钮切换放大缩小
			_imgbox.on('click', '.imgbox-an .toggle-zoom', function () {
				var _this = $(this);
				imgbox_swiper.zoom.toggle();
				_this.toggleClass('is-zoom');
			});

			//切换全屏
			_imgbox.on('click', '.imgbox-an .toggle-full', function () {
				if (!document.fullscreenElement) {
					//进入页面全屏
					full_in();
				} else {
					full_out();
				}
			});

			_imgbox.data('is_on', true);
		}

		//全屏
		function full_in() {
			var docElm = document.documentElement;
			if (docElm.requestFullscreen) {
				docElm.requestFullscreen();
			} else if (docElm.msRequestFullscreen) {
				docElm.msRequestFullscreen();
			} else if (docElm.mozRequestFullScreen) {
				docElm.mozRequestFullScreen();
			} else if (docElm.webkitRequestFullScreen) {
				docElm.webkitRequestFullScreen();
			}
			$(imgbox_selector + ' .imgbox-an .toggle-full .fa').removeClass('fa-expand').addClass('fa-compress');
			$(imgbox_selector + '.show').addClass('full-screen'); //全屏
		}

		//退出全屏
		function full_out() {
			if (document.fullscreenElement) {
				if (document.exitFullscreen) {
					document.exitFullscreen();
				} else if (document.msExitFullscreen) {
					document.msExitFullscreen();
				} else if (document.mozCancelFullScreen) {
					document.mozCancelFullScreen();
				} else if (document.webkitCancelFullScreen) {
					document.webkitCancelFullScreen();
				}
			}

			$(imgbox_selector + ' .imgbox-an .toggle-full .fa').removeClass('fa-compress').addClass('fa-expand');
			_imgbox.removeClass('full-screen'); //全屏	
		}

		//链接处理
		function link_replace(link) {
			return link.replace(/(.*\/)(.*)(-\d+x\d+\.)(.*)/g, "$1$2.$4").replace(/\??x-oss-process(.*)/, "");
		}

		//定位show_style
		function show_style(_this) {
			var offset = _this.offset();
			var offset_top = offset.top;
			var offset_left = offset.left;
			var scrollTop = $(document).scrollTop();
			var height = _this.height();
			var width = _this.width();

			var s_top = offset_top - scrollTop + (height / 2);
			var s_left = offset_left + (width / 2);

			_imgbox.attr('style', '--imgbox-origin-top:' + s_top + 'px;--imgbox-origin-left:' + s_left + 'px;');
		}

		//显示
		function show(_this) {
			$('body').addClass('imgbox-show');
			//$(".modal").modal("hide");
			show_style(_this);
			_imgbox.addClass("show").removeClass("hide");
		}

		function thumb_open() {
			var _thumb_btn = $(imgbox_selector + ' .imgbox-an .toggle-thumbs,.hide-but');

			if (options.thumbs && _thumb_btn.length) {
				if (imgbox_swiper.slides.length > 1) {
					_thumb_btn.show();
				} else {
					_imgbox.removeClass('show-thumb');
					_thumb_btn.hide();
				}
			}
		}

		function close() {
			$('body').removeClass('imgbox-show');
			_imgbox.addClass('hideing').removeClass("show");
			full_out(); //退出全屏

			setTimeout(function () {
				_imgbox.removeClass("hideing").addClass("hide").attr('style', '');

				$('.toggle-palay.is-play').removeClass("is-play"); //停止播放

				//恢复放大缩小
				try {
					imgbox_swiper.zoom.out();
					imgbox_swiper.autoplay.stop();
				} catch (e) {}

				//恢复下滑关闭
				$(imgbox_selector + ' .swiper-close').css({
					'opacity': "",
					'transform': "",
				});
			}, 200);
		}

		//滑动关闭
		function touch_close() {
			_imgbox.on('touchmove pointermove MSPointerMove', function (e) {
				e.preventDefault ? e.preventDefault() : e.returnValue = !1;
			});

			_imgbox.minitouch({
				direction: 'bottom',
				selector: '.swiper-close',
				depreciation: 100,
				onStart: false,
				stop: function (_e, _this, distanceX, distanceY) {
					var scale = _this.find('img').css("transform").replace(/[^0-9\-,]/g, '').split(',')[0];
					return (scale && scale > 1);
				},
				onIng: function (_e, _this, distanceX, distanceY) {
					var set_opacity = (200 - distanceY) / 100;
					set_opacity = set_opacity < 1 && set_opacity;
					_this.css('opacity', set_opacity);
				},
				inEnd: function (_e, _this, distanceX, distanceY) {
					(distanceY <= 50) && _this.css({
						'opacity': "",
					});
				},
				onEnd: function (_e, _this, distanceX, distanceY) {
					close();
					_this.css({
						'transform': "translateY(" + (distanceY + 200) + "px)",
					});
				}
			});
		}

		function get_slide(each_this) {
			var thumbs_src = each_this.attr("src") || each_this.attr("box-img");
			var data_src = each_this.attr("data-src");

			if (!thumbs_src && !data_src) return '';

			var full_src = each_this.attr("data-full-url") || link_replace((data_src || thumbs_src));
			var main_img = (thumbs_src == full_src) ? '<img src="' + full_src + '" class="lazyloaded">' : '<img src="' + thumbs_src + '" data-src="' + full_src + '"  class="lazyload"><div class="swiper-lazy-preloader"></div>';
			var main_img_html = '<div class="swiper-slide"><div class="swiper-close"><div class="swiper-zoom-container"><div class="absolute img-close"></div>' + main_img + '</div></div></div>';
			return main_img_html;
		}

		function get_thumbs(each_this) {
			var thumbs_src_b = each_this.attr("data-src") || each_this.attr("src");
			if (!thumbs_src_b) return '';
			var thumbs_img = '<img data-src="' + thumbs_src_b + '"  class="lazyload fit-cover">';
			var thumbs_img_html = '<div class="swiper-slide">' + thumbs_img + '</div>';
			return thumbs_img_html;
		}

		function is_no(_this) {
			//判断上级是否有链接，且不是链接到原图
			var src = _this.attr("data-src") || _this.attr("src");
			if (!src) return false;

			src = link_replace(src);
			var parent = _this.parent('a');
			if (!parent.length) return false;
			var href = parent.attr('box-img') || parent.attr('href');
			href = link_replace(href);
			return (href && (href.indexOf(src) == -1 || src.indexOf(href) == -1));
		}
	}
})(jQuery, window);

tbquire(['swiper'], function () {
	$("link#swiper").length || $("head").append('<link type="text/css" id="swiper" rel="stylesheet" href="' + _win.uri + '/css/swiper.min.css?ver=' + _win.ver + '">');

	Miniimgbox.options.group = _win.imgbox_type === 'group';
	Miniimgbox.options.thumbs = _win.imgbox_thumbs;
	Miniimgbox.options.down = _win.imgbox_down;
	Miniimgbox.options.play = _win.imgbox_play;
	Miniimgbox.options.zoom = _win.imgbox_zoom;
	Miniimgbox.options.full = _win.imgbox_full;

	Miniimgbox('.alone-imgbox-img,a[data-imgbox]');
	Miniimgbox('img', '.wp-posts-content');
	Miniimgbox('img', '.imgbox-container');
	Miniimgbox('.box-img', '.comment-content');
})