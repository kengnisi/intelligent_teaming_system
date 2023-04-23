import WebSocket from "ws";
import Team from "../model/team_model";
import Message from "../model/message_model";
import parmessage from "../model/parmessage_model";
import user_team from "../model/userTeam_model";
class ws {
  static online = 0 // 在线连接
  static wss: WebSocket.Server //默认实例
  static init(server) {
    // 创建实例
    this.wss = new WebSocket.Server({ server, path: '' });
    this.wss.on('connection', async (ws, request) => {
      const websiteType = new URL(request.url, "http://127.0.0.1:3000")
      ws.on('message', (data, isBinary) => {
        const jsData = JSON.parse(data.toString())
        console.log("jsData", jsData)
        switch (jsData.type) {
          case "group":
            this.sendToTeamCliect(jsData)
            break
          case "personal":
            this.sendToPersonalCliect(jsData)
          default:
            return
        }
        return
      });
      try {
        //do something
        // 这里可以做一些加强判断查询数据库等行为
        console.log(typeof websiteType.searchParams.get("userId"))
        ws["userId"] = websiteType.searchParams.get("userId") // 添加ws实例的唯一标识
        const obj = { "message": "连接成功", "retCode": 200 }
        ws.send(JSON.stringify(obj))
      } catch (error) {
        console.log('websocket connection error', error)
        return ws.close();
      }
    });

  }
  // 发送队伍客户端数据
  static async sendToTeamCliect(Data) {
    console.log("Data", Data)
    let iskeep = false // 加个变量做下发成功判断
    if (!(this.wss instanceof WebSocket.Server)) {
      return iskeep;
    }
    const { teamId } = Data
    const teamInfo = await user_team.findAll({
      where: {
        teamId: teamId,
        isDelete: 0
      }
    })
    const userIdList = teamInfo.map((team) => {
      return team.userId
    })
    const resMessage = await Message.create(Data.message)
    this.wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN && userIdList.includes(Number(client["userId"]))) {
        console.log("发送给指定匹配id")
        // 发送给指定匹配id
        console.log(client["userId"])
        client.send(JSON.stringify(Data.message));
        iskeep = true
      }
    });
    return iskeep;
  }
  // 发送个人客户端数据
  static async sendToPersonalCliect(Data) {
    console.log("私聊发送的信息", Data)
    let iskeep = false // 加个变量做下发成功判断
    if (!(this.wss instanceof WebSocket.Server)) {
      return iskeep;
    }

    const { message } = Data
    // const teamInfo = await user_team.findAll({
    //   where: {
    //     teamId: teamId,
    //     isDelete: 0
    //   }
    // })
    // const userIdList = teamInfo.map((team) => {
    //   return team.userId
    // })
    const resMessage = await parmessage.create(Data.message)
    this.wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN && (Number(client["userId"]) == message.acceptUserId || Number(client["userId"]) == message.sendUserId)) {
        console.log("发送给指定匹配id")
        // 发送给指定匹配id
        console.log(client["userId"])
        client.send(JSON.stringify(Data.message));
        iskeep = true
      }
    });
    return iskeep;
  }
}
export default ws
