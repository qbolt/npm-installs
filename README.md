# npm-installs

## Description :
**`npm-installs`** is a command-line application that allows you to run `npm install` on specified directories concurrently using a single command. It also has support for recursive installs with a an optional specified depth.

**`npm-installs` will automatically exclude all `/node_modules` directories.** 

## Installation

`npm i -g npm-installs`

## Usage :

`npm-installs <...dirs> [options]`

### Examples

##### Running `npm install` on proj1 and proj2 within ~/code/projects

```bash
$ npm-installs proj1 proj2
Starting `npm install` for '/Users/johndoe/code/projects/proj1'
Starting `npm install` for '/Users/johndoe/code/projects/proj2'
Completed '/Users/johndoe/code/projects/proj1'
Completed '/Users/johndoe/code/projects/proj2'
Completed all
```

---

##### Running `npm install` on all projects in a given directory recursively

*If the specified directory contains a `package.json`, it will also have `npm install` called on it.*

```bash
$ npm-installs projects -r
Starting `npm install` for '/Users/johndoe/code/projects/proj1'
Starting `npm install` for '/Users/johndoe/code/projects/proj2'
Completed '/Users/johndoe/code/projects/proj1'
Completed '/Users/johndoe/code/projects/proj2'
Completed all
```
---

##### Running `npm install` on all projects in a given directory including that directory with a `depth` of `2`

Folder structure
```
/project-root
    /proj1
    /proj2
        /subproj1
        /subproj2
            /deeplynestedproj
```

*With a depth of 2, `/deeplynestedproj` will be excluded*

```bash
$ npm-installs project-root -d 2
Starting `npm install` for '/Users/johndoe/code/project-root'
Starting `npm install` for '/Users/johndoe/code/project-root/proj1'
Starting `npm install` for '/Users/johndoe/code/project-root/proj2'
Starting `npm install` for '/Users/johndoe/code/project-root/proj2/subproj1'
Starting `npm install` for '/Users/johndoe/code/project-root/proj2/subproj2'
Completed '/Users/johndoe/code/project-root'
Completed '/Users/johndoe/code/project-root/proj1'
Completed '/Users/johndoe/code/project-root/proj2'
Completed '/Users/johndoe/code/project-root/proj2/subproj1'
Completed '/Users/johndoe/code/project-root/proj2/subproj1'
Completed all
```
