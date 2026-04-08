const platforms = ["公众号文章", "小红书笔记", "Twitter", "视频脚本"] as const;

export default function HomePage() {
  return (
    <main>
      <h1>What should we create today?</h1>
      {platforms.map((platform) => (
        <label key={platform}>
          <input aria-label={platform} type="checkbox" />
          {platform}
        </label>
      ))}
    </main>
  );
}
