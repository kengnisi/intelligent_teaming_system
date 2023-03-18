import { Server } from 'http'
import user from '../model/user_model'
import run from "../app/index"
import sequelize from "../app/database"
const userInfo: user = {
  openId: "11111",
  username: "hly",
  avatarUrl: "https://img.yzcdn.cn/vant/cat.jpeg",
  gender: 0,
  phone: "13751892103",
  email: "2879613012@qq.com",
  userStatus: 0,
  userRole: 0,
  tags: "[]",
  profile: "",
} as user
describe("http", () => {
  let server: Server
  beforeAll(() => {
    server = run("8001")
  })
  it("insert", async () => {
    const userList = new Array()
    for (let i = 0; i < 10000; i++) {
      userList.push(userInfo)
    }
    const res = await user.bulkCreate(userList)
    return res
  })
  afterAll(async () => {
    server.close()
  })
})