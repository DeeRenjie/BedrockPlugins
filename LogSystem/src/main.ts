/* 
create by haojie06 2019/6/10
用于记录玩家在游戏中的行为 （超简化版coi..）
*/
import { MySystem,system } from "./system";
import { db,addRecord,readRecord } from "./database";
import { getTime,checkIfBlock,stringToInt,checkIfContainer,transNum } from "./utils";
system.initialize = function() {
  server.log("日志系统v1.1 https://github.com/haojie06/BedrockPlugins");
  //检测记录破坏方块
  this.checkDestroy((player,info)=>{
      let playerInfo = this.actorInfo(player);
      let blockInfo = info.block;
      let blockPos = info.blockpos;
      let dim = playerInfo.dim;
      let playerName = playerInfo.name;
      let blockName = blockInfo.value.name;
      let pX = transNum(playerInfo.pos[0]);
      let pY = transNum(playerInfo.pos[1]);
      let pZ = transNum(playerInfo.pos[2]);

      let bX = transNum(blockPos[0]);
      let bY = transNum(blockPos[1]);
      let bZ = transNum(blockPos[2]);

      let time = getTime();
      //server.log(`${time} ${playerName}(${pX},${pY},${pZ}) 破坏 ${blockName}(${bX},${bY},${bZ}) `);
      addRecord(time, playerName, pX, pY, pZ, "break", blockName, bX, bY, bZ, dim);
    });
/*
  this.checkBuild((player,info)=>{
    let playerInfo = this.actorInfo(player);
      let blockPos = info.blockpos;

      let playerName = playerInfo.name;
      let pX = playerInfo.pos[0].toFixed(0);
      let pY = playerInfo.pos[1].toFixed(0);
      let pZ = playerInfo.pos[2].toFixed(0);

      let bX = blockPos[0].toFixed(0);
      let bY = blockPos[1].toFixed(0);
      let bZ = blockPos[2].toFixed(0);

      let time = getTime();
      server.log(`${time} ${playerName}(${pX},${pY},${pZ}) build 方块(${bX},${bY},${bZ}) `);
  });
*/
//手中有物品 右键方块时调用
/*
  this.checkUse((player,info)=>{
      let playerInfo = this.actorInfo(player);
      let item:ItemInstance = info.item;
      let playerName = playerInfo.name;
      let itemName = item.name;
      let itemNum = item.count;
      let pX = playerInfo.pos[0].toFixed(0);
      let pY = playerInfo.pos[1].toFixed(0);
      let pZ = playerInfo.pos[2].toFixed(0);

      let bX = blockPos[0].toFixed(0);
      let bY = blockPos[1].toFixed(0);
      let bZ = blockPos[2].toFixed(0);

      let time = getTime();
      server.log(`${time} ${playerName}(${pX},${pY},${pZ}) useItem ${itemName}`);
  });
*/
//放置方块记录 1.12之后需要升级
  this.checkUseOn((player,info,result)=>{
      if (result == true) {
        try {
          let time = getTime();
          let playerInfo = this.actorInfo(player);
          let dim = playerInfo.dim;
          let item:ItemInstance = info.item;
          let playerName = playerInfo.name;
          let itemName = "minecraft:" + item.name;
          let itemNum = item.count;
          let pX = transNum(playerInfo.pos[0]);
          let pY = transNum(playerInfo.pos[1]);
          let pZ = transNum(playerInfo.pos[2]);
          let vec3:Vec3 = info.position;
          if(itemName != null){
            if(checkIfBlock(itemName) == true){
          //server.log(`${time} ${playerName}(${pX},${pY},${pZ}) 放置 ${itemName}(${transNum(Number(vec3[0]))},${transNum(Number(vec3[1]))},${transNum(Number(vec3[2]))})`);
          addRecord(time, playerName, pX, pY, pZ, "place", itemName, transNum(Number(vec3[0])), transNum(Number(vec3[1])), transNum(Number(vec3[2])), dim);  
        }else{
          }
        }
        } catch (error) {
        }
    }
  });

  //检测打开容器 未来升级
  this.checkUseBlock((player,info)=>{
          let time = getTime();
          let playerInfo = this.actorInfo(player);
          let dim = playerInfo.dim;
          let block = info.block;
          let blockPos = info.blockpos;
          let playerName = playerInfo.name;
          let pX = transNum(playerInfo.pos[0]);
          let pY = transNum(playerInfo.pos[1]);
          let pZ = transNum(playerInfo.pos[2]);
          let blockName = block.value.name;
          let bX = transNum(blockPos[0]);
          let bY = transNum(blockPos[1]);
          let bZ = transNum(blockPos[2]);
          if(checkIfContainer(blockName)){
            //server.log(`${time} ${playerName} dim:${dim}(${pX},${pY},${pZ}) 打开容器 ${blockName}(${bX},${bY},${bZ})`);
            addRecord(time, playerName, pX, pY, pZ, "open", blockName, bX, bY, bZ, dim);
          }
  })
//添加查询命令
// /logs x y z x y z 可选：行为
// /logsof playerName
this.registerCommand("logs", {
  description: "读取日志",
  permission: 1,
  overloads: [
    {
      parameters: [{
        name:"start",
        type:"position"
      },
      {
        name:"end",
        type:"position"
      },
      {//可选的行为名称 （破坏 放置 打开）
        name:"action",
        type:"string",
        optional:true
      }
    ],
      handler(origin,[start,end,action]) {
        if (!origin.entity) throw "Player required";
        const info = this.actorInfo(origin.entity);
        let sX = transNum(start[0]);
        let sY = transNum(start[1]);
        let sZ = transNum(start[2]);

        let eX = transNum(end[0]);
        let eY = transNum(end[1]);
        let eZ = transNum(end[2]);

        let dim = info.dim;
        let records:string[];
        if(action == ""){
          //server.log(`全局查找 ${sX} ${sY} ${sZ}`);
          records = readRecord(sX,sY,sZ,eX,eY,eZ,dim);
        }
        else{
          //server.log("特定行为查找" + action);
          records = readRecord(sX,sY,sZ,eX,eY,eZ,dim,action);
        }
        let say:string = `§a§l日志系统1.0 by haojie06 以下为查找到的记录：§f\n`;
        for(let line of records){
          say = say + line + "\n";
        }
        //server.log(say);
        this.invokeConsoleCommand("§aLogSystem",`tell ${info.name} ${say}`);
      }
    } as CommandOverload<MySystem, ["position","position","string"]>
  ]
});
};