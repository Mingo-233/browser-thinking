# 前言

前端在开发项目的过程中，会引入很多静态资源，例如各种格式的图片（png,svg,jpg,webp...）在频繁迭代开发过程中，经常会遇到这次还用这张图片，下个迭代就不用了，但是之前引入的资源总是会遗忘处理，久而久之在项目中会留存很多不需要的资源。 这些废弃资源不仅会影响打包体积还特别碍眼，所以想有没有一个脚本可以自动处理删除这些未用到的资源，网上搜了一下大多是一些python脚本或者java的，对于前端并不是那么好用。于是自己便写了一个node的，分享给大家。




# 1用法

1. 将脚本放置于项目根目录下（你也可以放在其他目录，但是脚步内的相关路径代码需要适配更改一下）

2. 在脚本内配置2个文件目录地址，一个是当前项目用于存放静态资源（图片）的文件夹地址 **inputImgFileDir**，一个是需要检索的文件夹地址 **needHandleFileDirs** （例如vue项目大多是一个页面文件夹/views，一个公共组件文件夹/components）
3. 在当前脚本目录下执行脚本即可 node xxx.js


# 2大致思路：
1. 先检索所有的图片文件，记录名称和相对应的文件地址，数组allImgFileList
2. 为所有的图片名称生成正则规则
3. 匹配读取所有的代码文件，每次读取内容进行正则匹配，若匹配到，则从整体记录的资源数组中删除这个资源
4. 到最后，仍留在allImgFileList中的资源就是未被查找到的资源，进行删除处理


# 3nodejs脚本
```
const fs = require("fs");
const path = require("path");
// 包含项目图片文件夹地址
let inputImgFileDir = "./src/assets/images";
// 包含需要检索的代码文件夹地址
let needHandleFileDirs = ["./src/views", "./src/components"];

let allImgFileList = [];
// 递归查找指定文件夹下所有图片资源
recursionFindImg(inputImgFileDir);

// 生成所有正则规则
let regList = [];
for (const img of allImgFileList) {
  let regRule = new RegExp(img.imgName);
  regList.push({ regRule: regRule, name: img.imgName });
}
// 开始检索指定文件夹是否有未使用的图片
for (const needHandleFileDir of needHandleFileDirs) {
  recursionSearchFile(needHandleFileDir);
}

console.log("未被使用的文件list");
console.log(allImgFileList);
// 开始批量删除
for (const unusedImg of allImgFileList) {
  DelUnusedFiles(unusedImg.absDir);
}

function recursionFindImg(currentPath) {
  let imgDirNames = fs.readdirSync(path.join(__dirname, currentPath));
  let fileDirList = [];
  fileDirList = imgDirNames.filter((dirName) => {
    if (dirName.includes(".")) {
      allImgFileList.push({
        imgName: dirName,
        absDir: currentPath + "/" + dirName,
      });
    }
    return !dirName.includes(".");
  });
  for (const dir of fileDirList) {
    recursionFindImg(`./src/assets/images/${dir}`);
  }
}

function recursionSearchFile(currentPath) {
  const files = fs.readdirSync(path.join(__dirname, currentPath));
  let fileDirList = [];
  let fileList = [];
  fileDirList = files.filter((dirName) => {
    if (dirName.includes(".")) {
      fileList.push(dirName);
    }
    return !dirName.includes(".");
  });
  for (const fileName of fileList) {
    let context = fs.readFileSync(
      path.join(__dirname, `${currentPath}/${fileName}`),
      { encoding: "utf-8" }
    );

    for (const reg of regList) {
      if (reg.regRule.test(context)) {
        let i = allImgFileList.findIndex((img) => img.imgName === reg.name);
        if (i > -1) {
          allImgFileList.splice(i, 1);
        }
      }
    }
  }
  for (const fileDir of fileDirList) {
    recursionSearchFile(currentPath + "/" + fileDir);
  }
}

function DelUnusedFiles(imgPath) {
  fs.rm(path.join(__dirname, imgPath), (err) => {
    if (err) {
      console.log(err);
    }
  });
}

```

# 4效果

控制台：

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9533fd095c754d2daf7ec2e641f140a4~tplv-k3u1fbpfcp-watermark.image?)

git diff

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/dc9f15c8150e43f29c58d2c19f2aff13~tplv-k3u1fbpfcp-watermark.image?)

# 5.后续


1 该脚本是自己随意写着玩的，略有粗糙，若觉的有优化的地方欢迎评论指出

 现有的不足之处就是:   
 如果这个资源在代码中是被注释掉的，未被使用，无法区分，这个资源会被认为被使用了。

2 git项目地址

