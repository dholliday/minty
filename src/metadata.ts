import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { mplTokenMetadata } from "@metaplex-foundation/mpl-token-metadata";

const umi = createUmi("https://api.devnet.solana.com").use(mplTokenMetadata());

const metadata = {
  name: "Big Dex",
  symbol: "BIGDEX",
  description: "How big is your dex? Eat Stake grow Big Dex",
  image:
    "https://github.com/dholliday/bigdex/blob/eff383839797a93980efe01c2f541fad7568e5c2/public/token/token_image.png",
};
