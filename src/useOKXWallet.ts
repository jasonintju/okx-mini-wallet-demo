import { useEffect, useState } from 'react';
import { OKXUniversalConnectUI, THEME } from '@okxconnect/ui';
import { OKXSolanaProvider } from '@okxconnect/solana-provider';
import { PublicKey } from '@solana/web3.js';

export const useOKXWallet = () => {
	const [universalUi, setUniversalUi] = useState<OKXUniversalConnectUI | null>(
		null
	);
	const [isConnected, setIsConnected] = useState(false);
	const [provider, setProvider] = useState<OKXSolanaProvider | null>(null);
	const [publicKey, setPublicKey] = useState<PublicKey | null>(null);

	useEffect(() => {
		const initializeUI = async () => {
			const ui = await OKXUniversalConnectUI.init({
				dappMetaData: {
					icon: 'https://static.okx.com/cdn/assets/imgs/247/58E63FEA47A2B7D7.png',
					name: 'InterSOON',
				},
				actionsConfiguration: {
					returnStrategy: 'tg://resolve',
					modals: 'all',
					tmaReturnUrl: 'back',
				},
				language: 'en_US',
				uiPreferences: {
					theme: THEME.LIGHT,
				},
			});

			const provider = new OKXSolanaProvider(ui);
			setProvider(provider);
			setUniversalUi(ui);

			const connected = ui.connected();
			setIsConnected(connected);

			if (connected) {
				try {
					const account = provider.getAccount();
					setPublicKey(account!.publicKey);
				} catch (error) {
					console.error('Failed to get account:', error);
				}
			}
		};

		initializeUI();
	}, []);

	const connect = async () => {
		if (!universalUi) return;
		try {
			await universalUi.openModal({
				namespaces: {
					solana: {
						chains: ['solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp'],
					},
				},
			});
			const connected = universalUi.connected();
			setIsConnected(connected);
			if (connected) {
				try {
					const account = provider?.getAccount();
					setPublicKey(account!.publicKey);
				} catch (error) {
					console.error('Failed to get account:', error);
				}
			}
		} catch (error: any) {
			alert(error.message);
			console.error('Failed to connect wallet:', error);
		}
	};

	const disconnect = async () => {
		if (!universalUi) return;

		try {
			await universalUi.disconnect();
			setIsConnected(false);
			setPublicKey(null);
		} catch (error: any) {
			alert(`disconnec error ${error.message}`);
			console.error('Failed to disconnect wallet:', error);
		}
	};

	return {
		universalUi,
		provider,
		isConnected,
		publicKey,
		connect,
		disconnect,
	};
};
