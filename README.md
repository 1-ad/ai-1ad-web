# 1-ad.com

First-round, as-is import of the existing 1-ad.com website. The website files
remain at the repository root so existing asset paths and preview URLs work.
This baseline does not redesign the site or apply the proposed SEO changes.

## Structure

- `index.html`, `site/`: existing homepage, styles, scripts, branding, and thumbnails.
- `portfolio/`, `projects/`: existing creative samples and their assets.
- `preview/`: creative preview UI, including `?c=portfolio/...` URLs.
- `icons/`, `loops/`, `effects/`, `js/`: existing animation demos and shared code.
- `php/contact.php`: existing PHP contact endpoint.
- `resume/`, `robots.txt`, `sitemap.xml`, `favicon.ico`: existing supporting files.
- `temp/`: original delivery archives included in the supplied build.

## Local preview

For a static visual preview, run the following from this directory:

```sh
python3 -m http.server 8080 --bind 127.0.0.1
```

Open <http://127.0.0.1:8080/>. This command serves the frontend and creative
previews; it does not execute the PHP contact endpoint. Do not expose this static
preview server publicly, because it serves PHP files as source text.

With PHP installed, use its development server instead:

```sh
php -S 127.0.0.1:8080 -t .
```

The existing demos also use external fonts and animation libraries. Some older
samples depend on third-party services that may no longer be available.

## Production requirements

Serve this repository root through the existing PHP-enabled web server, keeping
the directory structure intact. A static-only host cannot run the contact form.

The supplied contact handler expects these server-managed resources:

- `/opt/1-ad/contact-mail/vendor/autoload.php`: PHPMailer autoloader.
- `/etc/1-ad/contact-mail.ini`: private `username` and `password` SMTP settings.
- `/var/lib/1-ad/contact-messages`: private message archive, writable by PHP.
- Outbound Gmail SMTP access on port 587 with STARTTLS.

These resources remain outside the public website and are not included in this
repository. Never commit SMTP credentials or archived contact messages.

## Baseline verification

The import was compared byte for byte against the supplied build directory.
Operating-system metadata files were excluded. Website code, copy, styles,
metadata, tracking, and creative assets were retained without edits.
