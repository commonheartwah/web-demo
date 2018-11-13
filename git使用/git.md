1. 根据master 新建自己的分支
- git checkout xxx master -b
2. 拉去远程分支
- git fetch
3. 删除本地分支
- git branch -d xxx
4. 删除本地分支后， git branch -r 但是依旧可以看到删除的分支
- 首先看远程分支有哪些是变化的 git remote show origin
- 然后执行 git remote prune origin
- 最后执行 git branch -a 或者 git branch -r 这样看到的分支与远程仓库中的分支是一样的了
5. 包的安装
- 运行时依赖 --save      dependencies
- 开发时依赖 --save-dev  devDependencies