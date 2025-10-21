export const platformOptions = [
    { value: 'all', label: 'Toutes les plateformes' }, // Icône générique
    { value: 'FaFacebook', label: 'Facebook' },
    { value: 'FaInstagram', label: 'Instagram' },
    { value: 'FaTwitter', label: 'Twitter' },
    { value: 'FaLinkedin', label: 'LinkedIn' },
    { value: 'FaYoutube', label: 'YouTube' },
    { value: 'FaTiktok', label: 'TikTok' },
    { value: 'FaSnapchatGhost', label: 'Snapchat' },
    { value: 'FaPinterest', label: 'Pinterest' },
    { value: 'FaRedditAlien', label: 'Reddit' },
    { value: 'FaTumblr', label: 'Tumblr' },
    { value: 'FaWhatsapp', label: 'WhatsApp' },
    { value: 'FaDiscord', label: 'Discord' },
    { value: 'FaTelegramPlane', label: 'Telegram' },
    { value: 'FaMediumM', label: 'Medium' },
    { value: 'FaGithub', label: 'GitHub' },
    { value: 'FaTwitch', label: 'Twitch' },
    { value: 'FaSoundcloud', label: 'SoundCloud' },
    { value: 'FaVimeoV', label: 'Vimeo' },
    { value: 'FaStackOverflow', label: 'Stack Overflow' },
    { value: 'FaDribbble', label: 'Dribbble' },
    { value: 'FaBehance', label: 'Behance' },
];


export const socialMediaUrlPatterns: Record<string, RegExp> = {
    facebook: /^https?:\/\/([a-z]+\.)?facebook\.com\/.+$/i,
    instagram: /^https?:\/\/([a-z]+\.)?instagram\.com\/.+$/i,
    twitter: /^https?:\/\/([a-z]+\.)?twitter\.com\/.+$/i,
    linkedin: /^https?:\/\/([a-z]+\.)?linkedin\.com\/.+$/i,
    youtube: /^https?:\/\/([a-z]+\.)?(youtube\.com|youtu\.be)\/.+$/i,
    tiktok: /^https?:\/\/([a-z]+\.)?tiktok\.com\/.+$/i,
    threads: /^https?:\/\/([a-z]+\.)?threads\.com\/.+$/i,
    pinterest: /^https?:\/\/([a-z]+\.)?pinterest\.com\/.+$/i,
    reddit: /^https?:\/\/([a-z]+\.)?reddit\.com\/.+$/i,
    twitch: /^https?:\/\/([a-z]+\.)?twitch\.tv\/.+$/i,
    discord: /^https?:\/\/(discord\.gg|discord\.com\/invite)\/.+$/i,
    telegram: /^https?:\/\/(t\.me|telegram\.me)\/.+$/i,
    whatsapp: /^https?:\/\/(wa\.me|api\.whatsapp\.com)\/.+$/i,
    github: /^https?:\/\/(www\.)?github\.com\/.+$/i,
    medium: /^https?:\/\/([a-z]+\.)?medium\.com\/.+$/i,
    snapchat: /^https?:\/\/(www\.)?snapchat\.com\/add\/[a-zA-Z0-9._-]+/,
    vimeo: /^https?:\/\/(www\.)?vimeo\.com\/[0-9]+/,
    soundcloud: /^https?:\/\/(www\.)?soundcloud\.com\/[a-zA-Z0-9_-]+/,
    spotify: /^https?:\/\/(open\.)?spotify\.com\/(artist|album|track|user|playlist)\/[a-zA-Z0-9]+/,
    bandcamp: /^https?:\/\/[a-zA-Z0-9_-]+\.bandcamp\.com/,
    stack_overflow: /^https?:\/\/(www\.)?stackoverflow\.com\/users\/[0-9]+\/[a-zA-Z0-9_-]+/,
    website: /^https?:\/\/[^\s/$.?#].[^\s]*$/, // validation générique d'un site
    blog: /^https?:\/\/[^\s/$.?#].[^\s]*$/, // même que site
    newsletter: /^https?:\/\/[^\s/$.?#].[^\s]*$/, // ou Mailchimp/Substack, etc.
    podcast: /^https?:\/\/[^\s/$.?#].[^\s]*$/,
    behance: /^https?:\/\/(www\.)?behance\.net\/[a-zA-Z0-9_-]+/,
    dribbble: /^https?:\/\/(www\.)?dribbble\.com\/[a-zA-Z0-9_-]+/,
    figma: /^https?:\/\/(www\.)?figma\.com\/(file|@)[a-zA-Z0-9/_?-]+/,
    slack: /^https?:\/\/[a-zA-Z0-9_-]+\.slack\.com\/?.*$/,
    mastodon: /^https?:\/\/[a-zA-Z0-9_-]+@?[a-zA-Z0-9_.-]+\.[a-z]+/,
    bluesky: /^https?:\/\/bsky\.app\/profile\/[a-zA-Z0-9_.-]+/,
    substack: /^https?:\/\/[a-zA-Z0-9_-]+\.substack\.com/,
    patreon: /^https?:\/\/(www\.)?patreon\.com\/[a-zA-Z0-9_-]+/,
    'ko-fi': /^https?:\/\/(www\.)?ko-fi\.com\/[a-zA-Z0-9_-]+/,
    buy_me_a_coffee: /^https?:\/\/(www\.)?buymeacoffee\.com\/[a-zA-Z0-9_-]+/,
    gumroad: /^https?:\/\/(www\.)?gumroad\.com\/[a-zA-Z0-9_-]+/,
    etsy: /^https?:\/\/(www\.)?etsy\.com\/shop\/[a-zA-Z0-9_-]+/,
    shopify: /^https?:\/\/[a-zA-Z0-9_-]+\.myshopify\.com/,
    amazon: /^https?:\/\/(www\.)?amazon\.[a-z.]+\/[a-zA-Z0-9/_-]+/,
    ebay: /^https?:\/\/(www\.)?ebay\.[a-z.]+\/[a-zA-Z0-9/_-]+/,
    alibaba: /^https?:\/\/(www\.)?alibaba\.com\/product-detail\/[a-zA-Z0-9/_-]+/,
    other: /^https?:\/\/[^\s/$.?#].[^\s]*$/, // fallback générique
};


export function isValidUrlForPlatform(url: string, platform: string): boolean {
    console.log({ url, platform })
    const pattern = socialMediaUrlPatterns[platform];
    if (!pattern) return false;
    return pattern.test(url);
}
