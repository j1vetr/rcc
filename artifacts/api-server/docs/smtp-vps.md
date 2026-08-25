# RCC SMTP production configuration

The RCC API reads mail settings from its process environment. Production values belong in `/etc/rcc-api.env`, not in the repository.

## Required values

```dotenv
SMTP_HOST=mail.toov.com.tr
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=no-reply@toov.com.tr
SMTP_PASSWORD=replace-with-a-rotated-secret
SMTP_FROM_ADDRESS=no-reply@toov.com.tr
SMTP_FROM_NAME=RCC Royal Car Cleaning
ADMIN_NOTIFICATION_EMAIL=replace-with-the-private-admin-address
```

Use port `465` with `SMTP_SECURE=true` for implicit TLS. If the mail provider requires STARTTLS on port `587`, set `SMTP_PORT=587` and `SMTP_SECURE=false`.

## VPS procedure

1. Edit `/etc/rcc-api.env` as root and add the required values.
2. Set restrictive ownership and permissions with `root:root` and mode `600`.
3. Confirm that the `rcc-api` PM2 process loads `/etc/rcc-api.env`.
4. Run `rccup` to pull the update, install packages, build the API and restart only RCC services.
5. Check the `rcc-api` logs for startup errors. Do not log or paste SMTP values.

The root PM2 daemon also hosts unrelated applications. Do not use global PM2 maintenance commands such as `pm2 update`, `pm2 kill` or a blind `pm2 save`.

## Secret rotation

If an SMTP password has been shared outside the private environment file, rotate it in the mail provider panel, update `/etc/rcc-api.env` and restart with `rccup`. Keep the previous password out of commits, logs and support messages.