import { Injectable } from '@nestjs/common';
import { createTransport } from 'nodemailer';
import { MyLoggerService } from '../logger/logger.service';
import { BlogDocument, Reply, Comment } from '../blog/blog.schema';

@Injectable()
export class EmailService {
  private transporter;

  constructor(private readonly myLogger: MyLoggerService) {
    this.myLogger.setContext('EmailService');

    this.transporter = createTransport({
      host: 'smtp.163.com', // 邮件服务商，如：smtp.163.com， smtp.qq.com
      port: 465, // 默认情况下为587，如果设置secure为true时则默认为465
      secure: true, // 是否使用tls加密。默认为false，当我们设置为true时，建议端口设置为465
      auth: {
        user: 'journeysite@163.com', // 邮箱账号 pass:li1149926505
        pass: 'VJNMREZMDZGDIHDE', // 邮箱授权码
      },
    });
  }

  sendMail = async (to: string, html: string, subject?: string) => {
    this.myLogger.log('sendMail method, to: ' + to);
    this.myLogger.log(html);
    // 发送邮件
    try {
      await this.transporter.sendMail({
        from: `"Journey" <journeysite@163.com>`, // 从哪个邮箱发送
        to, // 收件人，多个邮箱以逗号分割
        subject: subject || '您收到了新的评论', // 标题
        html, // html body
      });
    } catch (err) {
      this.myLogger.error('send email error: ' + err?.message || err);
    }
  };

  sendCommentNotification = async (blog: BlogDocument, comment: Comment | Reply) => {
    let to = '';
    let msg = '';

    // 是评论
    if ('reply' in comment) {
      to = '1149926505@qq.com';
      msg = `“${comment.arthur}” 对您的文章《<a :href="https://lishuxue.site/blog/${blog._id}">${blog.title}</a>》发表了评论：<br /> 
      “${comment.content}”`;
    } else if ('replyId' in comment) {
      // 评论下的某个回复
      to = comment.replyEmail;
      msg = `“${comment.arthur}” 在文章《<a :href="https://lishuxue.site/blog/${blog._id}">${blog.title}</a>》中回复了您的评论：<br /> 
      您的评论： “${comment.replyContent}” <br /> 
      “${comment.arthur}” 的回复： “${comment.content}”`;
    }

    await this.sendMail(to, msg);

    // 评论下面各方的回复内容，都抄送我
    if ('replyId' in comment) {
      const to = '1149926505@qq.com';
      const msg = `“${comment.arthur}” 在您的文章《<a :href="https://lishuxue.site/blog/${blog._id}">${blog.title}</a>》中回复了 “${comment.replyArthur}” 的评论：<br /> 
      “${comment.replyArthur}” 的评论：“${comment.replyContent}” <br /> 
      “${comment.arthur}” 的回复：“${comment.content}” `;

      await this.sendMail(to, msg);
    }
  };
}
