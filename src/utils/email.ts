import * as nodemailer from 'nodemailer';
import { IBlog } from '../models/Blog';
import sentry from './sentry';
import loadWebPage from './loadWebPage';
import axios from 'axios';
import schedule from 'node-schedule';

// 配置邮件客户端
const transporter = nodemailer.createTransport({
  host: 'smtp.163.com', // 邮件服务商，如：smtp.163.com， smtp.qq.com
  port: 465, // 默认情况下为587，如果设置secure为true时则默认为465
  secure: true, // 是否使用tls加密。默认为false，当我们设置为true时，建议端口设置为465
  auth: {
    user: 'journeysite@163.com', // 邮箱账号
    pass: 'VJNMREZMDZGDIHDE' // 邮箱授权码
  }
});

const sendMail = (to: string, html: string, subject?: string) => {
  sentry.addBreadcrumb('utils/email.js --> sendMail');
  // 发送邮件
  try {
    transporter.sendMail({
      from: `"Journey" <journeysite@163.com>`, // 从哪个邮箱发送
      to, // 收件人，多个邮箱以逗号分割
      subject: subject || '您收到了新的评论', // 标题
      html // html body
    });
  } catch (err) {
    sentry.captureException(err);
  }
};

const sendMailNotification = (blog: IBlog, comment: any) => {
  sentry.addBreadcrumb('utils/email.js --> sendMailNotification');
  let to = '';
  let msg = '';
  if (comment.replyEmail && comment.replyContent) {
    to = comment.replyEmail;
    msg = `${comment.arthur}在文章<a :href="https://lishuxue.site/blog/${blog._id}">《${blog.title}》</a>中回复了您的评论：<br />
    您的评论：${comment.replyContent}<br />
    ${comment.arthur}的回复：${comment.content}`;
  } else {
    to = '1149926505@qq.com';
    msg = `${comment.arthur}对您的文章<a :href="https://lishuxue.site/blog/${blog._id}">《${blog.title}》</a>发表了评论：<br />
    ${comment.content}`;
  }

  sendMail(to, msg);

  // 所有评论聊天都同时再发给我
  if (comment.replyEmail && comment.replyContent && comment.replyName) {
    const to = '1149926505@qq.com';
    const msg = `${comment.arthur}在您的文章<a :href="https://lishuxue.site/blog/${blog._id}">《${blog.title}》</a>中回复了${comment.replyName}的评论：<br />
    ${comment.replyName}的评论：${comment.replyContent}<br />
    ${comment.arthur}的回复：${comment.content}`;

    sendMail(to, msg);
  }
};

const sendWarm = async () => {
  const one: any = await loadWebPage();
  const wea: any = await axios.get('https://www.tianqiapi.com/free/day?appid=19838913&appsecret=dUknzCP2');
  const html = `
    <div class="one" style="margin: 0 auto; max-width: 720px;">
        <div class="others" style="background: #f8f8f8; color: #6d6d6d; padding: 15px 0; text-align: center;">
            <div class="wea">今日天气：${wea.data.wea}</div>
            <div class="temp" style="font-size: 40px; margin: 20px 0 20px 0;">
              ${wea.data.tem}<span style="position: relative; top: -20px; font-size: 12px;">℃</span>
            </div>
            <div class="win">${wea.data.win}： ${wea.data.win_speed}</div>
        </div>
        <div class="main">
            <div class="image" style="max-width: 720px;">
                <img src="${one.imageUrl}" style="width: 100%;" />
            </div>
            <div class="line" style="position: relative; top: -5px; height: 35px; background: #6d6d6d;"></div>
            <div class="text"
                style="position: relative; top: -5px; padding: 0 15px; height: 120px; background: #dadada; display: flex; justify-content: center; align-items: center;">
                <span style="color: #6d6d6d; line-height: 1.5;">${one.text}</span>
            </div>
            <div class="line" style="position: relative; top: -5px; height: 35px; background: #6d6d6d;"></div>
        </div>
    </div>
  `;

  sendMail('1149926505@qq.com,1406798534@qq.com', html, '每日温暖');
};

const sendMailSchedule = () => {
  /**
   * 参数：
   * second (0-59)
   * minute (0-59)
   * hour (0-23)
   * date (1-31)
   * month (0-11)
   * year
   * dayOfWeek (0-6) Starting with Sunday
   */
  const options = {
    second: 0,
    minute: 0,
    hour: 10
  };
  schedule.scheduleJob(options, () => {
    sendWarm();
  });
};

export default {
  sendMailNotification,
  sendMailSchedule
};
