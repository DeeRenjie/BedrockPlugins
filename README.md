# StoneServer 如何添加插件
**截至更新 StoneServer支持版本 1.12**

StoneServer一大特色就是其扩展了官方的脚本api，让玩家可以使用脚本来制作插件。官方脚本是通过行为包来加载的，而StoneServer的插件实际上也正是特殊的行为包，添加它们的方法是相似的。

**注意，StoneServer存在一些BUG，而作者每天都在勤劳的修复扩展中👍，所以安装插件前请务必先运行install.sh并选择install cobblestone进行更新，以及想在游戏里输入命令需要开启作弊**
![如图所示](https://s2.ax1x.com/2019/07/29/e86wKP.th.png)

## 下载插件

目前似乎还没有太多人开发插件。。（欢迎大家加入插件的学习 **telegram：https://t.me/stone_server**
下面列出了已知可用的插件（1.12）
- [EasyEssentialsV2 基础指令插件](https://github.com/haojie06/BedrockPlugins/tree/master/EasyEssentialsV2)
此插件提供了诸如 /tpa /back /home 等功能
- [BehaviourLog 玩家行为日志插件](https://github.com/haojie06/BedrockPlugins/tree/master/BehaviourLog)
此插件用于记录玩家的破坏/放置/开箱等行为 减少纠纷
- [Elevator 方块电梯插件](https://github.com/haojie06/BedrockPlugins/tree/master/Elevator)
名字就可以看出这是一个电梯插件
- [EasyList 简易黑白名单插件](https://github.com/haojie06/BedrockPlugins/tree/master/EasyList)
这个插件不同于原生白名单，它可以将玩家id和QQ号之类的东西绑定起来，不过目前还不成熟(我是结合QQ机器人使用的)
- [Lagremover 自动清理插件](https://github.com/haojie06/BedrockPlugins/tree/master/LagRemover)
定时清理生物/掉落物 /lagstatus显示待清理状态 更新后此插件会清理几乎所有的（除了村民/鹦鹉/熊猫/僵尸村民等）未命名生物实体
，所以需要养殖的请准备大量命名牌，好处是*在我的服里* 大大的降低了卡顿。 另外清理名单/间隔都可以在脚本中设置

*上面这些插件都是已知的（我写的。。），虽然代码可能很幼稚，不过也算付出了一点劳动，欢迎给个star支持支持。*

我的插件都会同时上传.tgz打包文件，比如https://github.com/haojie06/BedrockPlugins/tree/master/EasyEssentialsV2 中的 **EasyEssentialsV2.tgz** 这个文件（*插件成熟后我也会直接从release发布*），下载后上传到服务器上数据文件夹中的 **development_behavior_packs**目录下，执行`tar -zxvf EasyEssentialsV2.tgz`解压可得行为包文件夹，然后我们需要打开文件夹中的manifest.json。
```
nano EasyEssentials/manifest.json
#我们会看到类似于以下的内容
{
  "format_version": 1,
  "header": {
    "name": "EasyEssentials 2.0",
    "description": "for stoneserver created by haojie06",
    "uuid": "3289a580-6d2f-46fe-bc37-6dd121800f42",
    "version": [0, 0, 0],
    "min_engine_version": [1, 12, 0]
  },
  "modules": [
    {
      "description": "data",
      "type": "data",
      "uuid": "21cfd061-9e23-4875-8a08-68169b225de9",
      "version": [0, 0, 0]
    }
  ]
}
```

在这里面，我们只需要复制出**header**中的两段,注意version之后的逗号要删掉。
```
"uuid": "3289a580-6d2f-46fe-bc37-6dd121800f42",
"version": [0, 0, 0]
```
在存档中编辑**world_behavior_packs.json**（如果没有的话就新建）
```
nano /home/minecraft/cobble/start/worlds/world/world_behavior_packs.json
#以我的json文件为例（注意多个行为包的写法），填入我们刚才复制的内容，注意格式！
[
{
    "pack_id": "3289a580-6d2f-46fe-bc37-6dd121800f42",
    "version": [0, 0, 0]
},
{
    "pack_id": "018718bc-ed21-42be-841d-839bc7eb1ca1",
    "version": [0, 0, 0]
}
]
```
**需要注意的是，之前复制出来的uuid在这里要改成pack_id**，修改完毕之后保存，重启服务器，插件就应该成功加载了。
