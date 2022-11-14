## 1. Git基础

### 1.2 Git 是什么

Git是一个版本管理控制系统（缩写VCS），它可以在任何时间点，将文档的状态作为更新记录保存起来，也可以在任何时间点，将更新记录恢复回来。


### 1.4 Git 基本工作流程

| git仓库          | 暂存区             | 工作目录            |
| ---------------- | ------------------ | ------------------- |
| 用于存放提交记录 | 临时存放被修改文件 | 被Git管理的项目目录 |

![](assets/05.png)

### 1.5 Git 的使用

#### 1.5.1 Git 使用前配置

在使用 git 前，需要告诉 git 你是谁，在向 git 仓库中提交时需要用到。

1. 配置提交人姓名：`git config --global user.name 提交人姓名`
2. 配置提交人姓名：`git config --global user.email 提交人邮箱` 
3. 查看git配置信息：`git config --list`   
4.   git config --global user.email "you@example.com"
     git config --global user.name "Your Name"

**注意**
1. 如果要对配置信息进行修改，重复上述命令即可。

2. 配置只需要执行一次。

#### 1.5.2 提交步骤

1. `git init` 初始化git仓库
2. `git status` 查看文件状态
3. `git add 文件列表` 追踪文件（git add .  可以添加所有文件）
4. `git commit -m 提交信息`  向仓库中提交代码
5. `git log` 查看提交记录

git 提交时如果想忽略某些文件或者目录：
1.在根目录下创建 .gitignore 文件
2.在该文件中直接添加内容，如：
#忽略.mdb、.sln、.sln,.config ，文件，不忽视 .txt 文件
*.mdb
*.ldb
*.sln
.config
!.txt
#忽略node_modules，Debug目录及文件，忽视obj目录

node_modules
Debug
obj/

#### 1.5.3 撤销

- 用暂存区中的文件覆盖工作目录中的文件： `git checkout 文件`

- 将文件从暂存区中删除： `git rm --cached 文件`
- 将 git 仓库中指定的更新记录恢复出来，并且覆盖暂存区和工作目录：`git reset --hard commitID` <br>
**Tips:<br>commitID 可以先git log 查看提交记录里面有id值，想要恢复到哪个版本就写哪次提交的id**
  比如现有a1 a2 a3 a4四个版本，此时我们恢复a2版本，后面的a3 和a4版本将被清除掉
![](assets/07.png)


## 2. Git进阶

### 2.1 分支

为了便于理解，大家暂时可以认为分支就是当前工作目录中代码的一份副本。

使用分支，可以让我们从开发主线上分离出来，以免影响开发主线。

![](assets/08.png)



#### 2.1.1 分支细分

1. 主分支（master）：第一次向 git 仓库中提交更新记录时自动产生的一个分支。

2. 开发分支（develop）：作为开发的分支，基于 master 分支创建。

3. 功能分支（feature）：作为开发具体功能的分支，基于开发分支创建


**功能分支 -> 开发分支 -> 主分支**

#### 2.1.2 分支命令

- `git branch` 查看分支

- `git branch 分支名称` 创建分支

- `git checkout 分支名称` 切换分支

- `git merge 来源分支` 合并分支

- `git branch -d 分支名称` 删除分支（分支被合并后才允许删除）（-D 强制删除）
<br>
**Tips：<br> 
1比如我切换到开发分支创建了文件并把它提交到仓库了，那么我只能在git切换到开发分支的时候，我的编辑软件例如vscode，里面才会有开发分支里面的文件，如果我切换到其他其他分支我是看不到开发分支里面的文件的<br>
2比如我要合并开发分支到主分支上，那么我要在主分支上进行操作，合并完成之后我们在主分支时就可以看到开发分支的文件代码了。另外当我们合并完之后，我们还是可以切换到开发分支上去编辑代码<br>
3同理要删除分支a，那当前不能在a分支的状态下删除a<br>
4分支是不能随意切换的，必须把当前分支里面的改动提交到仓库后才能切换到其他分支，保证工作副本的干净，否则当前分支里面的暂存区的内容会被带到其他分支上去**


### 2.2 暂时保存更改

在git中，可以暂时提取分支上所有的改动并存储，让开发人员得到一个干净的工作副本，临时转向其他工作。

使用场景：分支临时切换

- 存储临时改动：`git stash`
- 恢复改动：`git stash pop`<br>
Tips：<br>1这个改动是独立于分支的，也就是说如果已经存储临时改动内容，后来恢复改动，但是这个恢复是可以恢复到其他分支上去的，所以要注意当前处于什么分支
## 3. Github

在版本控制系统中，大约90%的操作都是在本地仓库中进行的：暂存，提交，查看状态或者历史记录等等。除此之外，如果仅仅只有你一个人在这个项目里工作，你永远没有机会需要设置一个远程仓库。

