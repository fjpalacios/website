# Website

This is the repository for my next personal website.

## Steps to run this program
This program can be run in both development and production environments.

If you want to clone this repo you can do it by running:

``` console
$ git clone git@github.com:fjpalacios/website.git
```

### Development *Classical* Way
``` console
$ yarn
$ yarn develop
```

### Development Docker Way
``` console
$ make build
$ make run
```

### Production *Classical* Way
``` console
$ yarn
$ yarn build
```
At this point a `public` directory has been created, it contains all the static
files that you need to move into production.

### Production Docker Way
The Docker Way of the production environment generates from node the necessary
static files and moves these statics to the default path of an nginx server
with port 80 exposed. I prefer port 8080 on the host machine, but it's up to
you to choose which you prefer and change it in the `docker run` command.

``` console
$ docker build -t website:latest .
$ docker run -itd -p 8080:80 --rm --name website website:latest
```

For detailed explanation on how things work, check out
[Gatsby docs](https://www.gatsbyjs.org/docs/).
