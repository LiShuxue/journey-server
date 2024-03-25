import { readFileSync } from 'fs';
import * as yaml from 'js-yaml';
import { join } from 'path';

const YAML_CONFIG_FILENAME = `${process.env.NODE_ENV}.yaml`;

// 配置管理，值可以从.env或者.yaml文件中获取
export default () => {
  return yaml.load(readFileSync(join(__dirname, YAML_CONFIG_FILENAME), 'utf8'));
};