只有当你需要和你的开发团队共享数据时，设置一个远程仓库才有意义。你可以把它想象成一个 “文件管理服务器”，利用这个服务器可以与开发团队的其他成员进行数据交换。


### 3.2 多人协作开发流程

- A在自己的计算机中创建本地仓库
- A在github中创建远程仓库
- A将本地仓库推送到远程仓库
- B克隆远程仓库到本地进行开发
- B将本地仓库中开发的内容推送到远程仓库
- A将远程仓库中的最新内容拉去到本地

### 3.3 创建仓库

1. 填写仓库基本信息

2. 将本地仓库推送到远程仓库

   1. git push 远程仓库地址 分支名称

   2. git push 远程仓库地址别名 分支名称

   3. git push -u 远程仓库地址别名 分支名称

       -u 记住推送地址及分支，下次推送只需要输入git push即可

   4. git remote add 远程仓库地址别名 远程仓库地址
       <br>
       **Tips：<br>仓库别名一般写origin**

### 3.3  [查看远程库信息(git remote的用法)]
     1 git remote 查看远程库的信息
     2 git remote –v 查看远程库的详细信息
     3 git remote add name url 添加远程仓库
     4 git remote rename oldname newname 重命名仓库
     5 git remote rm 删除仓库

### 3.4 拉取操作

#### 3.4.1 克隆仓库

克隆远端数据仓库到本地：`git clone 仓库地址`

#### 3.4.2 拉取远程仓库中最新的版本

拉取远程仓库中最新的版本：`git pull 远程仓库地址 分支名称`
   <br>
**Tips：
1克隆是下载全部的内容，和pull拉去会跟本地仓库比较，下载更新的部分<br>
2如果远程仓库中的版本高于本地仓库，那么此时本地仓库是不能向远程仓库推送的，必须先拉取仓库最新的版本在去提交**

#### Git :fatal: refusing to merge unrelated histories解决
原因是两个分支是两个不同的版本，具有不同的提交历史
`$git pull origin master --allow-unrelated-histories`
可以允许不相关历史提，强制合并

### 回退版本 git如何撤销上一次commit操作

1.第一种情况：还没有push，只是在本地commit

`git reset --soft|--mixed|--hard <commit_id>`
git push develop develop --force  (本地分支和远程分支都是 develop)
这里的<commit_id>就是每次commit的SHA-1，可以在log里查看到

--mixed    会保留源码,只是将git commit和index 信息回退到了某个版本.
--soft   保留源码,只回退到commit信息到某个版本.不涉及index的回退,如果还需要提交,直接commit即可.
--hard    源码也会回退到某个版本,commit和index 都会回退到某个版本.(注意,这种方式是改变本地代码仓库源码)

当然有人在push代码以后,也使用 reset --hard <commit...> 回退代码到某个版本之前,但是这样会有一个问题,你线上的代码没有变,线上commit,index都没有变,当你把本地代码修改完提交的时候你会发现全是冲突.....这时换下一种


2.commit push 代码已经更新到远程仓库

对于已经把代码push到线上仓库,你回退本地代码其实也想同时回退线上代码,回滚到某个指定的版本,线上,线下代码保持一致.你要用到下面的命令

`git revert <commit_id>`
revert 之后你的本地代码会回滚到指定的历史版本,这时你再 git push 既可以把线上的代码更新。

注意：git revert是用一次新的commit来回滚之前的commit，git reset是直接删除指定的commit，看似达到的效果是一样的,其实完全不同。

第一:上面我们说的如果你已经push到线上代码库, reset 删除指定commit以后,你git push可能导致一大堆冲突.但是revert 并不会.
第二:如果在日后现有分支和历史分支需要合并的时候,reset 恢复部分的代码依然会出现在历史分支里.但是revert 方向提交的commit 并不会出现在历史分支里.
第三:reset 是在正常的commit历史中,删除了指定的commit,这时 HEAD 是向后移动了,而 revert 是在正常的commit历史中再commit一次,只不过是反向提交,他的 HEAD 是一直向前的.

### 3.6 跨团队协作

1. 程序员 C fork仓库
2. 程序员 C 将仓库克隆在本地进行修改
3. 程序员 C 将仓库推送到远程
4. 程序员 C 发起pull reqest
5. 原仓库作者审核
6. 原仓库作者合并代码

### 3.7 ssh免登陆

https协议仓库地址：https://github.com/itcast-frontEnd/git-demo.git

![](assets/22.png)

生成秘钥：`ssh-keygen`

秘钥存储目录：C:\Users\用户\\.ssh

公钥名称：id_rsa.pub

私钥名称：id_rsa <br><br>
**在远程仓库里面设置公钥**
![](assets/23.png)

