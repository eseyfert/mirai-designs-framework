# Page

A set of classes to help with standardizing page layouts.
Used internally.

---

### Sass

```scss
// Include default styles without configuration
@forward '@miraidesigns/page/styles';
```

```scss
// Configure appearance
@use '@miraidesigns/page' with (
    $variable: value
);

@include page.styles();
```

---

### Standard Layout

The standard layout contains a separated, active sidebar and the main page component.\
A header at the top of the page holds the branding/logo type and the sidebar anchor element.\
The main area stretches out and fills the space between header and footer and holds our content.\
Our footer will generally hold a copyright notice and secondary navigation links and is stuck to the bottom of the page.

```html
<body class="mdf-preload no-js">
    <div id="sidebar"></div>

    <div id="page" class="mdf-page">
        <header class="mdf-page__header">
            <div id="logo"></div>

            <button id="sidebar-anchor"></button>
        </header>

        <main class="mdf-page__main">
            <div class="mdf-container"></div>
        </main>

        <footer class="mdf-page__footer"></footer>
    </div>
</body>
```