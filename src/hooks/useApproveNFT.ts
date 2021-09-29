import { useCallback } from 'react'
import { useWallet } from 'use-wallet'
import { provider } from 'web3-core'
import { Contract } from 'web3-eth-contract'

import { approveNFT } from '../sushi/utils'

const useApproveNFT = (erc721Contract: Contract, to: string) => {
    const { account }: { account: string; ethereum: provider } = useWallet()

    const handleApproveNFT = useCallback(async () => {
        try {
            const tx = await approveNFT(erc721Contract, to, account)
            console.log(tx)
            return tx
        } catch (e) {
            return false
        }
    }, [account, erc721Contract, to])

    return { onApproveNFT: handleApproveNFT }
}

export default useApproveNFT