![](assets/24.png)

git remote add origin_ssh xxxxssh远程仓库地址 //为ssh地址取别名

git push origin_ssh //利用ssh免登陆推送
### 3.8 GIT忽略清单

将不需要被git管理的文件名字添加到此文件中，在执行git命令的时候，git就会忽略这些文件。

git忽略清单文件名称：**.gitignore**

将工作目录中的文件全部添加到暂存区：`git add .`(add后面是个.)


### 4.0 Git fetch和git pull的区别
一、远端跟踪分支不同

1、Git fetch：Git fetch能够直接更改远端跟踪分支。

2、git pull：git pull无法直接对远程跟踪分支操作，我们必须先切回本地分支然后创建一个新的commit提交。

二、拉取不同

1、Git fetch：Git fetch会将数据拉取到本地仓库 - 它并不会自动合并或修改当前的工作。

2、git pull：git pull是从远程获取最新版本并merge到本地，会自动合并或修改当前的工作。
(git pull 等效于 git fetch + git merge ，但是根据commit ID来看的话，他们实际的实现原理是不一样的。)
三、commitID不同

1、Git fetch：使用Git fetch更新代码，本地的库中master的commitID不变，还是等于1。

2、git pull：使用git pull更新代码，本地的库中master的commitID发生改变，变成了2。

### 5.1常用git stash命令：

（1）git stash save "save message"  : 执行存储时，添加备注，方便查找，只有git stash 也要可以的，但查找时不方便识别。

（2）git stash list  ：查看stash了哪些存储

（3）git stash show ：显示做了哪些改动，默认show第一个存储,如果要显示其他存贮，后面加stash@{$num}，比如第二个 git stash show stash@{1}

（4）git stash show -p : 显示第一个存储的改动，如果想显示其他存存储，命令：git stash show  stash@{$num}  -p ，比如第二个：git stash show  stash@{1}  -p

（5）git stash apply :应用某个存储,但不会把存储从存储列表中删除，默认使用第一个存储,即stash@{0}，如果要使用其他个，git stash apply stash@{$num} ， 比如第二个：git stash apply stash@{1} 

（6）git stash pop ：命令恢复之前缓存的工作目录，将缓存堆栈中的对应stash删除，并将对应修改应用到当前的工作目录下,默认为第一个stash,即stash@{0}，如果要应用并删除其他stash，命令：git stash pop stash@{$num} ，比如应用并删除第二个：git stash pop stash@{1}

（7）git stash drop stash@{$num} ：丢弃stash@{$num}存储，从列表中删除这个存储

（8）git stash clear ：删除所有缓存的stash

### 6.1 git clone 他人的项目并git push 到自己的github
    git rm -r --cached .
    git config core.autocrlf false

    git add .

git commit -m "Initial commit"

git push -u origin master

### 6.2取消对某个文件的跟踪步骤：

1、git rm -r -n --cached 文件或目录，列出你需要取消跟踪的文件，可以查看列表，检查下是否有误操作导致一些不应该被取消的文件取消了，是为了再次确认的。-r 表示递归，-n 表示先不删除，只是列出文件。

 
2、git rm -r --cached 文件，取消缓存不想要跟踪的文件


### 7git rebase合并多次commit：

1、 git rebase -i  [startpoint]  [endpoint]
其中-i的意思是--interactive，即弹出交互式的界面让用户编辑完成合并操作，[startpoint] [endpoint]则指定了一个编辑区间，如果不指定[endpoint]，则该区间的终点默认是当前分支HEAD所指向的commit(注：该区间指定的是一个前开后闭的区间)。

git rebase -i HEAD~3  或 git rebase -i 36224db （指定特定一次提交合并）

2、对所有需要合并的提交进行处理操作


下面注释部分是git为我们提供的命令说明。每一个commit id 前面的pick表示指令类型，git 为我们提供了以下几个命令:

> pick：保留该commit（缩写:p）
            reword：保留该commit，但我需要修改该commit的注释（缩写:r）
            edit：保留该commit, 但我要停下来修改该提交(不仅仅修改注释)（缩写:e）
            squash：将该commit和前一个commit合并（缩写:s）
            fixup：将该commit和前一个commit合并，但我不要保留该提交的注释信息（缩写:f）
            exec：执行shell命令（缩写:x）
            drop：我要丢弃该commit（缩写:d）

然后wq保存退出后是注释修改界面


例如 ： 保留第一次提交 合并第二第三次
pick d2cf1f9 fix: 第一次提交
s 47971f6 fix: 第二次提交
s fb28c8d fix: 第三次提交

3、删除被合并的提交 提交注释

> 可以再浏览态 按下两个dd可以删除一行

全部操作完 :wq 保存退出