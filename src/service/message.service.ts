import Message from "../model/message_model"

class MessageService {
  async getTeamMessage(teamId: number) {
    const res = await Message.findAll({
      where: {
        isDelete: 0,
        teamId
      }
    })
    return res
  }
}
export default new MessageService