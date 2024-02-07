import { initializeKeypair } from "./initializeKeypair";
import * as help from "./utils/helpers";
import * as web3 from "@solana/web3.js";
import * as token from "@solana/spl-token";
import * as bs58 from "bs58";
import dotenv from "dotenv";
dotenv.config();

async function main() {
  const connection = new web3.Connection(web3.clusterApiUrl("mainnet-beta"));

  const secret = process.env.SOLANA_MAIN_WALLET_PRIVATE_KEY as string;
  const secretDecode = bs58.decode(secret);
  const secretKey = Uint8Array.from(secretDecode);
  const keypair = web3.Keypair.fromSecretKey(secretKey);

  console.log("Public Key:", keypair.publicKey.toBase58());

  const mintPublicKey = new web3.PublicKey(
    "b9r4vNai5wpjWUZ2nqz6bcsMhyH8F3oSCVzWt97TFBp"
  );

  const destinationPublicKey = new web3.PublicKey(
    "HpksWfTfABoBwPJ8ac8c6qvAewtNs5DyrDuZWMieCcfq"
  );

  const amount = 420567242021492;

  const tokenAccount = await help.createTokenAccount(
    connection,
    keypair, //payer
    mintPublicKey, //mint
    keypair.publicKey // Owner of token account
  );

  const transactionSignature = await token.mintTo(
    connection,
    keypair, //payer
    mintPublicKey, //mint
    tokenAccount.address, //destination token account
    keypair, //authority
    amount
  );

  console.log(
    `Mint Token Transaction: https://explorer.solana.com/tx/${transactionSignature}`
  );

  /* await help.mintTokens(
    connection,
    keypair, // payer
    mintPublicKey, // mint
    destinationPublicKey, // destination
    keypair, // authority
    420567242021492
  ); */

  // const mint = await createNewMint(
  //   connection,
  //   user, // We'll pay the fees
  //   user.publicKey, // We're the mint authority
  //   user.publicKey, // And the freeze authority >:)
  //   2 // Only two decimals!
  // );

  //

  // const receiverTokenAccount = await help.createTokenAccount(
  //   connection,
  //   user, // payer
  //   new web3.PublicKey("JCfEGkxmEXeWrysCuZM96UnxhPd8EHWkQFFj5Sug1S9Y"), // mint
  //   new web3.PublicKey("HpksWfTfABoBwPJ8ac8c6qvAewtNs5DyrDuZWMieCcfq") //receiver
  // );

  // await help.transferTokens(
  //   connection,
  //   user, // payer
  //   new web3.PublicKey("2fnYBGbP1joRyyp7LRqhn678A32Hr2x1FP6skQt5LPwr"), // source token account
  //   receiverTokenAccount.address, // destination token account
  //   user.publicKey,
  //   100,
  //   new web3.PublicKey("JCfEGkxmEXeWrysCuZM96UnxhPd8EHWkQFFj5Sug1S9Y") // token mint
  // );
}

main()
  .then(() => {
    console.log("Finished successfully");
    process.exit(0);
  })
  .catch((error) => {
    console.log(error);
    process.exit(1);
  });
