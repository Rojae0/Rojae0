import { writeFileSync } from "node:fs";
import Parser from "rss-parser";

const staticContent = `
# Graphics Blog
`;

const parser = new Parser({
  headers: {
    Accept: "application/rss+xml, application/xml, text/xml; q=0.1",
  },
});

const monthNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

(async () => {
  let blogSection = "<table>\n";
  try {
    const feed = await parser.parseURL("https://gamewindowcoder.tistory.com/rss");
    const latestPostsCount = 10;
    for (let i = 0; i < latestPostsCount && i < feed.items.length; i++) {
      const { title, link, pubDate } = feed.items[i];

      let formattedDate = "날짜 정보 없음";
      if (pubDate) {
        const d = new Date(pubDate);
        const day = String(d.getDate()).padStart(2, "0");
        const month = monthNames[d.getMonth()];
        const year = d.getFullYear();
        formattedDate = `${day}-${month}, ${year}`;
      }

      console.log(`${i + 1}. ${title} (${link}) - ${formattedDate}`);
      blogSection += `<tr><td>${i+1}.</td><td><a href="${link}" target="_blank">${title}</a></td><td>${formattedDate}</td></tr>\n`;
    }
    blogSection += "</table>\n";
  } catch (error) {
    console.error("RSS 파싱 중 오류 발생:", error);
    blogSection = "블로그 글을 불러오지 못했습니다.\n";
  }

  const finalContent = staticContent + blogSection;
  writeFileSync("README.md", finalContent, "utf8");
  console.log("README 업데이트 완료");
})();
