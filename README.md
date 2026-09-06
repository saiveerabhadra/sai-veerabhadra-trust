# Sai Veera Bhadra Trust Website

A responsive website for Sai Veera Bhadra Trust, showcasing its mission, community activities, support programs, gallery, videos, and donation information.

## Features

- Responsive design for desktop, tablet, and mobile devices
- Shared header and footer using `header.html` and `footer.html`
- Runtime layout loading through `layout.js`
- Image carousel with lightbox support
- Video gallery with poster previews and modal playback
- Mobile navigation menu
- Donation, assistance, contact, and birthday-giving pages
- Social media hover effects
- Local image and video assets

## Project Structure

```text
.
├── build.js
├── css/
│   └── style.css
├── images/
├── js/
│   ├── layout.js
│   └── main.js
├── pages/
│   ├── header.html
│   ├── footer.html
│   ├── index.html
│   ├── about.html
│   ├── activities.html
│   ├── gallery.html
│   ├── education.html
│   ├── medical.html
│   ├── food.html
│   ├── skill.html
│   ├── assistance.html
│   ├── donate.html
│   ├── birthday.html
│   └── contact.html
└── videos/
```

## Running the Website

Because the website loads the shared header and footer using JavaScript `fetch()`, run it through a local server.

### Using VS Code Live Server

1. Open the project in VS Code.
2. Right-click `index.html`.
3. Select **Open with Live Server**.
4. Open the provided browser URL.

Do not open the pages directly using ``, because browser security restrictions block JavaScript file fetching.

## Shared Header and Footer

The shared files are:

```text
pages/header.html
pages/footer.html
```

All pages load them through:

```text
js/layout.js
```

After changing the shared layout or page placeholders, run:

```bash
node build.js
```

## Technologies

- HTML5
- CSS3
- JavaScript
- Font Awesome
- Google Fonts
- VS Code Live Server

## Contact

**Sai Veera Bhadra Trust**  
Andhra Pradesh, India

Email: `saiveerabhadra24@gmail.com`  
Phone: `7702550818`
