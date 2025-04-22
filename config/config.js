import dotenv from "dotenv";
import process from "node:process";

dotenv.config();

const config = {
  // Saucedemo users
  Saucedemo_standard_user_LOGIN: process.env.saucedemo_standard_user_LOGIN || 'standard_user',
  Saucedemo_standard_user_PASSWORD: process.env.saucedemo_standard_user_PASSWORD || 'secret_sauce',
  Saucedemo_locked_out_user_LOGIN: process.env.saucedemo_locked_out_user_LOGIN || 'locked_out_user',
  Saucedemo_locked_out_user_PASSWORD: process.env.saucedemo_locked_out_user_PASSWORD || 'secret_sauce',
  Saucedemo_problem_user_LOGIN: process.env.saucedemo_problem_user_LOGIN || 'problem_user',
  Saucedemo_problem_user_PASSWORD: process.env.saucedemo_problem_user_PASSWORD || 'secret_sauce',
  Saucedemo_performance_glitch_user_LOGIN: process.env.saucedemo_performance_glitch_user_LOGIN || 'performance_glitch_user',
  Saucedemo_performance_glitch_user_PASSWORD: process.env.saucedemo_performance_glitch_user_PASSWORD || 'secret_sauce',
  Saucedemo_error_user_LOGIN: process.env.saucedemo_error_user_LOGIN || 'error_user',
  Saucedemo_error_user_PASSWORD: process.env.saucedemo_error_user_PASSWORD || 'secret_sauce',
  Saucedemo_visual_user_LOGIN: process.env.saucedemo_visual_user_LOGIN || 'visual_user',
  Saucedemo_visual_user_PASSWORD: process.env.saucedemo_visual_user_PASSWORD || 'secret_sauce'
};

export default config;
