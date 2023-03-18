import { Context } from "koa";
import Schema, { Values, Rules } from 'async-validator'

async function validata<T extends Values>(data: any, rules: Rules): Promise<{ data: T | {}, error: any | null }> {
  const validator = new Schema(rules)
  let newTeamInfo = data
  return await validator.validate(newTeamInfo).then((res) => {
    return {
      data: res as T,
      error: null
    }
  }).catch(err => {
    return {
      data: {} as T,
      error: err.errors[0].message
    }
  })
}

export default validata