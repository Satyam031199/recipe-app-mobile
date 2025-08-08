export const formatDate = (timestamp: number) => {
  return new Date(timestamp).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export const getProviderIcon = (provider: string) => {
  switch (provider) {
    case "oauth_google":
      return "logo-google";
    case "oauth_facebook":
      return "logo-facebook";
    case "oauth_github":
      return "logo-github";
    default:
      return "person";
  }
};

export const getProviderName = (provider: string) => {
  switch (provider) {
    case "oauth_google":
      return "Google";
    case "oauth_facebook":
      return "Facebook";
    case "oauth_github":
      return "GitHub";
    default:
      return "Email";
  }
};

export const getYoutubeEmbedUrl = (url: string) => {
  if(!url) return null;
  const videoId = url.split("v=")[1];
  return `https://www.youtube.com/embed/${videoId}`;
}