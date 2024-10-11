
# Lokiframe

A Nextjs project for people who want to locally host a digital picture frame.
Users can add pictures and change picture frame settings at `/` and photo show is on `/frame`.


## Raspberry Pi Setup to bare minimum
Setup Raspbian Lite on Raspberry Pi

**Initial Commands:** \
`sudo apt update`

```
sudo apt install --no-install-recommends xserver-xorg-video-all \
 xserver-xorg-input-all xserver-xorg-core xinit x11-xserver-utils \
 chromium-browser unclutter
 ```
***Install node v20***
```
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.0/install.sh | bash
nvm install 20
``` 

**Set auto login:**  
- `sudo raspi-config` 
  -  Boot Options > Console Autologin 

**Add to ~/.profile:**
```bash
if [ -z $DISPLAY ] && [ $(tty) = /dev/tty1 ]
then
  startx
fi
```

**Add to .xinitrc:**
```bash
#!/usr/bin/env sh
xset -dpms
xset s off
xset s noblank

unclutter &
chromium-browser http://localhost:3000/frame \
 --window-size=1920,1080 \
 --window-position=0,0 \
 --start-fullscreen \
 --kiosk \
 --noerrdialogs \
 --disable-translate \
 --no-first-run \
 --fast \
 --fast-start \
 --disable-infobars \
 --disable-features=TranslateUI \
 --overscroll-history-navigation=0 \
 --disable-pinch
```

**Set /boot/config.txt**
```
disable_overscan=1
```

## Run Locally

Install dependencies

```bash
  npm install
```

Start the server

```bash
  npm run build
  npm run start
```

`localhost:3000` to add photos \
`localhost:3000/frame` for digital picture frame
