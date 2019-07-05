1. 根据master 新建自己的分支
- git checkout -b xxx master 
2. 拉去远程分支
- git fetch
3. 删除本地分支
- git branch -d xxx
4. 删除本地分支后， git branch -r 但是依旧可以看到删除的分支
- 首先看远程分支有哪些是变化的 git remote show origin
- 然后执行 git remote prune origin
- 最后执行 git branch -a 或者 git branch -r 这样看到的分支与远程仓库中的分支是一样的了
5. 切换镜像源
- npm config set registry https://registry.npm.taobao.org（切换）
- npm config get registry（检查）
