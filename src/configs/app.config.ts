/**
 * @class AppConfig
 * @description config environment + preload bootstrap app
 * @since 1.0.0
 */

import * as path from 'path';
import * as yaml from 'yamljs';

import { AppConfigModel, AppEnvironment } from '../interfaces';
import { Environment } from '../constants';
import { Logger } from '@nestjs/common';

const ROOT = path.normalize(__dirname + '/..');

function setupEnv(): AppEnvironment {
  const mode = (
    process.env.NODE_ENV ||
    process.argv[2] ||
    Environment.production
  ).trim();
  // set environment
  process.env.NODE_ENV = mode;

  Logger.log(
    `Application loaded using the "${mode}" environment configuration.`,
  );

  const env: AppEnvironment = yaml.load(
    path.join(ROOT, `/configs/environment/${mode}.env.yaml`),
  );

  return env as AppEnvironment;
}

const ENV: AppEnvironment = setupEnv();

export default {
  ROOT: ROOT,
  ENV: ENV,
} as AppConfigModel;
