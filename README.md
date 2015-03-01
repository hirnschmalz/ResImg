# ResImg.js
Super lightweight JavaScript plugin to enable responsive images
(landscape and portrait).


## Settings

### data-src

With this attribute you can specify the images for the different breakpoints.
The format should be pretty straightforward.

```HTML
data-src="<480:demo_480.jpg,<960:demo_960.jpg,>960:demo.jpg"
```

### data-src-ls

With this attribute you can specify special images for landscape mode. If set,
this image will be used (if the viewport is landscape) instead of `data-src`.

```HTML
data-src-ls="<480:landscape_480.jpg,<960:landscape_960.jpg,>960:landscape.jpg"
```

### data-src-pt

With this attribute you can specify special images for portrait mode. If set,
this image will be used (if the viewport is portrait) instead of `data-src`.

```HTML
data-src-pt="<480:portrait_480.jpg,<960:portrait_960.jpg,>960:portrait.jpg"
```

### data-src-2x

With this attribute you can specify special images for high dpi (retina)
displays. If set, this image will be used for such a display instead of
`data-src`.

```HTML
data-src-2x="<480:retina_480.jpg,<960:retina_960.jpg,>960:retina.jpg"
```

### data-src-ls-2x

With this attribute you can specify special images for high dpi (retina)
displays in landscape mode. If set, this image will be used for such a display
(if the viewport is landscape) instead of `data-src` or `data-src-2x`.

```HTML
data-src-ls-2x="<480:retina-ls_480.jpg,<960:retina-ls_960.jpg,>960:retina-ls.jpg"
```

### data-src-pt-2x

With this attribute you can specify special images for high dpi (retina)
displays in portrait mode. If set, this image will be used for such a display
(if the viewport is portrait) instead of `data-src` or `data-src-2x`.

```HTML
data-src-pt-2x="<480:retina-pt_480.jpg,<960:retina-pt_960.jpg,>960:retina-pt.jpg"
```

### data-src-base

Set the base path for images defined in the `data-src` attribute. Images will be
searched inside this path.

### data-src-base-ls

Set the base path for images defined in the `data-src-ls` attribute. Images will
be searched inside this path.

### data-src-base-pt

Set the base path for images defined in the `data-src-pt` attribute. Images will
be searched inside this path.

### data-src-2x

Set the base path for images defined in the `data-src-2x` attribute. Images will
be searched inside this path.

### data-src-ls-2x

Set the base path for images defined in the `data-src-ls-2x` attribute. Images
will be searched inside this path.

### data-src-pt-2x

Set the base path for images defined in the `data-src-pt-2x` attribute. Images
will be searched inside this path.


## Future Settings (not implemented at the moment)

### data-src-ratio

### data-src-ratio-ls

### data-src-ratio-pt


## How does it work?

This script was inspired by the article http://davidwalsh.name/responsive-design
written by Koen Vendrik. It's purpose is to bring responsive images to your
browser until the [picture tag](http://caniuse.com/#feat=picture) is supported
by all the browsers out there.

The script tries to show the best matching image. If the device is landscape and
retina  the following attributes are used to display in this order

- `data-src-ls-2x`
- `data-src-2x`
- `data-src-ls`
- `data-src`

If you always specify special images for landscape and portrait you don't need
to add the `data-src` or `data-src-2x` attribute.

For performance reasons only bigger images as the current one get's loaded. If
a high quality image is loaded, there is no need to load a smaller image if the
browser window is scaled down.
