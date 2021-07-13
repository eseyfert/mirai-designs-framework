# FX

A collection of variables and mixins to create various effects and transitions for our elements.

---

### Sass

```scss
@use '@miraidesigns/fx';
```

---

### Animation

Apply transitions and animations in a consistent manner.

```scss
.#{base.$prefix}-class--animate {
    @include fx.animation-standard(transform, 200ms);
}
```

---

### Elevation

Elevate your elements and set them apart on various layers.

```scss
.#{base.$prefix}-class--elevate {
    @include fx.elevation(2);

    // Also works well in combination with our layer system.
    @include fx.elevation(base.layer('dialog'));
}
```
