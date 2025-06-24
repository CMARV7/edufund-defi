async function supplyToCompound(amount) {
    const provider = window.ethereum;

    if (!provider) {
        alert("Please install MetaMask!");
        return;
    }

    const compound = new Compound(provider);

    try {
        // Convert input to smallest unit (wei)
        const daiAmount = Compound.utils.toWei(amount, 18); // DAI has 18 decimals

        const daiAddress = Compound.util.getAddress(Compound.DAI);

        const signer = provider.selectedAddress;

        // Step 1: Approve Compound to use your DAI
        const approval = await compound.eth.trx(
            daiAddress,
            'approve',
            [Compound.util.getAddress(Compound.cDAI), daiAmount],
            { from: signer }
        );
        console.log("DAI Approved:", approval);

        // Step 2: Supply to Compound
        const trx = await compound.supply(Compound.DAI, daiAmount);
        console.log("DAI Supplied:", trx);

        alert("✅ DAI successfully supplied to Compound!");
    } catch (err) {
        console.error("Error supplying to Compound:", err);
        alert("❌ Error supplying to Compound. See console.");
    }
}

async function updateBalances() {
    const provider = window.ethereum;
    if (!provider || !provider.selectedAddress) return;

    const compound = new Compound(provider);
    const walletAddress = provider.selectedAddress;

    try {
        // Get wallet DAI balance
        const daiBalance = await compound.eth.read(
            Compound.util.getAddress(Compound.DAI),
            'function balanceOf(address) view returns (uint256)',
            [walletAddress]
        );

        const formattedDai = Compound.utils.fromWei(daiBalance, 18);
        document.getElementById('walletDaiBalance').innerText = `DAI Wallet Balance: ${formattedDai}`;

        // Get cDAI balance and convert back to DAI supplied
        const cTokenBalance = await compound.eth.read(
            Compound.util.getAddress(Compound.cDAI),
            'function balanceOf(address) view returns (uint256)',
            [walletAddress]
        );

        const exchangeRate = await compound.exchangeRate(Compound.cDAI);
        const daiSupplied = Compound.utils.fromWei(
            (cTokenBalance * exchangeRate).toString().slice(0, -3), // Small cleanup
            18
        );

        document.getElementById('compoundSupplied').innerText = `DAI Supplied to Compound: ${daiSupplied}`;
    } catch (err) {
        console.error("Balance fetch failed:", err);
        alert("Could not fetch balances.");
    }
}

async function borrowFromCompound(amount) {
    const provider = window.ethereum;
    if (!provider) {
        alert("Please install MetaMask!");
        return;
    }

    const compound = new Compound(provider);
    const signer = provider.selectedAddress;

    try {
        const daiAmount = Compound.utils.toWei(amount, 18);

        // Borrow from Compound
        const trx = await compound.borrow(Compound.DAI, daiAmount);
        console.log("DAI Borrowed:", trx);

        alert("✅ You’ve successfully borrowed DAI from Compound!");

        updateBorrowedBalance(); // Refresh balance
    } catch (err) {
        console.error("Borrow failed:", err);
        alert("❌ Failed to borrow. Check console for error.");
    }
}

async function updateBorrowedBalance() {
    const provider = window.ethereum;
    if (!provider || !provider.selectedAddress) return;

    const compound = new Compound(provider);
    const address = provider.selectedAddress;

    try {
        const borrowed = await compound.getBorrowBalance(Compound.DAI, address);
        const formatted = Compound.utils.fromWei(borrowed, 18);

        document.getElementById('borrowedBalance').innerText = `DAI Borrowed: ${formatted}`;
    } catch (err) {
        console.error("Error fetching borrow balance:", err);
    }
}
