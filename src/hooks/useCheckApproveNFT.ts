import { useCallback, useEffect, useState } from 'react'
import useSushi from './useSushi'
import { useWallet } from 'use-wallet'
import { Contract } from 'web3-eth-contract'
import { isApprovedForAll } from '../sushi/utils'

const useCheckApproveNFT = (nftContract: Contract, to: string) => {
    const [isApproved, setIsApprovedNFT] = useState(false)
    const { account } = useWallet()
    const sushi = useSushi()
    const masterChefContract = to

    const fetchIsApprovedNFT = useCallback(async () => {
        if (to && account && nftContract) {
            const isApproved = await isApprovedForAll(
                nftContract,
                to,
                account,
            )
            setIsApprovedNFT(isApproved)
        }
    }, [account, masterChefContract, nftContract])

    useEffect(() => {
        if (account && masterChefContract && nftContract) {
            fetchIsApprovedNFT()
        }
        let refreshInterval = setInterval(fetchIsApprovedNFT, 3000)
        return () => clearInterval(refreshInterval)
    }, [account, masterChefContract, nftContract])

    return isApproved
}

export default useCheckApproveNFT
