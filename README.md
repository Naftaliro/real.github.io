# mitchellberg.org

the real-name site: résumé, projects and contact. same catppuccin windows as
[3hz.dev](https://3hz.dev) and [naftaliro.dev](https://naftaliro.dev). plain html, css and js, no build step.

| file | what it is |
| --- | --- |
| `index.html` | the whole site. every box is a `<section class="win">` |
| `404.html` | the not-found page |
| `assets/css/style.css` | palettes at the top, then the bar, windows, sections, phones, and print |
| `assets/js/main.js` | the flavor switcher and the wallpaper. that's all the js |
| `assets/fonts/` | iosevka aile (body), iosevka (the terminal bits), silkscreen (the logo), trimmed to what the site uses |
| `resume.typ` / `resume.pdf` | the résumé source and the pdf it makes |
| `resume.html` | sends `/resume` to `/resume.pdf` |

## flavors

it opens in latte if your system is in light mode and mocha if it's dark. the button in the bar
(or `t`) cycles mocha → macchiato → frappé → latte and remembers your pick. the wallpaper is the
3hz prairie in the daytime for latte and at sunrise for the dark ones.

## updating the résumé

edit `resume.typ`, then rebuild the pdf with [typst](https://typst.app):

```sh
typst compile resume.typ resume.pdf
```

keep it to one page. then make the same change in `index.html` so the site and the pdf agree.
no phone number or street address on either.

## printing

printing the page (or saving it as a pdf from the browser) gives a plain two-page résumé:
no bar, no wallpaper, black on white.

## preview locally

```sh
python3 -m http.server
# then open http://localhost:8000
```
