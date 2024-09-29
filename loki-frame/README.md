## Getting Started

Download Raspbian Lite

Install
`sudo apt-get update -qq

sudo apt-get install --no-install-recommends xserver-xorg-video-all \
 xserver-xorg-input-all xserver-xorg-core xinit x11-xserver-utils \
 chromium-browser unclutter

# Go to: Boot Options > Console Autologin

sudo raspi-config
`

Add to .bash_profile
`if [ -z $DISPLAY ] && [ $(tty) = /dev/tty1 ]
then
  startx
fi`
Add to .xinitrc
`
#!/usr/bin/env sh
xset -dpms
xset s off
xset s noblank

unclutter &
chromium-browser http://localhost:3000 \
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
`
In /boot/config.txt`
disable_overscan=1
`
