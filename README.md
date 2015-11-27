MOAT js Firmware App
========

# System Requirements

If you want to run this application on your ServiceSync, here's what it takes:
* __ServiceSync Server:__ `v2.2.5` or later
* __ServiceSync Clinet:__ `v1.1.2` or later

Supported gateway devices are as follows:

* __Generic Intel-based PCs:__ Debian `7.x` (Wheezy)
* __Amradillo-IoT / G2:__  Kernel `v3.14-at4` + AtmarkDist `v20151026` or later
* __OpenBlocks:__ Firmware `1.0.5` or later
* __Raspberry Pi:__ Raspbian `May 2015`

## Server Package

### Preparing Development Environment

To develop a Server Package, `Node.js`, `Grunt` and `Java`(1.6 or later) are required. If these tools even work, you are able to use any Operating System what you like.

In case of using Mac or Linux, you can install `Node.js` with [nodebrew](https://github.com/hokaccha/nodebrew).
The blow is a sample to install Node.js `v0.12.5`.
```
$ nodebrew install-binary v0.12.5
$ nodebrew use v0.12.5
$ node -v
v0.12.5
```

[Grunt](http://gruntjs.com/) is required to build the Server Package. Install Grunt as follows.
```
$ npm install -g grunt-cli
```
Java Runtime is required by Grunt task. Install Java Runtime.

Linux:
```
$ sudo apt-get install openjdk-7-jre
```

Mac or Windows:
* Refer to https://www.java.com/en/download/help/download_options.xml

### Build

Get the source code.

Execute the following commands to build the Server Package. The Server Package named `firmware-${VERSION}.zip` will be generated.
```
$ npm install
$ grunt pack
```

If you want to clean artifacts, execute the following command.
```
$ grunt clean
```

### Deploy

1. Login to ServiceSync Web Console with PP's (Platform Provicer) account.
2. Select [Packages] from the side menu.
3. Open [Server Packages] tab.
4. Click [Add] Button. Pop-up window will appear.
5. Select the Server Package and click [submit] button.
6. Push [Deploy] button in [Detail Info].


# Limitation

* No limitation as of now

# Known Bugs

* No bug as of now

# Change History

## Server Package

### `1.0.0` November 30, 2015

* Initial Release
