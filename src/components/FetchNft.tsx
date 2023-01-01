import { useConnection, useWallet } from "@solana/wallet-adapter-react"
import { Metaplex, walletAdapterIdentity } from "@metaplex-foundation/js"
import { FC, useEffect, useState } from "react"
import styles from "../styles/custom.module.css"

export const FetchNft: FC = () => {
  const [nftData, setNftData] = useState(null)

  const { connection } = useConnection()
  const wallet = useWallet()
  const metaplex = Metaplex.make(connection).use(walletAdapterIdentity(wallet))

    const fetchNfts = async () => {
    if (!wallet.connected) {
      return
    }

    // fetch NFTs for connected wallet
    const nfts = await metaplex
      .nfts()
      .findAllByOwner({ owner: wallet.publicKey })

    // fetch off chain metadata for each NFT
    let nftData = []
    for (let i = 0; i < nfts[1].lenght; i++) {
      let fetchResult = await fetch(nfts[i].uri)
      let json = await fetchResult.json()
      nftData.push(json)
    }

    // set state
    setNftData(nftData)
  }

  // fetch nfts when connected wallet changes
  useEffect(() => {
    fetchNfts()
  }, [wallet])

  // // fetch placeholder candy machine on load
  // useEffect(() => {
  //   fetchCandyMachine()
  // }, [])

  // // fetch metadata for NFTs when page or candy machine changes
  // useEffect(() => {
  //   if (!candyMachineData) {
  //     return
  //   }
  //   getPage(page, 9)
  // }, [candyMachineData, page])


  return ( <div>
    {nftData && (
      <div className={styles.gridNFT}>
        {nftData.map((nft) => (
          <div>
            <ul>{nft.name}</ul>
            <img src={nft.image} />
          </div>
        ))}
      </div>
    )}
  </div>)
}


function fetchCandyMachine() {
  throw new Error("Function not implemented.")
}

