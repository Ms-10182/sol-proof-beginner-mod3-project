import { Connection, clusterApiUrl, Keypair, Transaction } from '@solana/web3.js';
import { createMint, getOrCreateAssociatedTokenAccount, mintTo, TOKEN_PROGRAM_ID } from '@solana/spl-token';
import bs58 from 'bs58';

// Your Phantom wallet's private key as a Base58 encoded string
const base58PrivateKey = 'my private key';

async function mintSPLToken() {
    // Decode the Base58 encoded private key to a Uint8Array
    const secretKey = bs58.decode(base58PrivateKey);

    // Connect to the Solana devnet
    const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');
    
    // Use the existing wallet
    const payer = Keypair.fromSecretKey(secretKey);

    // Create a new mint
    const mint = await createMint(
        connection,
        payer, // Fee payer
        payer.publicKey, // Mint authority
        null, // Freeze authority
        9 // Number of decimals
    );

    console.log('Mint created:', mint.toBase58());

    // Get the token account of the payer, and if it does not exist, create it
    const fromTokenAccount = await getOrCreateAssociatedTokenAccount(
        connection,
        payer,
        mint,
        payer.publicKey
    );

    // Minting 100 new tokens to the "fromTokenAccount"
    const signature = await mintTo(
        connection,
        payer, // Fee payer
        mint, // Mint
        fromTokenAccount.address, // Token account
        payer, // Mint authority
        20000000000 // Amount of tokens, in the smallest unit (e.g. if decimals is 9, this is 1 token)
    );

    console.log('Mint signature:', signature);
}

mintSPLToken().catch(err => {
    console.error(err);
});
