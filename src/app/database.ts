import path from "path";
import { Sequelize } from "sequelize-typescript";
import config from './config'

export const sequelize = new Sequelize(config.MYSQL_DATABASE as string, config.MYSQL_USER as string, config.MYSQL_PASSWORD, {
  host: config.MYSQL_HOST,
  port: config.MYSQL_PORT as unknown as number,
  dialect: 'mysql',
  logging: false,
  timezone: '+08:00',
  models: [path.join(__dirname, '..', 'model.**/*.ts'), path.join(__dirname, '..', 'model/**/*.ts')],
  define: {
    freezeTableName: true
  },
})
const db = async () => {
  try {
    await sequelize.authenticate()
    console.log(`数据库"${config.MYSQL_DATABASE}"连接成功`)
  } catch (error) {
    console.error("数据库连接失败", error)
  }
}

export default db