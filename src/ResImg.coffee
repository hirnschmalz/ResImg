###
@name: ResImg.js
@version: 1.0.3

Copyright 2015-2015 Markus Bischof, http://hirnschmalz.at
Licensed under the MIT license
###
class ResImgItem

  # Class variables
  image = undefined

  # 'Protected' Class variables
  _src = undefined
  _src2x = undefined
  _srcLs = undefined
  _srcLs2x = undefined
  _srcPt = undefined
  _srcPt2x = undefined
  _base = undefined
  _base2x = undefined
  _baseLs = undefined
  _baseLs2x = undefined
  _basePt = undefined
  _basePt2x = undefined

  # Constants
  ATTR_SRC:                   'data-src'
  ATTR_SRC_2X:                'data-src-2x'
  ATTR_SRC_LS:                'data-src-ls'
  ATTR_SRC_LS_2X:             'data-src-ls-2x'
  ATTR_SRC_PT:                'data-src-pt'
  ATTR_SRC_PT_2X:             'data-src-pt-2x'
  ATTR_BASE:                  'data-src-base'
  ATTR_BASE_2X:               'data-src-base-2x'
  ATTR_BASE_LS:               'data-src-base'
  ATTR_BASE_LS_2X:            'data-src-base-ls-2x'
  ATTR_BASE_PT:               'data-src-base'
  ATTR_BASE_PT_2X:            'data-src-base-pt-2x'

  COND_LOWER:                 '<'
  COND_UPPER:                 '>'
  COND_DOMAIN_IMAGE:          '://'
  COND_DIVIDER:               ','
  COND_DIVIDER_INNER:         ':'
  COND_DIVIDER_INNER_REPLACE: '||'

  COND_UPER_LOWER_REGEX:      /[<>]/
  COND_LAST_REGEX:            /:(.+)/

  constructor: (imageElement) ->
    @image = imageElement

    # Extract the image attributes
    @_src = @image.getAttribute(@ATTR_SRC) if @hasAttr(@image, @ATTR_SRC)
    @_src2x = if @hasAttr(@image, @ATTR_SRC_2X) then @image.getAttribute(@ATTR_SRC_2X) else @_src

    @_srcLs = if @hasAttr(@image, @ATTR_SRC_LS) then @image.getAttribute(@ATTR_SRC_LS) else @_src
    if @hasAttr(@image, @ATTR_SRC_LS_2X)
      @_srcLs2x = @image.getAttribute(@ATTR_SRC_LS_2X)
    else
      @_srcLs2x = if @hasAttr(@image, @ATTR_SRC_LS) then @_srcLs else @_src2x

    @_srcPt = if @hasAttr(@image, @ATTR_SRC_PT) then @image.getAttribute(@ATTR_SRC_PT) else @_src
    if @hasAttr(@image, @ATTR_SRC_PT_2X)
      @_srcPt2x = @image.getAttribute(@ATTR_SRC_PT_2X)
    else
      @_srcPt2x = if @hasAttr(@image, @ATTR_SRC_PT) then @_srcPt else @_src2x

    @_base = if @hasAttr(@image, @ATTR_BASE) then @image.getAttribute(@ATTR_BASE) else ''
    @_base2x = if @hasAttr(@image, @ATTR_BASE_2X) then @image.getAttribute(@ATTR_BASE_2X) else @_base

    @_baseLs = if @hasAttr(@image, @ATTR_BASE_LS) then @image.getAttribute(@ATTR_BASE_LS) else @_base
    if @hasAttr(@image, @ATTR_BASE_LS_2X)
      @_baseLs2x = @image.getAttribute(@ATTR_BASE_LS_2X)
    else
      @_baseLs2x = if @hasAttr(@image, @ATTR_BASE_LS) then @_baseLs else @_base2x

    @_basePt = if @hasAttr(@image, @ATTR_BASE_PT) then @image.getAttribute(@ATTR_BASE_PT) else @_base
    if @hasAttr(@image, @ATTR_BASE_PT_2X)
      @_basePt2x = @image.getAttribute(@ATTR_BASE_PT_2X)
    else
      @_basePt2x = if @hasAttr(@image, @ATTR_BASE_PT) then @_basePt else @_base2x

  hasAttr: (element, attribute) ->
    returnValue = undefined
    if element?
      if !element.hasAttribute
        returnValue = element.getAttribute(attribute) != null
      else
        returnValue = element.hasAttribute(attribute)

    returnValue

  isResponsiveImage: (image) ->
    if @hasAttr(image, @ATTR_SRC) or ( @hasAttr(image, @ATTR_SRC_LS) and @hasAttr(image, @ATTR_SRC_PT) )
      return true

    false

  getImageSrc: (width, isRetina, isPortrait) ->
    src  = null
    base = null

    if isRetina
      src  = if isPortrait then @_srcPt2x else @_srcLs2x
      base = if isPortrait then @_basePt2x else @_baseLs2x
    else
      src  = if isPortrait then @_srcPt else @_srcLs
      base = if isPortrait then @_basePt else @_baseLs

    queries = src.split( @COND_DIVIDER )

    newImageSrc = undefined
    for query in queries
      [condition, imgSrc] = query.replace( @COND_DIVIDER_INNER, @COND_DIVIDER_INNER_REPLACE ).split( @COND_DIVIDER_INNER_REPLACE )
      breakpoint = parseInt(condition.split(@COND_UPER_LOWER_REGEX)[1])

      if condition.indexOf( @COND_LOWER ) isnt -1
        if width < breakpoint
          newImageSrc = imgSrc
          break
      else
        if width > breakpoint
          newImageSrc = imgSrc

    if newImageSrc
      isDomainImage = if newImageSrc.indexOf(@COND_DOMAIN_IMAGE) isnt -1 then true else false

      finalImageSrc = if isDomainImage then newImageSrc else (base + newImageSrc)
      @image.setAttribute('src', finalImageSrc) if finalImageSrc isnt @image.src



