import crypto from 'crypto'
const md5password = (openId: string) => {
  const md5 = crypto.createHash('md5');
  const result = md5.update(openId).digest('hex');
  return result;
}
export default md5password;

