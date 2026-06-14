# Deploying HADIYANA to a Hostinger VPS

The site is fully static (HTML/CSS/JS, no backend), so you just need a web
server to serve the files. These steps use **Nginx** on a fresh **Ubuntu**
Hostinger VPS. Total time: ~10 minutes.

> Replace `hadiyana.com` with your real domain and `203.0.113.10` with your
> VPS IP throughout.

---

## 1. Connect to the VPS

From the Hostinger panel, note your VPS **IP** and **root password** (or set up
an SSH key). Then from your computer:

```bash
ssh root@203.0.113.10
```

## 2. Install Nginx + Git

```bash
apt update && apt install -y nginx git
```

## 3. Get the site onto the server

The repo is public, so clone the `hadiyana` branch straight in:

```bash
git clone -b hadiyana https://github.com/josepharkanet/Event-management-.git /var/www/hadiyana
```

(If the repo later becomes private, upload the files instead with
`scp -r ./site root@203.0.113.10:/var/www/hadiyana`, or use a deploy key.)

## 4. Configure Nginx

```bash
# copy the provided server block
cp /var/www/hadiyana/deploy/nginx-hadiyana.conf /etc/nginx/sites-available/hadiyana

# edit server_name (your domain) and root if you cloned elsewhere
nano /etc/nginx/sites-available/hadiyana

# enable it, disable the default site
ln -s /etc/nginx/sites-available/hadiyana /etc/nginx/sites-enabled/hadiyana
rm -f /etc/nginx/sites-enabled/default

# test config and reload
nginx -t && systemctl reload nginx
```

At this point the site is live over **HTTP** at your VPS IP
(`http://203.0.113.10`).

## 5. Point your domain at the VPS

In your domain's DNS settings (Hostinger → Domains → DNS, or your registrar):

| Type | Name | Value          |
|------|------|----------------|
| A    | `@`  | `203.0.113.10` |
| A    | `www`| `203.0.113.10` |

DNS can take a few minutes to a few hours to propagate.

## 6. Add HTTPS (free, via Let's Encrypt)

Once the domain resolves to the VPS:

```bash
apt install -y certbot python3-certbot-nginx
certbot --nginx -d hadiyana.com -d www.hadiyana.com
```

Certbot installs the certificate, switches the site to HTTPS, and auto-renews.

---

## Updating the site later

Whenever you push new changes to the `hadiyana` branch:

```bash
cd /var/www/hadiyana && git pull
```

That's it — static files, no build step or restart needed.

## Notes

- **Permissions:** if Nginx can't read the files, run
  `chown -R www-data:www-data /var/www/hadiyana`.
- **Firewall:** if `ufw` is on, allow web traffic with
  `ufw allow 'Nginx Full'`.
- **Hero video** still streams from YouTube (needs internet). For a fully
  self-hosted hero, drop an `.mp4` in `assets/img/` and swap the `<iframe>`
  for a `<video>` (see the comment in `index.html` and `README.md`).
- **Lead form** is a client-side stub; wire `#leadForm`'s `action` to a real
  endpoint or a form service when ready (see `README.md`).
