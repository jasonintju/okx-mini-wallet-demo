import { useOKXWallet } from './useOKXWallet';

function OKXConnect() {
	const { isConnected, connect, disconnect, publicKey } = useOKXWallet();

	return (
		<div>
			{isConnected ? (
				publicKey ? (
					publicKey.toString()
				) : (
					'xxx'
				)
			) : (
				<button onClick={connect}>connect</button>
			)}

			<button className="mt-10 block" onClick={disconnect}>
				disconnect
			</button>
		</div>
	);
}

export default OKXConnect;