class @ResImg

  # Declare our class variables
  images = []

  # It only makes sense to load bigger images,
  # as a reason of that we save the biggest resolution
  # for what we loaded images.
  maxWidth = 0


  constructor: ->

    # Get all the images in our document
    images = document.getElementsByTagName('body')[0].getElementsByTagName('img')
    relevantImages = []

    # We are only interestd in images with our special data attributes
    for image in images
      if ResImgItem::isResponsiveImage(image)
        relevantImages.push new ResImgItem(image)

    @images = relevantImages

  checkImages: () ->
    # Only do something if there are images are on the current page
    return if @images.length == 0

    # Gather some information about the users device
    [viewportWidth, viewportHeight, deviceHasHdpi, deviceIsPortrait] = @getViewportInfo()

    if viewportWidth > maxWidth
      maxWidth = viewportWidth

      # Process all the images found on the page
      for image in @images
        image.getImageSrc(viewportWidth, deviceHasHdpi, deviceIsPortrait)

  addImage: (image) ->
    if ResImgItem::isResponsiveImage(image)
      [viewportWidth, viewportHeight, deviceHasHdpi, deviceIsPortrait] = @getViewportInfo()
      newImage = new ResImgItem(image)
      @images.push newImage
      newImage.getImageSrc(viewportWidth, deviceHasHdpi, deviceIsPortrait)

  getViewportInfo: () ->
    viewportWidth    = window.innerWidth  || document.documentElement.clientWidth  || document.body.clientWidth
    viewportHeight   = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
    deviceHasHdpi    = if (window.devicePixelRatio and window.devicePixelRatio >= 1.2) then true else false
    deviceIsPortrait = viewportHeight > viewportWidth

    return [viewportWidth, viewportHeight, deviceHasHdpi, deviceIsPortrait]


debounce = (func, wait, immediate) ->
  timeout = null

  () ->
    context = this
    args = arguments

    later = () ->
      timeout = null;

      if !immediate
        func.apply(context, args)

      callNow = immediate && !timeout
      clearTimeout(timeout)
      timeout = setTimeout(later, wait)
      func.apply(context, args) if callNow

# Create an instance of our ResImg class
window.ResImg = new ResImg

# Listen to window resizing
debounceTimer = 250

if window.addEventListener
  window.addEventListener('load', () ->
    window.ResImg.checkImages()
  , false)
  window.addEventListener('resize', () ->
    debounce window.ResImg.checkImages(), debounceTimer
  , false)
else
  window.attachEvent('onload', () ->
    window.ResImg.checkImages()
  )
  window.attachEvent('onresize', () ->
    debounce window.ResImg.checkImages(), debounceTimer
  )
