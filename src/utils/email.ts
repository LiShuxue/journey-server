import * as nodemailer from 'nodemailer';
import { IBlog } from '../models/Blog';
import sentry from './sentry';
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
    // to do
  });
};

export default {
  sendMailNotification,
  sendMailSchedule
};
