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
    recursionFindImg(`${currentPath}/${dir}`);
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
