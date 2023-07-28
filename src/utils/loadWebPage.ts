import axios from 'axios';
import { load } from 'cheerio'; // 服务器上操作HTML

const loadWebPage = async () => {
  const res = await axios.get('http://wufazhuce.com/');
  const result = getImageAndText(res.data);
  return result;
};

const getImageAndText = (htmlString: string) => {
  const $ = load(htmlString);
  const todayOne = $('#carousel-one .carousel-inner .item.active');
  const imageUrl = $(todayOne).find('.fp-one-imagen').attr('src');
  const text = $(todayOne)
    .find('.fp-one-cita')
    .text()
    .replace(/(^\s*)|(\s*$)/g, '');

  return {
    imageUrl,
    text,
  };
};

export default loadWebPage;
