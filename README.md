# Duke · Portfolio website

A fast, static portfolio: plain HTML, CSS and JavaScript. There's no build step, so it works on any free host.

```
site/
├── index.html        Homepage (hero, Design ↔ Code, work, about, skills, services, contact)
├── crost-flow.html   Crost Flow case study
├── styles.css        All styles; colours and fonts are tokens at the top
├── script.js         Theme toggle, Design ↔ Code switch, draggable skills, contact form
├── cv/               CV source (cv.html + Geist fonts)
└── assets/
    ├── favicon.svg
    ├── avatar.jpg     Illustrated avatar (hero)
    ├── photo.jpg      Headshot (About, front photo)
    ├── photo-2.jpg    Seated portrait (About, back photo; tap the stack to shuffle)
    └── Adeyemi-Dennis-CV.pdf   Your CV (source: cv/cv.html)
```

## Preview it on your computer

```bash
cd site
python3 -m http.server 4321
```

Then open http://localhost:4321

## Things to add

1. **Your photos:** `avatar.jpg` (illustration) shows in the hero, and `photo.jpg` (headshot) in About. The seated portrait, `photo-2.jpg`, sits behind it as a second tilted card. Visitors can click or tap the stack to swap which photo is in front.
2. **Your CV:** `assets/Adeyemi-Dennis-CV.pdf`, downloaded by the "CV" button in the nav. To update it, edit `cv/cv.html`, print it to PDF (A4, no headers), and replace this file.
3. **Testimonials:** in `index.html`, find `id="testimonials"`, remove the word `hidden`, and replace the 3 placeholder quotes with real ones.
4. **Personal projects:** in `index.html`, replace the two "Personal project · In progress" cards. You can copy the Crost Flow card as a template, and `crost-flow.html` as a template for the case study page.
5. **Crost Flow images:** these load straight from Behance right now. For reliability, download them from your Behance project into `assets/` and update the `src="…"` paths.

## Contact form

The form opens the visitor's email app with the message pre-filled, so no server is needed. If you'd rather receive messages directly, sign up for a free form service such as Formspree, then set the form's `action` to their URL and remove the submit handler in `script.js`.

## Change colours or fonts

Open `styles.css`. The top of the file has the tokens:
- `--accent` is the blue (`#2F4BFF` light, `#6A80FF` dark)
- `--bg` / `--surface` are the background and card colours
- `--font` / `--mono` are Geist and Geist Mono, from Google Fonts

## Put it online (free)

**Netlify (easiest):** go to app.netlify.com/drop and drag the `site` folder onto the page. You get a live link straight away.

**Vercel or GitHub Pages:** push the `site` folder to a GitHub repo (e.g. `github.com/dukeof-tech/portfolio`), then import it on vercel.com, or turn on Pages in the repo settings.

**Custom domain:** once you buy one (e.g. `dukedesigns.com`), add it in your host's domain settings and follow their DNS steps.
