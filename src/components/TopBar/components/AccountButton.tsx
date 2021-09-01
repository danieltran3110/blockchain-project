import React, { useCallback } from 'react'
import styled from 'styled-components'
import { useWallet } from 'use-wallet'
import useModal from '../../../hooks/useModal'
import useSushi from '../../../hooks/useSushi'
import Button from '../../Button'
import WalletProviderModal from '../../WalletProviderModal'
import AccountModal from './AccountModal'

interface AccountButtonProps {}

const AccountButton: React.FC<AccountButtonProps> = (props) => {
    const [onPresentAccountModal] = useModal(<AccountModal />)
    const [onPresentWalletProviderModal] = useModal(
        <WalletProviderModal />,
        'provider',
    )

    const sushi = useSushi()

    const { account } = useWallet()

    const handleUnlockClick = useCallback(() => {
        onPresentWalletProviderModal()
    }, [onPresentWalletProviderModal])

    const onConnect = async () => {
        if (!account) {
            onPresentWalletProviderModal()
        }
    }

    return (
        <StyledAccountButton>
        {!account ? (
            <Button onClick={onConnect} size="sm" text="Unlock Wallet" />
        ) : (
            <Button onClick={onPresentAccountModal} size="sm" text="My Wallet" />
        )}
        {/* <p>{toTrunc(getBalanceNumber(tokenBalance), 5)} <span>{'TOAN'}</span></p> */}
        </StyledAccountButton>
    )
}

const StyledAccountButton = styled.div``

export default AccountButton
