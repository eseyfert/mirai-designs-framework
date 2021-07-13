# Typography

Typography allows you to present your content in a clear and legible manner.

---

### Sass

```scss
// Include default styles without configuration
@forward '@miraidesigns/typography/styles';
```

```scss
// Configure appearance
@use '@miraidesigns/typography' with (
    $variable: value
);

@include typography.styles();
```

---

## Implementation

It is necessary to properly configure this module and I recommend to load it early in the load order.\
Please configure the `_variables.scss` file and the `load()` mixin found in `_mixins.scss` responsible for loading the fonts.

### Fonts

Fonts are split into three groups.\
Regular is the main font used for elements, paragraphs, inputs, general writing and so on.\
Headline is the secondary font used for headings and other emphasis driven text.\
Code is used for `<pre>` and `<code>` blocks and other systematic text applications.\
Each style can also be applied through classes.

| Name     | Class               |
| -------- | ------------------- |
| Regular  | `mdf-font-regular`  |
| Headline | `mdf-font-headline` |
| Code     | `mdf-font-code`     |

### Headlines

Headlines are the largest text reserved for short headings that attract the users attention.

| Heading type | Element | Class            |
| ------------ | ------- | ---------------- |
| Headline 1   | `<h1>`  | `mdf-headline-1` |
| Headline 2   | `<h2>`  | `mdf-headline-2` |
| Headline 3   | `<h3>`  | `mdf-headline-3` |
| Headline 4   | `<h4>`  | `mdf-headline-4` |
| Headline 5   | `<h5>`  | `mdf-headline-5` |
| Headline 6   | `<h6>`  | `mdf-headline-6` |

### Subtitles

Subtitles are usually smaller than headlines and best if kept short and descriptive.

| Subtitle type | Class            |
| ------------- | ---------------- |
| Subtitle 1    | `mdf-subtitle-1` |
| Subtitle 2    | `mdf-subtitle-2` |

### Captions

Captions are usually the smallest text and describe headlines or media elements like images.

| Subtitle type | Class         |
| ------------- | ------------- |
| Caption       | `mdf-caption` |