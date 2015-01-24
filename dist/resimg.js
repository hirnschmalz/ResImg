
/*
@name: resimg.js
@version: 1.1

Copyright 2015-2015 Markus Bischof, http://hirnschmalz.at
Licensed under the MIT license
 */

(function() {
  var ResImgItem, debounce, debounceTimer, resimg;

  ResImgItem = (function() {
    var image, _base, _base2x, _baseLs, _baseLs2x, _basePt, _basePt2x, _src, _src2x, _srcLs, _srcLs2x, _srcPt, _srcPt2x;

    image = void 0;

    _src = void 0;

    _src2x = void 0;

    _srcLs = void 0;

    _srcLs2x = void 0;

    _srcPt = void 0;

    _srcPt2x = void 0;

    _base = void 0;

    _base2x = void 0;

    _baseLs = void 0;

    _baseLs2x = void 0;

    _basePt = void 0;

    _basePt2x = void 0;

    ResImgItem.prototype.ATTR_SRC = 'data-src';

    ResImgItem.prototype.ATTR_SRC_2X = 'data-src-2x';

    ResImgItem.prototype.ATTR_SRC_LS = 'data-src-ls';

    ResImgItem.prototype.ATTR_SRC_LS_2X = 'data-src-ls-2x';

    ResImgItem.prototype.ATTR_SRC_PT = 'data-src-pt';

    ResImgItem.prototype.ATTR_SRC_PT_2X = 'data-src-pt-2x';

    ResImgItem.prototype.ATTR_BASE = 'data-src-base';

    ResImgItem.prototype.ATTR_BASE_2X = 'data-src-base-2x';

    ResImgItem.prototype.ATTR_BASE_LS = 'data-src-base';

    ResImgItem.prototype.ATTR_BASE_LS_2X = 'data-src-base-ls-2x';

    ResImgItem.prototype.ATTR_BASE_PT = 'data-src-base';

    ResImgItem.prototype.ATTR_BASE_PT_2X = 'data-src-base-pt-2x';

    ResImgItem.prototype.COND_LOWER = '<';

    ResImgItem.prototype.COND_UPPER = '>';

    ResImgItem.prototype.COND_DOMAIN_IMAGE = '://';

    ResImgItem.prototype.COND_DIVIDER = ',';

    ResImgItem.prototype.COND_DIVIDER_INNER = ':';

    ResImgItem.prototype.COND_DIVIDER_INNER_REPLACE = '||';

    ResImgItem.prototype.COND_UPER_LOWER_REGEX = /[<>]/;

    ResImgItem.prototype.COND_LAST_REGEX = /:(.+)/;

    function ResImgItem(imageElement) {
      this.image = imageElement;
      if (this.hasAttr(this.image, this.ATTR_SRC)) {
        this._src = this.image.getAttribute(this.ATTR_SRC);
      }
      this._src2x = this.hasAttr(this.image, this.ATTR_SRC_2X) ? this.image.getAttribute(this.ATTR_SRC_2X) : this._src;
      this._srcLs = this.hasAttr(this.image, this.ATTR_SRC_LS) ? this.image.getAttribute(this.ATTR_SRC_LS) : this._src;
      if (this.hasAttr(this.image, this.ATTR_SRC_LS_2X)) {
        this._srcLs2x = this.image.getAttribute(this.ATTR_SRC_LS_2X);
      } else {
        this._srcLs2x = this.hasAttr(this.image, this.ATTR_SRC_LS) ? this._srcLs : this._src2x;
      }
      this._srcPt = this.hasAttr(this.image, this.ATTR_SRC_PT) ? this.image.getAttribute(this.ATTR_SRC_PT) : this._src;
      if (this.hasAttr(this.image, this.ATTR_SRC_PT_2X)) {
        this._srcPt2x = this.image.getAttribute(this.ATTR_SRC_PT_2X);
      } else {
        this._srcPt2x = this.hasAttr(this.image, this.ATTR_SRC_PT) ? this._srcPt : this._src2x;
      }
      this._base = this.hasAttr(this.image, this.ATTR_BASE) ? this.image.getAttribute(this.ATTR_BASE) : '';
      this._base2x = this.hasAttr(this.image, this.ATTR_BASE_2X) ? this.image.getAttribute(this.ATTR_BASE_2X) : this._base;
      this._baseLs = this.hasAttr(this.image, this.ATTR_BASE_LS) ? this.image.getAttribute(this.ATTR_BASE_LS) : this._base;
      if (this.hasAttr(this.image, this.ATTR_BASE_LS_2X)) {
        this._baseLs2x = this.image.getAttribute(this.ATTR_BASE_LS_2X);
      } else {
        this._baseLs2x = this.hasAttr(this.image, this.ATTR_BASE_LS) ? this._baseLs : this._base2x;
      }
      this._basePt = this.hasAttr(this.image, this.ATTR_BASE_PT) ? this.image.getAttribute(this.ATTR_BASE_PT) : this._base;
      if (this.hasAttr(this.image, this.ATTR_BASE_PT_2X)) {
        this._basePt2x = this.image.getAttribute(this.ATTR_BASE_PT_2X);
      } else {
        this._basePt2x = this.hasAttr(this.image, this.ATTR_BASE_PT) ? this._basePt : this._base2x;
      }
    }

    ResImgItem.prototype.hasAttr = function(element, attribute) {
      var returnValue;
      returnValue = void 0;
      if (!element.hasAttribute) {
        returnValue = element.getAttribute(attribute) !== null;
      } else {
        returnValue = element.hasAttribute(attribute);
      }
      return returnValue;
    };

    ResImgItem.prototype.isResponsiveImage = function(image) {
      if (this.hasAttr(image, this.ATTR_SRC) || (this.hasAttr(image, this.ATTR_SRC_LS) && this.hasAttr(image, this.ATTR_SRC_PT))) {
        return true;
      }
      return false;
    };

    ResImgItem.prototype.getImageSrc = function(width, isRetina, isPortrait) {
      var base, breakpoint, condition, finalImageSrc, imgSrc, isDomainImage, newImageSrc, queries, query, src, _i, _len, _ref;
      src = null;
      base = null;
      if (isRetina) {
        src = isPortrait ? this._srcPt2x : this._srcLs2x;
        base = isPortrait ? this._basePt2x : this._baseLs2x;
      } else {
        src = isPortrait ? this._srcPt : this._srcLs;
        base = isPortrait ? this._basePt : this._baseLs;
      }
      queries = src.split(this.COND_DIVIDER);
      newImageSrc = void 0;
      for (_i = 0, _len = queries.length; _i < _len; _i++) {
        query = queries[_i];
        _ref = query.replace(this.COND_DIVIDER_INNER, this.COND_DIVIDER_INNER_REPLACE).split(this.COND_DIVIDER_INNER_REPLACE), condition = _ref[0], imgSrc = _ref[1];
        breakpoint = parseInt(condition.split(this.COND_UPER_LOWER_REGEX)[1]);
        if (condition.indexOf(this.COND_LOWER) !== -1) {
          if (width < breakpoint) {
            newImageSrc = imgSrc;
            break;
          }
        } else {
          if (width > breakpoint) {
            newImageSrc = imgSrc;
          }
        }
      }
      if (newImageSrc) {
        isDomainImage = newImageSrc.indexOf(this.COND_DOMAIN_IMAGE) !== -1 ? true : false;
        finalImageSrc = isDomainImage ? newImageSrc : base + newImageSrc;
        if (finalImageSrc !== this.image.src) {
          return this.image.setAttribute('src', finalImageSrc);
        }
      }
    };

    return ResImgItem;

  })();

  this.ResImg = (function() {
    var images;

    images = [];

    function ResImg() {
      var image, relevantImages, _i, _len;
      images = document.getElementsByTagName('body')[0].getElementsByTagName('img');
      relevantImages = [];
      for (_i = 0, _len = images.length; _i < _len; _i++) {
        image = images[_i];
        if (ResImgItem.prototype.isResponsiveImage(image)) {
          relevantImages.push(new ResImgItem(image));
        }
      }
      this.images = relevantImages;
    }

    ResImg.prototype.checkImages = function() {
      var deviceHasHdpi, deviceIsPortrait, image, viewportHeight, viewportWidth, _i, _len, _ref, _ref1, _results;
      if (this.images.length === 0) {
        return;
      }
      _ref = this.getViewportInfo(), viewportWidth = _ref[0], viewportHeight = _ref[1], deviceHasHdpi = _ref[2], deviceIsPortrait = _ref[3];
      _ref1 = this.images;
      _results = [];
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        image = _ref1[_i];
        _results.push(image.getImageSrc(viewportWidth, deviceHasHdpi, deviceIsPortrait));
      }
      return _results;
    };

    ResImg.prototype.addImage = function(image) {
      var deviceHasHdpi, deviceIsPortrait, newImage, viewportHeight, viewportWidth, _ref;
      if (ResImgItem.prototype.isResponsiveImage(image)) {
        _ref = this.getViewportInfo(), viewportWidth = _ref[0], viewportHeight = _ref[1], deviceHasHdpi = _ref[2], deviceIsPortrait = _ref[3];
        newImage = new ResImgItem(image);
        this.images.push(newImage);
        return newImage.getImageSrc(viewportWidth, deviceHasHdpi, deviceIsPortrait);
      }
    };

    ResImg.prototype.getViewportInfo = function() {
      var deviceHasHdpi, deviceIsPortrait, viewportHeight, viewportWidth;
      viewportWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
      viewportHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
      deviceHasHdpi = window.devicePixelRatio && window.devicePixelRatio >= 1.2 ? true : false;
      deviceIsPortrait = viewportHeight > viewportWidth;
      return [viewportHeight, viewportHeight, deviceHasHdpi, deviceIsPortrait];
    };

    return ResImg;

  })();

  debounce = function(func, wait, immediate) {
    var timeout;
    timeout = null;
    return function() {
      var args, context, later;
      context = this;
      args = arguments;
      return later = function() {
        var callNow;
        timeout = null;
        if (!immediate) {
          func.apply(context, args);
        }
        callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) {
          return func.apply(context, args);
        }
      };
    };
  };

  resimg = new ResImg;

  debounceTimer = 250;

  if (window.addEventListener) {
    window.addEventListener('load', function() {
      return resimg.checkImages();
    }, false);
    window.addEventListener('resize', function() {
      return debounce(resimg.checkImages(), debounceTimer);
    }, false);
  } else {
    window.attachEvent('onload', function() {
      return resimg.checkImages();
    });
    window.attachEvent('onresize', function() {
      return debounce(resimg.checkImages(), debounceTimer);
    });
  }

}).call(this);
